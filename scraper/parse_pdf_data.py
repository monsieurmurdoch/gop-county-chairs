#!/usr/bin/env python3
"""
Parse PDF data for Mississippi and Montana county chairs
"""

import json
import re
from datetime import datetime

# Mississippi data from PDF
MISSISSIPPI_DATA = [
    {"county": "Adams County", "chairName": "Paul Brown", "email": "pbrown5205@aol.com", "stateCode": "MS"},
    {"county": "Alcorn County", "chairName": "Charles Seago", "email": "seagosurveying@bellsouth.net", "stateCode": "MS"},
    {"county": "Attala County", "chairName": "Scott Wiggers", "email": "swiggers@att.net", "stateCode": "MS"},
    {"county": "Benton County", "chairName": "Olivia Futral", "email": "ofutral@att.net", "stateCode": "MS"},
    {"county": "Bolivar County", "chairName": "Pamela Maxwell", "email": "prmaxwell@yahoo.com", "stateCode": "MS"},
    {"county": "Calhoun County", "chairName": "Steve Whitten", "email": "srw4@mail.com", "stateCode": "MS"},
    {"county": "Carroll County", "chairName": "Kate Strachan", "email": "katestrachan99@yahoo.com", "stateCode": "MS"},
    {"county": "Chickasaw County", "chairName": "Scott Murphee", "email": "smurphree2696@gmail.com", "stateCode": "MS"},
    {"county": "Choctaw County", "chairName": "Ernest Hadley", "email": "ernestcliffordhadleyiv@gmail.com", "stateCode": "MS"},
    {"county": "Clarke County", "chairName": "V. Chandler Mills", "email": "cmills1830@aol.com", "stateCode": "MS"},
    {"county": "Clay County", "chairName": "Dwight Dyess", "email": "dwightdyess@gmail.com", "stateCode": "MS"},
    {"county": "Coahoma County", "chairName": "Nathan McMullen", "email": "nathanmcmullen@yahoo.com", "stateCode": "MS"},
    {"county": "Covington County", "chairName": "Robert Faler", "email": "feedersmilling@hotmail.com", "stateCode": "MS"},
    {"county": "DeSoto County", "chairName": "Shannon Bibbee", "email": "s.bibbee@gmail.com", "stateCode": "MS"},
    {"county": "Forrest County", "chairName": "Larry DeLeon", "email": "fcrec.chair@gmail.com", "stateCode": "MS"},
    {"county": "George County", "chairName": "Jeff Howell", "email": "rcnursery@bellsouth.net", "stateCode": "MS"},
    {"county": "Greene County", "chairName": "Girard Bolton", "email": "ruthanne@tds.net", "stateCode": "MS"},
    {"county": "Grenada County", "chairName": "Dolly Marascalco", "email": "dolly38901@yahoo.com", "stateCode": "MS"},
    {"county": "Hancock County", "chairName": "Jason Chiniche", "email": "jason@jjc-eng.com", "stateCode": "MS"},
    {"county": "Harrison County", "chairName": "Frank Genzer", "email": "frank@genzer-whlcarchitecture.com", "stateCode": "MS"},
    {"county": "Hinds County", "chairName": "Pete Perry", "email": "pperry@pgrms.com", "stateCode": "MS"},
    {"county": "Holmes County", "chairName": "Bruce Edwards", "email": "bruceaedwards12@gmail.com", "stateCode": "MS"},
    {"county": "Humphreys County", "chairName": "Steven Harris", "email": "smh317@gmail.com", "stateCode": "MS"},
    {"county": "Itawamba County", "chairName": "Ron Boutwell", "email": "", "stateCode": "MS"},
    {"county": "Jackson County", "chairName": "Vivian Dailey", "email": "vdailey@cableone.net", "stateCode": "MS"},
    {"county": "Jefferson County", "chairName": "Ashlee Ellis Smith", "email": "asmith@ellissmithpolicy.com", "stateCode": "MS"},
    {"county": "Jefferson Davis County", "chairName": "James Dumas", "email": "drdumas@windstream.net", "stateCode": "MS"},
    {"county": "Jones County", "chairName": "John Parker", "email": "jparker@jparkerservices.com", "stateCode": "MS"},
    {"county": "Kemper County", "chairName": "Cheryl Sparkman", "email": "sparkmanfarms@att.net", "stateCode": "MS"},
    {"county": "Lafayette County", "chairName": "Meme Mullen", "email": "mememullen@gmail.com", "stateCode": "MS"},
    {"county": "Lamar County", "chairName": "Cheryl Cranford", "email": "ccranfordre@gmail.com", "stateCode": "MS"},
    {"county": "Lauderdale County", "chairName": "Chris Bullock", "email": "chris@catersmarket.com", "stateCode": "MS"},
    {"county": "Lawrence County", "chairName": "Dave Nichols", "email": "dhnichols@bellsouth.net", "stateCode": "MS"},
    {"county": "Leake County", "chairName": "Billy Boyd", "email": "vivianboyd@bellsouth.net", "stateCode": "MS"},
    {"county": "Lee County", "chairName": "Jimmy Stephens", "email": "jmsredhead2011@gmail.com", "stateCode": "MS"},
    {"county": "Leflore County", "chairName": "Robert E. Spiller", "email": "rspiller@msn.com", "stateCode": "MS"},
    {"county": "Lincoln County", "chairName": "John Roberts", "email": "gopjohnroberts@gmail.com", "stateCode": "MS"},
    {"county": "Lowndes County", "chairName": "Chrissy Heard", "email": "ckeysheard@gmail.com", "stateCode": "MS"},
    {"county": "Madison County", "chairName": "Renee Lambert", "email": "rolamber@aol.com", "stateCode": "MS"},
    {"county": "Marion County", "chairName": "April Cook", "email": "adwcook@hotmail.com", "stateCode": "MS"},
    {"county": "Marshall County", "chairName": "Bill Beaty", "email": "bill_beaty@ymail.com", "stateCode": "MS"},
    {"county": "Monroe County", "chairName": "Connie Long", "email": "clongaec@aol.com", "stateCode": "MS"},
    {"county": "Montgomery County", "chairName": "Matthew Bennett", "email": "jmbennett@gmail.com", "stateCode": "MS"},
    {"county": "Newton County", "chairName": "Julie Davis", "email": "suthernjules@aol.com", "stateCode": "MS"},
    {"county": "Neshoba County", "chairName": "David Carter", "email": "davidcarter39350@gmail.com", "stateCode": "MS"},
    {"county": "Noxubee County", "chairName": "Janie Gregg", "email": "mdlakzy@aol.com", "stateCode": "MS"},
    {"county": "Oktibbeha County", "chairName": "Marnita Henderson", "email": "marnita@oktibbehagop.org", "stateCode": "MS"},
    {"county": "Panola County", "chairName": "Sean O'Neal", "email": "seanonealagent@att.net", "stateCode": "MS"},
    {"county": "Pearl River County", "chairName": "Mike Tyson", "email": "tysonprcgop@gmail.com", "stateCode": "MS"},
    {"county": "Pike County", "chairName": "Bobby McDaniel", "email": "govnor@bellsouth.net", "stateCode": "MS"},
    {"county": "Pontotoc County", "chairName": "Faye Dillard", "email": "fayegdillard@gmail.com", "stateCode": "MS"},
    {"county": "Prentiss County", "chairName": "June Hutcheson", "email": "jrhutch1@att.net", "stateCode": "MS"},
    {"county": "Quitman County", "chairName": "Clayton Vance", "email": "umeagle@yahoo.com", "stateCode": "MS"},
    {"county": "Rankin County", "chairName": "Beau Cox", "email": "beaucox1@gmail.com", "stateCode": "MS"},
    {"county": "Scott County", "chairName": "Dedra Champion", "email": "championstrong@yahoo.com", "stateCode": "MS"},
    {"county": "Simpson County", "chairName": "Christopher Purdum", "email": "crpurdum@gmail.com", "stateCode": "MS"},
    {"county": "Smith County", "chairName": "Kyle Cockrell", "email": "cfm2k15@yahoo.com", "stateCode": "MS"},
    {"county": "Stone County", "chairName": "Holly Scanlon", "email": "hollyscanlon57@yahoo.com", "stateCode": "MS"},
    {"county": "Sunflower County", "chairName": "Gene Hill Jr.", "email": "ghilljr50@yahoo.com", "stateCode": "MS"},
    {"county": "Tallahatchie County", "chairName": "Jerrerico Chambers", "email": "jericho.etsd@gmail.com", "stateCode": "MS"},
    {"county": "Tate County", "chairName": "Pat Nozinich", "email": "pnozinich@reagan.com", "stateCode": "MS"},
    {"county": "Tippah County", "chairName": "Nathan Stroupe", "email": "sspetro@hotmail.com", "stateCode": "MS"},
    {"county": "Tishomingo County", "chairName": "Ken Dulaney", "email": "krdulaney@gmail.com", "stateCode": "MS"},
    {"county": "Tunica County", "chairName": "Webster Franklin", "email": "wfranklin@tunicatravel.com", "stateCode": "MS"},
    {"county": "Union County", "chairName": "Sue Morrisson", "email": "suecfnp@gmail.com", "stateCode": "MS"},
    {"county": "Walthall County", "chairName": "Jeremy Crane", "email": "cranejk@yahoo.com", "stateCode": "MS"},
    {"county": "Warren County", "chairName": "Eric Biedenharn", "email": "ericbjr@att.net", "stateCode": "MS"},
    {"county": "Washington County", "chairName": "Dave Clarke", "email": "dave.clarke@cbbcollp.com", "stateCode": "MS"},
    {"county": "Wayne County", "chairName": "Aaron Williams", "email": "aaron.auto72@aol.com", "stateCode": "MS"},
    {"county": "Webster County", "chairName": "Chad Winter", "email": "cwinter@fce-engineering.com", "stateCode": "MS"},
    {"county": "Wilkinson County", "chairName": "Alex Ventress IV", "email": "ventressjames110162@gmail.com", "stateCode": "MS"},
    {"county": "Winston County", "chairName": "Mark Forsman", "email": "markj8962@aol.com", "stateCode": "MS"},
    {"county": "Yalobusha County", "chairName": "James Person", "email": "jamespersonjr@yahoo.com", "stateCode": "MS"},
    {"county": "Yazoo County", "chairName": "Hayes Dent", "email": "hayes@hayesdent.com", "stateCode": "MS"},
]

