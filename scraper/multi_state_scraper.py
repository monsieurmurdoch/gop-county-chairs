#!/usr/bin/env python3
"""
Multi-State GOP County Chair Scraper
Scrapes county chair information from multiple state GOP websites
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
from datetime import datetime
from urllib.parse import urljoin, urlparse

# Headers to mimic a real browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}

STATE_NAMES = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MO': 'Missouri',
    'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota',
    'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania',
    'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota',
    'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming', 'MS': 'Mississippi', 'MT': 'Montana',
    'DC': 'District of Columbia'
}

def clean_id(text):
    clean = re.sub(r'[,./:\s\'-]+', '-', text.lower())
    return clean.strip('-')

def extract_email(text):
    """Extract email addresses from text"""
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    emails = re.findall(email_pattern, text)
    return emails[0] if emails else None

def extract_phone(text):
    """Extract phone numbers from text"""
    phone_patterns = [
        r'\(\d{3}\)\s*\d{3}[-\s]\d{4}',
        r'\d{3}[-.\s]\d{3}[-.\s]\d{4}',
        r'\d{10}',
    ]
    for pattern in phone_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return None

def fetch_url(url, retries=3):
    """Fetch URL with retry logic"""
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=HEADERS, timeout=15)
            response.raise_for_status()
            return response
        except Exception as e:
            print(f"  Attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(2)
            else:
                return None
    return None

def scrape_texas():
    """Scrape Texas GOP county chairs"""
    print("\n=== Scraping Texas GOP ===")
    url = "https://www.texasgop.org/leadership-directory/"
    response = fetch_url(url)
    if not response:
        print("Failed to fetch Texas GOP page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    chairs = []

    # Texas GOP has an interactive directory - look for county listings
    # Try to find any county information in the page
    for elem in soup.find_all(['div', 'li', 'tr']):
        text = elem.get_text(strip=True)
        # Look for patterns like "County County - Name"
        county_match = re.search(r'([A-Z][a-z]+)\s+County', text)
        if county_match:
            county_name = county_match.group(1)
            # Try to find a person's name nearby
            name_match = re.search(r'([A-Z][a-z]+\s+[A-Z][a-z]+)', text)
            chair_name = name_match.group(1) if name_match else 'TBD'
            email = extract_email(text)

            chairs.append({
                'id': f'TX-{clean_id(county_name)}',
                'state': 'Texas',
                'stateCode': 'TX',
                'county': f'{county_name} County',
                'chairName': chair_name if chair_name != county_name else 'TBD',
                'email': email,
                'phone': extract_phone(text),
                'electionDate': None,
                'source': url,
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': None
            })

    print(f"  Found {len(chairs)} Texas county chairs")
    return chairs

def scrape_ohio():
    """Scrape Ohio GOP county chairs"""
    print("\n=== Scraping Ohio GOP ===")
    url = "https://www.ohiogop.org/county-chairs"
    response = fetch_url(url)
    if not response:
        print("Failed to fetch Ohio GOP page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    chairs = []

    # Look for county chair listings
    for elem in soup.find_all(['div', 'li', 'p', 'tr']):
        text = elem.get_text(strip=True)
        if len(text) < 10 or len(text) > 500:
            continue

        county_match = re.search(r'([A-Z][a-z]+)\s+County', text)
        if county_match:
            county_name = county_match.group(1)
            name_match = re.search(r'(?:Chair|Chairperson|:)\s*([A-Z][a-z]+\s+(?:[A-Z]\.\s+)?[A-Z][a-z]+)', text, re.IGNORECASE)
            chair_name = name_match.group(1).strip() if name_match else 'TBD'
            email = extract_email(text)

            chairs.append({
                'id': f'OH-{clean_id(county_name)}',
                'state': 'Ohio',
                'stateCode': 'OH',
                'county': f'{county_name} County',
                'chairName': chair_name,
                'email': email,
                'phone': extract_phone(text),
                'electionDate': None,
                'source': url,
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': None
            })

    print(f"  Found {len(chairs)} Ohio county chairs")
    return chairs

def scrape_florida():
    """Scrape Florida GOP county chairs"""
    print("\n=== Scraping Florida GOP ===")
    url = "https://www.florida.gop/party-officers"
    response = fetch_url(url)
    if not response:
        print("Failed to fetch Florida GOP page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    chairs = []

    # Look for county chair listings
    for elem in soup.find_all(['div', 'li', 'p']):
        text = elem.get_text(strip=True)
        if len(text) < 10 or len(text) > 500:
            continue

        county_match = re.search(r'([A-Z][a-z]+)\s+County', text, re.IGNORECASE)
        if county_match:
            county_name = county_match.group(1).capitalize()
            name_match = re.search(r'(?:Chair|Chairperson|:)\s*([A-Z][a-z]+\s+[A-Z][a-z]+)', text, re.IGNORECASE)
            chair_name = name_match.group(1).strip() if name_match else 'TBD'
            email = extract_email(text)

            chairs.append({
                'id': f'FL-{clean_id(county_name)}',
                'state': 'Florida',
                'stateCode': 'FL',
                'county': f'{county_name} County',
                'chairName': chair_name,
                'email': email,
                'phone': extract_phone(text),
                'electionDate': None,
                'source': url,
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': None
            })

    print(f"  Found {len(chairs)} Florida county chairs")
    return chairs

def scrape_georgia():
    """Scrape Georgia GOP county chairs"""
    print("\n=== Scraping Georgia GOP ===")
    url = "https://gagop.org/county-chairs/"
    response = fetch_url(url)
    if not response:
        print("Failed to fetch Georgia GOP page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    chairs = []

    for elem in soup.find_all(['div', 'li', 'p']):
        text = elem.get_text(strip=True)
        if len(text) < 10 or len(text) > 500:
            continue

        county_match = re.search(r'([A-Z][a-z]+)\s+County', text)
        if county_match:
            county_name = county_match.group(1)
            name_match = re.search(r'([A-Z][a-z]+\s+[A-Z][a-z]+)', text)
            chair_name = name_match.group(1).strip() if name_match else 'TBD'
            email = extract_email(text)

            chairs.append({
                'id': f'GA-{clean_id(county_name)}',
                'state': 'Georgia',
                'stateCode': 'GA',
                'county': f'{county_name} County',
                'chairName': chair_name,
                'email': email,
                'phone': extract_phone(text),
                'electionDate': None,
                'source': url,
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': None
            })

    print(f"  Found {len(chairs)} Georgia county chairs")
    return chairs

def scrape_north_carolina():
    """Scrape North Carolina GOP county chairs"""
    print("\n=== Scraping North Carolina GOP ===")
    url = "https://ncgop.org/county-organizations/"
    response = fetch_url(url)
    if not response:
        print("Failed to fetch North Carolina GOP page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    chairs = []

    for elem in soup.find_all(['div', 'li', 'p']):
        text = elem.get_text(strip=True)
        if len(text) < 10 or len(text) > 500:
            continue

        county_match = re.search(r'([A-Z][a-z]+)\s+County', text)
        if county_match:
            county_name = county_match.group(1)
            name_match = re.search(r'([A-Z][a-z]+\s+[A-Z][a-z]+)', text)
            chair_name = name_match.group(1).strip() if name_match else 'TBD'
            email = extract_email(text)

            chairs.append({
                'id': f'NC-{clean_id(county_name)}',
                'state': 'North Carolina',
                'stateCode': 'NC',
                'county': f'{county_name} County',
                'chairName': chair_name,
                'email': email,
                'phone': extract_phone(text),
                'electionDate': None,
                'source': url,
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': None
            })

    print(f"  Found {len(chairs)} North Carolina county chairs")
    return chairs

def scrape_pennsylvania():
    """Scrape Pennsylvania GOP county chairs"""
    print("\n=== Scraping Pennsylvania GOP ===")
    url = "https://pagop.org/county-chairs/"
    response = fetch_url(url)
    if not response:
        print("Failed to fetch Pennsylvania GOP page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    chairs = []

    for elem in soup.find_all(['div', 'li', 'p']):
        text = elem.get_text(strip=True)
        if len(text) < 10 or len(text) > 500:
            continue

        county_match = re.search(r'([A-Z][a-z]+)\s+County', text)
        if county_match:
            county_name = county_match.group(1)
            name_match = re.search(r'([A-Z][a-z]+\s+[A-Z][a-z]+)', text)
            chair_name = name_match.group(1).strip() if name_match else 'TBD'
            email = extract_email(text)

            chairs.append({
                'id': f'PA-{clean_id(county_name)}',
                'state': 'Pennsylvania',
                'stateCode': 'PA',
                'county': f'{county_name} County',
                'chairName': chair_name,
                'email': email,
                'phone': extract_phone(text),
                'electionDate': None,
                'source': url,
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': None
            })

    print(f"  Found {len(chairs)} Pennsylvania county chairs")
    return chairs

def scrape_michigan():
    """Scrape Michigan GOP county chairs"""
    print("\n=== Scraping Michigan GOP ===")
    url = "https://migop.org/county-chairs/"
    response = fetch_url(url)
    if not response:
        print("Failed to fetch Michigan GOP page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    chairs = []

    for elem in soup.find_all(['div', 'li', 'p']):
        text = elem.get_text(strip=True)
        if len(text) < 10 or len(text) > 500:
            continue

        county_match = re.search(r'([A-Z][a-z]+)\s+County', text)
        if county_match:
            county_name = county_match.group(1)
            name_match = re.search(r'([A-Z][a-z]+\s+[A-Z][a-z]+)', text)
            chair_name = name_match.group(1).strip() if name_match else 'TBD'
            email = extract_email(text)

            chairs.append({
                'id': f'MI-{clean_id(county_name)}',
                'state': 'Michigan',
                'stateCode': 'MI',
                'county': f'{county_name} County',
                'chairName': chair_name,
                'email': email,
                'phone': extract_phone(text),
                'electionDate': None,
                'source': url,
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': None
            })

    print(f"  Found {len(chairs)} Michigan county chairs")
    return chairs

def scrape_wisconsin():
    """Scrape Wisconsin GOP county chairs"""
    print("\n=== Scraping Wisconsin GOP ===")
    url = "https://wisgop.org/county-chairs/"
    response = fetch_url(url)
    if not response:
        print("Failed to fetch Wisconsin GOP page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    chairs = []

    for elem in soup.find_all(['div', 'li', 'p']):
        text = elem.get_text(strip=True)
        if len(text) < 10 or len(text) > 500:
            continue

        county_match = re.search(r'([A-Z][a-z]+)\s+County', text)
        if county_match:
            county_name = county_match.group(1)
            name_match = re.search(r'([A-Z][a-z]+\s+[A-Z][a-z]+)', text)
            chair_name = name_match.group(1).strip() if name_match else 'TBD'
            email = extract_email(text)

            chairs.append({
                'id': f'WI-{clean_id(county_name)}',
                'state': 'Wisconsin',
                'stateCode': 'WI',
                'county': f'{county_name} County',
                'chairName': chair_name,
                'email': email,
                'phone': extract_phone(text),
                'electionDate': None,
                'source': url,
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': None
            })

    print(f"  Found {len(chairs)} Wisconsin county chairs")
    return chairs

def scrape_missouri():
    """Scrape Missouri GOP county chairs"""
    print("\n=== Scraping Missouri GOP ===")
    url = "https://mogop.org/county-chairs/"
    response = fetch_url(url)
    if not response:
        print("Failed to fetch Missouri GOP page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    chairs = []

    for elem in soup.find_all(['div', 'li', 'p']):
        text = elem.get_text(strip=True)
        if len(text) < 10 or len(text) > 500:
            continue

        county_match = re.search(r'([A-Z][a-z]+)\s+County', text)
        if county_match:
            county_name = county_match.group(1)
            name_match = re.search(r'([A-Z][a-z]+\s+[A-Z][a-z]+)', text)
            chair_name = name_match.group(1).strip() if name_match else 'TBD'
            email = extract_email(text)

            chairs.append({
                'id': f'MO-{clean_id(county_name)}',
                'state': 'Missouri',
                'stateCode': 'MO',
                'county': f'{county_name} County',
                'chairName': chair_name,
                'email': email,
                'phone': extract_phone(text),
                'electionDate': None,
                'source': url,
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': None
            })

    print(f"  Found {len(chairs)} Missouri county chairs")
    return chairs

def scrape_indiana():
    """Scrape Indiana GOP county chairs"""
    print("\n=== Scraping Indiana GOP ===")
    url = "https://indianagop.org/county-organizations/"
    response = fetch_url(url)
    if not response:
        print("Failed to fetch Indiana GOP page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    chairs = []

    for elem in soup.find_all(['div', 'li', 'p']):
        text = elem.get_text(strip=True)
        if len(text) < 10 or len(text) > 500:
            continue

        county_match = re.search(r'([A-Z][a-z]+)\s+County', text)
        if county_match:
            county_name = county_match.group(1)
            name_match = re.search(r'([A-Z][a-z]+\s+[A-Z][a-z]+)', text)
            chair_name = name_match.group(1).strip() if name_match else 'TBD'
            email = extract_email(text)

            chairs.append({
                'id': f'IN-{clean_id(county_name)}',
                'state': 'Indiana',
                'stateCode': 'IN',
                'county': f'{county_name} County',
                'chairName': chair_name,
                'email': email,
                'phone': extract_phone(text),
                'electionDate': None,
                'source': url,
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': None
            })

    print(f"  Found {len(chairs)} Indiana county chairs")
    return chairs

def scrape_tennessee():
    """Scrape Tennessee GOP county chairs"""
    print("\n=== Scraping Tennessee GOP ===")
    url = "https://tngop.org/county-chairs/"
    response = fetch_url(url)
    if not response:
        print("Failed to fetch Tennessee GOP page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    chairs = []

    for elem in soup.find_all(['div', 'li', 'p']):
        text = elem.get_text(strip=True)
        if len(text) < 10 or len(text) > 500:
            continue

        county_match = re.search(r'([A-Z][a-z]+)\s+County', text)
        if county_match:
            county_name = county_match.group(1)
            name_match = re.search(r'([A-Z][a-z]+\s+[A-Z][a-z]+)', text)
            chair_name = name_match.group(1).strip() if name_match else 'TBD'
            email = extract_email(text)

            chairs.append({
                'id': f'TN-{clean_id(county_name)}',
                'state': 'Tennessee',
                'stateCode': 'TN',
                'county': f'{county_name} County',
                'chairName': chair_name,
                'email': email,
                'phone': extract_phone(text),
                'electionDate': None,
                'source': url,
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': None
            })

    print(f"  Found {len(chairs)} Tennessee county chairs")
    return chairs

def scrape_arizona():
    """Scrape Arizona GOP county chairs"""
    print("\n=== Scraping Arizona GOP ===")
    url = "https://azgop.org/county-chairs/"
    response = fetch_url(url)
    if not response:
        print("Failed to fetch Arizona GOP page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    chairs = []

    for elem in soup.find_all(['div', 'li', 'p']):
        text = elem.get_text(strip=True)
        if len(text) < 10 or len(text) > 500:
            continue

        county_match = re.search(r'([A-Z][a-z]+)\s+County', text)
        if county_match:
            county_name = county_match.group(1)
            name_match = re.search(r'([A-Z][a-z]+\s+[A-Z][a-z]+)', text)
            chair_name = name_match.group(1).strip() if name_match else 'TBD'
            email = extract_email(text)

            chairs.append({
                'id': f'AZ-{clean_id(county_name)}',
                'state': 'Arizona',
                'stateCode': 'AZ',
                'county': f'{county_name} County',
                'chairName': chair_name,
                'email': email,
                'phone': extract_phone(text),
                'electionDate': None,
                'source': url,
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': None
            })

    print(f"  Found {len(chairs)} Arizona county chairs")
    return chairs

def deduplicate_chairs(chairs_list):
    """Deduplicate chairs by ID"""
    seen = set()
    unique = []
    for chair in chairs_list:
        if chair['id'] not in seen:
            seen.add(chair['id'])
            unique.append(chair)
    return unique

def main():
    print("=" * 60)
    print("Multi-State GOP County Chair Scraper")
    print("=" * 60)

    all_chairs = []

    # Scrape multiple states
    scrapers = [
        scrape_texas,
        scrape_ohio,
        scrape_florida,
        scrape_georgia,
        scrape_north_carolina,
        scrape_pennsylvania,
        scrape_michigan,
        scrape_wisconsin,
        scrape_missouri,
        scrape_indiana,
        scrape_tennessee,
        scrape_arizona,
    ]

    for scraper in scrapers:
        try:
            chairs = scraper()
            all_chairs.extend(chairs)
            time.sleep(1)  # Be respectful to servers
        except Exception as e:
            print(f"Error scraping {scraper.__name__}: {e}")

    # Deduplicate
    all_chairs = deduplicate_chairs(all_chairs)

    print("\n" + "=" * 60)
    print(f"Total chairs found: {len(all_chairs)}")

    # Count by state
    state_counts = {}
    for chair in all_chairs:
        state_counts[chair['stateCode']] = state_counts.get(chair['stateCode'], 0) + 1

    print("\nChairs by state:")
    for code in sorted(state_counts.keys()):
        print(f"  {code}: {state_counts[code]}")

    # Save results
    output_file = '/Users/robertmalka/Desktop/gop-county-chairs/scraper/new_scraped_data.json'
    with open(output_file, 'w') as f:
        json.dump(all_chairs, f, indent=2)
    print(f"\nSaved to {output_file}")

    return all_chairs

if __name__ == "__main__":
    main()
