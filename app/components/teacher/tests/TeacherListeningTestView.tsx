import React, { useState, useEffect, useRef } from "react";
import { Badge } from "@/app/components/ui/basic";
import { QuestionSet, Question } from "@/app/types/question-bank";
import { useRouter } from "next/navigation";

interface TeacherListeningTestViewProps {
  test: any;
}

const TeacherListeningTestView: React.FC<TeacherListeningTestViewProps> = ({
  test,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  // Access questionSets correctly from the data structure
  const questionSets = test?.questionSets || [];
  const totalParts = questionSets.length;
  const currentQuestionSet = questionSets[currentPartIndex];

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
  }, [currentPartIndex]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
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

  const handleNext = () => {
    if (currentPartIndex < totalParts - 1) {
      setCurrentPartIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0); // Reset question index for new part
    }
  };

  const handleBack = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex((prev) => prev - 1);
      setCurrentQuestionIndex(0); // Reset question index for previous part
    }
  };

  // Part 1: Multiple choice questions with individual audio for each conversation
  const renderListeningPart1 = (questionSet: any) => {
    const conversations = questionSet.conversations || [];
    const currentConversation = conversations[currentQuestionIndex] || {};

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
            <span className="text-sm text-gray-500">
              {formatTime(audioCurrentTime)} / {formatTime(audioDuration)}
            </span>
          </div>
          <audio
            ref={audioRef}
            src={currentConversation.audioUrl}
            preload="metadata"
          />
        </div>

        {/* Question */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">
              {currentConversation.question.text}
            </h3>
          </div>

          <div className="space-y-3">
            {currentConversation.question.options &&
              Object.entries(currentConversation.question.options).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center font-medium">
                        {key}
                      </div>
                      <span>{value as string}</span>
                    </div>
                  </div>
                )
              )}
          </div>
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
            src={questionSet.audioUrl || "/audio/sample.mp3"}
            preload="metadata"
          />
        </div>

        {/* Questions */}
        <div className="bg-white border rounded-lg p-6">
          <div className="space-y-4">
            {questions.map((question: any, index: number) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <p className="font-medium mb-2">{question.text}</p>
                <div className="space-y-2">
                  {question.options &&
                    Object.entries(question.options).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center p-2 border rounded bg-gray-50"
                      >
                        <span className="text-sm">{value as string}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Part 3: Opinion matching
  const renderListeningPart3 = (questionSet: any) => {
    const questions = questionSet.questions || [];

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium mb-2">
              Listen to two people discussing work arrangements. Read the
              opinions below and decide whose opinion matches the statements:
              the man, the woman, or both.
            </p>
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
            src={questionSet.audioUrl || "/audio/sample.mp3"}
            preload="metadata"
          />
        </div>

        {/* Questions */}
        <div className="bg-white border rounded-lg p-6">
          <div className="space-y-4">
            {questions.map((question: any, index: number) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <p className="font-medium mb-2">{question.text}</p>
                <div className="space-y-2">
                  {question.options &&
                    Object.entries(question.options).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center p-2 border rounded bg-gray-50"
                      >
                        <span className="text-sm">{value as string}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Part 4: Multiple choice with multiple questions
  const renderListeningPart4 = (questionSet: any) => {
    const lectures = questionSet.lectures || [];
    const allQuestions = lectures.flatMap((lecture: any) =>
      (lecture.questions || []).map((q: any) => ({
        ...q,
        lectureTitle: lecture.topic,
        speaker: lecture.speaker,
      }))
    );

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium mb-2">
              Listen to lectures about AI and answer the questions below.
            </p>
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
            src={questionSet.audioUrl || "/audio/sample.mp3"}
            preload="metadata"
          />
        </div>

        {/* Questions */}
        <div className="bg-white border rounded-lg p-6">
          <div className="space-y-6">
            {allQuestions.map((question: any, index: number) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="mb-2">
                  <p className="text-sm text-gray-600">
                    {question.lectureTitle} - {question.speaker}
                  </p>
                </div>
                <p className="font-medium mb-2">{question.text}</p>
                <div className="space-y-2">
                  {question.options &&
                    Object.entries(question.options).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center p-2 border rounded bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gray-100 rounded border flex items-center justify-center font-medium text-sm">
                            {key}
                          </div>
                          <span className="text-sm">{value as string}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentPart = () => {
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
    let questionNumber = 1;
    for (let i = 0; i < currentPartIndex; i++) {
      const set = questionSets[i];
      switch (set.part) {
        case 1:
          questionNumber += set.conversations?.length || 0;
          break;
        case 2:
          questionNumber += set.monologue?.questions?.length || 0;
          break;
        case 3:
          questionNumber += set.questions?.length || 0;
          break;
        case 4:
          questionNumber +=
            set.lectures?.reduce(
              (lectureTotal: number, lecture: any) =>
                lectureTotal + (lecture.questions?.length || 0),
              0
            ) || 0;
          break;
      }
    }
    return questionNumber;
  };

  if (!test) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-lg font-medium">
                <span className="text-gray-600">Listening Test Preview</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">L</span>
                </div>
                <span className="font-medium">AptisWeb</span>
              </div>
              <span className="font-medium text-gray-600">Listening</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="font-medium">Part {currentPartIndex + 1} of {totalParts}</span>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: totalParts }, (_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-sm ${
                      i === currentPartIndex
                        ? 'bg-purple-500'
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
      <div className="bg-white shadow-sm border-t">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                disabled={currentPartIndex === 0}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous Part
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Question {getCurrentQuestionNumber()} of {getTotalQuestions()}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPartIndex === totalParts - 1}
                className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Part
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherListeningTestView; 