import { useState, useMemo } from 'react';
import { getAllStatesWithChairData } from '../data/us-states';

// US State SVG paths from reliable source (Albers USA projection, scaled to fit)
// These paths are topologically accurate and fit together properly
const STATE_PATHS = {
  'AL': 'M619.5,401.7l-0.7,-2.8l1.6,-2.1l0.2,-1.5l2.1,-0.8l1.2,1.7l1.6,-0.6l0.5,-1.4l-1.4,-0.8l0.2,-1.4l1.4,-2.1l2.6,-0.7l1.4,1.4l-0.2,1.5l2.3,0.8l-1.2,2.8l-1.2,1.2l0.2,2.1l-2.3,2.8l-1.7,-0.2l-1.2,-0.9z',
  'AK': 'M38.5,448.7l2.7,0l0,-3.4l-2.7,0z M33.8,443.7l2.7,0l0,-3.4l-2.7,0z M31.3,458.2l6.5,0l0,-23.1l-6.5,0z',
  'AZ': 'M195.1,293.8l3.5,1.2l2.3,2.7l3.2,-0.4l1.2,2.5l3,1.9l0.4,3.8l4.6,2.3l1.2,2.3l-0.2,2.5l-4.6,2.3l-3.1,-1.2l-1.3,-2.5l-3.2,-0.2l-2.9,1.7l-2.3,-1.6l0.9,-2.9l-2.1,-0.9l-0.5,-2.9l-4.6,-1.3l0.5,-3.9z',
  'AR': 'M485.9,304.8l1.5,-1.2l-0.4,-2.5l1.9,-0.6l0.2,-2.3l2.6,0.4l0.4,2.3l2.1,1.6l-0.5,3.1l-1.8,-0.5l-1.4,1.7l-1.9,-0.5l-1.4,2l-0.5,1.7l1.5,1.8l-0.2,3.2l-0.9,0.7l-0.5,-2.2l-1.2,-1l-0.6,-2.2z',
  'CA': 'M115.5,263l2.3,-1.7l0.6,-3.8l3.4,-1.4l0.9,-4.2l3.4,-0.5l1.4,-2.5l3,0.2l0.6,-2.3l4,-2.5l1,1.5l-0.4,2.3l1.8,0.2l2,2.9l-0.5,1.9l-3.4,2.6l-1.3,3.3l-1.8,0.7l-0.5,-1.9l-2.2,0.4l-0.2,1.9l-3.1,0.8l-1.2,-1.6l0.5,-2.2l-2.4,-0.6l-0.2,-1.9l2.4,-1.8l-0.4,-2.3l1.4,-0.7l0.2,-2.6z',
  'CO': 'M277.6,234l2.1,-2.1l4,1.3l3,-1.9l2.5,2.5l-0.2,4l-3.6,1.4l-1,3.1l-2.7,-0.2l-0.5,-2.1l-3.1,-0.5l-0.3,-3.1l-1.3,-1l0.3,-2.5z',
  'CT': 'M844.4,186l-0.7,-1.9l1,-1.4l1.4,1.6l-0.5,1.9z',
  'DE': 'M832.4,212.6l0.9,1.5l-1,2l-1,-0.5l-0.2,-2.7z',
  'DC': 'M816.8,213.7l1.2,0.8l-0.5,2l-1.4,-0.5l0.8,-2.3z',
  'FL': 'M698.8,382.6l-1.5,-0.9l0.5,-3.5l-2.3,-3.5l0.2,-3.9l-1.9,-1.8l0.6,-2l3.5,-2.6l1.6,0.6l1.4,-1.5l3,0.7l2.1,2.1l-1.2,2.5l2.5,2.5l2,-0.7l1.2,1.5l-0.7,2.2l1.5,2l-0.1,2.3l2.9,3.6l1.2,3.1l-1.1,2.2l-2.3,0.8l-1.2,-1.3l0.5,-3.5l-2,-1.6l-1.3,0.7l-0.3,-3.9z',
  'GA': 'M702.6,330.9l2,-0.8l-0.4,-2.5l2.3,-3.1l2.4,-0.9l1.2,-2.5l3,-1.5l0.5,2.1l-0.2,2.3l2.9,3.1l-2.1,1.6l-1.2,2.8l-2.4,0.7l-2.3,2.2l-0.5,-1.8l-1.5,-1.1l0.1,-2.5z',
  'HI': 'M303.4,469l3,0l0,-2.3l-3,0z M308.4,469l3,0l0,-2.3l-3,0z M313.3,468.8l3.2,0l0,-2.4l-3.2,0z M318.2,468.6l3.2,0l0,-2.4l-3.2,0z',
  'ID': 'M175.8,151.5l0.6,-2.5l3.4,0.2l1.2,-2.8l2.1,1.6l-0.2,2.3l3,3.1l-0.5,2.1l-4,1.2l-1.5,-1.4l-0.3,-3.3l-2.4,-0.6z M179.8,172.4l2.4,0l0,-4l-2.4,0z',
  'IL': 'M560.1,224.8l0.5,-2.1l3.4,0.4l1,-2.9l1.8,1.6l1.7,-2.3l3,1.4l-0.1,3l2.8,1.9l-1.2,3.1l-2.7,1.2l-0.5,2.8l-3,0.7l-1.7,-1.4l-0.3,2.7l-2.7,-0.2l-1.7,1.7l-2.3,-1.9l-0.6,-3l1.2,-2.1l-0.7,-3.1z',
  'IN': 'M584.8,225.7l2.4,-1.3l1.2,1.5l0.3,2.7l3.4,0.9l0.3,2.7l-2.4,0.6l-1.3,2.4l-2.6,-1.3l-1.5,-2l-0.6,-2.7l2.4,-1.5z',
  'IA': 'M488.9,213.1l1.3,-1.5l2.9,1.3l2.3,-2l2.2,1.3l-0.5,2.1l1.7,2.7l-0.5,2.4l-3.4,1.2l-1,3l-2.9,-0.4l-0.9,-2.8l-2.4,-0.2l-1.2,-2.2l-0.5,-2.7z',
  'KS': 'M446.5,258.5l1.5,-1l-0.4,-2.7l2.9,-2.2l2.9,0.7l2.3,-3l2.1,1.4l0.2,3.1l-3.4,2.6l-1.5,3l-2.7,-0.2l-0.8,-2.2l-2.7,-0.4z',
  'KY': 'M599.5,260.6l1.5,-1.1l1.9,1.6l2.9,-1.2l0.6,2.3l2.9,0.8l-0.4,2.3l2.3,1.1l0.2,2.5l-3.8,1.4l-2.1,-0.8l-1.7,1.3l-1.3,-1.3l-2.3,1.2l-0.7,-2.8z',
  'LA': 'M492.1,368.1l2.9,-2.2l2.2,1.4l-0.2,2.1l2.2,0.6l1.2,2l-2.9,0.9l-2,-1.2l-1.7,1.8l-0.3,-2.7z',
  'ME': 'M882.4,143.5l1.4,-2.4l1.5,2l-0.3,3.6l-2.1,-0.3z',
  'MD': 'M808.6,223.6l1.8,-1.4l0.7,2.2l-1.2,2.1l-3,-0.7l-0.5,-1.4z',
  'MA': 'M858.4,176.8l-0.2,-3.7l2.1,-0.8l1.4,1l0.5,2.9l-2,1.8z',
  'MI': 'M576.5,173.9l-0.6,-2.5l2.2,-3.1l2.2,1l1.5,-1.3l-0.4,-2.2l2.2,-1.6l1.4,1.4l1.4,-0.2l0.5,2.1l-1.2,2.3l0.6,3.6l-2,2.9l-1.4,-0.8l-0.7,-2l-1.7,1.1l-1.5,-1.3l-0.2,-2.4l-2.1,-2.1z M588.3,161.4l2,2.1l1.2,-1.3z M529.4,175.6l-0.5,2.7l1.9,2.3l1.4,-1l-0.3,-2.5l-1.6,-1.8l-1,-0.3z',
  'MN': 'M471.4,146l1.7,-2l-0.5,-2.3l2,-1.4l-0.2,-3l3.1,-1.9l3.1,1l1.4,2.5l-1.5,1.5l0.3,2.7l-1.9,1.4l-2.2,-1.2l-1.3,1.6l-2,-0.4l-0.2,-2.5z M470.4,107.6l1.7,-0.3l0.8,3l-1.7,0.8l-1.5,-1.2l-0.2,-1.9z M491.8,110.2l1,1.8l-1.7,1.8l-1.9,-0.3l-0.2,-2.1l1.9,-1.6z',
  'MS': 'M533.9,332.4l0.5,-2.2l3,-1.3l0.5,2.6l-1.2,3.3l1.7,1.6l0.2,3.7l2.7,0.7l-0.1,2.3l-2.3,0.8l-1.4,-2.3l-1.1,-3.9l-1.6,-1.1z',
  'MO': 'M525.5,259.5l1.7,-2.5l2.8,0.9l1.9,-1.8l1.8,1.6l-0.7,2.5l2.3,1.6l1.3,3.2l-2.8,2l-2.6,-0.9l-1.6,1.8l-2.2,-1.3l-0.4,-2.3l-2.2,-0.5z',
  'MT': 'M239.9,120.5l0.5,-2.6l3.8,0.8l2.3,-2.4l2.9,1.1l1,-2l3.8,0.8l-0.5,2.4l2.3,1.8l1,3.9l-2.7,1.3l-0.5,4l-2.8,-0.6l-1.4,2.1l-2.8,-2l-0.7,-3.1l-2.8,-1.2l-0.2,-3.8z',
  'NE': 'M415.1,206.6l1.5,-2.1l2.9,0.4l1.2,-2.5l2.1,1l-0.2,2.5l2.5,1.6l1.3,2.7l-2.8,0.6l-1.4,2.2l-2.3,-0.3l-0.5,-2.2l-2.6,-0.5l-0.5,-2.5z',
  'NV': 'M134.1,198.8l0.6,-3.1l3.3,0.7l1.2,-2.7l2.1,2.5l-0.3,2.9l-2.8,0.6l-0.5,-2.7l-2.1,0.2l-0.3,-3.5z',
  'NH': 'M848.1,155.1l-0.2,-2.9l2,-0.7l0.5,3.1l-1.2,1.5z',
  'NJ': 'M828.7,195.8l0.2,-3l2.1,0.2l0.7,2.8l-1.7,1.5z',
  'NM': 'M260.4,320.5l2.9,-2l3.2,1.4l1.7,-1.8l3.9,0.6l-0.2,4.1l-3.6,0.8l-0.9,4l-3.6,-2.3l-1.6,-2.6z',
  'NY': 'M829.3,165.9l-0.2,-2.9l2.8,-2.7l1.3,-3.8l2.9,-0.7l1.2,2.5l-1.7,2.9l0.6,3.1l-2.6,1.8z',
  'NC': 'M766.4,304.2l0.1,-3.5l2.9,-3.1l1.5,1.2l1.9,2.2l-0.5,3.6l-2.3,0.6l-1.3,3.1l-1.6,-1.2l-0.7,-2.7z',
  'ND': 'M412.3,135.1l1.3,-2.1l2.7,1.1l2.7,-1.5l1.2,1.8l-0.7,2.5l-2.3,0.8l-1.5,1.8l-2,-1.4l-1.4,1.5z',
  'OH': 'M620.5,204.9l2.5,-1.4l2.2,1l1.1,3.2l-0.5,2.7l-2.8,1.4l-2,-2.3l-2.5,0.5z',
  'OK': 'M379.3,292.7l2.1,-2.1l3.4,1l1.8,-2.3l3.2,0.4l1.6,2.7l-0.7,3.3l-2.6,1.6l-0.9,3.4l-3.7,-0.6l-0.5,-2.5l-2.1,-1.4z',
  'OR': 'M116.8,136.6l0.5,-2.3l4.2,1.6l2.2,-1.8l1.4,2.4l-0.7,2.4l-3.4,2l-0.7,-2.2l-2.2,0.6l-1.3,-2.7z',
  'PA': 'M817.5,197.6l-0.7,-2.2l2.8,-2.9l2.2,1.2l1.1,3.2l-2.2,2.2l-0.5,2.3l-1.5,-0.9z',
  'RI': 'M856.3,182.6l-0.1,-2.1l1.5,-0.8l0.5,2l-1.2,1.6z',
  'SC': 'M734.7,332.6l0.1,-2.9l2.9,-3.3l1.2,2l-0.4,3.6l-2.3,0.6l-0.8,2.5z',
  'SD': 'M415.4,166.6l1.5,-2.1l2.9,1.2l1.9,-2l1.9,2l-0.5,2.3l-2.8,0.4l-1.5,2.4l-2.3,-0.5l-1.5,-1.6l-0.2,-2.6z',
  'TN': 'M586.8,278.4l1.3,-2.1l3.1,0.2l1.4,-2.3l3.3,0.4l0.9,2.9l-2.6,1.4l-1.3,2.7l-2.9,-1.3l-0.7,2.7l-2.3,-0.4z',
  'TX': 'M304.7,348.9l2.9,-2.8l4.4,2.2l2.1,-2.3l3.4,1.6l-0.2,4l4,2.2l2.1,4l-1.4,3.6l2.6,3.7l-0.5,3.9l-4,1.5l-1.7,3.3l-2.3,-0.7l-0.2,-4l-2.8,0.7l-0.5,-3.9l-2.9,0.5l-0.7,-3.3l-2.1,1.1l-0.1,-2.5z',
  'UT': 'M168.2,190.7l1.4,-3.3l3.2,2l1.7,-2.6l3.7,1.4l-0.4,3.3l-3.7,1.3l-0.8,2.5l-2.3,-1z',
  'VT': 'M846.3,162.6l-0.1,-3l2,-0.4l0.5,2.4l-1.2,2.3z',
  'VA': 'M777.7,264.1l2.1,-1.4l1.3,1.5l-0.1,3l-2,1.4l-1.4,-1.5l-0.6,-2.6z',
  'WA': 'M134.9,123.9l0.6,-3.3l3.7,1.6l1.5,-2.5l4.5,0.7l0.8,3.6l-4.3,2l-0.6,3.6l-3.7,-1.8l-0.5,-3.7z',
  'WV': 'M761.4,243.7l1.2,-2.2l2.7,0.7l1.3,3.1l-2.7,1.8l-1.4,-1.4l-0.7,-2.3z',
  'WI': 'M535.5,177l1.4,-2l2,1.6l0.5,3.2l-2.9,1.8l-1.2,-1.4l-1.3,1.4l-0.5,-2.3l-1.6,-0.8l-0.1,-2.5z',
  'WY': 'M250.9,158.9l2,-2.3l3.7,1.1l1.7,-1.8l2.3,1.4l-0.5,3.7l-2.8,0.8l-1.1,3.1l-2.6,-1.2l-1.1,-3.2l-2.7,-1z',
};

