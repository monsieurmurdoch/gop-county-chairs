#!/usr/bin/env python3
"""
GOP County Chair Scraper
Collects county chair data from all 50 state Republican Party websites
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
from datetime import datetime
from typing import List, Dict, Optional
import urllib.parse

class GOPChairScraper:
    """Base scraper for GOP county chair data"""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        self.data = []
        self.state_info = {
            'AL': {'name': 'Alabama', 'url': None, 'counties': 67},
            'AK': {'name': 'Alaska', 'url': None, 'counties': 30},
            'AZ': {'name': 'Arizona', 'url': None, 'counties': 15},
            'AR': {'name': 'Arkansas', 'url': None, 'counties': 75},
            'CA': {'name': 'California', 'url': None, 'counties': 58},
            'CO': {'name': 'Colorado', 'url': None, 'counties': 64},
            'CT': {'name': 'Connecticut', 'url': None, 'counties': 8},
            'DE': {'name': 'Delaware', 'url': None, 'counties': 3},
            'FL': {'name': 'Florida', 'url': 'https://www.florida.gop/party-officers/', 'counties': 67},
            'GA': {'name': 'Georgia', 'url': None, 'counties': 159},
            'HI': {'name': 'Hawaii', 'url': None, 'counties': 5},
            'ID': {'name': 'Idaho', 'url': None, 'counties': 44},
            'IL': {'name': 'Illinois', 'url': None, 'counties': 102},
            'IN': {'name': 'Indiana', 'url': None, 'counties': 92},
            'IA': {'name': 'Iowa', 'url': 'https://www.iowagop.org/leadership', 'counties': 99},
            'KS': {'name': 'Kansas', 'url': None, 'counties': 105},
            'KY': {'name': 'Kentucky', 'url': None, 'counties': 120},
            'LA': {'name': 'Louisiana', 'url': None, 'counties': 64},
            'ME': {'name': 'Maine', 'url': None, 'counties': 16},
            'MD': {'name': 'Maryland', 'url': None, 'counties': 24},
            'MA': {'name': 'Massachusetts', 'url': None, 'counties': 14},
            'MI': {'name': 'Michigan', 'url': None, 'counties': 83},
            'MN': {'name': 'Minnesota', 'url': None, 'counties': 87},
            'MS': {'name': 'Mississippi', 'url': 'https://www.msgop.org', 'counties': 82},
            'MO': {'name': 'Missouri', 'url': None, 'counties': 115},
            'MT': {'name': 'Montana', 'url': 'https://mtgop.org', 'counties': 56},
            'NE': {'name': 'Nebraska', 'url': None, 'counties': 93},
            'NV': {'name': 'Nevada', 'url': None, 'counties': 17},
            'NH': {'name': 'New Hampshire', 'url': None, 'counties': 10},
            'NJ': {'name': 'New Jersey', 'url': None, 'counties': 21},
            'NM': {'name': 'New Mexico', 'url': 'https://newmexico.gop/officers-staff/', 'counties': 33},
            'NY': {'name': 'New York', 'url': None, 'counties': 62},
            'NC': {'name': 'North Carolina', 'url': None, 'counties': 100},
            'ND': {'name': 'North Dakota', 'url': None, 'counties': 53},
            'OH': {'name': 'Ohio', 'url': 'https://ohiogop.org/county-chairs/', 'counties': 88},
            'OK': {'name': 'Oklahoma', 'url': 'https://okgop.com/leadership-staff/', 'counties': 77},
            'OR': {'name': 'Oregon', 'url': 'https://oregon.gop/leadership/', 'counties': 36},
            'PA': {'name': 'Pennsylvania', 'url': None, 'counties': 67},
            'RI': {'name': 'Rhode Island', 'url': None, 'counties': 5},
            'SC': {'name': 'South Carolina', 'url': None, 'counties': 46},
            'SD': {'name': 'South Dakota', 'url': None, 'counties': 66},
            'TN': {'name': 'Tennessee', 'url': None, 'counties': 95},
            'TX': {'name': 'Texas', 'url': 'https://texasgop.org/leadership-directory/', 'counties': 254},
            'UT': {'name': 'Utah', 'url': None, 'counties': 29},
            'VT': {'name': 'Vermont', 'url': None, 'counties': 14},
            'VA': {'name': 'Virginia', 'url': 'https://virginia.gop/find-your-local-gop/', 'counties': 133},
            'WA': {'name': 'Washington', 'url': None, 'counties': 39},
            'WV': {'name': 'West Virginia', 'url': None, 'counties': 55},
            'WI': {'name': 'Wisconsin', 'url': None, 'counties': 72},
            'WY': {'name': 'Wyoming', 'url': None, 'counties': 23},
        }

    def clean_id(self, text: str) -> str:
        """Clean text for use in ID"""
        # Remove special characters and replace with dash
        clean = re.sub(r'[,./:\s\'-]+', '-', text.lower())
        return clean.strip('-')

    def create_record(self, state_code: str, county: str, chair_name: str,
                     email: str = None, phone: str = None, source: str = None,
                     election_date: str = None, notes: str = None) -> Dict:
        """Create a standardized county chair record"""
        state_info = self.state_info.get(state_code, {'name': state_code})
        county_clean = county.strip()

        # Create ID from state code and county name
        id_base = f"{state_code}-{self.clean_id(county_clean)}"

        return {
            'id': id_base,
            'state': state_info['name'],
            'stateCode': state_code,
            'county': county_clean,
            'chairName': chair_name.strip(),
            'email': email,
            'phone': phone,
            'electionDate': election_date,
            'source': source or f"https://www.{state_code.lower()}gop.org" if state_code else None,
            'lastVerified': datetime.now().strftime('%Y-%m-%d'),
            'notes': notes
        }

    def fetch_url(self, url: str, timeout: int = 30) -> Optional[str]:
        """Fetch a URL and return the HTML content"""
        try:
            response = self.session.get(url, timeout=timeout)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None

    def scrape_virginia(self) -> List[Dict]:
        """Scrape Virginia GOP county chairs - already done, including for completeness"""
        url = 'https://virginia.gop/find-your-local-gop/'
        html = self.fetch_url(url)
        if not html:
            return []

        soup = BeautifulSoup(html, 'html.parser')
        records = []

        # Virginia has a clean format: ### County\n\nName\n\n###...
        content = soup.get_text()
        lines = content.split('\n')

        current_county = None
        for line in lines:
            line = line.strip()
            if not line:
                continue
            # Look for county pattern (usually starts with ###)
            if line.startswith('###') or ' County' in line:
                current_county = line.replace('###', '').strip()
            elif current_county and len(line) > 2 and len(line) < 50:
                # Likely a name
                records.append(self.create_record(
                    'VA', current_county, line, source=url
                ))
                current_county = None

        return records

    def scrape_state_generic(self, state_code: str, url: str) -> List[Dict]:
        """Generic scraper for states with HTML directories"""
        html = self.fetch_url(url)
        if not html:
            return []

        soup = BeautifulSoup(html, 'html.parser')
        records = []

        # Look for common patterns
        # 1. Tables with county/chair columns
        for table in soup.find_all('table'):
            rows = table.find_all('tr')
            for row in rows[1:]:  # Skip header
                cells = row.find_all(['td', 'th'])
                if len(cells) >= 2:
                    county = cells[0].get_text(strip=True)
                    chair = cells[1].get_text(strip=True)
                    if county and chair and 'County' in county:
                        records.append(self.create_record(
                            state_code, county, chair, source=url
                        ))

        # 2. Lists or divs with class containing 'county' or 'chair'
        for item in soup.find_all(class_=re.compile('county|chair|leadership', re.I)):
            text = item.get_text(strip=True)
            if len(text) < 100 and len(text.split()) >= 2:
                # Could be a county + name
                words = text.split()
                if any(c in text.lower() for c in ['county', 'parish', 'borough']):
                    records.append(self.create_record(
                        state_code, text, 'TBD', source=url, notes='Needs manual verification'
                    ))

        return records

    def scrape_texas(self) -> List[Dict]:
        """Scrape Texas GOP leadership directory"""
        url = 'https://texasgop.org/leadership-directory/'
        html = self.fetch_url(url)
        if not html:
            return []

        soup = BeautifulSoup(html, 'html.parser')
        records = []

        # Texas uses a dropdown or accordion format
        # Look for county patterns
        for elem in soup.find_all(text=re.compile(r'\s*County\s*', re.I)):
            parent = elem.find_parent()
            if parent:
                county = elem.strip()
                # Try to find associated chair
                sibling = parent.find_next_sibling() or parent.find_parent().find_next_sibling()
                if sibling:
                    chair = sibling.get_text(strip=True)
                    if chair and len(chair) < 50:
                        records.append(self.create_record(
                            'TX', county, chair, source=url
                        ))

        return records

    def discover_state_urls(self) -> Dict[str, str]:
        """Discover state GOP party URLs that have county chair directories"""
        # Known URLs from research
        known_urls = {
            'VA': 'https://virginia.gop/find-your-local-gop/',
            'TX': 'https://texasgop.org/leadership-directory/',
            'OH': 'https://ohiogop.org/county-chairs/',
            'FL': 'https://florida.gop/party-officers/',
            'IA': 'https://www.iowagop.org/leadership',
            'NM': 'https://newmexico.gop/officers-staff/',
            'OK': 'https://okgop.com/leadership-staff/',
            'OR': 'https://oregon.gop/leadership/',
            'MS': 'https://www.msgop.org',
            'MT': 'https://mtgop.org',
        }

        # Try to find URLs for other states
        for state_code, info in self.state_info.items():
            if state_code in known_urls:
                continue

            # Try common URL patterns
            patterns = [
                f"https://www.{state_code.lower()}gop.org/county-chairs/",
                f"https://www.{state_code.lower()}gop.org/leadership/",
                f"https://www.{state_code.lower()}gop.org/local/",
                f"https://{state_code.lower()}gop.org/leadership/",
                f"https://{state_code.lower()}.gop/county-chairs/",
                f"https://www.{state_code.lower()}republicanparty.com/leadership/",
            ]

            for pattern in patterns:
                try:
                    response = self.session.head(pattern, timeout=10)
                    if response.status_code == 200:
                        known_urls[state_code] = pattern
                        print(f"Found URL for {state_code}: {pattern}")
                        break
                except:
                    continue

        return known_urls

    def scrape_all_states(self) -> List[Dict]:
        """Main method to scrape all 50 states"""
        all_data = []

        # Start with Virginia (already have data)
        print("Scraping Virginia...")
        all_data.extend(self.scrape_virginia())
        print(f"Virginia: {len(self.scrape_virginia())} records")

        # Discover URLs
        print("Discovering state party URLs...")
        state_urls = self.discover_state_urls()

        # Scrape each state
        for state_code, url in state_urls.items():
            if state_code == 'VA':
                continue  # Already done

            print(f"Scraping {state_code}...")
            time.sleep(1)  # Be respectful

            if state_code == 'TX':
                records = self.scrape_texas()
            else:
                records = self.scrape_state_generic(state_code, url)

            all_data.extend(records)
            print(f"  {state_code}: {len(records)} records")

        # For states without data, create placeholder records
        for state_code, info in self.state_info.items():
            existing = [d for d in all_data if d['stateCode'] == state_code]
            if not existing:
                print(f"No data for {state_code} - creating manual entry placeholders")
                # Create a few sample counties as placeholders
                all_data.append(self.create_record(
                    state_code, f"{info['name']} (all counties)", 'TBD - Manual Entry Needed',
                    notes=f"Requires manual verification - {info['counties']} counties"
                ))

        return all_data

    def save_to_json(self, data: List[Dict], output_file: str):
        """Save data to JSON file in JavaScript format"""
        # Convert to JavaScript export format
        js_content = "// GOP County Chairs Data\n// Generated: " + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + "\n\n"
        js_content += "export const countyChairs = [\n"

        for record in data:
            js_content += "  " + json.dumps(record, ensure_ascii=False) + ",\n"

        js_content += "];\n\n"

        # Add helper functions
        js_content += """
