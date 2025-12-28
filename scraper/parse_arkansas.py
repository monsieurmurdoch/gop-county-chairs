#!/usr/bin/env python3
"""Parse Arkansas GOP county chairs data"""

import json

# Arkansas county chairs from arkansasgop.org/countygop.html
# Data extracted from the website

ARKANSAS_CHAIRS = {
    'Arkansas': 'Jim Smith',
    'Baxter': 'Chris Chamberlin',
    'Boone': 'Chris Diffey',
    'Chicot': 'Fonda Matthews',
    'Clay': 'Pat Bannerman',
    'Craighead': 'Jeremy Terrell',
    'Crittenden': 'Wayne Croom',
    'Cross': 'Kevin Watts',
    'Desha': 'Jamie Sims',
    'Fulton': 'Gary Phillips',
    'Greene': 'Marc Reeves',
    'Independence': 'Cody Smith',
    'Izard': 'Michelle Graetz',
    'Jackson': 'Donny Ivie',
    'Lawrence': 'Erika Shields',
    'Lee': 'Ronni Schwantz',
    'Lincoln': 'Rebekah DeWitt',
    'Lonoke': 'Jennifer Hopper',
    'Marion': 'Bob Zdora',
    'Mississippi': 'Kylie Crosskno',
    'Monroe': 'Linda Nosler',
    'Phillips': 'Martin Rawls',
    'Poinsett': 'Randy Mills',
    'Prairie': 'John Dobson',
    'Randolph': 'Billy Hallman',
    'Searcy': 'Ellen Griffin',
    'Sharp': 'Joseph Barnes',
    'St. Francis': 'Jonathan Smith',
    'Stone': 'Darren Waddles',
    'Woodruff': 'Tom Kendrick',
    'Benton': 'Barbara Tillman',
    'Carroll': 'Shawna Writer',
    'Crawford': 'Mark Shaffer',
    'Madison': 'Wendy Pettz',
    'Sebastian': 'Kelly Procter-Pierce',
    'Washington': 'William Little',
    'Cleburne': 'Steve Smith',
    'Conway': 'Susan Dumas',
    'Faulkner': 'Samuel Strain',
    'Perry': 'Alford Drinkwater',
    'Pulaski': 'Kenneth Wallace',
    'Van Buren': 'Kevin Johnson',
    'White': 'Roger Pearson',
    'Ashley': 'Gene Barnes',
    'Bradley': 'Len Blaylock',
    'Calhoun': 'Bryan Walker',
    'Clark': 'Jenna Scott',
    'Cleveland': 'Patrick Berry',
    'Columbia': 'Beth Anne Rankin',
    'Dallas': 'Brady Harmon',
    'Drew': 'Mike Akin',
    'Franklin': 'Preston Anderson',
    'Garland': 'Gaylon Boshears',
    'Grant': 'Ken Bragg',
    'Hempstead': 'Steve Atchley',
    'Hot Spring': 'Michael Shnaekel',
    'Howard': 'Darin Wood',
    'Jefferson': 'David Singer',
    'Johnson': 'Marty Claiborne',
    'Little River': 'Karen Austin',
    'Logan': 'Aaron Chastain',
    'Miller': 'Diana Lowe',
    'Montgomery': 'Timothy Morren',
    'Nevada': 'Jared Silvey',
    'Newton': 'Vanessa Moore',
    'Ouachita': 'Jack Stewart',
    'Pike': 'Randy Bradford',
    'Polk': 'John Maddox',
    'Pope': 'Allan George',
    'Scott': 'Brody Jones',
    'Sevier': 'Monte Bartek',
    'Union': 'Kent Harrell',
    'Yell': 'Clay Hooten',
}

def generate_arkansas_data():
    """Generate Arkansas county chairs JSON"""
    chairs = []
    today = "2025-12-27"

    for county, chair_name in ARKANSAS_CHAIRS.items():
        county_slug = county.lower().replace('.', '').replace(' ', '-')
        chair_id = f"AR-{county_slug}"

        chairs.append({
            "id": chair_id,
            "state": "Arkansas",
            "stateCode": "AR",
            "county": f"{county} County" if not county.endswith(' County') else county,
            "chairName": chair_name,
            "email": None,
            "phone": None,
            "electionDate": None,
            "source": "https://www.arkansasgop.org/countygop.html",
            "lastVerified": today,
            "notes": None
        })

    return chairs

if __name__ == "__main__":
    chairs = generate_arkansas_data()
    with open('/Users/robertmalka/Desktop/gop-county-chairs/scraper/arkansas_chairs.json', 'w') as f:
        json.dump(chairs, f, indent=2)

    with_names = [c for c in chairs if c['chairName'] and c['chairName'] != 'TBD']
    print(f"Generated {len(chairs)} Arkansas county chairs")
    print(f"Chairs with names: {len(with_names)}")
