import { useState } from 'react';
import { statusOptions, alignmentOptions } from '../data/candidates';
import SortIcon from './SortIcon';

const CandidatesTable = ({
  data,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  onView,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const getStatusInfo = (status) => {
    return statusOptions.find(s => s.value === status) || { label: status, color: 'slate' };
  };

  const getAlignmentInfo = (alignment) => {
    return alignmentOptions.find(a => a.value === alignment) || { label: alignment, scoreRange: [0, 0] };
  };

  const getAlignmentBadge = (alignment, score) => {
    const badges = {
      high: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      low: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      unknown: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400',
    };
    return badges[alignment] || badges.unknown;
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'county', label: 'County' },
    { key: 'position', label: 'Position' },
    { key: 'status', label: 'Status' },
    { key: 'alignment', label: 'Alignment' },
    { key: 'lastContact', label: 'Last Contact' },
  ];

  return (
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
                    <SortIcon column={column.key} sortConfig={sortConfig} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  <svg className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-lg font-medium">No candidates found</p>
                  <p className="text-sm">Add your first candidate to get started</p>
                </td>
              </tr>
            ) : (
              data.map((candidate, index) => {
                const statusInfo = getStatusInfo(candidate.status);
                const alignmentBadge = getAlignmentBadge(candidate.alignment, candidate.alignmentScore);

                return (
                  <tr
                    key={candidate.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                      index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/50'
                    }`}
                    onClick={() => onView?.(candidate)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{candidate.name}</div>
                        {candidate.email && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">{candidate.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {candidate.county}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {candidate.position}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${statusInfo.color === 'slate' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400' : ''}
                        ${statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${statusInfo.color === 'purple' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                        ${statusInfo.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${statusInfo.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                        ${statusInfo.color === 'amber' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                      `}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${alignmentBadge}`}>
                          {getAlignmentInfo(candidate.alignment).label}
                        </span>
                        {candidate.alignmentScore > 0 && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">({candidate.alignmentScore}/10)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {candidate.lastContact || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onEdit?.(candidate)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete?.(candidate)}
                          className="p-1.5 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 011-1h2a1 1 0 011 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
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
            Showing all {data.length} candidate{data.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default CandidatesTable;
