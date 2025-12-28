#!/usr/bin/env python3
"""Merge Alabama data into main county-chairs.js file"""

import json
import re

# Read Alabama data
with open('alabama_chairs.json', 'r') as f:
    alabama_chairs = json.load(f)

# Read the main county-chairs.js file
with open('/Users/robertmalka/Desktop/gop-county-chairs/src/data/county-chairs.js', 'r') as f:
    content = f.read()

# Extract the array from the JavaScript file
match = re.search(r'export const countyChairs = (\[.*?\]);', content, re.DOTALL)
if match:
    existing_chairs = json.loads(match.group(1))
else:
    existing_chairs = []

# Create a dict of existing chairs by ID for easy lookup
existing_dict = {chair['id']: chair for chair in existing_chairs}

# Merge Alabama data (replace existing AL entries)
for chair in alabama_chairs:
    existing_dict[chair['id']] = chair

# Convert back to array
merged_chairs = list(existing_dict.values())

# Sort by state, then county
merged_chairs.sort(key=lambda x: (x['stateCode'], x['county']))

# Count chairs with actual names
chairs_with_names = [c for c in merged_chairs if c.get('chairName') not in ['TBD', 'VACANT', 'Coming Soon', None]]
coverage_percent = len(chairs_with_names) / len(merged_chairs) * 100

# Count chairs with emails
chairs_with_emails = [c for c in merged_chairs if c.get('email')]
chairs_with_phones = [c for c in merged_chairs if c.get('phone')]

print(f"Merged {len(alabama_chairs)} Alabama chairs")
print(f"Total counties: {len(merged_chairs)}")
print(f"Chairs with names: {len(chairs_with_names)} ({coverage_percent:.1f}%)")
print(f"Chairs with emails: {len(chairs_with_emails)}")
print(f"Chairs with phones: {len(chairs_with_phones)}")

# Write back to JavaScript format
output = f"""export const countyChairs = {json.dumps(merged_chairs, indent=2)};

export const getTotalChairs = () => countyChairs.length;

export const getChairsWithData = () => {{
  return countyChairs.filter(c => c.chairName && c.chairName !== 'TBD' && c.chairName !== 'VACANT' && c.chairName !== 'Coming Soon');
}};

export const getCoverage = () => {{
  const withData = getChairsWithData();
  return {{
    total: countyChairs.length,
    withData: withData.length,
    percent: ((withData.length / countyChairs.length) * 100).toFixed(1)
  }};
}};

export const getStates = () => {{
  const states = {{}};
  countyChairs.forEach(chair => {{
    if (!states[chair.stateCode]) {{
      states[chair.stateCode] = {{
        state: chair.state,
        stateCode: chair.stateCode,
        counties: [],
        withChair: 0
      }};
    }}
    states[chair.stateCode].counties.push(chair);
    if (chair.chairName && chair.chairName !== 'TBD' && chair.chairName !== 'VACANT' && chair.chairName !== 'Coming Soon') {{
      states[chair.stateCode].withChair++;
    }}
  }});
  return Object.values(states).sort((a, b) => a.state.localeCompare(b.state));
}};

export const getCountiesByState = (stateCode) => {{
  return countyChairs.filter(c => c.stateCode === stateCode);
}};

export const searchChairs = (query) => {{
  const q = query.toLowerCase();
  return countyChairs.filter(c =>
    c.state.toLowerCase().includes(q) ||
    c.stateCode.toLowerCase().includes(q) ||
    c.county.toLowerCase().includes(q) ||
    (c.chairName && c.chairName.toLowerCase().includes(q))
  );
}};
"""

with open('/Users/robertmalka/Desktop/gop-county-chairs/src/data/county-chairs.js', 'w') as f:
    f.write(output)

print("\nUpdated county-chairs.js")
