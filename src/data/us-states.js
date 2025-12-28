// All 50 states + DC with their county/parish/borough counts
export const ALL_US_STATES = [
  { code: 'AL', name: 'Alabama', countyCount: 67 },
  { code: 'AK', name: 'Alaska', countyCount: 30 }, // Boroughs
  { code: 'AZ', name: 'Arizona', countyCount: 15 },
  { code: 'AR', name: 'Arkansas', countyCount: 75 },
  { code: 'CA', name: 'California', countyCount: 58 },
  { code: 'CO', name: 'Colorado', countyCount: 64 },
  { code: 'CT', name: 'Connecticut', countyCount: 8 },
  { code: 'DE', name: 'Delaware', countyCount: 3 },
  { code: 'FL', name: 'Florida', countyCount: 67 },
  { code: 'GA', name: 'Georgia', countyCount: 159 },
  { code: 'HI', name: 'Hawaii', countyCount: 5 }, // 4 counties + 1 consolidated city-county
  { code: 'ID', name: 'Idaho', countyCount: 44 },
  { code: 'IL', name: 'Illinois', countyCount: 102 },
  { code: 'IN', name: 'Indiana', countyCount: 92 },
  { code: 'IA', name: 'Iowa', countyCount: 99 },
  { code: 'KS', name: 'Kansas', countyCount: 105 },
  { code: 'KY', name: 'Kentucky', countyCount: 120 },
  { code: 'LA', name: 'Louisiana', countyCount: 64 }, // Parishes
  { code: 'ME', name: 'Maine', countyCount: 16 },
  { code: 'MD', name: 'Maryland', countyCount: 24 },
  { code: 'MA', name: 'Massachusetts', countyCount: 14 },
  { code: 'MI', name: 'Michigan', countyCount: 83 },
  { code: 'MN', name: 'Minnesota', countyCount: 87 },
  { code: 'MS', name: 'Mississippi', countyCount: 82 },
  { code: 'MO', name: 'Missouri', countyCount: 115 },
  { code: 'MT', name: 'Montana', countyCount: 56 },
  { code: 'NE', name: 'Nebraska', countyCount: 93 },
  { code: 'NV', name: 'Nevada', countyCount: 17 },
  { code: 'NH', name: 'New Hampshire', countyCount: 10 },
  { code: 'NJ', name: 'New Jersey', countyCount: 21 },
  { code: 'NM', name: 'New Mexico', countyCount: 33 },
  { code: 'NY', name: 'New York', countyCount: 62 },
  { code: 'NC', name: 'North Carolina', countyCount: 100 },
  { code: 'ND', name: 'North Dakota', countyCount: 53 },
  { code: 'OH', name: 'Ohio', countyCount: 88 },
  { code: 'OK', name: 'Oklahoma', countyCount: 77 },
  { code: 'OR', name: 'Oregon', countyCount: 36 },
  { code: 'PA', name: 'Pennsylvania', countyCount: 67 },
  { code: 'RI', name: 'Rhode Island', countyCount: 5 },
  { code: 'SC', name: 'South Carolina', countyCount: 46 },
  { code: 'SD', name: 'South Dakota', countyCount: 66 },
  { code: 'TN', name: 'Tennessee', countyCount: 95 },
  { code: 'TX', name: 'Texas', countyCount: 254 },
  { code: 'UT', name: 'Utah', countyCount: 29 },
  { code: 'VT', name: 'Vermont', countyCount: 14 },
  { code: 'VA', name: 'Virginia', countyCount: 133 },
  { code: 'WA', name: 'Washington', countyCount: 39 },
  { code: 'WV', name: 'West Virginia', countyCount: 55 },
  { code: 'WI', name: 'Wisconsin', countyCount: 72 },
  { code: 'WY', name: 'Wyoming', countyCount: 23 },
  { code: 'DC', name: 'District of Columbia', countyCount: 1 },
];

// Get all states with their chair counts from the county chairs data
export const getAllStatesWithChairData = (countyChairsData) => {
  // Count chairs per state from the actual data
  const stateChairCounts = {};
  countyChairsData.forEach(chair => {
    if (!stateChairCounts[chair.stateCode]) {
      stateChairCounts[chair.stateCode] = {
        total: 0,
        withChair: 0,
        withEmail: 0,
      };
    }
    stateChairCounts[chair.stateCode].total++;

    const hasChair = chair.chairName &&
      chair.chairName !== 'TBD' &&
      chair.chairName !== 'VACANT' &&
      chair.chairName !== 'Coming Soon';

    if (hasChair) {
      stateChairCounts[chair.stateCode].withChair++;
    }
    if (chair.email) {
      stateChairCounts[chair.stateCode].withEmail++;
    }
  });

  // Combine with all states list
  return ALL_US_STATES.map(stateInfo => {
    const data = stateChairCounts[stateInfo.code] || { total: 0, withChair: 0, withEmail: 0 };
    return {
      code: stateInfo.code,
      name: stateInfo.name,
      countyCount: stateInfo.countyCount,
      chairCount: data.withChair,
      totalDataCount: data.total,
      emailCount: data.withEmail,
      coveragePercent: data.total > 0 ? Math.round((data.withChair / stateInfo.countyCount) * 100) : 0,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
};
