import React, { useState, useEffect } from 'react';
import { Badge } from '@/app/components/ui/basic';
import { QuestionSet, Question, Passage } from '@/app/types/question-bank';
import { useRouter } from 'next/navigation';

interface LearnerTestViewProps {
  test: any;
  onTestComplete?: (answers: Record<string, string>, timeSpent: number) => void;
}

const DEFAULT_DURATION = 35 * 60; // 35 phút, đơn vị giây

const LearnerTestView: React.FC<LearnerTestViewProps> = ({ test, onTestComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(test?.duration || DEFAULT_DURATION);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [startTime] = useState<number>(Date.now());
  
  const questionSets = test.questionSets || [];
  const totalParts = questionSets.length;
  const currentQuestionSet = questionSets[currentPartIndex];

  useEffect(() => {
    if (timeLeft <= 0 && !isTestComplete) {
      handleTestComplete();
    }
    
    if (timeLeft > 0 && !isTestComplete) {
      const timer = setInterval(() => setTimeLeft((t: number) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isTestComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!test) return null;

  // Calculate total questions across all question sets
  const totalQuestions = test.questionSets?.reduce((total: number, set: QuestionSet) => {
    if (set.part === 1 || set.part === 3) {
      return total + (set.questions?.length || 0);
    } else if (set.part === 2) {
      // Part 2 usually has 1 question with multiple sentences
      return total + 1;
    } else if (set.part === 4) {
      // Part 4 has paragraphs to match with headings
      return total + (set.paragraphs?.length || 0);
    }
    return total;
  }, 0) || 0;

  const handleAnswerSelect = (questionKey: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionKey]: answer
    }));
  };

  const handleNext = () => {
    if (currentPartIndex < totalParts - 1) {
      setCurrentPartIndex(prev => prev + 1);
    } else {
      // If this is the last part, complete the test
      handleTestComplete();
    }
  };

  const handleBack = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex(prev => prev - 1);
    }
  };

  const handleTestComplete = () => {
    setIsTestComplete(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    if (onTestComplete) {
      onTestComplete(selectedAnswers, timeSpent);
    }
  };

  const renderReadingPart1 = (questionSet: QuestionSet) => {
    const passage = questionSet.passageText || questionSet.content || '';
    const questions = questionSet.questions || [];

    // Regex tìm các [1], [2], ...
    const gapRegex = /\[(\d+)\]/g;
    let lastIndex = 0;
    let match;
    let elements = [];
    let gapCount = 0;
    while ((match = gapRegex.exec(passage)) !== null) {
      const start = match.index;
      const end = gapRegex.lastIndex;
      // Thêm text trước gap
      elements.push(<span key={`text-${gapCount}`}>{passage.slice(lastIndex, start)}</span>);
      // Thêm dropdown tại vị trí gap
      const gapIdx = parseInt(match[1], 10) - 1;
      const question = questions[gapIdx];
      elements.push(
        gapIdx === 0 ? (
          <select
            key={`gap-${gapCount}`}
            className="mx-1 px-2 py-1 border border-gray-400 rounded bg-yellow-100 text-sm font-medium min-w-[80px]"
            value={questions[0]?.answer || ''}
            disabled
          >
            <option value={questions[0]?.answer || ''}>
              {questions[0]?.options && questions[0]?.answer ? (typeof questions[0].options === 'object' && !Array.isArray(questions[0].options) ? (questions[0].options as Record<string, string>)[questions[0].answer as string] : '') : ''}
            </option>
          </select>
        ) : (
          <select
            key={`gap-${gapCount}`}
            className="mx-1 px-2 py-1 border border-gray-400 rounded bg-yellow-100 text-sm font-medium min-w-[80px]"
            value={selectedAnswers[`${questionSet.id}-${gapIdx}`] || ''}
            onChange={e => handleAnswerSelect(`${questionSet.id}-${gapIdx}`, e.target.value)}
          >
            <option value="">---</option>
            {question && Object.entries(question.options || {}).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        )
      );
      lastIndex = end;
      gapCount++;
    }
    // Thêm phần còn lại của passage
    elements.push(<span key="text-last">{passage.slice(lastIndex)}</span>);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">
            Choose the word that fits in the gap. The first one is done for you.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="border-b pb-3 mb-4">
            <p className="font-medium text-gray-700">Email Message</p>
          </div>
          <div className="email-content text-sm leading-relaxed space-y-3">
            <span>{elements}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderReadingPart2 = (questionSet: QuestionSet) => {
    const sentences = questionSet.questions?.[0]?.sentences || [];
    
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium">
            The sentences below are from a biography. Order the sentences to make a story. The first sentence of the story is an example.
          </p>
        </div>

        <div className="space-y-3">
          {sentences.map((sentence: any, index: number) => (
            <div 
              key={sentence.id || index}
              className={`p-4 border rounded-lg ${
                sentence.isExample 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <p className="text-sm">{sentence.text}</p>
              {sentence.isExample && (
                <Badge className="mt-2 bg-blue-100 text-blue-800">Example</Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReadingPart3 = (questionSet: QuestionSet) => {
    const passages = questionSet.passages || [];
    const questions = questionSet.questions || [];

    // Lấy danh sách person (A, B, C, D)
    const personList = passages.map((p: any) => ({
      key: p.person || p.id,
      label: `Person ${p.person || p.id}`,
    }));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left side - Passages */}
        <div className="space-y-6">
          <h3 className="text-center text-xl font-semibold mb-4">How do you spend your free time?</h3>
          {passages.map((passage: any, idx: number) => (
            <div key={passage.id || idx} className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-2">{`Person ${passage.person || passage.id}`}</h4>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{passage.text || passage.content}</p>
            </div>
          ))}
        </div>
        {/* Right side - Questions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">
            Read the four opinions posted on a travel forum. Then, answer the questions.
          </h3>
          <div className="space-y-3">
            {questions.map((q: any, idx: number) => (
              <div key={q.id || idx} className="flex items-center gap-3">
                <span className="font-medium w-6">{idx + 1}.</span>
                <span className="flex-1">{q.text}</span>
                <select
                  className="px-2 py-1 border border-yellow-300 rounded bg-yellow-100 min-w-[120px]"
                  value={selectedAnswers[`${questionSet.id}-${idx}`] || ''}
                  onChange={e => handleAnswerSelect(`${questionSet.id}-${idx}`, e.target.value)}
                >
                  <option value="">Select...</option>
                  {personList.map(p => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderReadingPart4 = (questionSet: QuestionSet) => {
    const rawHeadings = questionSet.headings || [];
    const headings = Array.isArray(rawHeadings)
      ? rawHeadings
      : typeof rawHeadings === 'object' && rawHeadings !== null
        ? Object.entries(rawHeadings).map(([id, text]) => ({ id, text }))
        : [];
    const passage = questionSet.passageText || questionSet.passage || '';
    const title = questionSet.title || 'No title provided';

    const paragraphs = passage
      ? passage.split(/\n\s*\n/).map((text, idx) => ({ id: idx, text: text.trim() }))
      : [];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left side - Passage */}
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">{title || 'No title provided'}</h3>
            <div className="space-y-4 text-sm leading-relaxed">
              {paragraphs.map((para, index) => (
                <div key={para.id} className="space-y-2">
                  <p className="font-semibold text-gray-600">{index}.</p>
                  <p className="whitespace-pre-wrap">{para.text}</p>
                </div>
              ))}
            </div>  
          </div>
        </div>
        {/* Right side - Headings to match */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">
              Read the text. Match the headings to the paragraphs. The answer to question 0 is an example. There is one heading that you will not use.
            </p>
          </div>
          <div className="bg-white border rounded-lg p-6">
            <div className="space-y-3">
              {paragraphs.map((_, idx) => {
                const q = Array.isArray(questionSet.questions) ? questionSet.questions[idx] : undefined;
                const options = q?.options || {};
                const headingList = Object.entries(options).map(([key, text]) => ({
                  key: key.replace('Heading', ''),
                  text,
                }));
                const correctHeading = q?.answer || '';

                return idx === 0 ? (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="font-medium">{idx}.</span>
                    <select className="flex-1 p-2 border rounded" value={correctHeading} disabled>
                      {headingList.map(h => (
                        <option key={h.key} value={h.key}>{String(h.text)}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div key={idx} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <span className="font-medium">{idx}.</span>
                    <select
                      className="flex-1 p-2 border rounded"
                      value={selectedAnswers[`${questionSet?.id}-${idx}`] || ''}
                      onChange={e => handleAnswerSelect(`${questionSet?.id}-${idx}`, e.target.value)}
                    >
                      <option value="">Select heading...</option>
                      {headingList.map(h => (
                        <option key={h.key} value={h.key}>{String(h.text)}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentPart = () => {
    if (!currentQuestionSet) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">No part available</p></div>;
    switch (currentQuestionSet.part) {
      case 1:
        return renderReadingPart1(currentQuestionSet);
      case 2:
        return renderReadingPart2(currentQuestionSet);
      case 3:
        return renderReadingPart3(currentQuestionSet);
      case 4:
        return renderReadingPart4(currentQuestionSet);
      default:
        return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Unsupported part</p></div>;
    }
  };

  if (isTestComplete) {
    return (
      <div className="h-screen flex flex-col bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Completed!</h2>
            <p className="text-gray-600 mb-6">Your answers have been submitted successfully.</p>
            <button
              onClick={() => router.push('/learner/practice')}
              className="px-6 py-2 bg-[#152C61] text-white rounded-lg hover:bg-[#0f1f45]"
            >
              Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Back to Practice button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => router.push('/learner/practice')}
          className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm text-white"
          style={{ backgroundColor: 'rgb(42 65 115 / var(--tw-border-opacity, 1))' }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgb(52 75 135 / var(--tw-border-opacity, 1))')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = 'rgb(42 65 115 / var(--tw-border-opacity, 1))')}
        >
          ← Back to Practice
        </button>
      </div>
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-lg font-medium">
                <span className={`${timeLeft <= 300 ? 'text-red-600' : 'text-gray-600'}`}>
                  {formatTime(timeLeft)}
                </span>
                {timeLeft <= 300 && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    Time running out!
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">A</span>
                </div>
                <span className="font-medium">AptisWeb</span>
              </div>
              <span className="font-medium text-gray-600">Reading</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="font-medium">Part {currentPartIndex + 1} of {totalParts}</span>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: totalParts }, (_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-sm ${
                      i === currentPartIndex
                        ? 'bg-blue-500'
                        : i < currentPartIndex
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {renderCurrentPart()}
        </div>
      </div>

      {/* Footer navigation */}
      <div className="bg-white border-t shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentPartIndex === 0}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Flag 🏴
              </button>
              
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                {currentPartIndex === totalParts - 1 ? 'Finish Test' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerTestView; 