# Montana data from PDF
MONTANA_DATA = [
    {"county": "Beaverhead County", "chairName": "Carl Malesich", "email": "cdmalesich@gmail.com", "phone": "406-660-0208", "stateCode": "MT"},
    {"county": "Big Horn County", "chairName": "Jason Stephenson", "email": "jasons8166@yahoo.com", "phone": "406-200-5375", "stateCode": "MT"},
    {"county": "Blaine County", "chairName": "Karla Buck", "email": "bpl@itstriangle.com", "phone": "406-357-2286", "stateCode": "MT"},
    {"county": "Broadwater County", "chairName": "Ed Regan", "email": "reganed33ad@gmail.com", "phone": "406-266-4442", "stateCode": "MT"},
    {"county": "Carbon County", "chairName": "Scott Boggio", "email": "slboggio@aol.com", "phone": "406-670-7115", "stateCode": "MT"},
    {"county": "Carter County", "chairName": "Dennis Bishop", "email": "dennis.bishop55@yahoo.com", "phone": "406-975-6850", "stateCode": "MT"},
    {"county": "Cascade County", "chairName": "Eric Hinebauch", "email": "eric.hinebauch@outlook.com", "phone": "406-690-6699", "stateCode": "MT"},
    {"county": "Chouteau County", "chairName": "Aaron Jones", "email": "scribnerranchinc@gmail.com", "phone": "406-552-2928", "stateCode": "MT"},
    {"county": "Custer County", "chairName": "Mollie Phipps", "email": "molliephipps@hotmail.com", "phone": "406-853-2152", "stateCode": "MT"},
    {"county": "Daniels County", "chairName": "Curtis Fladager", "email": "angrycowboy@yahoo.com", "phone": "307-251-3242", "stateCode": "MT"},
    {"county": "Dawson County", "chairName": "Colette Wilburn", "email": "cwilburn@midrivers.com", "phone": "406-365-5824", "stateCode": "MT"},
    {"county": "Fallon County", "chairName": "James Whitney", "email": "jameswhitney55@icloud.com", "phone": "406-778-1123", "stateCode": "MT"},
    {"county": "Fergus County", "chairName": "Bruce Williams", "email": "bruchar@yahoo.com", "phone": "406-366-5821", "stateCode": "MT"},
    {"county": "Flathead County", "chairName": "Al Olszewski", "email": "oz@reagan.com", "phone": "406-253-8248", "stateCode": "MT"},
    {"county": "Gallatin County", "chairName": "Marla Davis", "email": "728dwd@prodigy.net", "phone": "406-581-3704", "stateCode": "MT"},
    {"county": "Glacier County", "chairName": "Marvin Kimmet", "email": "barkk@northerntel.net", "phone": "406-339-2135", "stateCode": "MT"},
    {"county": "Golden Valley County", "chairName": "Lisa Pearce", "email": "mamapearce@hotmail.com", "phone": "907-942-0624", "stateCode": "MT"},
    {"county": "Granite County", "chairName": "Kerry Graybeal", "email": "kgraybeal5@gmail.com", "phone": "406-559-0684", "stateCode": "MT"},
    {"county": "Hill County", "chairName": "Edward Hill", "email": "hillforhouse28@gmail.com", "phone": "406-390-1098", "stateCode": "MT"},
    {"county": "Jefferson County", "chairName": "Stu Goodner", "email": "stugoodner@hotmail.com", "phone": "719-461-4873", "stateCode": "MT"},
    {"county": "Judith Basin County", "chairName": "Jessica Osmundson", "email": "rjo@itstriangle.com", "phone": "406-374-2449", "stateCode": "MT"},
    {"county": "Lake County", "chairName": "Tracy Sharp", "email": "theknowbetters@gmail.com", "phone": "406-407-2197", "stateCode": "MT"},
    {"county": "Lewis and Clark County", "chairName": "Darin Gaub", "email": "daringaub@protonmail.com", "phone": "406-579-0178", "stateCode": "MT"},
    {"county": "Lincoln County", "chairName": "Jennifer Curtiss", "email": "jensteve@interbel.net", "phone": "406-250-4736", "stateCode": "MT"},
    {"county": "Madison County", "chairName": "Bob Wagner", "email": "bobwagner4leg@yahoo.com", "phone": "406-491-2328", "stateCode": "MT"},
    {"county": "McCone County", "chairName": "Bill Harris", "email": "harrisbill50@gmail.com", "phone": "406-974-3671", "stateCode": "MT"},
    {"county": "Mineral County", "chairName": "Gordon Hendrick", "email": "hendrickhd14@yahoo.com", "phone": "406-546-9825", "stateCode": "MT"},
    {"county": "Missoula County", "chairName": "Ryan Darling", "email": "ryandarling@proton.me", "phone": "406-780-0798", "stateCode": "MT"},
    {"county": "Musselshell County", "chairName": "Maryrose Beasley", "email": "mrosebeasley@gmail.com", "phone": "406-320-2345", "stateCode": "MT"},
    {"county": "Park County", "chairName": "Glen Fowler", "email": "glen@glen-fowler.com", "phone": "406-589-6096", "stateCode": "MT"},
    {"county": "Pondera County", "chairName": "Ted Kronebusch", "email": "tedandlori@3rivers.net", "phone": "406-450-2096", "stateCode": "MT"},
    {"county": "Powder River County", "chairName": "Levi McEuen", "email": "thegiftranch@gmail.com", "phone": "406-427-5174", "stateCode": "MT"},
    {"county": "Powell County", "chairName": "Terry Jennings", "email": "jennings59722@gmail.com", "phone": "406-498-4877", "stateCode": "MT"},
    {"county": "Prairie County", "chairName": "Shane Eaton", "email": "shaneetn@midrivers.com", "phone": "406-486-5564", "stateCode": "MT"},
    {"county": "Ravalli County", "chairName": "Ron Stoltz", "email": "rkstoltz1962@gmail.com", "phone": "406-896-7495", "stateCode": "MT"},
    {"county": "Richland County", "chairName": "Kristin Larson", "email": "kslarson6@gmail.com", "phone": "406-480-5139", "stateCode": "MT"},
    {"county": "Rosebud County", "chairName": "Joan Duffield", "email": "jduffield@rangeweb.net", "phone": "406-351-2411", "stateCode": "MT"},
    {"county": "Sanders County", "chairName": "Paul Fielder", "email": "pcfielder@blackfoot.net", "phone": "406-210-5943", "stateCode": "MT"},
    {"county": "Silver Bow County", "chairName": "Robert Dwyer", "email": "rfdwyer@gmail.com", "phone": "503-332-3065", "stateCode": "MT"},
    {"county": "Stillwater County", "chairName": "Fiona Nave", "email": "fionanave@reagan.com", "phone": "406-321-4602", "stateCode": "MT"},
    {"county": "Sweet Grass County", "chairName": "Mike Duvall", "email": "mikenpatti1@gmail.com", "phone": "669-253-8375", "stateCode": "MT"},
    {"county": "Valley County", "chairName": "Jeff Pattison", "email": "pattison.jeff@gmail.com", "phone": "406-263-5333", "stateCode": "MT"},
    {"county": "Yellowstone County", "chairName": "Pam Purinton", "email": "chair@yellowstongop.org", "phone": "406-855-3535", "stateCode": "MT"},
]

