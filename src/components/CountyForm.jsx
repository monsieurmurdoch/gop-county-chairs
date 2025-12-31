import { useState, useEffect } from 'react';
import { countyChairs, getStates } from '../data/county-chairs';

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

// Common county name suffixes to strip
const COUNTY_SUFFIXES = [' County', ' Parish', ' Borough', ' city', ' City', ' Municipality'];

const CountyForm = ({ chair, onSave, onCancel, existingChairs = [] }) => {
  const isEditing = !!chair;

  const [formData, setFormData] = useState({
    state: chair?.state || '',
    stateCode: chair?.stateCode || '',
    county: chair?.county || '',
    chairName: chair?.chairName || '',
    email: chair?.email || '',
    phone: chair?.phone || '',
    electionDate: chair?.electionDate || '',
    source: chair?.source || '',
    lastVerified: chair?.lastVerified || new Date().toISOString().split('T')[0],
    notes: chair?.notes || '',
  });

  const [errors, setErrors] = useState({});

  // Update state when stateCode changes
  useEffect(() => {
    if (formData.stateCode) {
      const stateInfo = US_STATES.find(s => s.code === formData.stateCode);
      if (stateInfo) {
        setFormData(prev => ({ ...prev, state: stateInfo.name }));
      }
    }
  }, [formData.stateCode]);

  // Check for duplicate county
  const isDuplicate = () => {
    if (!formData.stateCode || !formData.county) return false;

    const normalizedInput = formData.county.toLowerCase()
      .replace(new RegExp(COUNTY_SUFFIXES.join('|'), 'gi'), '')
      .trim();

    return existingChairs.some(c => {
      if (isEditing && c.id === chair.id) return false; // Skip self when editing
      if (c.stateCode !== formData.stateCode) return false;

      const normalizedExisting = c.county.toLowerCase()
        .replace(new RegExp(COUNTY_SUFFIXES.join('|'), 'gi'), '')
        .trim();
      return normalizedExisting === normalizedInput;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.stateCode) newErrors.stateCode = 'State is required';
    if (!formData.county) newErrors.county = 'County is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isDuplicate()) {
      setErrors({ county: 'A chair for this county already exists' });
      return;
    }

    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Format phone number
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 max-w-2xl w-full">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
        {isEditing ? 'Edit County Chair' : 'Add County Chair'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* State Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            State *
          </label>
          <select
            name="stateCode"
            value={formData.stateCode}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              errors.stateCode ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
            }`}
          >
            <option value="">Select state...</option>
            {US_STATES.map(state => (
              <option key={state.code} value={state.code}>{state.name}</option>
            ))}
          </select>
          {errors.stateCode && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stateCode}</p>
          )}
        </div>

        {/* County Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            County Name *
          </label>
          <input
            type="text"
            name="county"
            value={formData.county}
            onChange={handleChange}
            placeholder="e.g., Maricopa County"
            className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              errors.county ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
            }`}
          />
          {errors.county && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.county}</p>
          )}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Include "County" suffix (e.g., "Maricopa County")
          </p>
        </div>

        {/* Chair Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Chair Name
          </label>
          <input
            type="text"
            name="chairName"
            value={formData.chairName}
            onChange={handleChange}
            placeholder="Full name of county chair"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Leave blank if position is vacant
          </p>
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
              placeholder="chair@example.com"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                setFormData(prev => ({ ...prev, phone: formatted }));
              }}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Election Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Next Election Date
            </label>
            <input
              type="date"
              name="electionDate"
              value={formData.electionDate}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Last Verified */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Last Verified
            </label>
            <input
              type="date"
              name="lastVerified"
              value={formData.lastVerified}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Source URL
          </label>
          <input
            type="url"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="https://stategop.org/leadership"
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
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Filing deadlines, additional contact info, etc."
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
            {isEditing ? 'Save Changes' : 'Add Chair'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CountyForm;
