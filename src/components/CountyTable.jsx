import { useState } from 'react';
import { getCandidates } from '../data/candidates';

const CountyTable = ({ data, sortConfig, onSort, candidates = [], onChairViewed }) => {
  const [selectedChair, setSelectedChair] = useState(null);

  // Handle chair selection
  const handleChairClick = (chair) => {
    setSelectedChair(chair);
    // Notify parent that this chair was viewed
    if (onChairViewed && chair.id) {
      onChairViewed(chair.id);
    }
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return (
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  // Helper to get chair display name and status
  const getChairDisplay = (chair) => {
    const name = chair.chairName;
    if (!name || name === 'TBD' || name === 'VACANT' || name === 'Coming Soon') {
      return { name: name || 'TBD', status: 'missing' };
    }
    return { name, status: 'found' };
  };

  // Get candidates for a specific county/state
  const getCandidatesForCounty = (county, stateCode) => {
    return candidates.filter(c => {
      const candidateCounty = c.county.replace(/ County| Parish| Borough| city| County/g, '').trim();
      const chairCounty = county.replace(/ County| Parish| Borough| city| County/g, '').trim();
      return c.stateCode === stateCode && candidateCounty === chairCounty;
    });
  };

  // Get candidate status color
  const getStatusColor = (status) => {
    const colors = {
      'potential': 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
      'contacted': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'interested': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'recruited': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'confirmed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      'funded': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'declined': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'not_interested': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return colors[status] || colors['potential'];
  };

  // Get status label
  const getStatusLabel = (status) => {
    const labels = {
      'potential': 'Prospect',
      'contacted': 'Contacted',
      'interested': 'Interested',
      'recruited': 'Recruited',
      'confirmed': 'Confirmed',
      'funded': 'Funded',
      'declined': 'Declined',
      'not_interested': 'Not Interested',
    };
    return labels[status] || 'Unknown';
  };

  // Get row background color based on candidate status
  const getRowBackground = (county, stateCode) => {
    const countyCandidates = getCandidatesForCounty(county, stateCode);
    if (countyCandidates.length === 0) return '';

    // Use highest priority status for coloring
    const statusPriority = ['funded', 'confirmed', 'recruited', 'interested', 'contacted', 'potential'];
    for (const status of statusPriority) {
      if (countyCandidates.some(c => c.status === status)) {
        const bgColors = {
          'funded': 'bg-amber-50/50 dark:bg-amber-900/10',
          'confirmed': 'bg-emerald-50/50 dark:bg-emerald-900/10',
          'recruited': 'bg-green-50/50 dark:bg-green-900/10',
          'interested': 'bg-purple-50/50 dark:bg-purple-900/10',
          'contacted': 'bg-blue-50/50 dark:bg-blue-900/10',
          'potential': 'bg-slate-50/50 dark:bg-slate-700/10',
        };
        return bgColors[status];
      }
    }
    return '';
  };

  const columns = [
    { key: 'state', label: 'State' },
    { key: 'county', label: 'County' },
    { key: 'chairName', label: 'County Chair' },
    { key: 'candidate', label: 'Candidate' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
  ];

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => onSort(column.key)}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.key !== 'candidate' && <SortIcon column={column.key} />}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                data.map((chair, index) => {
                  const chairDisplay = getChairDisplay(chair);
                  const countyCandidates = getCandidatesForCounty(chair.county, chair.stateCode);
                  const rowBg = getRowBackground(chair.county, chair.stateCode);
                  const hasCandidates = countyCandidates.length > 0;

                  return (
                    <tr
                      key={chair.id}
                      onClick={() => handleChairClick(chair)}
                      className={`cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                        chairDisplay.status === 'missing' ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''
                      } ${rowBg ? rowBg : ''} ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/50'}`}
                    >
                      <td className="px-4 py-3 text-xs">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {chair.stateCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                        {chair.county}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {chairDisplay.status === 'missing' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {chairDisplay.name}
                          </span>
                        ) : (
                          <span className="font-medium text-slate-900 dark:text-white">
                            {chairDisplay.name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {hasCandidates ? (
                          <div className="flex flex-wrap gap-1">
                            {countyCandidates.map((c, i) => (
                              <span
                                key={i}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}
                              >
                                {c.name.length > 15 ? c.name.slice(0, 15) + '...' : c.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {chair.email ? (
                          <a
                            href={`mailto:${chair.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs"
                          >
                            {chair.email.length > 20 ? chair.email.slice(0, 20) + '...' : chair.email}
                          </a>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {chair.phone ? (
                          <a
                            href={`tel:${chair.phone.replace(/\D/g, '')}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs"
                          >
                            {chair.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={chair.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium inline-flex items-center gap-1"
                        >
                          View
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination info */}
        {data.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing all {data.length} results
              {candidates.length > 0 && (
                <span className="ml-4 text-slate-500">
                  • {data.filter(c => getCandidatesForCounty(c.county, c.stateCode).length > 0).length} counties with candidates
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Chair Detail Modal */}
      {selectedChair && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedChair(null)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedChair.county}, {selectedChair.state}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  County Chair Information
                </p>
              </div>
              <button
                onClick={() => setSelectedChair(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Chair Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    County Chair
                  </label>
                  <p className="mt-1 text-sm text-slate-900 dark:text-white">
                    {selectedChair.chairName && selectedChair.chairName !== 'TBD' && selectedChair.chairName !== 'VACANT' ? (
                      selectedChair.chairName
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400">Not Available</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Last Verified
                  </label>
                  <p className="mt-1 text-sm text-slate-900 dark:text-white">
                    {new Date(selectedChair.lastVerified).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Contact Information</h4>
                <div className="space-y-3">
                  {selectedChair.email ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <a
                        href={`mailto:${selectedChair.email}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {selectedChair.email}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-400 dark:text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm">Email not available</span>
                    </div>
                  )}

                  {selectedChair.phone ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13 2.257a1 1 0 001.21-.502l4.493-1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <a
                        href={`tel:${selectedChair.phone.replace(/\D/g, '')}`}
                        className="text-sm text-green-600 dark:text-green-400 hover:underline"
                      >
                        {selectedChair.phone}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-400 dark:text-slate-600">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13 2.257a1 1 0 001.21-.502l4.493-1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-sm">Phone not available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Source */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Source</h4>
                <a
                  href={selectedChair.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  {selectedChair.source.replace(/https?:\/\//, '').split('/')[0]}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Candidates Section */}
              {(() => {
                const countyCandidates = getCandidatesForCounty(selectedChair.county, selectedChair.stateCode);
                if (countyCandidates.length === 0) {
                  return (
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Candidates</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        No candidates found for this county. <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Add one</a>.
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      Candidates ({countyCandidates.length})
                    </h4>
                    <div className="space-y-3">
                      {countyCandidates.map((candidate) => (
                        <div key={candidate.id} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {candidate.name}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                                  {getStatusLabel(candidate.status)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                {candidate.position || 'Position not specified'}
                              </p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {candidate.email && (
                                  <a
                                    href={`mailto:${candidate.email}`}
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    {candidate.email.length > 20 ? candidate.email.slice(0, 20) + '...' : candidate.email}
                                  </a>
                                )}
                                {candidate.phone && (
                                  <span className="text-slate-600 dark:text-slate-400">
                                    {candidate.phone}
                                  </span>
                                )}
                                {candidate.alignmentScore && (
                                  <span className={`px-2 py-0.5 rounded ${
                                    candidate.alignmentScore >= 8
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                      : candidate.alignmentScore >= 5
                                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  }`}>
                                    Score: {candidate.alignmentScore}/10
                                  </span>
                                )}
                              </div>
                              {candidate.notes && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                                  {candidate.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setSelectedChair(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CountyTable;
