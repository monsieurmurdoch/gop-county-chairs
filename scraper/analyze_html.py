#!/usr/bin/env python3
"""Analyze HTML files to find county chair data"""

import json
import re
import sys

def analyze_file(filepath, state_name, counties=None):
    """Analyze a single HTML file"""
    try:
        with open(filepath, 'r') as f:
            html = f.read()
    except:
        print(f"Could not read {filepath}")
        return

    print(f"\n{'='*60}")
    print(f"{state_name}: {len(html)} bytes")
    print(f"{'='*60}")

    # Look for JSON data in script tags
    json_patterns = [
        ('__NEXT_DATA__', r'__NEXT_DATA__\s*=\s*({.+?})</script>'),
        ('__NUXT__', r'__NUXT__\s*=\s*({.+?})</script>'),
        ('window.__INITIAL_STATE__', r'window\.__INITIAL_STATE__\s*=\s*({.+?});'),
        ('window.data', r'window\.data\s*=\s*({.+?});'),
        ('application/ld+json', r'<script type="application/ld\+json">(.+?)</script>'),
    ]

    found_json = []
    for name, pattern in json_patterns:
        matches = re.findall(pattern, html, re.DOTALL)
        if matches:
            print(f"\n{name}: Found {len(matches)} matches")
            for i, match in enumerate(matches[:1]):
                try:
                    data = json.loads(match)
                    keys = str(list(data.keys())[:10]) if isinstance(data, dict) else type(data).__name__
                    print(f"  Data structure: {keys[:100]}")
                    found_json.append((name, data))
                except Exception as e:
                    pass

    # Look for API URLs
    api_urls = re.findall(r'(https?://[^\s"\'<>]+api[^\s"\'<>]*)', html, re.IGNORECASE)
    if api_urls:
        print(f"\nFound {len(set(api_urls))} unique API URLs:")
        for url in sorted(set(api_urls))[:10]:
            print(f"  {url}")

    # Look for county mentions
    if counties:
        found_counties = []
        for county in counties:
            if county in html:
                idx = html.find(county)
                context = html[max(0, idx-100):idx+300]
                found_counties.append((county, context[:150]))

        print(f"\nFound {len(found_counties)} counties mentioned")
        for county, ctx in found_counties[:10]:
            # Try to extract a chair name
            chair_match = re.search(r'(Chair|Contact|Person|Representative)[^:]*:?\s*<?[^>]*>?\s*([A-Z][a-z]+ [A-Z][a-z]+)', ctx, re.IGNORECASE)
            if chair_match:
                print(f"  {county}: {chair_match.group(2)}")
            else:
                # Just show the county was found
                print(f"  {county}: found")

    # Look for table data
    tables = re.findall(r'<table[^>]*>(.+?)</table>', html, re.DOTALL)
    if tables:
        print(f"\nFound {len(tables)} table(s)")
        for i, table in enumerate(tables[:2]):
            rows = re.findall(r'<tr[^>]*>(.+?)</tr>', table, re.DOTALL)
            print(f"  Table {i}: {len(rows)} rows")
            # Check first few rows for county patterns
            for row in rows[:5]:
                row_text = re.sub(r'<[^>]+>', ' ', row).strip()
                if 'county' in row_text.lower() and len(row_text) < 200:
                    print(f"    Row: {row_text[:100]}")

    return found_json

# Analyze key states
states_to_check = [
    ('/tmp/pa_gop.html', 'Pennsylvania', ['Adams', 'Allegheny', 'Beaver', 'Bedford', 'Berks', 'Bradford', 'Bucks', 'Butler', 'Chester', 'Delaware', 'Erie', 'Lancaster', 'Lehigh', 'Luzerne', 'Montgomery', 'Philadelphia', 'Westmoreland', 'York']),
    ('/tmp/oh_gop.html', 'Ohio', ['Cuyahoga', 'Franklin', 'Hamilton', 'Summit', 'Montgomery', 'Lucas', 'Stark', 'Butler', 'Mahoning', 'Portage', 'Lorain', 'Lake', 'Medina', 'Warren']),
    ('/tmp/il_gop.html', 'Illinois', ['Cook', 'DuPage', 'Lake', 'Will', 'Kane', 'McHenry', 'Madison', 'St. Clair', 'Winnebago', 'Sangamon', 'Peoria', 'Champaign', 'McLean']),
    ('/tmp/ny_gop.html', 'New York', ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Nassau', 'Suffolk', 'Westchester', 'Erie', 'Monroe', 'Albany', 'Saratoga']),
    ('/tmp/az_gop.html', 'Arizona', ['Maricopa', 'Pima', 'Pinal', 'Mohave', 'Coconino', 'Yavapai', 'Yuma']),
]

for filepath, state, counties in states_to_check:
    analyze_file(filepath, state, counties)
