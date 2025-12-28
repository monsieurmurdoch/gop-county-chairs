// Candidates data for prospective political candidates
// This file tracks potential candidates for recruitment/support

export const candidates = [
  {
    id: "candidate-001",
    name: "Jane Smith",
    county: "Fairfax County, VA",
    stateCode: "VA",
    position: "County Chair",
    status: "potential",
    alignment: "high",
    alignmentScore: 8,
    source: "referral",
    lastContact: "2025-01-15",
    notes: "Met at local GOP event. Very interested in school choice initiatives.",
    email: "jane.smith@example.com",
    phone: null,
    experience: 5,
    previousOffices: [],
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15"
  },
  {
    id: "candidate-002",
    name: "Robert Johnson",
    county: "Montgomery County, TX",
    stateCode: "TX",
    position: "School Board Trustee",
    status: "contacted",
    alignment: "high",
    alignmentScore: 9,
    source: "event",
    lastContact: "2025-01-20",
    notes: "Strong business background. Served on PTA for 3 years. Concerned about curriculum.",
    email: "r.johnson@example.com",
    phone: null,
    experience: 3,
    previousOffices: ["PTA President"],
    createdAt: "2025-01-10",
    updatedAt: "2025-01-20"
  },
  {
    id: "candidate-003",
    name: "Maria Garcia",
    county: "Miami-Dade County, FL",
    stateCode: "FL",
    position: "City Council",
    status: "interested",
    alignment: "medium",
    alignmentScore: 6,
    source: "outreach",
    lastContact: "2025-01-22",
    notes: "Former Democrat. Shifted views on economic policy. Needs more mentoring on platform.",
    email: "maria.g@example.com",
    phone: "305-555-0123",
    experience: 2,
    previousOffices: [],
    createdAt: "2025-01-18",
    updatedAt: "2025-01-22"
  },
  {
    id: "candidate-004",
    name: "Michael Chen",
    county: "Orange County, CA",
    stateCode: "CA",
    position: "State Assembly",
    status: "potential",
    alignment: "high",
    alignmentScore: 7,
    source: "research",
    lastContact: null,
    notes: "Small business owner. Very articulate on tax policy. Haven't reached out yet.",
    email: null,
    phone: null,
    experience: 0,
    previousOffices: [],
    createdAt: "2025-01-20",
    updatedAt: "2025-01-20"
  },
  {
    id: "candidate-005",
    name: "Sarah Thompson",
    county: "Maricopa County, AZ",
    stateCode: "AZ",
    position: "School Board",
    status: "recruited",
    alignment: "high",
    alignmentScore: 9,
    source: "event",
    lastContact: "2025-01-25",
    notes: "Former teacher. Exposed union corruption in her district. Running this cycle.",
    email: "sarah.t@example.com",
    phone: "602-555-0456",
    experience: 8,
    previousOffices: ["School Board", "PTA"],
    createdAt: "2025-01-05",
    updatedAt: "2025-01-25"
  }
];

// Status options with labels and colors
export const statusOptions = [
  { value: 'potential', label: 'Potential', color: 'slate' },
  { value: 'contacted', label: 'Contacted', color: 'blue' },
  { value: 'interested', label: 'Interested', color: 'purple' },
  { value: 'recruited', label: 'Recruited', color: 'green' },
  { value: 'declined', label: 'Declined', color: 'red' },
  { value: 'not_interested', label: 'Not Interested', color: 'amber' },
];

// Alignment levels
export const alignmentOptions = [
  { value: 'high', label: 'High', scoreRange: [8, 10] },
  { value: 'medium', label: 'Medium', scoreRange: [5, 7] },
  { value: 'low', label: 'Low', scoreRange: [1, 4] },
  { value: 'unknown', label: 'Unknown', scoreRange: [0, 0] },
];

// Source options
export const sourceOptions = [
  'referral',
  'event',
  'outreach',
  'research',
  'social_media',
  'other',
];

// Position types
export const positionTypes = [
  'County Chair',
  'School Board',
  'City Council',
  'State Legislature',
  'Mayor',
  'Sheriff',
  'Other',
];

// Helper functions
export const getCandidates = () => candidates;

export const getCandidatesByStatus = (status) => {
  return candidates.filter(c => c.status === status);
};

export const getCandidatesByState = (stateCode) => {
  return candidates.filter(c => c.stateCode === stateCode);
};

export const getCandidatesByAlignment = (alignment) => {
  return candidates.filter(c => c.alignment === alignment);
};

export const searchCandidates = (query) => {
  const q = query.toLowerCase();
  return candidates.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.county.toLowerCase().includes(q) ||
    c.notes?.toLowerCase().includes(q) ||
    c.email?.toLowerCase().includes(q) ||
    c.position?.toLowerCase().includes(q)
  );
};

export const getStatusStats = () => {
  const stats = {};
  statusOptions.forEach(opt => {
    stats[opt.value] = candidates.filter(c => c.status === opt.value).length;
  });
  return stats;
};

export const addCandidate = (candidate) => {
  const newCandidate = {
    ...candidate,
    id: `candidate-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };
  candidates.push(newCandidate);
  return newCandidate;
};

export const updateCandidate = (id, updates) => {
  const index = candidates.findIndex(c => c.id === id);
  if (index !== -1) {
    candidates[index] = {
      ...candidates[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    return candidates[index];
  }
  return null;
};

export const deleteCandidate = (id) => {
  const index = candidates.findIndex(c => c.id === id);
  if (index !== -1) {
    candidates.splice(index, 1);
    return true;
  }
  return false;
};
