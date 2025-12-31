import { useState, useMemo, useEffect } from 'react';
import { countyChairs, getStates } from './data/county-chairs';
import { candidates, getCandidates, searchCandidates as searchCandidatesData, addCandidate, updateCandidate, deleteCandidate, getStatusStats } from './data/candidates';
import { getAllStatesWithChairData } from './data/us-states';
import { chairsApi, localChairsStorage } from './api/chairs';
import Filters from './components/Filters';
import CountyTable from './components/CountyTable';
import CandidatesTable from './components/CandidatesTable';
import CandidateForm from './components/CandidateForm';
import CandidateModal from './components/CandidateModal';
import CountyForm from './components/CountyForm';
import StateMap from './components/StateMap';

function App() {
  // View: 'chairs' or 'candidates'
  const [view, setView] = useState('chairs');

  // Chairs state
  const [chairsData, setChairsData] = useState(countyChairs);
  const [selectedState, setSelectedState] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'county', direction: 'asc' });
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);
  const [viewMode, setViewMode] = useState('recent'); // 'recent' or 'all'
  const [lastViewed, setLastViewed] = useState([]); // Array of chair IDs recently viewed
  const [showChairForm, setShowChairForm] = useState(false);
  const [editingChair, setEditingChair] = useState(null);

  // Handle when a chair is viewed
  const handleChairViewed = (chairId) => {
    setLastViewed(prev => {
      const filtered = prev.filter(id => id !== chairId);
      return [chairId, ...filtered].slice(0, 50); // Keep last 50
    });
  };

  // Candidates state
  const [candidates, setCandidates] = useState(getCandidates());
  const [candidateSortConfig, setCandidateSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidateFilter, setCandidateFilter] = useState({ status: 'all', alignment: 'all' });
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [viewingCandidate, setViewingCandidate] = useState(null);

  // Calculate coverage stats for chairs
  const coverageStats = useMemo(() => {
    const withData = chairsData.filter(c =>
      c.chairName && c.chairName !== 'TBD' && c.chairName !== 'VACANT' && c.chairName !== 'Coming Soon'
    );
    const withEmail = chairsData.filter(c => c.email);
    const withPhone = chairsData.filter(c => c.phone);
    return {
      total: chairsData.length,
      withData: withData.length,
      withEmail: withEmail.length,
      withPhone: withPhone.length,
      percent: ((withData.length / chairsData.length) * 100).toFixed(1)
    };
  }, [chairsData]);

  // Get filtered and sorted chairs data
  const filteredChairs = useMemo(() => {
    let filtered = chairsData;

    // Apply view mode filter
    if (viewMode === 'recent' && lastViewed.length > 0) {
      filtered = filtered.filter(chair => lastViewed.includes(chair.id));
    } else if (viewMode === 'recent' && lastViewed.length === 0) {
      // Show nothing when in recent mode but nothing viewed yet
      filtered = [];
    }

    if (selectedState !== 'all') {
      filtered = filtered.filter(chair => chair.stateCode === selectedState);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(chair =>
        (chair.chairName || '').toLowerCase().includes(query) ||
        (chair.email || '').toLowerCase().includes(query) ||
        chair.county.toLowerCase().includes(query) ||
        chair.state.toLowerCase().includes(query) ||
        chair.stateCode.toLowerCase().includes(query)
      );
    }

    if (showOnlyMissing) {
      filtered = filtered.filter(chair =>
        !chair.chairName || chair.chairName === 'TBD' || chair.chairName === 'VACANT' || chair.chairName === 'Coming Soon'
      );
    }

    filtered.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      if (sortConfig.direction === 'asc') {
        return aVal.localeCompare(bVal);
      }
      return bVal.localeCompare(aVal);
    });

    return filtered;
  }, [viewMode, lastViewed, selectedState, searchQuery, sortConfig, showOnlyMissing]);

  // Get filtered and sorted candidates data
  const filteredCandidates = useMemo(() => {
    let filtered = [...candidates];

    // Apply status filter
    if (candidateFilter.status !== 'all') {
      filtered = filtered.filter(c => c.status === candidateFilter.status);
    }

    // Apply alignment filter
    if (candidateFilter.alignment !== 'all') {
      filtered = filtered.filter(c => c.alignment === candidateFilter.alignment);
    }

    // Apply search
    if (candidateSearch) {
      const query = candidateSearch.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.county.toLowerCase().includes(query) ||
        (c.notes || '').toLowerCase().includes(query) ||
        (c.email || '').toLowerCase().includes(query) ||
        (c.position || '').toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[candidateSortConfig.key] || '';
      let bVal = b[candidateSortConfig.key] || '';

      // Special handling for alignmentScore (numeric)
      if (candidateSortConfig.key === 'alignmentScore') {
        aVal = aVal || 0;
        bVal = bVal || 0;
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return candidateSortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (sortConfig.direction === 'asc') {
        return aVal.localeCompare(bVal);
      }
      return bVal.localeCompare(aVal);
    });

    return filtered;
  }, [candidates, candidateFilter, candidateSearch, candidateSortConfig]);

  const states = getAllStatesWithChairData(chairsData);
  const candidateStatusStats = getStatusStats();

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleCandidateSort = (key) => {
    setCandidateSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const exportToCSV = () => {
    const data = view === 'chairs' ? filteredChairs : filteredCandidates;
    const filename = view === 'chairs' ? 'gop-county-chairs.csv' : 'gop-candidates.csv';

    if (view === 'chairs') {
      const headers = ['State', 'State Code', 'County', 'Chair Name', 'Email', 'Phone', 'Source', 'Last Verified'];
      const rows = data.map(chair => [
        chair.state, chair.stateCode, chair.county,
        chair.chairName || '', chair.email || '', chair.phone || '',
        chair.source, chair.lastVerified
      ]);
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } else {
      const headers = ['Name', 'County', 'State', 'Position', 'Status', 'Alignment', 'Score', 'Email', 'Phone', 'Source', 'Last Contact', 'Notes'];
      const rows = data.map(c => [
        c.name, c.county, c.stateCode || '', c.position || '', c.status,
        c.alignment, c.alignmentScore, c.email || '', c.phone || '',
        c.source || '', c.lastContact || '', `"${(c.notes || '').replace(/"/g, '""')}"`
      ]);
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    }
  };

  const handleSaveCandidate = (candidateData) => {
    if (editingCandidate) {
      const updated = updateCandidate(editingCandidate.id, candidateData);
      setCandidates(getCandidates());
    } else {
      addCandidate(candidateData);
      setCandidates(getCandidates());
    }
    setShowCandidateForm(false);
    setEditingCandidate(null);
  };

  const handleDeleteCandidate = (candidate) => {
    if (confirm(`Are you sure you want to delete ${candidate.name}?`)) {
      deleteCandidate(candidate.id);
      setCandidates(getCandidates());
      setViewingCandidate(null);
    }
  };

  // Chair CRUD handlers
  const handleSaveChair = async (chairData) => {
    try {
      // Generate ID
      const countyNormalized = chairData.county.toLowerCase()
        .replace(/ county| parish| borough| city/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const id = `${chairData.stateCode}-${countyNormalized}`;

      const chairPayload = {
        ...chairData,
        id,
      };

      if (editingChair) {
        // Update existing chair
        const updated = await chairsApi.update(editingChair.id, chairPayload);
        setChairsData(prev => prev.map(c => c.id === editingChair.id ? updated : c));
      } else {
        // Create new chair
        const created = await chairsApi.create(chairPayload);
        setChairsData(prev => [...prev, created]);
      }

      setShowChairForm(false);
      setEditingChair(null);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleEditChair = (chair) => {
    setEditingChair(chair);
    setShowChairForm(true);
  };

  const handleDeleteChair = async (chair) => {
    try {
      await chairsApi.delete(chair.id);
      setChairsData(prev => prev.filter(c => c.id !== chair.id));
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setView('chairs')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'chairs'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
              </svg>
              County Chairs
            </button>
            <button
              onClick={() => setView('candidates')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'candidates'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Candidates
            </button>
          </div>

          {/* Header Content */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {view === 'chairs' ? 'GOP County Chairs' : 'Candidate Tracker'}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {view === 'chairs'
                  ? 'Republican Party county chair leadership directory'
                  : 'Track and evaluate prospective candidates'
                }
              </p>

              {/* Stats */}
              {view === 'chairs' ? (
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                      {coverageStats.withData} / {coverageStats.total} ({coverageStats.percent}%)
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">chairs found</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
                      {coverageStats.withEmail}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">emails</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium">
                      {coverageStats.withPhone}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">phones</span>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-400 font-medium">
                      {candidates.length} Total
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium">
                      {candidateStatusStats.recruited || 0} Recruited
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
                      {candidateStatusStats.interested || 0} Interested
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium">
                      {candidateStatusStats.potential || 0} Potential
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {view === 'chairs' ? filteredChairs.length : filteredCandidates.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {view === 'chairs' ? (selectedState === 'all' ? 'Showing' : 'Counties') : 'Candidates'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* County Chairs View */}
        {view === 'chairs' && (
          <>
            {/* State Map */}
            <StateMap
              countyChairsData={chairsData}
              selectedState={selectedState}
              onSelectState={setSelectedState}
            />

            {/* Filters */}
            <Filters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedState={selectedState}
              onStateChange={setSelectedState}
              states={states}
              onExport={exportToCSV}
              resultCount={filteredChairs.length}
              showOnlyMissing={showOnlyMissing}
              onToggleMissing={() => setShowOnlyMissing(!showOnlyMissing)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              lastViewedCount={lastViewed.length}
            />

            {/* Table */}
            <CountyTable
              data={filteredChairs}
              sortConfig={sortConfig}
              onSort={handleSort}
              candidates={candidates}
              onChairViewed={handleChairViewed}
              onEdit={handleEditChair}
              onDelete={handleDeleteChair}
            />

            {/* Add Chair Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setEditingChair(null);
                  setShowChairForm(true);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0h6" />
                </svg>
                Add County Chair
              </button>
            </div>
          </>
        )}

        {/* Candidates View */}
        {view === 'candidates' && (
          <>
            {/* Candidate Filters & Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 mb-6 border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    placeholder="Search candidates..."
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <select
                    value={candidateFilter.status}
                    onChange={(e) => setCandidateFilter({ ...candidateFilter, status: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="all">All Statuses</option>
                    <option value="potential">Potential</option>
                    <option value="contacted">Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="recruited">Recruited</option>
                    <option value="declined">Declined</option>
                    <option value="not_interested">Not Interested</option>
                  </select>

                  <select
                    value={candidateFilter.alignment}
                    onChange={(e) => setCandidateFilter({ ...candidateFilter, alignment: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="all">All Alignments</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="unknown">Unknown</option>
                  </select>

                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </button>

                  <button
                    onClick={() => {
                      setEditingCandidate(null);
                      setShowCandidateForm(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0h6" />
                    </svg>
                    Add Candidate
                  </button>
                </div>
              </div>
            </div>

            {/* Candidates Table */}
            <CandidatesTable
              data={filteredCandidates}
              sortConfig={candidateSortConfig}
              onSort={handleCandidateSort}
              onEdit={(candidate) => {
                setEditingCandidate(candidate);
                setShowCandidateForm(true);
              }}
              onDelete={handleDeleteCandidate}
              onView={setViewingCandidate}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {view === 'chairs'
                ? 'Data sourced from official state Republican Party websites'
                : 'Internal candidate tracking system'
              }
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </footer>

      {/* Candidate Form Modal */}
      {showCandidateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCandidateForm(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <CandidateForm
              candidate={editingCandidate}
              onSave={handleSaveCandidate}
              onCancel={() => {
                setShowCandidateForm(false);
                setEditingCandidate(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {viewingCandidate && (
        <CandidateModal
          candidate={viewingCandidate}
          onClose={() => setViewingCandidate(null)}
          onEdit={(candidate) => {
            setViewingCandidate(null);
            setEditingCandidate(candidate);
            setShowCandidateForm(true);
          }}
          onDelete={handleDeleteCandidate}
        />
      )}

      {/* County Chair Form Modal */}
      {showChairForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowChairForm(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <CountyForm
              chair={editingChair}
              existingChairs={chairsData}
              onSave={handleSaveChair}
              onCancel={() => {
                setShowChairForm(false);
                setEditingChair(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
