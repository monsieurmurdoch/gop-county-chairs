import { useState, useEffect } from 'react';
import { statusOptions, alignmentOptions, positionTypes, sourceOptions } from '../data/candidates';
import { countyChairs } from '../data/county-chairs';

const CandidateForm = ({ candidate, onSave, onCancel }) => {
  const isEditing = !!candidate;

  const [formData, setFormData] = useState({
    name: candidate?.name || '',
    county: candidate?.county || '',
    stateCode: candidate?.stateCode || '',
    position: candidate?.position || '',
    status: candidate?.status || 'potential',
    alignment: candidate?.alignment || 'unknown',
    alignmentScore: candidate?.alignmentScore || 0,
    source: candidate?.source || 'other',
    lastContact: candidate?.lastContact || '',
    email: candidate?.email || '',
    phone: candidate?.phone || '',
    experience: candidate?.experience || 0,
    notes: candidate?.notes || '',
  });

  const [showCountyDropdown, setShowCountyDropdown] = useState(false);

  // Get unique state codes from county chairs for dropdown
  const availableStates = [...new Set(countyChairs.map(c => c.stateCode))].sort();

  // Get counties for selected state
  const availableCounties = formData.stateCode
    ? countyChairs.filter(c => c.stateCode === formData.stateCode).map(c => c.county)
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();

    const candidateData = {
      ...formData,
      experience: Number(formData.experience),
      alignmentScore: Number(formData.alignmentScore),
    };

    // Combine county with state if county is selected from dropdown
    if (formData.stateCode && formData.county && !formData.county.includes(',')) {
      const state = countyChairs.find(c => c.stateCode === formData.stateCode)?.state;
      candidateData.county = `${formData.county}, ${formData.stateCode}`;
      candidateData.stateCode = formData.stateCode;
    }

    onSave(candidateData);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // Auto-derive alignment score from alignment selection
  useEffect(() => {
    if (formData.alignment !== 'unknown') {
      const alignInfo = alignmentOptions.find(a => a.value === formData.alignment);
      if (alignInfo && !formData.alignmentScore) {
        const avgScore = (alignInfo.scoreRange[0] + alignInfo.scoreRange[1]) / 2;
        setFormData(prev => ({ ...prev, alignmentScore: Math.round(avgScore) }));
      }
    }
  }, [formData.alignment]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
        {isEditing ? 'Edit Candidate' : 'Add New Candidate'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Full name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Position
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="">Select position...</option>
              {positionTypes.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Source
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              {sourceOptions.map(src => (
                <option key={src} value={src}>{src.charAt(0).toUpperCase() + src.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* County/State Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              State
            </label>
            <select
              name="stateCode"
              value={formData.stateCode}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="">Select state...</option>
              {availableStates.map(stateCode => {
                const state = countyChairs.find(c => c.stateCode === stateCode)?.state;
                return <option key={stateCode} value={stateCode}>{state} ({stateCode})</option>;
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              County
            </label>
            <select
              name="county"
              value={formData.county}
              onChange={handleChange}
              disabled={!formData.stateCode}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select county...</option>
              {availableCounties.map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="email@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="555-123-4567"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(status => (
              <label key={status.value} className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={status.value}
                  checked={formData.status === status.value}
                  onChange={handleChange}
                  className="mr-1"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{status.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Alignment */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Political Alignment
          </label>
          <div className="flex flex-wrap gap-3">
            {alignmentOptions.map(align => (
              <label key={align.value} className="flex items-center">
                <input
                  type="radio"
                  name="alignment"
                  value={align.value}
                  checked={formData.alignment === align.value}
                  onChange={handleChange}
                  className="mr-1"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{align.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Alignment Score */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Alignment Score (1-10)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              name="alignmentScore"
              min="0"
              max="10"
              value={formData.alignmentScore}
              onChange={handleChange}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-slate-900 dark:text-white w-8 text-center">
              {formData.alignmentScore}
            </span>
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Years of Political Experience
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Last Contact */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Last Contact Date
          </label>
          <input
            type="date"
            name="lastContact"
            value={formData.lastContact}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Background, interactions, concerns, etc."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            {isEditing ? 'Save Changes' : 'Add Candidate'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm;
