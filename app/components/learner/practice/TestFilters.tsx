import { Filter } from 'lucide-react';

interface TestFiltersProps {
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
}

export default function TestFilters({
  selectedType,
  setSelectedType,
}: TestFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={18} className="text-gray-500" />
        <h2 className="text-lg font-medium">Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Test Type Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Test Type</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                selectedType === null
                  ? 'bg-[#152C61] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('reading')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                selectedType === 'reading'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reading
            </button>
            <button
              onClick={() => setSelectedType('listening')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                selectedType === 'listening'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Listening
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}