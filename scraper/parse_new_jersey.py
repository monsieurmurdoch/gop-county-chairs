#!/usr/bin/env python3
"""Parse New Jersey GOP county chairs from njgop.org/leadership/counties/"""

import json
from datetime import date

# New Jersey county chairs data extracted from https://www.njgop.org/leadership/counties/
NEW_JERSEY_CHAIRS = {
    'Atlantic': 'Don Purdy',
    'Bergen': 'Jack Zisa',
    'Burlington': 'Sean Earlen',
    'Camden': 'Kimberley Stuart',
    'Cape May': 'Michael Donohue',
    'Cumberland': 'Michael Testa, Jr.',
    'Essex': 'Al Barlas',
    'Gloucester': 'Adam Wingate',
    'Hudson': 'Jose Arango',
    'Hunterdon': 'Gabe Plumer',
    'Mercer': 'Patricia Johnson',
    'Middlesex': 'Robert Bengivenga Jr.',
    'Monmouth': 'Shaun Golden',
    'Morris': 'Laura Ali',
    'Ocean': 'George Gilmore',
    'Passaic': 'Peter Murphy',
    'Salem': 'Linwood Donelson',
    'Somerset': 'Tracy DiFrancesco',
    'Sussex': 'Joseph Labarbera',
    'Union': 'Carlos Santos',
    'Warren': 'Doug Steinhardt',
}

def generate_new_jersey_data():
    """Generate New Jersey county chair data"""
    chairs = []
    today = date.today().isoformat()

    for county, chair_name in NEW_JERSEY_CHAIRS.items():
        county_slug = county.lower().replace('.', '').replace(' ', '-')
        chair_id = f"NJ-{county_slug}"

        chairs.append({
            "id": chair_id,
            "state": "New Jersey",
            "stateCode": "NJ",
            "county": f"{county} County",
            "chairName": chair_name,
            "email": None,
            "phone": None,
            "electionDate": None,
            "source": "https://www.njgop.org/leadership/counties/",
            "lastVerified": today,
            "notes": None
        })

    return chairs

if __name__ == "__main__":
    chairs = generate_new_jersey_data()
    print(f"Generated {len(chairs)} New Jersey county chairs")

    # Save to JSON file
    with open('new_jersey_chairs.json', 'w') as f:
        json.dump(chairs, f, indent=2)

    print(f"Saved to new_jersey_chairs.json")
    print(f"\nSample entries:")
    for chair in chairs[:3]:
        print(f"  {chair['id']}: {chair['county']} - {chair['chairName']}")
