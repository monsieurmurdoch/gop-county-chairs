#!/usr/bin/env python3
"""
Generate comprehensive county chairs data for all 50 states
Combines scraped data with placeholders for states without data
"""

import json
from datetime import datetime

# Virginia data (93 counties)
VIRGINIA_DATA = [
    {"id": "VA-accomack-county", "state": "Virginia", "stateCode": "VA", "county": "Accomack County", "chairName": "Sam Sellard", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-albemarle-county", "state": "Virginia", "stateCode": "VA", "county": "Albemarle County", "chairName": "Nancy Muir", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-alexandria-city", "state": "Virginia", "stateCode": "VA", "county": "Alexandria City", "chairName": "Chris Howell", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-alleghany-covington", "state": "Virginia", "stateCode": "VA", "county": "Alleghany / Covington", "chairName": "Tiffany Snedegar", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-amelia-county", "state": "Virginia", "stateCode": "VA", "county": "Amelia County", "chairName": "Martha Muniz", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-amherst-county", "state": "Virginia", "stateCode": "VA", "county": "Amherst County", "chairName": "John Ruff", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-appomattox-county", "state": "Virginia", "stateCode": "VA", "county": "Appomattox County", "chairName": "Robin Wolfskill", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-arlington-county", "state": "Virginia", "stateCode": "VA", "county": "Arlington County", "chairName": "Matthew Hurtt", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-augusta-county", "state": "Virginia", "stateCode": "VA", "county": "Augusta County", "chairName": "Ray Eppard", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-bath-county", "state": "Virginia", "stateCode": "VA", "county": "Bath County", "chairName": "Deborah Mills", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-bedford-county", "state": "Virginia", "stateCode": "VA", "county": "Bedford County", "chairName": "Melvin Adams", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-bland-county", "state": "Virginia", "stateCode": "VA", "county": "Bland County", "chairName": "Patrick White", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-botetourt-county", "state": "Virginia", "stateCode": "VA", "county": "Botetourt County", "chairName": "Steve Dean", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-bristol-city", "state": "Virginia", "stateCode": "VA", "county": "Bristol City", "chairName": "Steven Gobble", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-brunswick-county", "state": "Virginia", "stateCode": "VA", "county": "Brunswick County", "chairName": "Eric Brazeal", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-buchanan-county", "state": "Virginia", "stateCode": "VA", "county": "Buchanan County", "chairName": "Tom Scott", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-buckingham-county", "state": "Virginia", "stateCode": "VA", "county": "Buckingham County", "chairName": "Ramona Christian", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-campbell-county", "state": "Virginia", "stateCode": "VA", "county": "Campbell County", "chairName": "Katherine Decker", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-caroline-county", "state": "Virginia", "stateCode": "VA", "county": "Caroline County", "chairName": "Jeff Sili", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-carroll-county", "state": "Virginia", "stateCode": "VA", "county": "Carroll County", "chairName": "Phil Hawks", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-charlotte-county", "state": "Virginia", "stateCode": "VA", "county": "Charlotte County", "chairName": "Noah Davis", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-chesapeake-city", "state": "Virginia", "stateCode": "VA", "county": "Chesapeake City", "chairName": "Nicholas Proffitt", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-chesterfield-county", "state": "Virginia", "stateCode": "VA", "county": "Chesterfield County", "chairName": "Dee Dee Vanburen", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-clarke-county", "state": "Virginia", "stateCode": "VA", "county": "Clarke County", "chairName": "Tim Johnson", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-colonial-heights", "state": "Virginia", "stateCode": "VA", "county": "Colonial Heights", "chairName": "Zachary Wood", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-craig-county", "state": "Virginia", "stateCode": "VA", "county": "Craig County", "chairName": "Susan Edwards", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-culpeper-county", "state": "Virginia", "stateCode": "VA", "county": "Culpeper County", "chairName": "Larry Green", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-cumberland-county", "state": "Virginia", "stateCode": "VA", "county": "Cumberland County", "chairName": "Glenn Mozingo", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-dickenson-county", "state": "Virginia", "stateCode": "VA", "county": "Dickenson County", "chairName": "Jony Baker", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-dinwiddie-county", "state": "Virginia", "stateCode": "VA", "county": "Dinwiddie County", "chairName": "Gary Sheehan", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-emporia-greensville", "state": "Virginia", "stateCode": "VA", "county": "Emporia/Greensville County", "chairName": "D. A. (Fred) Maldonado", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-essex-county", "state": "Virginia", "stateCode": "VA", "county": "Essex County", "chairName": "William Healy", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-fairfax-city", "state": "Virginia", "stateCode": "VA", "county": "Fairfax City", "chairName": "Anahita Renner", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-fairfax-county", "state": "Virginia", "stateCode": "VA", "county": "Fairfax County", "chairName": "Katie Gorka", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-falls-church", "state": "Virginia", "stateCode": "VA", "county": "Falls Church", "chairName": "Jack Blakely", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-fauquier-county", "state": "Virginia", "stateCode": "VA", "county": "Fauquier County", "chairName": "Tim Hoffman", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-floyd-county", "state": "Virginia", "stateCode": "VA", "county": "Floyd County", "chairName": "David Whitaker", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-fluvanna-county", "state": "Virginia", "stateCode": "VA", "county": "Fluvanna County", "chairName": "Darrell Byers", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-franklin-city", "state": "Virginia", "stateCode": "VA", "county": "Franklin City / Southampton County", "chairName": "Mark Kitchen", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-franklin-county", "state": "Virginia", "stateCode": "VA", "county": "Franklin County", "chairName": "Bill Cooper", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-frederick-county", "state": "Virginia", "stateCode": "VA", "county": "Frederick County", "chairName": "Derek Adler", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-fredericksburg", "state": "Virginia", "stateCode": "VA", "county": "Fredericksburg", "chairName": "Scott Vezina", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-giles-county", "state": "Virginia", "stateCode": "VA", "county": "Giles County", "chairName": "Mae Midkiff", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-gloucester-county", "state": "Virginia", "stateCode": "VA", "county": "Gloucester County", "chairName": "Teresa Altemus", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-goochland-county", "state": "Virginia", "stateCode": "VA", "county": "Goochland County", "chairName": "Ira \"Buddy\" Bishop", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-grayson-county", "state": "Virginia", "stateCode": "VA", "county": "Grayson County", "chairName": "Jonathan Warren", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-greene-county", "state": "Virginia", "stateCode": "VA", "county": "Greene County", "chairName": "Todd Sansom", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-halifax-county", "state": "Virginia", "stateCode": "VA", "county": "Halifax County", "chairName": "Andy Ferguson", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-hanover-county", "state": "Virginia", "stateCode": "VA", "county": "Hanover County", "chairName": "Jack Dyer", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-henrico-county", "state": "Virginia", "stateCode": "VA", "county": "Henrico County", "chairName": "Cam Modecki", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-isle-of-wight", "state": "Virginia", "stateCode": "VA", "county": "Isle of Wight County", "chairName": "Bill Yoakum", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-king-queen", "state": "Virginia", "stateCode": "VA", "county": "King & Queen County", "chairName": "Bill Rilee", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-king-george", "state": "Virginia", "stateCode": "VA", "county": "King George County", "chairName": "Julie Gibson", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-king-william", "state": "Virginia", "stateCode": "VA", "county": "King William County", "chairName": "Lindsay M. Robinson", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-lancaster-county", "state": "Virginia", "stateCode": "VA", "county": "Lancaster County", "chairName": "Johanna Carrington", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-lee-county", "state": "Virginia", "stateCode": "VA", "county": "Lee County", "chairName": "Travis Mullins", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-loudoun-county", "state": "Virginia", "stateCode": "VA", "county": "Loudoun County", "chairName": "Scott Pio", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-louisa-county", "state": "Virginia", "stateCode": "VA", "county": "Louisa County", "chairName": "William Woody", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-lunenburg-county", "state": "Virginia", "stateCode": "VA", "county": "Lunenburg County", "chairName": "Flint Lewis", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-madison-county", "state": "Virginia", "stateCode": "VA", "county": "Madison County", "chairName": "Anthony Jewett", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-mathews-county", "state": "Virginia", "stateCode": "VA", "county": "Mathews County", "chairName": "DJ Morgan", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-mecklenburg-county", "state": "Virginia", "stateCode": "VA", "county": "Mecklenburg County", "chairName": "Wally Hudson", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-middlesex-county", "state": "Virginia", "stateCode": "VA", "county": "Middlesex County", "chairName": "Gail Mitchell", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-montgomery-county", "state": "Virginia", "stateCode": "VA", "county": "Montgomery County", "chairName": "Nic Lauer", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-nelson-county", "state": "Virginia", "stateCode": "VA", "county": "Nelson County", "chairName": "Michael Henever", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-new-kent-county", "state": "Virginia", "stateCode": "VA", "county": "New Kent County", "chairName": "Jake Westbrock", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-northampton-county", "state": "Virginia", "stateCode": "VA", "county": "Northampton County", "chairName": "Rob Stubbs", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-northumberland-county", "state": "Virginia", "stateCode": "VA", "county": "Northumberland County", "chairName": "Edgar Doleman", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-nottoway-county", "state": "Virginia", "stateCode": "VA", "county": "Nottoway County", "chairName": "William Berry", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-orange-county", "state": "Virginia", "stateCode": "VA", "county": "Orange County", "chairName": "Deanne Marshall", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-page-county", "state": "Virginia", "stateCode": "VA", "county": "Page County", "chairName": "Mike Overfelt", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-patrick-county", "state": "Virginia", "stateCode": "VA", "county": "Patrick County", "chairName": "Lynne Bogle", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-pittsylvania-county", "state": "Virginia", "stateCode": "VA", "county": "Pittsylvania County", "chairName": "Will Pace", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-powhatan-county", "state": "Virginia", "stateCode": "VA", "county": "Powhatan County", "chairName": "Steve Jenkins", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-prince-edward", "state": "Virginia", "stateCode": "VA", "county": "Prince Edward County", "chairName": "Diana Shores", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-prince-william", "state": "Virginia", "stateCode": "VA", "county": "Prince William County", "chairName": "Jacob Alderman", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-pulaski-county", "state": "Virginia", "stateCode": "VA", "county": "Pulaski County", "chairName": "Joseph Goodman", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-rappahannock-county", "state": "Virginia", "stateCode": "VA", "county": "Rappahannock County", "chairName": "Ronald L. Frazier", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-richmond-county", "state": "Virginia", "stateCode": "VA", "county": "Richmond County", "chairName": "Debbie Harper", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-roanoke-county", "state": "Virginia", "stateCode": "VA", "county": "Roanoke County", "chairName": "Chris Newton", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-rockingham-county", "state": "Virginia", "stateCode": "VA", "county": "Rockingham County", "chairName": "Daryl Borgquist", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-russell-county", "state": "Virginia", "stateCode": "VA", "county": "Russell County", "chairName": "Philip Addington", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-scott-county", "state": "Virginia", "stateCode": "VA", "county": "Scott County", "chairName": "Terry Silvert", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-shenandoah-county", "state": "Virginia", "stateCode": "VA", "county": "Shenandoah County", "chairName": "Timothy Carter", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-smyth-county", "state": "Virginia", "stateCode": "VA", "county": "Smyth County", "chairName": "Adam Tolbert", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-spotsylvania-county", "state": "Virginia", "stateCode": "VA", "county": "Spotsylvania County", "chairName": "Jordan Lynch", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-stafford-county", "state": "Virginia", "stateCode": "VA", "county": "Stafford County", "chairName": "Stephen Schwartz", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-surry-county", "state": "Virginia", "stateCode": "VA", "county": "Surry County", "chairName": "Kathy Crocker", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-sussex-county", "state": "Virginia", "stateCode": "VA", "county": "Sussex County", "chairName": "Dan Spurlock", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-tazewell-county", "state": "Virginia", "stateCode": "VA", "county": "Tazewell County", "chairName": "Aaron Gillespie", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-warren-county", "state": "Virginia", "stateCode": "VA", "county": "Warren County", "chairName": "Tom McFadden", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-washington-county", "state": "Virginia", "stateCode": "VA", "county": "Washington County", "chairName": "Stephen Fulton", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-westmoreland-county", "state": "Virginia", "stateCode": "VA", "county": "Westmoreland County", "chairName": "Alan Aylor", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-williamsburg", "state": "Virginia", "stateCode": "VA", "county": "Williamsburg-James City County", "chairName": "Jim Brittain", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-wise-county", "state": "Virginia", "stateCode": "VA", "county": "Wise County and the City of Norton", "chairName": "Kim Mullins", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-wythe-county", "state": "Virginia", "stateCode": "VA", "county": "Wythe County", "chairName": "Jamie Smith", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
    {"id": "VA-york-county", "state": "Virginia", "stateCode": "VA", "county": "York County", "chairName": "Kitty Staskelunas", "email": None, "phone": None, "source": "https://virginia.gop/find-your-local-gop/"},
]

# Add lastVerified to Virginia data
for record in VIRGINIA_DATA:
    record['lastVerified'] = datetime.now().strftime('%Y-%m-%d')
    if 'electionDate' not in record:
        record['electionDate'] = None
    if 'notes' not in record:
        record['notes'] = None

# Load Mississippi and Montana data
with open('/tmp/ms_mt_chairs.json', 'r') as f:
    MS_MT_DATA = json.load(f)

# State info for placeholders
STATES_INFO = {
    'AL': {'name': 'Alabama', 'counties': 67, 'url': 'https://www.algop.org'},
    'AK': {'name': 'Alaska', 'counties': 30, 'url': 'https://www.akgop.org'},
    'AZ': {'name': 'Arizona', 'counties': 15, 'url': 'https://www.azgop.org'},
    'AR': {'name': 'Arkansas', 'counties': 75, 'url': 'https://www.argop.org'},
    'CA': {'name': 'California', 'counties': 58, 'url': 'https://www.cagop.org'},
    'CO': {'name': 'Colorado', 'counties': 64, 'url': 'https://www.cogop.org'},
    'CT': {'name': 'Connecticut', 'counties': 8, 'url': 'https://www.ctgop.org'},
    'DE': {'name': 'Delaware', 'counties': 3, 'url': 'https://www.degop.org'},
    'FL': {'name': 'Florida', 'counties': 67, 'url': 'https://www.florida.gop/party-officers/'},
    'GA': {'name': 'Georgia', 'counties': 159, 'url': 'https://www.gagop.org'},
    'HI': {'name': 'Hawaii', 'counties': 5, 'url': 'https://www.higop.org'},
    'ID': {'name': 'Idaho', 'counties': 44, 'url': 'https://www.idgop.org/leadership/'},
    'IL': {'name': 'Illinois', 'counties': 102, 'url': 'https://www.ilgop.org'},
    'IN': {'name': 'Indiana', 'counties': 92, 'url': 'https://www.ingop.org'},
    'IA': {'name': 'Iowa', 'counties': 99, 'url': 'https://www.iowagop.org/leadership'},
    'KS': {'name': 'Kansas', 'counties': 105, 'url': 'https://kansas.gop'},
    'KY': {'name': 'Kentucky', 'counties': 120, 'url': 'https://www.kygop.org'},
    'LA': {'name': 'Louisiana', 'counties': 64, 'url': 'https://www.lagop.org'},
    'ME': {'name': 'Maine', 'counties': 16, 'url': 'https://www.megop.org'},
    'MD': {'name': 'Maryland', 'counties': 24, 'url': 'https://www.mdgop.org'},
    'MA': {'name': 'Massachusetts', 'counties': 14, 'url': 'https://www.magop.org'},
    'MI': {'name': 'Michigan', 'counties': 83, 'url': 'https://www.migop.org'},
    'MN': {'name': 'Minnesota', 'counties': 87, 'url': 'https://www.mngop.org'},
    'MO': {'name': 'Missouri', 'counties': 115, 'url': 'https://www.mogop.org'},
    'NE': {'name': 'Nebraska', 'counties': 93, 'url': 'https://ne.gop'},
    'NV': {'name': 'Nevada', 'counties': 17, 'url': 'https://www.nvgop.org'},
    'NH': {'name': 'New Hampshire', 'counties': 10, 'url': 'https://www.nhgop.org'},
    'NJ': {'name': 'New Jersey', 'counties': 21, 'url': 'https://www.njgop.org/leadership/'},
    'NM': {'name': 'New Mexico', 'counties': 33, 'url': 'https://newmexico.gop/officers-staff/'},
    'NY': {'name': 'New York', 'counties': 62, 'url': 'https://www.nygop.org'},
    'NC': {'name': 'North Carolina', 'counties': 100, 'url': 'https://www.ncgop.org'},
    'ND': {'name': 'North Dakota', 'counties': 53, 'url': 'https://www.ndgop.org'},
    'OH': {'name': 'Ohio', 'counties': 88, 'url': 'https://ohiogop.org/county-chairs/'},
    'OK': {'name': 'Oklahoma', 'counties': 77, 'url': 'https://okgop.com/leadership-staff/'},
    'OR': {'name': 'Oregon', 'counties': 36, 'url': 'https://oregon.gop/leadership/'},
    'PA': {'name': 'Pennsylvania', 'counties': 67, 'url': 'https://www.pagop.org'},
    'RI': {'name': 'Rhode Island', 'counties': 5, 'url': 'https://www.rigop.org'},
    'SC': {'name': 'South Carolina', 'counties': 46, 'url': 'https://www.scgop.org'},
    'SD': {'name': 'South Dakota', 'counties': 66, 'url': 'https://www.sdgop.org'},
    'TN': {'name': 'Tennessee', 'counties': 95, 'url': 'https://www.tngop.org'},
    'TX': {'name': 'Texas', 'counties': 254, 'url': 'https://texasgop.org/leadership-directory/'},
    'UT': {'name': 'Utah', 'counties': 29, 'url': 'https://www.utgop.org/leadership/'},
    'VT': {'name': 'Vermont', 'counties': 14, 'url': 'https://www.vtgop.org'},
    'WA': {'name': 'Washington', 'counties': 39, 'url': 'https://www.wagop.org'},
    'WV': {'name': 'West Virginia', 'counties': 55, 'url': 'https://wvgop.org/leadership/'},
    'WI': {'name': 'Wisconsin', 'counties': 72, 'url': 'https://www.wigop.org'},
    'WY': {'name': 'Wyoming', 'counties': 23, 'url': 'https://www.wygop.org'},
}

def create_placeholder(state_code):
    """Create a placeholder record for states without data"""
    info = STATES_INFO[state_code]
    return {
        'id': f"{state_code.lower()}-placeholder",
        'state': info['name'],
        'stateCode': state_code,
        'county': f"All {info['counties']} Counties",
        'chairName': "TBD - Requires Research",
        'email': None,
        'phone': None,
        'electionDate': None,
        'source': info['url'],
        'lastVerified': datetime.now().strftime('%Y-%m-%d'),
        'notes': f"County chair data requires manual collection. {info['counties']} counties in this state."
    }

def generate_full_data():
    """Generate complete county chairs data for all 50 states"""
    all_data = []

    # Add Virginia
    all_data.extend(VIRGINIA_DATA)

    # Add Mississippi and Montana
    all_data.extend(MS_MT_DATA)

    # Track which states have data
    states_with_data = {r['stateCode'] for r in all_data}

    # Add placeholders for remaining states
    for state_code in STATES_INFO:
        if state_code not in states_with_data:
            all_data.append(create_placeholder(state_code))

    return all_data

# States with actual data (removed - now computed dynamically)

def generate_full_data():
    """Save data to JavaScript file"""
    js_content = f"""// GOP County Chairs Data
// Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
//
// Data sources:
// - Virginia: https://virginia.gop/find-your-local-gop/ (93 counties)
// - Mississippi: msgop.org PDF (74 counties with emails)
// - Montana: mtgop.org PDF (43 counties with emails/phones)
// - Other states: Placeholders requiring research

export const countyChairs = [
"""
    for record in data:
        js_content += "  " + json.dumps(record, ensure_ascii=False) + ",\n"

    js_content += """];

export const DATA_SOURCES = {
  virginia: { url: 'https://virginia.gop/find-your-local-gop/', count: 93, hasContactInfo: false },
  mississippi: { url: 'https://www.msgop.org/wp-content/uploads/2022/04/County-Chairman-list-Website-.pdf', count: 74, hasContactInfo: true },
  montana: { url: 'https://mtgop.org/wp-content/uploads/2024/12/2023-2025-CC-Chair-List-8.pdf', count: 43, hasContactInfo: true },
};

// Get unique states
export const getStates = () => {
  const states = new Map();
  countyChairs.forEach(chair => {{
    if (!states.has(chair.stateCode)) {{
      states.set(chair.stateCode, {{
        name: chair.state,
        code: chair.stateCode,
        countyCount: 0,
        hasData: !chair.notes?.includes('Requires Research'),
        sourceUrl: chair.source
      }});
    }}
    states.get(chair.stateCode).countyCount++;
  }});
  return Array.from(states.values()).sort((a, b) => a.name.localeCompare(b.name));
}};

// Get counties by state
export const getCountiesByState = (stateCode) => {{
  return countyChairs.filter(chair => chair.stateCode === stateCode);
}};

// Search chairs
export const searchChairs = (query) => {{
  const lowerQuery = query.toLowerCase();
  return countyChairs.filter(chair =>
    chair.chairName.toLowerCase().includes(lowerQuery) ||
    chair.county.toLowerCase().includes(lowerQuery) ||
    chair.state.toLowerCase().includes(lowerQuery)
  );
}};

// Get states with actual data (not placeholders)
export const getStatesWithData = () => {{
  return getStates().filter(s => s.hasData);
}};

// Get data completeness stats
export const getDataStats = () => {{
  const states = getStates();
  const withData = states.filter(s => s.hasData).length;
  const totalChairs = countyChairs.filter(c => !c.notes?.includes('Requires Research')).length;
  return {{
    totalStates: states.length,
    statesWithData: withData,
    totalChairs: totalChairs,
    completionPercent: Math.round((withData / states.length) * 100)
  }};
}};
"""

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"Saved {len(data)} records to {output_file}")

if __name__ == "__main__":
    data = generate_full_data()
    output_file = '/Users/robertmalka/Desktop/gop-county-chairs/src/data/county-chairs.js'
    save_to_js_file(data, output_file)

    print(f"\n=== Data Summary ===")
    print(f"Virginia: {len(VIRGINIA_DATA)} counties")
    print(f"Mississippi: {len([x for x in MS_MT_DATA if x['stateCode'] == 'MS'])} counties")
    print(f"Montana: {len([x for x in MS_MT_DATA if x['stateCode'] == 'MT'])} counties")
    print(f"Placeholders: {len([x for x in data if x['notes'] and 'Requires Research' in x['notes']])} states")
    print(f"Total records: {len(data)}")
