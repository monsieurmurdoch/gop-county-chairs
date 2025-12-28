#!/usr/bin/env node
/**
 * Comprehensive state GOP scraper
 * Tries multiple URL patterns for each state
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Alternative URL patterns to try for each state
const URL_PATTERNS = {
    'PA': [
        'https://pagop.org/about/counties/',
        'https://pagop.org/county-leadership/',
        'https://www.pagop.org/counties/',
    ],
    'FL': [
        'https://www.floridagop.org/county-organizations/',
        'https://www.floridagop.org/leadership/',
        'https://floridagop.org/counties/',
    ],
    'IA': [
        'https://iowagop.org/county-chairs/',
        'https://www.iowagop.org/county-leadership/',
        'https://www.iowagop.org/counties/',
    ],
    'WI': [
        'https://wisgop.org/counties/',
        'https://wisgop.org/county-leadership/',
        'https://www.wisgop.org/leadership/',
    ],
    'MN': [
        'https://mngop.com/counties/',
        'https://mngop.com/county-chairs/',
        'https://www.mngop.com/leadership/',
    ],
    'MI': [
        'https://migop.org/counties/',
        'https://migop.org/county-leadership/',
        'https://www.migop.org/leadership/',
    ],
    'IL': [
        'https://ilgop.org/counties/',
        'https://illinois.gop/counties/',
        'https://ilgop.org/leadership/',
    ],
    'IN': [
        'https://indianagop.com/counties/',
        'https://indianagop.com/leadership/',
        'https://www.indianagop.com/county-organizations/',
    ],
    'TN': [
        'https://tngop.org/counties/',
        'https://tngop.org/county-chairs/',
        'https://www.tngop.org/leadership/',
    ],
    'KY': [
        'https://rpk.org/counties/',
        'https://rpk.org/county-leadership/',
        'https://kentuckygop.org/counties/',
    ],
    'SC': [
        'https://scgop.com/counties/',
        'https://scgop.com/county-leadership/',
        'https://www.scgop.com/leadership/',
    ],
    'LA': [
        'https://lagop.com/counties/',
        'https://lagop.com/parish-chairs/',
        'https://www.lagop.com/leadership/',
    ],
    'AZ': [
        'https://azgop.com/counties/',
        'https://azgop.com/county-leadership/',
        'https://www.azgop.com/leadership/',
    ],
    'CA': [
        'https://cagop.org/counties/',
        'https://cagop.org/county-leadership/',
        'https://www.cagop.org/leadership/',
    ],
    'NY': [
        'https://nygop.org/counties/',
        'https://nygop.org/county-leadership/',
        'https://www.nygop.org/leadership/',
    ],
    'NC': [
        'https://ncgop.org/counties/',
        'https://ncgop.org/county-leadership/',
        'https://www.ncgop.org/leadership/',
    ],
    'GA': [
        'https://gagop.org/counties/',
        'https://gagop.org/county-leadership/',
        'https://www.gagop.org/leadership/',
    ],
};

/**
 * Fetch a URL and return the HTML
 */
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            timeout: 15000,
        };

        const req = client.get(url, options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve({ url, html: data, statusCode: res.statusCode });
                } else {
                    resolve({ url, html: '', statusCode: res.statusCode });
                }
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ url, html: '', statusCode: 0, error: 'timeout' });
        });

        req.on('error', (err) => {
            resolve({ url, html: '', statusCode: 0, error: err.message });
        });

        req.end();
    });
}

/**
 * Check if HTML contains county chair data
 */
function hasCountyData(html, stateCode) {
    // Common indicators of county chair data
    const indicators = [
        'county',
        'chair',
        'chairman',
        'gop',
        'republican',
        'contact',
        'email',
        '@',
        '.com',
        '.org',
    ];

    const lowerHtml = html.toLowerCase();
    let score = 0;

    for (const indicator of indicators) {
        if (lowerHtml.includes(indicator)) {
            score++;
        }
    }

    // Check for minimum content length
    if (html.length < 1000) {
        return false;
    }

    // Check that it's not a 404 page
    if (lowerHtml.includes('page not found') || lowerHtml.includes('cannot be found')) {
        return false;
    }

    return score >= 5;
}

/**
 * Try all URL patterns for a state
 */
async function tryStateUrls(stateCode, stateName) {
    console.log(`\nTrying ${stateName} (${stateCode})...`);

    const urls = URL_PATTERNS[stateCode] || [];

    for (const url of urls) {
        process.stdout.write(`  Trying ${url}... `);
        const result = await fetchUrl(url);

        if (result.html && hasCountyData(result.html, stateCode)) {
            console.log(`FOUND! (${result.html.length} bytes)`);
            return { url, html: result.html };
        } else if (result.statusCode === 404) {
            console.log(`404`);
        } else if (result.statusCode === 200) {
            console.log(`200 but no data`);
        } else {
            console.log(`Error: ${result.statusCode || result.error}`);
        }
    }

    console.log(`  No working URL found`);
    return null;
}

/**
 * Main function
 */
async function main() {
    console.log('GOP County Chairs - Alternative URL Scraper');
    console.log('='.repeat(60));

    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const results = {};

    for (const [stateCode, urls] of Object.entries(URL_PATTERNS)) {
        // Get state name from first URL pattern (we'll map it)
        const stateNames = {
            'PA': 'Pennsylvania', 'FL': 'Florida', 'IA': 'Iowa', 'WI': 'Wisconsin',
            'MN': 'Minnesota', 'MI': 'Michigan', 'IL': 'Illinois', 'IN': 'Indiana',
            'TN': 'Tennessee', 'KY': 'Kentucky', 'SC': 'South Carolina', 'LA': 'Louisiana',
            'AZ': 'Arizona', 'CA': 'California', 'NY': 'New York', 'NC': 'North Carolina',
            'GA': 'Georgia',
        };

        const stateName = stateNames[stateCode];
        const result = await tryStateUrls(stateCode, stateName);

        if (result) {
            // Save the HTML
            const filename = `${stateCode.toLowerCase()}_found.html`;
            fs.writeFileSync(path.join(outputDir, filename), result.html);
            results[stateCode] = { url: result.url, filename };

            // Look for JSON data sources
            const jsonMatches = result.html.match(/https?:\/\/[^"'\s]*\.json[^"'\s]*/g);
            if (jsonMatches) {
                console.log(`  Found JSON URLs: ${jsonMatches.length}`);
                for (const jsonUrl of jsonMatches) {
                    if (!jsonUrl.includes('schema') && !jsonUrl.includes('lottie')) {
                        console.log(`    - ${jsonUrl}`);
                    }
                }
            }
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`Found working URLs for ${Object.keys(results).length} states:`);
    for (const [stateCode, data] of Object.entries(results)) {
        console.log(`  ${stateCode}: ${data.url}`);
    }

    // Save results
    fs.writeFileSync(
        path.join(outputDir, 'working_urls.json'),
        JSON.stringify(results, null, 2)
    );
}

main().catch(console.error);
