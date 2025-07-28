import { Filter, Clock, HelpCircle } from 'lucide-react';

interface TestFiltersProps {
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  durationFilter: number | null;
  setDurationFilter: (duration: number | null) => void;
  difficultyFilter: string | null;
  setDifficultyFilter: (difficulty: string | null) => void;
}

export default function TestFilters({
  selectedType,
  setSelectedType,
  durationFilter,
  setDurationFilter,
  difficultyFilter,
  setDifficultyFilter,
}: TestFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={18} className="text-gray-500" />
        <h2 className="text-lg font-medium">Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              onClick={() => setSelectedType('Reading')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                selectedType === 'Reading'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reading
            </button>
            <button
              onClick={() => setSelectedType('Listening')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                selectedType === 'Listening'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Listening
            </button>
            <button
              onClick={() => setSelectedType('Grammar')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                selectedType === 'Grammar'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grammar
            </button>
            <button
              onClick={() => setSelectedType('Vocabulary')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                selectedType === 'Vocabulary'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vocabulary
            </button>
          </div>
        </div>
        
        {/* Duration Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              Duration
            </div>
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDurationFilter(null)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                durationFilter === null
                  ? 'bg-[#152C61] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Any
            </button>
            <button
              onClick={() => setDurationFilter(15)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                durationFilter === 15
                  ? 'bg-[#152C61] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              &lt; 15 min
            </button>
            <button
              onClick={() => setDurationFilter(30)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                durationFilter === 30
                  ? 'bg-[#152C61] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              &lt; 30 min
            </button>
            <button
              onClick={() => setDurationFilter(60)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                durationFilter === 60
                  ? 'bg-[#152C61] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              &lt; 60 min
            </button>
          </div>
        </div>
        
        {/* Difficulty Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <HelpCircle size={16} className="mr-1" />
              Difficulty
            </div>
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDifficultyFilter(null)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                difficultyFilter === null
                  ? 'bg-[#152C61] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Any
            </button>
            <button
              onClick={() => setDifficultyFilter('Easy')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                difficultyFilter === 'Easy'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficultyFilter('Medium')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                difficultyFilter === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setDifficultyFilter('Hard')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                difficultyFilter === 'Hard'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}