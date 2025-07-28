'use client';

import { Headphones } from "lucide-react";

const EmptyListeningQuestionBankState = () => {
  return (
    <div className="col-span-3 text-center py-12">
      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Headphones className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No listening question sets found</h3>
      <p className="text-gray-500">Try adjusting your filters or create a new question set.</p>
    </div>
  );
};

export default EmptyListeningQuestionBankState; 