#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import re
import json
from datetime import datetime
import time

def clean_id(text):
    clean = re.sub(r'[,./:\s\'-]+', '-', text.lower())
    return clean.strip('-')

def scrape_georgia_chairs():
    base_url = 'https://gagop.org/find-my-county-party'
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}

    resp = requests.get(base_url, headers=headers, timeout=30)
    soup = BeautifulSoup(resp.content, 'html.parser')

    chairs = []
    county_links = []

    for link in soup.find_all('a'):
        text = link.get_text(strip=True)
        href = link.get('href', '')
        if ' County' in text and len(text) < 50 and href and href != '/find-my-county-party':
            full_url = href if href.startswith('http') else 'https://gagop.org' + href
            county_links.append({'county': text, 'url': full_url})

    print(f'Found {len(county_links)} county links')

    for i, cl in enumerate(county_links):
        try:
            time.sleep(0.3)
            c_resp = requests.get(cl['url'], headers=headers, timeout=20)
            c_soup = BeautifulSoup(c_resp.content, 'html.parser')
            page_text = c_soup.get_text()

            chair = 'TBD'
            email = None

            # Look for chair patterns
            patterns = [
                r'Chair[\w\s]*?:\s*([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
                r'Chairperson[\w\s]*?:\s*([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
                r'Chairman[\w\s]*?:\s*([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
            ]

            for pattern in patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    chair = match.group(1)
                    break

            # Look for email
            email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', page_text)
            if email_match:
                email = email_match.group(0)

            county_clean = clean_id(cl['county'])
            chairs.append({
                'id': f'GA-{county_clean}',
                'state': 'Georgia',
                'stateCode': 'GA',
                'county': cl['county'],
                'chairName': chair,
                'email': email,
                'phone': None,
                'electionDate': '2026-05-19',
                'source': cl['url'],
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': 'Filing deadline: March 2026'
            })

            if i < 15:
                print(f"  {cl['county']}: {chair} - {email or 'no email'}")

        except Exception as e:
            print(f"  Error scraping {cl['county']}: {e}")
            chairs.append({
                'id': f"GA-{clean_id(cl['county'])}",
                'state': 'Georgia',
                'stateCode': 'GA',
                'county': cl['county'],
                'chairName': 'TBD',
                'email': None,
                'phone': None,
                'electionDate': '2026-05-19',
                'source': cl['url'],
                'lastVerified': datetime.now().strftime('%Y-%m-%d'),
                'notes': 'Filing deadline: March 2026'
            })

    print(f'\nGeorgia: Scraped {len(chairs)} counties')
    return chairs

if __name__ == '__main__':
    georgia = scrape_georgia_chairs()

    with open('georgia_chairs.json', 'w') as f:
        json.dump(georgia, f, indent=2)
    print('Saved georgia_chairs.json')
