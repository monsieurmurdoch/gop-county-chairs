#!/usr/bin/env python3
"""Parse Alabama GOP county chairs from algop.org/our-party/find-local-gop/"""

import json
import re
from datetime import date
from html import unescape

def parse_alabama_html():
    """Parse the Alabama GOP HTML file"""

    with open('/tmp/al_gop.html', 'r') as f:
        html = f.read()

    chairs = []
    today = date.today().isoformat()

    # Extract all county blocks using regex
    # Pattern matches: <h3 class="name">County Name</h3> ... </ul> (next county or end)
    county_pattern = r'<h3 class="name">([^<]+)</h3>(.*?)(?=<h3 class="name">|</div>\s*</div>)'

    matches = re.findall(county_pattern, html, re.DOTALL)

    for county_name, county_html in matches:
        county_name = county_name.strip()

        # Extract chairman name
        chair_match = re.search(r'<li class="chairman">Chairman:\s*([^<]+)</li>', county_html)
        if chair_match:
            chair_name = chair_match.group(1).strip()
            # Clean up titles like "Sen." or "Representative"
            chair_name = re.sub(r'^(Sen\.|Representative|Senator)\s+', '', chair_name)
            # Handle "Acting Chairman" cases
            chair_name = re.sub(r'\s*—Acting Chairman.*', '', chair_name).strip()
            chair_name = re.sub(r'\s*-\s*Acting Chairman.*', '', chair_name).strip()
        else:
            chair_name = None

        # Extract email
        email_match = re.search(r'<a href="mailto:([^"]+)"', county_html)
        email = email_match.group(1).strip() if email_match else None

        # Extract phone
        phone_match = re.search(r'<a href="tel:([^"]+)".*?>([^<]+)</a>', county_html)
        if phone_match:
            phone = phone_match.group(2).strip()
        else:
            phone = None

        # Create county slug
        county_slug = county_name.lower().replace(' county', '').replace('.', '').replace(' ', '-')
        chair_id = f"AL-{county_slug}"

        chairs.append({
            "id": chair_id,
            "state": "Alabama",
            "stateCode": "AL",
            "county": county_name,
            "chairName": chair_name,
            "email": email,
            "phone": phone,
            "electionDate": None,
            "source": "https://algop.org/our-party/find-local-gop/",
            "lastVerified": today,
            "notes": None
        })

    return chairs

if __name__ == "__main__":
    chairs = parse_alabama_html()
    print(f"Generated {len(chairs)} Alabama county chairs")

    # Check for missing counties (Alabama has 67)
    all_counties = [
        "Autauga", "Baldwin", "Barbour", "Bibb", "Blount", "Bullock", "Butler",
        "Calhoun", "Chambers", "Cherokee", "Chilton", "Choctaw", "Clarke", "Clay",
        "Cleburne", "Coffee", "Colbert", "Conecuh", "Coosa", "Covington",
        "Crenshaw", "Cullman", "Dale", "Dallas", "DeKalb", "Elmore", "Escambia",
        "Etowah", "Fayette", "Franklin", "Geneva", "Greene", "Hale", "Henry",
        "Houston", "Jackson", "Jefferson", "Lamar", "Lauderdale", "Lawrence", "Lee",
        "Limestone", "Lowndes", "Madison", "Marengo", "Marion", "Marshall", "Mobile",
        "Monroe", "Montgomery", "Morgan", "Perry", "Pickens", "Pike", "Randolph",
        "Russell", "Shelby", "St. Clair", "Sumter", "Talladega", "Tallapoosa",
        "Tuscaloosa", "Walker", "Washington", "Wilcox", "Winston"
    ]

    found_counties = [c['county'].replace(' County', '') for c in chairs]

    # Find missing counties
    missing = [c for c in all_counties if c not in found_counties]
    if missing:
        print(f"Missing counties: {missing}")

    # Save to JSON file
    with open('alabama_chairs.json', 'w') as f:
        json.dump(chairs, f, indent=2)

    print(f"Saved to alabama_chairs.json")
    print(f"\nSample entries:")
    for chair in chairs[:5]:
        print(f"  {chair['id']}: {chair['county']} - {chair['chairName']}")

    # Count chairs with emails
    with_email = [c for c in chairs if c.get('email')]
    with_phone = [c for c in chairs if c.get('phone')]
    print(f"\nChairs with emails: {len(with_email)}")
    print(f"Chairs with phones: {len(with_phone)}")