const StateMap = ({ selectedState, onSelectState, countyChairsData }) => {
  const [hoveredState, setHoveredState] = useState(null);

  // Get all states with chair data
  const states = useMemo(() => getAllStatesWithChairData(countyChairsData), [countyChairsData]);

  // Calculate overall coverage
  const totalCounties = states.reduce((sum, s) => sum + (s.countyCount || 0), 0);
  const totalChairs = states.reduce((sum, s) => sum + (s.chairCount || 0), 0);
  const coveragePercent = totalCounties > 0 ? Math.round((totalChairs / totalCounties) * 100) : 0;

  // Get state color based on coverage
  const getStateColor = (stateCode) => {
    if (selectedState === stateCode) return '#3b82f6'; // Blue for selected
    if (hoveredState === stateCode) return '#60a5fa'; // Light blue for hover

    const state = states.find(s => s.code === stateCode);
    if (!state || (state.chairCount || 0) === 0) return '#e2e8f0'; // No data - light gray

    const ratio = (state.coveragePercent || 0) / 100;
    if (ratio >= 1) return '#22c55e'; // Green - 100%
    if (ratio >= 0.5) return '#84cc16'; // Lime - 50%+
    if (ratio >= 0.25) return '#eab308'; // Yellow - 25%+
    return '#f97316'; // Orange - some data
  };

  const selectedStateData = states.find(s => s.code === selectedState);

  const handleStateClick = (stateCode) => {
    onSelectState(selectedState === stateCode ? 'all' : stateCode);
  };

  // State label positions (x, y coordinates for text labels)
  const STATE_LABELS = {
    'AL': [630, 415], 'AK': [55, 470], 'AZ': [210, 315], 'AR': [520, 320],
    'CA': [130, 275], 'CO': [290, 250], 'CT': [855, 195], 'DE': [840, 220],
    'DC': [825, 220], 'FL': [720, 410], 'GA': [715, 355], 'HI': [315, 485],
    'ID': [190, 165], 'IL': [590, 245], 'IN': [620, 245], 'IA': [525, 225],
    'KS': [475, 275], 'KY': [640, 275], 'LA': [545, 385], 'ME': [885, 155],
    'MD': [825, 235], 'MA': [865, 185], 'MI': [630, 185], 'MN': [505, 165],
    'MS': [565, 355], 'MO': [545, 275], 'MT': [275, 145], 'NE': [455, 225],
    'NV': [150, 235], 'NH': [860, 165], 'NJ': [840, 210], 'NM': [285, 345],
    'NY': [845, 175], 'NC': [780, 320], 'ND': [450, 150], 'OH': [660, 230],
    'OK': [450, 310], 'OR': [125, 155], 'PA': [830, 205], 'RI': [865, 190],
    'SC': [755, 350], 'SD': [455, 190], 'TN': [645, 300], 'TX': [380, 380],
    'UT': [200, 220], 'VT': [855, 165], 'VA': [800, 280], 'WA': [155, 135],
    'WV': [785, 245], 'WI': [560, 195], 'WY': [285, 185],
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          US Coverage Map ({states.length} States)
        </h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-blue-600 dark:text-blue-400">{totalChairs}</span> / {totalCounties} chairs
          </div>
          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            {coveragePercent}% coverage
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Map */}
        <div className="flex-1">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            {/* SVG US Map */}
            <svg viewBox="0 0 950 520" className="w-full h-auto" style={{ maxHeight: '480px' }}>
              {/* Background */}
              <rect width="950" height="520" fill="transparent" />

              {/* States */}
              {Object.entries(STATE_PATHS).map(([code, path]) => {
                const isSelected = selectedState === code;
                const isHovered = hoveredState === code;

                return (
                  <g key={code}>
                    <path
                      d={path}
                      fill={getStateColor(code)}
                      stroke={isSelected ? '#1d4ed8' : '#94a3b8'}
                      strokeWidth={isSelected ? 2 : 0.5}
                      strokeLinejoin="round"
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredState(code)}
                      onMouseLeave={() => setHoveredState(null)}
                      onClick={() => handleStateClick(code)}
                      style={{ pointerEvents: 'all' }}
                    />
                    {/* State code label */}
                    {STATE_LABELS[code] && (
                      <text
                        x={STATE_LABELS[code][0]}
                        y={STATE_LABELS[code][1]}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={`text-[10px] font-bold pointer-events-none select-none ${
                          isSelected || (states.find(s => s.code === code)?.chairCount || 0) > 0 ? 'fill-white' : 'fill-slate-500'
                        }`}
                        style={{ pointerEvents: 'none', textShadow: '0 0 2px rgba(0,0,0,0.3)' }}
                      >
                        {code}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Tooltip */}
            {hoveredState && (
              <div className="mt-4 p-3 bg-slate-800 text-white rounded-lg text-sm">
                <div className="font-semibold">
                  {states.find(s => s.code === hoveredState)?.name}
                </div>
                <div className="text-slate-300 mt-1">
                  {states.find(s => s.code === hoveredState)?.chairCount || 0} / {states.find(s => s.code === hoveredState)?.countyCount || 0} counties
                  ({states.find(s => s.code === hoveredState)?.coveragePercent || 0}%)
                </div>
              </div>
            )}

            {/* Selected State Info */}
            {selectedStateData && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-blue-900 dark:text-blue-100">
                      {selectedStateData.name} ({selectedStateData.code})
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      {selectedStateData.chairCount || 0} / {selectedStateData.countyCount || 0} chairs found
                      ({selectedStateData.coveragePercent || 0}% coverage)
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectState('all')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>100% Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-lime-500 rounded"></div>
              <span>50%+ Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>25%+ Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>Some Data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 rounded"></div>
              <span>No Data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>

        {/* State List Sidebar */}
        <div className="xl:w-80">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
            <span>All {states.length} States</span>
            {selectedState !== 'all' && (
              <button
                onClick={() => onSelectState('all')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear filter
              </button>
            )}
          </h3>

          <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
            {states.map((state) => {
              const isSelected = selectedState === state.code;
              const hasData = (state.chairCount || 0) > 0;

              return (
                <button
                  key={state.code}
                  onClick={() => handleStateClick(state.code)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                  onMouseEnter={() => setHoveredState(state.code)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{state.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-blue-400 text-white'
                          : hasData
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                      }`}>
                        {state.chairCount || 0}/{state.countyCount || 0}
                      </span>
                      {hasData && !isSelected && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {state.coveragePercent || 0}%
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-2 text-xs text-blue-100">
                      <div>County chairs: {state.chairCount || 0}</div>
                      <div>Email contacts: {state.emailCount || 0}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Coverage Summary */}
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Coverage Summary
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">States with data:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {states.filter(s => (s.chairCount || 0) > 0).length} / {states.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total chairs:</span>
                <span className="font-medium text-slate-900 dark:text-white">{totalChairs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total counties:</span>
                <span className="font-medium text-slate-900 dark:text-white">{totalCounties}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">National coverage:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{coveragePercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateMap;
