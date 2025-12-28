#!/usr/bin/env python3
"""Parse Ohio GOP county chairs from JSON file"""

import json
import subprocess
from datetime import date

# Fetch the Ohio JSON data
url = "https://ohiogop.org/wp-content/uploads/2025/11/FINAL_CountyChairDirector11132025.json"
result = subprocess.run(['curl', '-s', url], capture_output=True, text=True)
ohio_data = json.loads(result.stdout)

print(f"Fetched {len(ohio_data)} Ohio county chairs from JSON")

# Convert to our format
chairs = []
today = date.today().isoformat()

for item in ohio_data:
    county_id = item['id'].lower().replace('-', '_')
    chair_id = f"OH-{county_id}"

    # Clean up email
    email = item.get('email', '').strip() or None

    chairs.append({
        "id": chair_id,
        "state": "Ohio",
        "stateCode": "OH",
        "county": item['name'],
        "chairName": item.get('chair', '').strip(),
        "email": email,
        "phone": None,  # No phone in the data
        "electionDate": None,
        "source": "https://ohiogop.org/county-chairs",
        "lastVerified": today,
        "notes": None
    })

# Save to JSON
with open('ohio_chairs.json', 'w') as f:
    json.dump(chairs, f, indent=2)

print(f"Saved to ohio_chairs.json")

# Show stats
with_email = [c for c in chairs if c.get('email')]
print(f"\nStats:")
print(f"  Total chairs: {len(chairs)}")
print(f"  With emails: {len(with_email)}")

print(f"\nSample entries:")
for chair in chairs[:5]:
    email_str = f" - {chair['email']}" if chair['email'] else ""
    print(f"  {chair['county']}: {chair['chairName']}{email_str}")
