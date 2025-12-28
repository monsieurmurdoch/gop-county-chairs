#!/usr/bin/env python3
"""Parse Nebraska GOP county chairs data"""

import json

# Nebraska county chairs from ne.gop/about-your-party/in-your-county/
# Data extracted from the website

NEBRASKA_CHAIRS = {
    'Adams': 'Deb Carlstrom',
    'Antelope': 'Connie Baker',
    'Arthur': 'Eddie Larsen',
    'Banner': 'Gary Shoemaker',
    'Blaine': 'Vacant',
    'Boone': 'H Thomas Fick',  # Note: appears twice with different chairs, using the second one
    'Box Butte': 'Marla Wade',
    'Boyd': 'Vacant',
    'Brown': 'Bret Younkin',
    'Buffalo': 'Joseph Maul',
    'Burt': 'Joe Goebel',
    'Butler': 'Dave McPhillips',
    'Cass': 'Tracy Zeorian',
    'Cedar': 'Cammie Metheny',
    'Chase': 'Arlan Wine',
    'Cherry': 'Craig Miles',
    'Cheyenne': 'Warren Phelps',
    'Clay': 'Laurel Kohmetscher',
    'Colfax': 'Susan Fetters',
    'Cuming': 'Steven Nickerson',
    'Custer': 'Craig Safranek',
    'Dakota': 'James Hicks',
    'Dawes': 'Tony Tangwall',
    'Dawson': 'Mark Montgomery',
    'Deuel': 'Vacant',
    'Dixon': 'Rick Stewart',
    'Dodge': 'Scott Eveland',
    'Douglas': 'Nancy Hicks',
    'Dundy': 'Rodney Keiser',
    'Fillmore': 'Michael Schoop',
    'Franklin': 'Ronald Ignowski',
    'Frontier': 'Melaine Standiford',
    'Furnas': 'Kathy Wilmont',
    'Gage': 'Dennis Applegarth',
    'Garden': 'Jim Olson',
    'Garfield': 'Brad Welton',
    'Gosper': 'Vacant',
    'Grant': 'Susan Connell',
    'Greeley': 'Tim Esch',
    'Hall': 'David Plond',
    'Hamilton': 'Greg Epp',
    'Harlan': 'Jason Dowell',
    'Hayes': 'Barry Richards',
    'Hitchcock': 'Vicki Bauer',
    'Holt': 'Debra Ecklund',
    'Hooker': 'Thad Emerson',
    'Howard': 'Vacant',
    'Jefferson': 'Vacant',
    'Johnson': 'George Kahnk',
    'Kearney': 'Kirk Frecks',
    'Keith': 'Christine Vail',
    'Keya Paha': 'Betty Palmer',
    'Kimball': 'Vacant',
    'Knox': 'Keith Kube',
    'Lancaster': 'Jack Riggins',
    'Lincoln': 'Cathleen Grauerholz',
    'Logan': 'Skip Hecox',
    'Loup': 'Vacant',
    'McPherson': 'Vacant',
    'Madison': 'Ryan Stover',
    'Merrick': 'Barry Denning',
    'Morrill': 'Dave Petersen',
    'Nance': 'Vacant',
    'Nemaha': 'Richard (Ken) Riley',
    'Nuckolls': 'David Dahl',
    'Otoe': 'Jim Stark',
    'Pawnee': 'Colton Schaardt',
    'Perkins': 'Melissa Sauder',
    'Phelps': 'Jeff Wheeler',
    'Pierce': 'Brad Lewon',
    'Platte': 'Jason Beiermann',
    'Polk': 'Steve Davies',
    'Red Willow': 'Brenden Funk',
    'Richardson': 'Vincent Metzner',
    'Rock': 'Vacant',
    'Saline': 'Chuck McKay',
    'Sarpy': 'Michael Tiedeman',
    'Scotts Bluff': 'Bob Rose',
    'Saunders': 'John Schnell',
    'Seward': 'Danna Seevers',
    'Sheridan': 'Kay Schroder',
    'Sherman': 'Kelli Loos',
    'Sioux': 'Vacant',
    'Stanton': 'Margo Marie Chenoweth',
    'Thayer': 'Jon Bruegemann',
    'Thomas': 'Pat Nehen',
    'Thurston': 'Steve Wageman',
    'Valley': 'Orrin Petska',
    'Washington': 'John Orr',
    'Wayne': 'Brendon Pick',
    'Webster': 'Duane Lienemann',
    'Wheeler': 'Alan Ramsey',
    'York': 'Diana Johnson',
}

def generate_nebraska_data():
    """Generate Nebraska county chairs JSON"""
    chairs = []
    today = "2025-12-27"

    for county, chair_name in NEBRASKA_CHAIRS.items():
        county_slug = county.lower().replace('.', '').replace(' ', '-')
        chair_id = f"NE-{county_slug}"

        chairs.append({
            "id": chair_id,
            "state": "Nebraska",
            "stateCode": "NE",
            "county": f"{county} County" if not county.endswith(' County') else county,
            "chairName": chair_name if chair_name != 'Vacant' else 'VACANT',
            "email": None,
            "phone": None,
            "electionDate": None,
            "source": "https://ne.gop/about-your-party/in-your-county/",
            "lastVerified": today,
            "notes": None
        })

    return chairs

if __name__ == "__main__":
    chairs = generate_nebraska_data()
    with open('/Users/robertmalka/Desktop/gop-county-chairs/scraper/nebraska_chairs.json', 'w') as f:
        json.dump(chairs, f, indent=2)

    with_names = [c for c in chairs if c['chairName'] and c['chairName'] not in ['TBD', 'VACANT']]
    print(f"Generated {len(chairs)} Nebraska county chairs")
    print(f"Chairs with names: {len(with_names)}")