def clean_id(text: str) -> str:
    """Clean text for use in ID"""
    clean = re.sub(r'[,./:\s\'-]+', '-', text.lower())
    return clean.strip('-')

def create_record(state_code: str, state_name: str, county: str, chair_name: str,
                 email: str = None, phone: str = None, source: str = None) -> dict:
    """Create a standardized county chair record"""
    return {
        'id': f"{state_code}-{clean_id(county)}",
        'state': state_name,
        'stateCode': state_code,
        'county': county.strip(),
        'chairName': chair_name.strip(),
        'email': email or None,
        'phone': phone or None,
        'electionDate': None,
        'source': source,
        'lastVerified': datetime.now().strftime('%Y-%m-%d'),
        'notes': None
    }

def generate_county_data():
    """Generate the complete county data file"""
    all_records = []

    # Add Mississippi data
    for item in MISSISSIPPI_DATA:
        all_records.append(create_record(
            'MS', 'Mississippi', item['county'], item['chairName'],
            email=item['email'],
            source='https://www.msgop.org/wp-content/uploads/2022/04/County-Chairman-list-Website-.pdf'
        ))

    # Add Montana data
    for item in MONTANA_DATA:
        all_records.append(create_record(
            'MT', 'Montana', item['county'], item['chairName'],
            email=item.get('email'),
            phone=item.get('phone'),
            source='https://mtgop.org/wp-content/uploads/2024/12/2023-2025-CC-Chair-List-8.pdf'
        ))

    return all_records

if __name__ == "__main__":
    data = generate_county_data()
    print(f"Generated {len(data)} records")
    with open('/tmp/ms_mt_chairs.json', 'w') as f:
        json.dump(data, f, indent=2)
    print("Saved to /tmp/ms_mt_chairs.json")
