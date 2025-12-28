#!/usr/bin/env node
/**
 * Browser-based scraper for JavaScript-heavy state GOP sites
 * Uses Puppeteer to render pages and extract county chair data
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// States to scrape with JavaScript-heavy sites
const STATES_TO_SCRAPE = [
    { code: 'OH', name: 'Ohio', url: 'https://ohiogop.org/county-chairs' },
    { code: 'PA', name: 'Pennsylvania', url: 'https://pagop.org/county-leadership' },
    { code: 'IA', name: 'Iowa', url: 'https://www.iowagop.org/leadership' },
    { code: 'WI', name: 'Wisconsin', url: 'https://wisgop.org/county-leadership' },
    { code: 'MN', name: 'Minnesota', url: 'https://mngop.com/leadership' },
    { code: 'MI', name: 'Michigan', url: 'https://migop.org/county-leadership' },
    { code: 'IL', name: 'Illinois', url: 'https://ilgop.org/county-leadership' },
    { code: 'IN', name: 'Indiana', url: 'https://indianagop.com/county-leadership' },
    { code: 'TN', name: 'Tennessee', url: 'https://tngop.org/county-leadership' },
    { code: 'KY', name: 'Kentucky', url: 'https://rpk.org/local-gop' },
    { code: 'SC', name: 'South Carolina', url: 'https://scgop.com/counties' },
    { code: 'LA', name: 'Louisiana', url: 'https://lagop.com/parish-leadership' },
    { code: 'AZ', name: 'Arizona', url: 'https://azgop.com/county-leadership' },
    { code: 'CA', name: 'California', url: 'https://cagop.org/county-leadership' },
    { code: 'NY', name: 'New York', url: 'https://www.nygop.org/county-organizations' },
    { code: 'FL', name: 'Florida', url: 'https://www.floridagop.org/county-organizations' },
    { code: 'NC', name: 'North Carolina', url: 'https://ncgop.org/county-organizations' },
    { code: 'GA', name: 'Georgia', url: 'https://gagop.org/county-leadership' },
];

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'output');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Scrape a single state using Puppeteer
 */
