'use client';

import { Search } from "lucide-react";

const EmptyQuestionBankState = () => {
  return (
    <div className="col-span-3 text-center py-12">
      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Search className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No question sets found</h3>
      <p className="text-gray-500">Try adjusting your filters or create a new question set.</p>
    </div>
  );
};

export default EmptyQuestionBankState;
