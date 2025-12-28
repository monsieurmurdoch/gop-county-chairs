#!/usr/bin/env python3
"""Parse Kansas GOP county chairs data"""

import json

# Kansas county chairs from kansas.gop/counties/
# Data extracted from the website

KANSAS_CHAIRS = {
    'Allen': 'John Brocker',
    'Anderson': 'Wesley Keller',
    'Atchison': 'Derek Franklin',
    'Barber': 'Mel Thompson',
    'Barton': 'Richard Frideman',
    'Bourbon': 'Kaety Bowers',
    'Brown': 'Chris Kroll',
    'Butler': 'Quentin Nusz',
    'Chase': 'Rebecca Green',
    'Chautauqua': 'Jim Beason',
    'Cherokee': 'Teri McNeal',
    'Cheyenne': 'Rodney Radcliffe',
    'Clark': 'Jim Harden',
    'Clay': 'Vonda Wiedmer',
    'Cloud': 'Ashley Hutchinson',
    'Coffey': 'Ron Strawder',
    'Comanche': 'Sandy Hoffman',
    'Cowley': 'Lael Fitzgerald',
    'Crawford': 'Jacob Cochran',
    'Decatur': 'Ralph Unger',
    'Dickinson': 'Greg Wilson',
    'Doniphan': 'Robyn Johnson',
    'Douglas': 'Brent Hoffman',
    'Edwards': 'Mike Padgham',
    'Elk': 'Steve Cook',
    'Ellis': 'Adam Peters',
    'Ellsworth': 'Todd Heitschmidt',
    'Finney': 'William Clifford',
    'Ford': 'Scott Fischer',
    'Franklin': 'Marty Bohannon',
    'Geary': 'Charles Stimatze',
    'Gove': 'Cheryl Remington',
    'Graham': 'Teri McAmoil',
    'Grant': 'Roger Flummerfelt',
    'Gray': 'Debbie Jury',
    'Greeley': 'Dwight Gooch',
    'Greenwood': 'Carol Ann Flock',
    'Hamilton': 'Mike Lewis',
    'Harper': 'Jan Lanie',
    'Harvey': 'Stewart Reimer',
    'Haskell': 'Vaughn Lower',
    'Hodgeman': 'Lance Ziesch',
    'Jackson': 'Rick Wright',
    'Jefferson': 'Sharon Sweeney',
    'Jewell': 'Keith Roe',
    'Johnson': 'Sue Huff',
    'Kearny': 'Celia Beymer',
    'Kingman': 'Shawn Vredenburg',
    'Kiowa': 'Don Stewart',
    'Labette': 'Tricia Brenneck',
    'Lane': 'Don Hineman',
    'Leavenworth': 'Gerard Overbey',
    'Lincoln': 'Denah Jensen',
    'Linn': 'Becky Johnson',
    'Logan': 'Mark Hanson',
    'Lyon': 'Renee Blackburn',
    'Marion': 'Rose Davidson',
    'Marshall': 'Bill Phillipi',
    'McPherson': 'James Bohnenblust',
    'Meade': 'Susan Fox',
    'Miami': 'Adeline Dowling',
    'Mitchell': 'Eva Delay',
    'Montgomery': 'Baylee Robinson',
    'Morris': 'Gary Floyd',
    'Morton': 'Leonardo Carrillo',
    'Nemaha': 'Ray Shinn',
    'Neosho': 'Doug Klaassen',
    'Ness': 'Brandi Reinert',
    'Norton': 'Rebecca Wetter',
    'Osage': 'Dana Webber',
    'Osborne': 'VACANT',
    'Ottawa': 'Rick Shupe',
    'Pawnee': 'Paula Carr',
    'Phillips': 'Caleb Breon',
    'Pottawatomie': 'Norman Stutzman',
    'Pratt': 'Gary Trimpe',
    'Rawlins': 'John Faber',
    'Reno': 'Ryan Patton',
    'Republic': 'Monty Dare',
    'Rice': 'Bob Booth',
    'Riley': 'Betty Mattingly-Elbert',
    'Rooks': 'Pat Wehrili',
    'Rush': 'Daniel Kenyon',
    'Russell': 'Daniel Krug',
    'Saline': 'Brenda Smith',
    'Scott': 'Monty Bare',
    'Sedgwick': 'Deb Lucia',
    'Seward': 'Tammy Sutherland-Abbott',
    'Shawnee': 'Lannel Griffith',
    'Sheridan': 'Carolyn Meyer',
    'Sherman': 'Jeannie Schields',
    'Smith': 'Vernon Reinking',
    'Stafford': 'Kurt Fairchild',
    'Stanton': 'Mary Lou Figgins',
    'Stevens': 'Erick Nordling',
    'Sumner': 'Glen Burdue',
    'Thomas': 'Mark Wood',
    'Trego': 'Richard Jensen',
    'Wabaunsee': 'Linda Highland',
    'Wallace': 'Brad Chubb',
    'Washington': 'Daniel Thalmann',
    'Wichita': 'Jim Myers',
    'Wilson': 'Bob Timmons',
    'Woodson': 'Shilo Eggers',
    'Wyandotte': 'Laura Sanchez',
}

def generate_kansas_data():
    """Generate Kansas county chairs JSON"""
    chairs = []
    today = "2025-12-27"

    for county, chair_name in KANSAS_CHAIRS.items():
        county_slug = county.lower().replace('.', '').replace(' ', '-')
        chair_id = f"KS-{county_slug}"

        chairs.append({
            "id": chair_id,
            "state": "Kansas",
            "stateCode": "KS",
            "county": f"{county} County" if not county.endswith(' County') else county,
            "chairName": chair_name,
            "email": None,
            "phone": None,
            "electionDate": None,
            "source": "https://kansas.gop/counties/",
            "lastVerified": today,
            "notes": None
        })

    return chairs

if __name__ == "__main__":
    chairs = generate_kansas_data()
    with open('/Users/robertmalka/Desktop/gop-county-chairs/scraper/kansas_chairs.json', 'w') as f:
        json.dump(chairs, f, indent=2)

    with_names = [c for c in chairs if c['chairName'] and c['chairName'] not in ['TBD', 'VACANT']]
    print(f"Generated {len(chairs)} Kansas county chairs")
    print(f"Chairs with names: {len(with_names)}")
