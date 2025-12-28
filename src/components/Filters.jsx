const Filters = ({
  searchQuery,
  onSearchChange,
  selectedState,
  onStateChange,
  states,
  onExport,
  resultCount,
  showOnlyMissing,
  onToggleMissing,
  viewMode,
  onViewModeChange,
  lastViewedCount
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* View Mode Toggle */}
        <div className="lg:w-auto">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            View
          </label>
          <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
            <button
              onClick={() => onViewModeChange('recent')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'recent'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Recent ({lastViewedCount})
            </button>
            <button
              onClick={() => onViewModeChange('all')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Search
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by county, chair name, email..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* State Filter */}
        <div className="lg:w-64">
          <label htmlFor="state" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            State
          </label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value="all">All States</option>
            {states.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name} ({state.totalDataCount || 0})
              </option>
            ))}
          </select>
        </div>

        {/* Missing Data Toggle */}
        <div className="lg:w-auto">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Filter
          </label>
          <button
            onClick={() => onToggleMissing?.()}
            className={`w-full lg:w-auto px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              showOnlyMissing
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {showOnlyMissing ? 'Show All' : 'Missing Only'}
          </button>
        </div>

        {/* Export Button */}
        <div className="lg:w-auto">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            &nbsp;
          </label>
          <button
            onClick={onExport}
            className="w-full lg:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {viewMode === 'recent' && lastViewedCount === 0
            ? 'Click on table rows to view county chair details. Recently viewed chairs will appear here.'
            : <>Showing <span className="font-semibold text-slate-900 dark:text-white">{resultCount}</span> county chair{resultCount !== 1 ? 's' : ''}
              {viewMode === 'recent' && ' (recently viewed)'}
              {showOnlyMissing && ' without chair data'}
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedState !== 'all' && ` in ${states.find(s => s.code === selectedState)?.name}`}</>
          }
        </p>
      </div>
    </div>
  );
};

export default Filters;
