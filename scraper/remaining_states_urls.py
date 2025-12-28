#!/usr/bin/env python3
"""
Remaining states to scrape - URLs to try manually or with specialized tools
"""

REMAINING_STATES = {
    'AL': {
        'name': 'Alabama',
        'counties': 67,
        'url': 'https://www.algop.org/county-leadership',
        'notes': 'Requires form submission or contact'
    },
    'AK': {
        'name': 'Alaska',
        'counties': 30,  # Actually boroughs
        'url': 'https://www.alaskarepublicanparty.com/leadership',
        'notes': 'Check for district chairs instead of county'
    },
    'AZ': {
        'name': 'Arizona',
        'counties': 15,
        'url': 'https://azgop.com/county-leadership',
        'notes': 'Has county leadership page'
    },
    'CA': {
        'name': 'California',
        'counties': 58,
        'url': 'https://cagop.org/county-leadership',
        'notes': 'Large state, check for county parties'
    },
    'CT': {
        'name': 'Connecticut',
        'counties': 8,
        'url': 'https://www.ctgop.org/leadership',
        'notes': 'Small number of counties'
    },
    'DE': {
        'name': 'Delaware',
        'counties': 3,
        'url': 'https://delawaregop.com',
        'notes': 'Only 3 counties'
    },
    'DC': {
        'name': 'Washington DC',
        'counties': 1,
        'url': 'https://dc.gop',
        'notes': 'Single jurisdiction'
    },
    'FL': {
        'name': 'Florida',
        'counties': 67,
        'url': 'https://www.floridagop.org/county-organizations',
        'notes': 'Check county Republican Executive Committees'
    },
    'GA': {
        'name': 'Georgia',
        'counties': 159,
        'url': 'https://gagop.org/county-leadership',
        'notes': 'Many counties, may need manual entry'
    },
    'HI': {
        'name': 'Hawaii',
        'counties': 5,
        'url': 'https://www.hawaiigop.com',
        'notes': 'Only 5 counties'
    },
    'IA': {
        'name': 'Iowa',
        'counties': 99,
        'url': 'https://www.iowagop.org/leadership',
        'notes': 'May have county chair list'
    },
    'ID': {
        'name': 'Idaho',
        'counties': 44,
        'url': 'https://www.idahogop.org/county-leadership',
        'notes': 'Check county parties page'
    },
    'IL': {
        'name': 'Illinois',
        'counties': 102,
        'url': 'https://ilgop.org/county-leadership',
        'notes': 'Check for county organizations'
    },
    'IN': {
        'name': 'Indiana',
        'counties': 92,
        'url': 'https://indianagop.com/county-leadership',
        'notes': 'May have county directory'
    },
    'KY': {
        'name': 'Kentucky',
        'counties': 120,
        'url': 'https://rpk.org/local-gop',
        'notes': 'Local GOP page'
    },
    'LA': {
        'name': 'Louisiana',
        'counties': 64,  # Parishes
        'url': 'https://lagop.com/parish-leadership',
        'notes': 'Called parishes, not counties'
    },
    'MA': {
        'name': 'Massachusetts',
        'counties': 14,
        'url': 'https://massgop.com/local-gop',
        'notes': 'Check for city/town committees'
    },
    'MD': {
        'name': 'Maryland',
        'counties': 24,
        'url': 'https://mdgop.org/county-organizations',
        'notes': 'Check county central committees'
    },
    'ME': {
        'name': 'Maine',
        'counties': 16,
        'url': 'https://www.mainegop.com/local-committees',
        'notes': 'Small number of counties'
    },
    'MI': {
        'name': 'Michigan',
        'counties': 83,
        'url': 'https://migop.org/county-leadership',
        'notes': 'Check for county parties'
    },
    'MN': {
        'name': 'Minnesota',
        'counties': 87,
        'url': 'https://mngop.com/leadership',
        'notes': 'Leadership page exists'
    },
    'NC': {
        'name': 'North Carolina',
        'counties': 100,
        'url': 'https://ncgop.org/county-organizations',
        'notes': 'Has county organizations page'
    },
    'ND': {
        'name': 'North Dakota',
        'counties': 53,
        'url': 'https://ndgop.org/state-committee',
        'notes': 'Check state committee for district chairs'
    },
    'NH': {
        'name': 'New Hampshire',
        'counties': 10,
        'url': 'https://www.nh.gop/committees',
        'notes': 'Very few counties'
    },
    'NJ': {
        'name': 'New Jersey',
        'counties': 21,
        'url': 'https://www.njgop.org/counties',
        'notes': 'County chairs page'
    },
    'NM': {
        'name': 'New Mexico',
        'counties': 33,
        'url': 'https://www.nmgop.com/county-leadership',
        'notes': 'Check for county parties'
    },
    'NY': {
        'name': 'New York',
        'counties': 62,
        'url': 'https://www.nygop.org/county-organizations',
        'notes': 'Check county committees'
    },
    'OH': {
        'name': 'Ohio',
        'counties': 88,
        'url': 'https://ohiogop.org/county-chairs',
        'notes': 'JavaScript rendered, may need browser automation'
    },
    'OK': {  # Done
        'name': 'Oklahoma',
        'counties': 77,
        'url': 'Already scraped',
        'notes': '68/76 from PDF'
    },
    'OR': {
        'name': 'Oregon',
        'counties': 36,
        'url': 'https://oregon.gop/county-parties',
        'notes': 'Check for county organizations'
    },
    'PA': {
        'name': 'Pennsylvania',
        'counties': 67,
        'url': 'https://pagop.org/county-leadership',
        'notes': 'Check county committees'
    },
    'RI': {
        'name': 'Rhode Island',
        'counties': 5,
        'url': 'https://www.rigop.org/local-committees',
        'notes': 'Only 5 counties'
    },
    'SC': {
        'name': 'South Carolina',
        'counties': 46,
        'url': 'https://scgop.com/county-parties',
        'notes': 'Check county parties page'
    },
    'SD': {
        'name': 'South Dakota',
        'counties': 66,
        'url': 'https://www.sdgop.com/leadership',
        'notes': 'Check for county leadership'
    },
    'TN': {
        'name': 'Tennessee',
        'counties': 95,
        'url': 'https://tngop.org/county-leadership',
        'notes': 'Check county leadership page'
    },
    'UT': {
        'name': 'Utah',
        'counties': 29,
        'url': 'https://www.utgop.org/counties',
        'notes': 'County page exists'
    },
    'VT': {
        'name': 'Vermont',
        'counties': 14,
        'url': 'https://www.vtgop.org/local-gop',
        'notes': 'Small number of counties'
    },
    'WA': {
        'name': 'Washington',
        'counties': 39,
        'url': 'https://www.wagop.org/county-organizations',
        'notes': 'Check for county parties'
    },
    'WV': {
        'name': 'West Virginia',
        'counties': 55,
        'url': 'https://wvgop.wv.gov/county-leadership',
        'notes': 'Check county leadership'
    },
    'WI': {
        'name': 'Wisconsin',
        'counties': 72,
        'url': 'https://wisgop.org/county-leadership',
        'notes': 'Check for county parties'
    },
    'WY': {
        'name': 'Wyoming',
        'counties': 23,
        'url': 'https://wyogop.org/county-leadership',
        'notes': 'Small number of counties'
    },
}

if __name__ == '__main__':
    print("Remaining states to scrape:")
    print("=" * 60)
    total_counties = 0
    for code, info in REMAINING_STATES.items():
        if info['url'] != 'Already scraped':
            print(f"{code}: {info['name']:20} - {info['counties']:3} counties - {info['url']}")
            total_counties += info['counties']
    print(f"\nTotal counties remaining: {total_counties}")
