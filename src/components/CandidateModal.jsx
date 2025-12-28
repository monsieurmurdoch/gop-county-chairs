import { statusOptions, alignmentOptions } from '../data/candidates';

const CandidateModal = ({ candidate, onClose, onEdit, onDelete }) => {
  if (!candidate) return null;

  const getStatusInfo = (status) => {
    return statusOptions.find(s => s.value === status) || { label: status, color: 'slate' };
  };

  const getAlignmentBadge = (alignment) => {
    const badges = {
      high: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      low: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      unknown: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400',
    };
    return badges[alignment] || badges.unknown;
  };

  const statusInfo = getStatusInfo(candidate.status);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{candidate.name}</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{candidate.position}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Status & Alignment */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Status:</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${statusInfo.color === 'slate' ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400' : ''}
                ${statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                ${statusInfo.color === 'purple' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                ${statusInfo.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                ${statusInfo.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                ${statusInfo.color === 'amber' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
              `}>
                {statusInfo.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Alignment:</span>
              <span className={`px-3 py-1 rounded text-sm font-semibold ${getAlignmentBadge(candidate.alignment)}`}>
                {candidate.alignment || 'Unknown'}
              </span>
              {candidate.alignmentScore > 0 && (
                <span className="text-sm text-slate-600 dark:text-slate-400">({candidate.alignmentScore}/10)</span>
              )}
            </div>
            {candidate.experience > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Experience:</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {candidate.experience} {candidate.experience === 1 ? 'year' : 'years'}
                </span>
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location</h3>
            <p className="text-slate-900 dark:text-white">{candidate.county}</p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Contact Information</h3>
            <div className="space-y-2">
              {candidate.email && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href={`mailto:${candidate.email}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {candidate.email}
                  </a>
                </div>
              )}
              {candidate.phone && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13 2.257a1 1 0 001.21-.502l4.493-1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                  </svg>
                  <a
                    href={`tel:${candidate.phone}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {candidate.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Contact</h3>
              <p className="text-slate-900 dark:text-white">{candidate.lastContact || 'Never'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Added</h3>
              <p className="text-slate-900 dark:text-white">{candidate.createdAt}</p>
            </div>
          </div>

          {/* Source */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Source</h3>
            <p className="text-slate-900 dark:text-white capitalize">{candidate.source || 'Other'}</p>
          </div>

          {/* Previous Offices */}
          {candidate.previousOffices && candidate.previousOffices.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Previous Offices</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.previousOffices.map((office, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs"
                  >
                    {office}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {candidate.notes && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Notes</h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{candidate.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              onDelete?.(candidate);
              onClose();
            }}
            className="px-4 py-2 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => {
              onEdit?.(candidate);
              onClose();
            }}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Edit Candidate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;
