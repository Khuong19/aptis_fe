import React, { useState, useEffect, useRef } from "react";
import { Badge } from "@/app/components/ui/basic";
import { QuestionSet, Question } from "@/app/types/question-bank";
import { useRouter } from "next/navigation";
import { getMergedAudioUrl } from "@/app/lib/api/audioService";

interface LearnerListeningTestViewProps {
  test: any;
  onTestComplete?: (answers: Record<string, string>, timeSpent: number) => void;
}

const DEFAULT_DURATION = 25 * 60; // 25 minutes for listening

const LearnerListeningTestView: React.FC<LearnerListeningTestViewProps> = ({
  test,
  onTestComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [timeLeft, setTimeLeft] = useState(test?.duration || DEFAULT_DURATION);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  // Access questionSets correctly from the data structure
  const questionSets = test?.questionSets || [];
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

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setAudioCurrentTime(audio.currentTime);
      const updateDuration = () => setAudioDuration(audio.duration);

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      audio.addEventListener("ended", () => setIsPlaying(false));

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.removeEventListener("ended", () => setIsPlaying(false));
      };
    }
  }, [currentPartIndex, currentLectureIndex]);

  // Reset audio when lecture changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentQuestionSet?.part === 4) {
      audio.load(); // Reload audio for new lecture
      setIsPlaying(false);
      setAudioCurrentTime(0);
    }
  }, [currentLectureIndex, currentQuestionSet?.part]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAnswerSelect = (questionKey: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionKey]: answer,
    }));
  };

  const handleBookmark = (questionKey: string) => {
    setBookmarkedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionKey)) {
        newSet.delete(questionKey);
      } else {
        newSet.add(questionKey);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    // For Part 1, navigate between questions first
    if (currentQuestionSet?.part === 1) {
      const conversations = currentQuestionSet.conversations || [];
      if (currentQuestionIndex < conversations.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        return;
      }
    }
    
    // For Part 4, navigate between lectures first
    if (currentQuestionSet?.part === 4) {
      const lectures = currentQuestionSet.lectures || [];
      if (currentLectureIndex < lectures.length - 1) {
        setCurrentLectureIndex(prev => prev + 1);
        return;
      }
    }
    
    // Then navigate between parts
    if (currentPartIndex < totalParts - 1) {
      setCurrentPartIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0); // Reset question index for new part
      setCurrentLectureIndex(0); // Reset lecture index for new part
    } else {
      handleTestComplete();
    }
  };

  const handleBack = () => {
    // For Part 1, navigate between questions first
    if (currentQuestionSet?.part === 1) {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
        return;
      }
    }
    
    // For Part 4, navigate between lectures first
    if (currentQuestionSet?.part === 4) {
      if (currentLectureIndex > 0) {
        setCurrentLectureIndex(prev => prev - 1);
        return;
      }
    }
    
    // Then navigate between parts
    if (currentPartIndex > 0) {
      setCurrentPartIndex((prev) => prev - 1);
      setCurrentQuestionIndex(0); // Reset question index for previous part
      setCurrentLectureIndex(0); // Reset lecture index for previous part
    }
  };

  const handleTestComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    if (onTestComplete) {
      onTestComplete(selectedAnswers, timeSpent);
    }
  };

  // Part 1: Multiple choice questions with individual audio for each conversation
  const renderListeningPart1 = (questionSet: any) => {
    const conversations = questionSet.conversations || [];
    const currentConversation = conversations[currentQuestionIndex] || {};
    const questionKey = `${questionSet.id}-conv${currentQuestionIndex}`;

    if (!currentConversation.question) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No question available</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">
            {currentConversation.title} - {currentConversation.context}
          </p>
        </div>

        {/* Audio Player */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>
            <span className="text-sm">Play/Stop</span>
          </div>
          <audio
            ref={audioRef}
            src={
              currentConversation.audioUrl 
                ? `${process.env.NEXT_PUBLIC_API_URL}/${currentConversation.audioUrl.replace("http://localhost:5000/api/", "")}`
                : "/audio/sample.mp3"
            }
            preload="metadata"
          />
        </div>

        {/* Question */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">
              {currentConversation.question.text}
            </h3>
            <button
              onClick={() => handleBookmark(questionKey)}
              className={`px-3 py-1 border rounded ${
                bookmarkedQuestions.has(questionKey)
                  ? "bg-yellow-100 border-yellow-400"
                  : "border-gray-300"
              }`}
            >
              🏴 Bookmark
            </button>
          </div>

          <div className="space-y-3">
            {currentConversation.question.options &&
              Object.entries(currentConversation.question.options).map(
                ([key, value]) => (
                  <label
                    key={key}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedAnswers[questionKey] === key
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center font-medium">
                        {key}
                      </div>
                      <span>{value as string}</span>
                    </div>
                    <input
                      type="radio"
                      name={questionKey}
                      value={key}
                      checked={selectedAnswers[questionKey] === key}
                      onChange={(e) =>
                        handleAnswerSelect(questionKey, e.target.value)
                      }
                      className="ml-auto"
                    />
                  </label>
                )
              )}
          </div>
        </div>

        {/* Question counter for Part 1 */}
        <div className="flex justify-center items-center">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {conversations.length}
          </span>
        </div>
      </div>
    );
  };

  // Part 2: Sentence completion with dropdowns
  const renderListeningPart2 = (questionSet: any) => {
    const monologue = questionSet.monologue;
    if (!monologue) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No monologue available</p>
        </div>
      );
    }

    const questions = monologue.questions || [];

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">{monologue.introduction}</p>
          <button
            onClick={() => handleBookmark(`${questionSet.id}-general`)}
            className={`px-3 py-1 border rounded ${
              bookmarkedQuestions.has(`${questionSet.id}-general`)
                ? "bg-yellow-100 border-yellow-400"
                : "border-gray-300"
            }`}
          >
            🏴 Bookmark
          </button>
        </div>

        {/* Audio Player */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>
            <span className="text-sm">Play/Stop</span>
          </div>
          <audio
            ref={audioRef}
            src={
              questionSet.monologue?.audioUrl 
                ? `${process.env.NEXT_PUBLIC_API_URL}/${questionSet.monologue.audioUrl.replace("http://localhost:5000/api/", "")}`
                : "/audio/sample.mp3"
            }
            preload="metadata"
          />
        </div>

        {/* Questions */}
        <div className="bg-white border rounded-lg p-6 space-y-4">
          {questions.map((question: any, index: number) => {
            const questionKey = `${questionSet.id}-q${index}`;

            const options = {
              A: questions[0].sentence,
              B: questions[1].sentence,
              C: questions[2].sentence,
              D: questions[3].sentence,
            };

            return (
              <div key={index} className="flex items-center space-x-3">
                <span className="font-medium min-w-[100px]">
                  {question.text} ...
                </span>
                <select
                  className="flex-1 p-2 border border-gray-300 rounded"
                  value={selectedAnswers[questionKey] || ""}
                  onChange={(e) =>
                    handleAnswerSelect(questionKey, e.target.value)
                  }
                >
                  <option value="">Select...</option>
                  {Object.entries(options).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Part 3: Opinion matching
  const renderListeningPart3 = (questionSet: any) => {
    const questions = questionSet.questions || [];
    const [audioSrc, setAudioSrc] = useState<string>("/audio/sample.mp3");
    const [isLoadingAudio, setIsLoadingAudio] = useState(true);

    // Load merged audio for Part 3
    useEffect(() => {
      const loadMergedAudio = async () => {
        try {
          setIsLoadingAudio(true);
          const mergedAudioUrl = await getMergedAudioUrl(questionSet);
          setAudioSrc(mergedAudioUrl);
        } catch (error) {
          console.error('Error loading merged audio:', error);
          // Fallback to first audio file
          const audioFile = questionSet.audioFiles?.[0];
          setAudioSrc(
            audioFile 
              ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${audioFile.replace("http://localhost:5000/api/uploads/", "")}`
              : "/audio/sample.mp3"
          );
        } finally {
          setIsLoadingAudio(false);
        }
      };

      loadMergedAudio();
    }, [questionSet]);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium mb-2">
              Listen to two people discussing work arrangements. Read the
              opinions below and decide whose opinion matches the statements:
              the man, the woman, or both.
            </p>
            <button
              onClick={() => handleBookmark(`${questionSet.id}-general`)}
              className={`px-3 py-1 border rounded ${
                bookmarkedQuestions.has(`${questionSet.id}-general`)
                  ? "bg-yellow-100 border-yellow-400"
                  : "border-gray-300"
              }`}
            >
              🏴 Bookmark
            </button>
          </div>
        </div>

        {/* Audio Player */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              disabled={isLoadingAudio}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isLoadingAudio 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isLoadingAudio ? "⏳" : isPlaying ? "⏸️" : "▶️"}
            </button>
            <span className="text-sm">
              {isLoadingAudio ? "Loading audio..." : "Play/Stop"}
            </span>
          </div>
          <audio
            ref={audioRef}
            src={audioSrc}
            preload="metadata"
          />
        </div>

        {/* Questions */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-medium mb-4">Who expresses which opinion?</h3>
          <div className="space-y-4">
            {questions.map((question: any, index: number) => {
              const questionKey = `${questionSet.id}-q${index}`;

              return (
                <div key={index} className="flex items-center space-x-3">
                  <span className="font-medium w-6">{index + 1}.</span>
                  <span className="flex-1">{question.text}</span>
                  <select
                    className="min-w-[150px] p-2 border border-gray-300 rounded"
                    value={selectedAnswers[questionKey] || ""}
                    onChange={(e) =>
                      handleAnswerSelect(questionKey, e.target.value)
                    }
                  >
                    <option value="">Select...</option>
                    {question.options &&
                      Object.entries(question.options).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value as string}
                        </option>
                      ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Part 4: Multiple choice with multiple questions
  const renderListeningPart4 = (questionSet: any) => {
    const lectures = questionSet.lectures || [];
    const currentLecture = lectures[currentLectureIndex];
    
    if (!currentLecture) {
      return (
        <div className="max-w-4xl mx-auto text-center py-8">
          <p className="text-gray-500">No lecture available</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Lecture Navigation */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-lg">Lecture {currentLectureIndex + 1} of {lectures.length}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Topic: {currentLecture.topic}
              </p>
              {currentLecture.speaker && (
                <p className="text-sm text-gray-500">Speaker: {currentLecture.speaker}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBookmark(`${questionSet.id}-lecture-${currentLectureIndex}`)}
                className={`px-3 py-1 border rounded ${
                  bookmarkedQuestions.has(`${questionSet.id}-lecture-${currentLectureIndex}`)
                    ? "bg-yellow-100 border-yellow-400"
                    : "border-gray-300"
                }`}
              >
                🏴 Bookmark
              </button>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>
            <span className="text-sm">Play/Stop</span>
            <span className="text-sm text-gray-500">
              {formatTime(audioCurrentTime)} / {formatTime(audioDuration)}
            </span>
          </div>
          <audio
            ref={audioRef}
            src={
              questionSet.audioFiles && questionSet.audioFiles[currentLectureIndex]
                ? `${process.env.NEXT_PUBLIC_API_URL}/${questionSet.audioFiles[currentLectureIndex].replace("http://localhost:5000/api/", "")}`
                : "/audio/sample.mp3"
            }
            preload="metadata"
            onError={(e) => {
              console.error('Audio error:', e);
            }}
          />
        </div>

        {/* Questions for Current Lecture */}
        <div className="space-y-6">
          {currentLecture.questions && currentLecture.questions.map((question: any, index: number) => {
            const questionKey = `${questionSet.id}-${currentLecture.topic}-q${index}`;

            return (
              <div key={index} className="bg-white border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{question.text}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Question {index + 1} of {currentLecture.questions.length}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBookmark(questionKey)}
                    className={`px-3 py-1 border rounded ${
                      bookmarkedQuestions.has(questionKey)
                        ? "bg-yellow-100 border-yellow-400"
                        : "border-gray-300"
                    }`}
                  >
                    🏴
                  </button>
                </div>

                <div className="space-y-3">
                  {question.options &&
                    Object.entries(question.options).map(([key, value]) => (
                      <label
                        key={key}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedAnswers[questionKey] === key
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center font-medium">
                            {key}
                          </div>
                          <span>{value as string}</span>
                        </div>
                        <input
                          type="radio"
                          name={questionKey}
                          value={key}
                          checked={selectedAnswers[questionKey] === key}
                          onChange={(e) =>
                            handleAnswerSelect(questionKey, e.target.value)
                          }
                          className="ml-auto"
                        />
                      </label>
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        
      </div>
    );
  };

  const renderCurrentPart = () => {
    // console.log("Rendering current part:", currentQuestionSet);
    if (!currentQuestionSet) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No part available</p>
        </div>
      );
    }

    const part = currentQuestionSet.part;

    switch (part) {
      case 1:
        return renderListeningPart1(currentQuestionSet);
      case 2:
        return renderListeningPart2(currentQuestionSet);
      case 3:
        return renderListeningPart3(currentQuestionSet);
      case 4:
        return renderListeningPart4(currentQuestionSet);
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Unsupported part</p>
          </div>
        );
    }
  };

  const getTotalQuestions = () => {
    return questionSets.reduce((total: number, set: any) => {
      switch (set.part) {
        case 1:
          return total + (set.conversations?.length || 0);
        case 2:
          return total + (set.monologue?.questions?.length || 0);
        case 3:
          return total + (set.questions?.length || 0);
        case 4:
          return (
            total +
            (set.lectures?.reduce(
              (lectureTotal: number, lecture: any) =>
                lectureTotal + (lecture.questions?.length || 0),
              0
            ) || 0)
          );
        default:
          return total;
      }
    }, 0);
  };

  const getCurrentQuestionNumber = () => {
    let total = 0;
    for (let i = 0; i < currentPartIndex; i++) {
      const set = questionSets[i];
      switch (set.part) {
        case 1:
          total += set.conversations?.length || 0;
          break;
        case 2:
          total += set.monologue?.questions?.length || 0;
          break;
        case 3:
          total += set.questions?.length || 0;
          break;
        case 4:
          total +=
            set.lectures?.reduce(
              (lectureTotal: number, lecture: any) =>
                lectureTotal + (lecture.questions?.length || 0),
              0
            ) || 0;
          break;
      }
    }

    // Add current question index for Part 1, or 1 for other parts
    if (currentQuestionSet?.part === 1) {
      total += currentQuestionIndex + 1;
    } else if (currentQuestionSet?.part === 4) {
      // For Part 4, add questions from previous lectures plus current lecture questions
      const lectures = currentQuestionSet.lectures || [];
      for (let i = 0; i < currentLectureIndex; i++) {
        total += lectures[i]?.questions?.length || 0;
      }
      total += 1; // Current lecture is counted as 1 question set
    } else {
      total += 1;
    }

    return total;
  };

  if (isTestComplete) {
    return (
      <div className="h-screen flex flex-col bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Listening Test Completed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your answers have been submitted successfully.
            </p>
            <button
              onClick={() => router.push("/learner/practice")}
              className="px-6 py-2 bg-[#152C61] text-white rounded-lg hover:bg-[#0f1f45]"
            >
              Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!test) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => router.push("/learner/practice")}
                className="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                ← Back to Practice
              </button>
              <div className="flex items-center space-x-2 text-lg font-medium">
                <span
                  className={`${
                    timeLeft <= 300 ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
                {timeLeft <= 300 && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    Time remaining
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">A</span>
                </div>
                <span className="font-medium">AptisWeb</span>
              </div>
              <span className="font-medium text-gray-600">Listening</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="font-medium">
                Question {getCurrentQuestionNumber()} of {getTotalQuestions()}
              </span>
              <span className="text-sm text-gray-500">
                Part {currentQuestionSet?.part || 1}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">{renderCurrentPart()}</div>
      </div>

      {/* Footer navigation */}
      <div className="bg-white border-t shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
                         <button
               onClick={handleBack}
               disabled={
                 currentQuestionSet?.part === 1 
                   ? currentQuestionIndex === 0 && currentPartIndex === 0
                   : currentQuestionSet?.part === 4 
                     ? currentLectureIndex === 0 && currentPartIndex === 0
                     : currentPartIndex === 0
               }
               className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {currentQuestionSet?.part === 1 ? "Previous" : currentQuestionSet?.part === 4 ? "Previous" : "Back"}
             </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleBookmark(`current-${currentPartIndex}`)}
                className={`px-4 py-2 border rounded-lg ${
                  bookmarkedQuestions.has(`current-${currentPartIndex}`)
                    ? "bg-yellow-100 border-yellow-400"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Flag 🏴
              </button>

                             <button
                 onClick={
                   currentPartIndex === totalParts - 1 && 
                   (currentQuestionSet?.part === 1 
                     ? currentQuestionIndex === (currentQuestionSet?.conversations?.length - 1)
                     : currentQuestionSet?.part === 4 
                       ? currentLectureIndex === (currentQuestionSet?.lectures?.length - 1)
                       : true)
                     ? handleTestComplete
                     : handleNext
                 }
                 className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
               >
                 {currentPartIndex === totalParts - 1 && 
                  (currentQuestionSet?.part === 1 
                    ? currentQuestionIndex === (currentQuestionSet?.conversations?.length - 1)
                    : currentQuestionSet?.part === 4 
                      ? currentLectureIndex === (currentQuestionSet?.lectures?.length - 1)
                      : true)
                   ? "Submit Test"
                   : currentQuestionSet?.part === 1 || currentQuestionSet?.part === 4
                     ? "Next"
                     : "Next Part"}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerListeningTestView;