// Get unique states
export const getStates = () => {
  const states = new Map();
  countyChairs.forEach(chair => {
    if (!states.has(chair.stateCode)) {
      states.set(chair.stateCode, {
        name: chair.state,
        code: chair.stateCode,
        countyCount: 0
      });
    }
    states.get(chair.stateCode).countyCount++;
  });
  return Array.from(states.values()).sort((a, b) => a.name.localeCompare(b.name));
};

// Get counties by state
export const getCountiesByState = (stateCode) => {
  return countyChairs.filter(chair => chair.stateCode === stateCode);
};

// Search chairs
export const searchChairs = (query) => {
  const lowerQuery = query.toLowerCase();
  return countyChairs.filter(chair =>
    chair.chairName.toLowerCase().includes(lowerQuery) ||
    chair.county.toLowerCase().includes(lowerQuery) ||
    chair.state.toLowerCase().includes(lowerQuery)
  );
};
"""

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)

        print(f"Saved {len(data)} records to {output_file}")


def main():
    scraper = GOPChairScraper()

    print("Starting GOP County Chair Scraper...")
    print("=" * 50)

    data = scraper.scrape_all_states()

    # Save to React data file
    output_file = '/Users/robertmalka/Desktop/gop-county-chairs/src/data/county-chairs.js'
    scraper.save_to_json(data, output_file)

    # Also save raw JSON for backup
    with open('/Users/robertmalka/Desktop/gop-county-chairs/scraper/county-chairs-raw.json', 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("=" * 50)
    print(f"Total records collected: {len(data)}")
    print("Done!")


if __name__ == "__main__":
    main()