async function scrapeState(state, browser) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Scraping ${state.name} (${state.code}) from ${state.url}`);
    console.log(`${'='.repeat(60)}`);

    const page = await browser.newPage();

    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        // Navigate to the page and wait for it to load
        console.log(`Loading page...`);
        await page.goto(state.url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait a bit for any JavaScript to render
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Get the full HTML content
        const html = await page.content();
        console.log(`Page loaded: ${html.length} bytes`);

        // Try to find county chair data using different selectors
        const extractedData = await page.evaluate(() => {
            const results = [];

            // Common patterns for county chair data
            const selectors = [
                // Table rows
                'table tr',
                'tbody tr',
                // List items
                'ul li',
                'ol li',
                // Divs with county classes
                '[class*="county"]',
                '[class*="County"]',
                // Data rows
                '[class*="row"]',
                '[class*="item"]',
            ];

            // Look for text patterns that might indicate county chairs
            const bodyText = document.body.innerText;

            // Look for patterns like "County Chair: Name" or "County - Name"
            const patterns = [
                /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+County)[\s:\-]+(?:Chair|Chairperson|Republican Chair)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g,
                /(?:Chair|Chairperson)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi,
            ];

            // Try to extract structured data
            for (const selector of selectors) {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        const text = el.textContent?.trim();
                        if (text && text.length < 500 && text.includes('County')) {
                            results.push({
                                selector: selector,
                                text: text,
                                html: el.innerHTML?.substring(0, 500)
                            });
                        }
                    });
                } catch (e) {
                    // Skip errors
                }
            }

            return {
                bodyText: bodyText.substring(0, 10000),
                potentialData: results.slice(0, 100),
                allLinks: Array.from(document.querySelectorAll('a[href]')).map(a => ({
                    text: a.textContent?.trim(),
                    href: a.getAttribute('href')
                })).filter(l => l.text && l.text.length < 200).slice(0, 50)
            };
        });

        // Save raw HTML for manual inspection
        const htmlPath = path.join(OUTPUT_DIR, `${state.code.toLowerCase()}_full.html`);
        fs.writeFileSync(htmlPath, html);
        console.log(`Saved HTML to: ${htmlPath}`);

        // Save extracted data
        const dataPath = path.join(OUTPUT_DIR, `${state.code.toLowerCase()}_extracted.json`);
        fs.writeFileSync(dataPath, JSON.stringify(extractedData, null, 2));
        console.log(`Saved extracted data to: ${dataPath}`);

        // Try to parse county chairs from the data
        const chairs = parseCountyChairs(extractedData, state);
        console.log(`Found ${chairs.length} potential county chairs`);

        if (chairs.length > 0) {
            // Save chairs to JSON
            const chairsPath = path.join(OUTPUT_DIR, `${state.code.toLowerCase()}_chairs.json`);
            fs.writeFileSync(chairsPath, JSON.stringify(chairs, null, 2));
            console.log(`Saved ${chairs.length} chairs to: ${chairsPath}`);

            // Print sample
            console.log('\nSample chairs:');
            chairs.slice(0, 5).forEach(c => {
                console.log(`  ${c.county}: ${c.chairName || 'TBD'}`);
            });
        }

        return chairs;

    } catch (error) {
        console.error(`Error scraping ${state.name}:`, error.message);
        return [];
    } finally {
        await page.close();
    }
}

/**
 * Parse county chairs from extracted page data
 */
function parseCountyChairs(data, state) {
    const chairs = [];
    const today = new Date().toISOString().split('T')[0];

    // List of counties to match against
    const countyLists = {
        'OH': ['Adams', 'Allen', 'Ashland', 'Ashtabula', 'Athens', 'Auglaize', 'Brown', 'Butler', 'Carroll', 'Champaign', 'Clark', 'Clermont', 'Clinton', 'Columbiana', 'Coshocton', 'Crawford', 'Cuyahoga', 'Darke', 'Defiance', 'Delaware', 'Erie', 'Fairfield', 'Fayette', 'Franklin', 'Fulton', 'Gallia', 'Geauga', 'Greene', 'Guernsey', 'Hamilton', 'Hancock', 'Hardin', 'Henry', 'Highland', 'Hocking', 'Holmes', 'Huron', 'Jackson', 'Jefferson', 'Knox', 'Lake', 'Lawrence', 'Licking', 'Logan', 'Lorain', 'Lucas', 'Madison', 'Mahoning', 'Medina', 'Meigs', 'Mercer', 'Miami', 'Monroe', 'Montgomery', 'Morgan', 'Morrow', 'Muskingum', 'Noble', 'Ottawa', 'Paulding', 'Perry', 'Pickaway', 'Pike', 'Portage', 'Preble', 'Putnam', 'Richland', 'Ross', 'Sandusky', 'Scioto', 'Seneca', 'Shelby', 'Stark', 'Summit', 'Trumbull', 'Tuscarawas', 'Union', 'Van Wert', 'Vinton', 'Warren', 'Washington', 'Wayne', 'Williams', 'Wood', 'Wyandot'],
        'PA': ['Adams', 'Allegheny', 'Armstrong', 'Beaver', 'Bedford', 'Berks', 'Blair', 'Bradford', 'Bucks', 'Butler', 'Cambria', 'Cameron', 'Carbon', 'Centre', 'Chester', 'Clarion', 'Clearfield', 'Clinton', 'Columbia', 'Crawford', 'Cumberland', 'Dauphin', 'Delaware', 'Elk', 'Erie', 'Fayette', 'Forest', 'Franklin', 'Fulton', 'Greene', 'Huntingdon', 'Indiana', 'Jefferson', 'Juniata', 'Lackawanna', 'Lancaster', 'Lawrence', 'Lebanon', 'Lehigh', 'Luzerne', 'Lycoming', 'McKean', 'Mercer', 'Mifflin', 'Monroe', 'Montgomery', 'Montour', 'Northampton', 'Northumberland', 'Perry', 'Philadelphia', 'Pike', 'Potter', 'Schuylkill', 'Snyder', 'Somerset', 'Sullivan', 'Susquehanna', 'Tioga', 'Union', 'Venango', 'Warren', 'Washington', 'Wayne', 'Westmoreland', 'Wyoming', 'York'],
        // Add more states as needed
    };

    const counties = countyLists[state.code] || [];

    // Look for county + chair patterns in the body text
    const bodyText = data.bodyText || '';

    for (const county of counties) {
        // Look for the county name followed by a chair name
        const patterns = [
            new RegExp(`${county}\\s+County[^.]{0,200}?Chair[^.]{0,100}?([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)?)`, 'i'),
            new RegExp(`${county}[:\\-\\s]+([^\\n]{0,100})`, 'i'),
        ];

        let chairName = null;
        let email = null;
        let phone = null;

        for (const pattern of patterns) {
            const match = bodyText.match(pattern);
            if (match) {
                chairName = match[1]?.trim();
                // Clean up the chair name
                chairName = chairName.replace(/^Chair[^:]*:?\s*/i, '').trim();
                chairName = chairName.replace(/\s{2,}/g, ' ').trim();
                if (chairName.length > 50 || chairName.length < 2) {
                    chairName = null;
                }
                break;
            }
        }

        // Look for email
        const emailMatch = bodyText.match(new RegExp(`${county}\\s+County[^.]{0,300}?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})`, 'i'));
        if (emailMatch) {
            email = emailMatch[1];
        }

        if (chairName || email) {
            chairs.push({
                id: `${state.code}-${county.toLowerCase().replace(/\s+/g, '-')}`,
                state: state.name,
                stateCode: state.code,
                county: `${county} County`,
                chairName: chairName || 'TBD',
                email: email || null,
                phone: phone || null,
                electionDate: null,
                source: state.url,
                lastVerified: today,
                notes: chairName ? null : 'Could not extract chair name from page'
            });
        }
    }

    // Also look for data in potentialData elements
    if (data.potentialData && data.potentialData.length > 0) {
        for (const item of data.potentialData) {
            if (item.text && item.text.includes('County')) {
                // Try to parse county and chair from this text
                const lines = item.text.split(/\n|<br>/);
                for (const line of lines) {
                    const cleanLine = line.trim().replace(/<[^>]+>/g, '').trim();
                    if (cleanLine.length > 5 && cleanLine.length < 200) {
                        // Check if this line contains a county name
                        for (const county of counties) {
                            if (cleanLine.includes(county) && cleanLine.length < 150) {
                                // Check if we already have this county
                                const existing = chairs.find(c => c.county === `${county} County`);
                                if (!existing) {
                                    // Try to extract a name from this line
                                    const nameMatch = cleanLine.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)[,\s]*(?:Chair|Contact|Person)?$/);
                                    const chairName = nameMatch ? nameMatch[1] : 'TBD';

                                    chairs.push({
                                        id: `${state.code}-${county.toLowerCase().replace(/\s+/g, '-')}`,
                                        state: state.name,
                                        stateCode: state.code,
                                        county: `${county} County`,
                                        chairName: chairName,
                                        email: null,
                                        phone: null,
                                        electionDate: null,
                                        source: state.url,
                                        lastVerified: today,
                                        notes: 'Extracted from page text'
                                    });
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    return chairs;
}

/**
 * Main function
 */
async function main() {
    console.log('GOP County Chairs - Browser Scraper');
    console.log('='.repeat(60));
    console.log(`Starting to scrape ${STATES_TO_SCRAPE.length} states...`);

    let browser;
    try {
        // Launch browser
        console.log('\nLaunching browser...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const allChairs = {};

        // Scrape each state
        for (const state of STATES_TO_SCRAPE) {
            const chairs = await scrapeState(state, browser);
            if (chairs.length > 0) {
                allChairs[state.code] = chairs;
            }

            // Small delay between states to be polite
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Save summary
        const summaryPath = path.join(OUTPUT_DIR, 'summary.json');
        fs.writeFileSync(summaryPath, JSON.stringify(allChairs, null, 2));

        console.log('\n' + '='.repeat(60));
        console.log('SUMMARY');
        console.log('='.repeat(60));
        for (const [code, chairs] of Object.entries(allChairs)) {
            console.log(`${code}: ${chairs.length} chairs`);
        }

        const totalChairs = Object.values(allChairs).flat().length;
        console.log(`\nTotal chairs extracted: ${totalChairs}`);
        console.log(`\nOutput saved to: ${OUTPUT_DIR}`);

    } catch (error) {
        console.error('Fatal error:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { scrapeState, parseCountyChairs };
