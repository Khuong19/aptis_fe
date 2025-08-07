import { LearnerTest } from "@/app/types";
import Link from "next/link";
import { Clock, HelpCircle, Calendar } from "lucide-react";

interface TestCardProps {
  test: LearnerTest;
}

export default function TestCard({ test }: TestCardProps) {
  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "reading":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "listening":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Convert duration from seconds to minutes
  const getDurationInMinutes = (duration: number) => {
    return Math.floor(duration / 60);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col border border-gray-100">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight flex-1 pr-2">
            {test.title}
          </h3>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(
              test.type
            )}`}
          >
            {test.type?.charAt(0).toUpperCase() + test.type?.slice(1)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-gray-500" />
            <span className="font-medium">
              {test.duration ? `${getDurationInMinutes(test.duration)} min` : 'Not specified'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <HelpCircle size={16} className="text-gray-500" />
            <span className="font-medium">
              {test.totalQuestions || test.questions || 0} questions
            </span>
          </div>
        </div>

        {/* Show creation date */}
        {test.createdAt && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
            <Calendar size={14} className="text-gray-400" />
            <span>Created: {formatDate(test.createdAt)}</span>
          </div>
        )}

        {test.status && test.status !== "Draft" && (
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                test.status === "Published"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : test.status === "Draft"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-gray-50 text-gray-700 border border-gray-200"
              }`}
            >
              {test.status}
            </span>
          </div>
        )}

        {test.lastAttempt && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{test.lastAttempt}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#152C61] h-2 rounded-full transition-all duration-300"
                style={{ width: `${test.lastAttempt}` }}
              ></div>
            </div>
          </div>
        )}

        <div className="mt-auto">
          <Link
            href={
              test.type?.toLowerCase() === "listening"
                ? `/learner/test-listening/${test.id}`
                : `/learner/practice/${test.id}`
            }
            className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-[#152C61] hover:bg-[#0f1f45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152C61] transition-colors duration-200"
          >
            {test.status === "Published"
              ? "Review Test"
              : test.status === "Draft"
              ? "Continue Test"
              : "Start Test"}
          </Link>
        </div>
      </div>
    </div>
  );
}

