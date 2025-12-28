#!/usr/bin/env python3
"""
Scrape JavaScript-heavy state GOP sites using various techniques:
1. Look for hidden JSON data in HTML
2. Try API endpoints
3. Use browser-like headers
"""

import json
import re
import subprocess
import sys

# States to scrape with JavaScript-heavy sites
JS_STATES = {
    'OH': {'name': 'Ohio', 'url': 'https://ohiogop.org/county-chairs', 'counties': 88},
    'FL': {'name': 'Florida', 'url': 'https://www.floridagop.org/county-organizations', 'counties': 67},
    'PA': {'name': 'Pennsylvania', 'url': 'https://pagop.org/county-leadership', 'counties': 67},
    'IA': {'name': 'Iowa', 'url': 'https://www.iowagop.org/leadership', 'counties': 99},
    'NC': {'name': 'North Carolina', 'url': 'https://ncgop.org/county-organizations', 'counties': 100},
    'GA': {'name': 'Georgia', 'url': 'https://gagop.org/county-leadership', 'counties': 159},
    'WI': {'name': 'Wisconsin', 'url': 'https://wisgop.org/county-leadership', 'counties': 72},
    'MN': {'name': 'Minnesota', 'url': 'https://mngop.com/leadership', 'counties': 87},
    'MI': {'name': 'Michigan', 'url': 'https://migop.org/county-leadership', 'counties': 83},
    'IL': {'name': 'Illinois', 'url': 'https://ilgop.org/county-leadership', 'counties': 102},
    'IN': {'name': 'Indiana', 'url': 'https://indianagop.com/county-leadership', 'counties': 92},
    'TN': {'name': 'Tennessee', 'url': 'https://tngop.org/county-leadership', 'counties': 95},
    'KY': {'name': 'Kentucky', 'url': 'https://rpk.org/local-gop', 'counties': 120},
    'SC': {'name': 'South Carolina', 'url': 'https://scgop.com/county-parties', 'counties': 46},
    'LA': {'name': 'Louisiana', 'url': 'https://lagop.com/parish-leadership', 'counties': 64},
    'AL': {'name': 'Alabama', 'url': 'https://www.algop.org/county-leadership', 'counties': 67},
    'AZ': {'name': 'Arizona', 'url': 'https://azgop.com/county-leadership', 'counties': 15},
    'CA': {'name': 'California', 'url': 'https://cagop.org/county-leadership', 'counties': 58},
    'NY': {'name': 'New York', 'url': 'https://www.nygop.org/county-organizations', 'counties': 62},
}

def fetch_with_curl(url):
    """Fetch page with curl using browser-like headers"""
    try:
        result = subprocess.run([
            'curl', '-s', '-L',
            '-H', 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            '-H', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            '-H', 'Accept-Language: en-US,en;q=0.9',
            url
        ], capture_output=True, text=True, timeout=30)
        return result.stdout
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

def extract_json_from_html(html):
    """Extract JSON data embedded in HTML (common pattern with React/Vue apps)"""
    # Look for <script> tags with JSON data
    script_matches = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
    json_data = []

    for script in script_matches:
        # Look for common patterns like window.__INITIAL_STATE__, etc.
        patterns = [
            r'window\.__INITIAL_STATE__\s*=\s*({.+?});',
            r'window\.INITIAL_DATA\s*=\s*({.+?});',
            r'data-sveltekit-fetched[^>]*>(.+?)</script>',
            r'__NEXT_DATA__\s*=\s*({.+?})</script>',
            r'__NUXT__\s*=\s*({.+?})</script>',
            r'"props":\s*{.+?},"page"',
        ]

        for pattern in patterns:
            matches = re.findall(pattern, script)
            for match in matches:
                try:
                    data = json.loads(match)
                    json_data.append(data)
                except:
                    pass

    return json_data

def scrape_state(state_code, state_info):
    """Scrape a single state"""
    url = state_info['url']
    print(f"\n{'='*60}")
    print(f"Scraping {state_info['name']} ({state_code}) from {url}")
    print(f'{'='*60}')

    html = fetch_with_curl(url)
    if not html:
        print(f"Failed to fetch page")
        return []

    print(f"Fetched {len(html)} bytes")

    # Try to extract embedded JSON
    json_data = extract_json_from_html(html)
    if json_data:
        print(f"Found {len(json_data)} JSON data objects")

    # Look for county-chair patterns in HTML
    # Save HTML for manual inspection
    with open(f'/tmp/{state_code.lower()}_gop.html', 'w') as f:
        f.write(html)

    print(f"Saved to /tmp/{state_code.lower()}_gop.html for manual inspection")

    # Try simple text extraction
    return []

def main():
    print("GOP County Chairs - JavaScript Site Scraper")
    print("=" * 60)

    all_chairs = {}

    for state_code, state_info in JS_STATES.items():
        chairs = scrape_state(state_code, state_info)
        if chairs:
            all_chairs[state_code] = chairs

    print(f"\n\n{'='*60}")
    print("Summary")
    print(f"{'='*60}")
    print("States processed: ", len(JS_STATES))
    print("\nNext steps:")
    print("1. Check /tmp/STATE_gop.html files for data structure")
    print("2. Extract county-chair patterns")
    print("3. Merge valid data into main dataset")

if __name__ == '__main__':
    main()
