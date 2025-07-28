'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Textarea,
  Badge,
  toast
} from '@/app/components/ui/basic';

// Custom RadioGroup component (only for this component)
interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ value, onValueChange, className = '', children }) => (
  <div className={`space-y-2 ${className}`}>{children}</div>
);

interface RadioGroupItemProps {
  value: string;
  id: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroupItem: React.FC<RadioGroupItemProps> = ({ value, id, checked, onChange }) => (
  <input
    type="radio"
    id={id}
    value={value}
    checked={checked}
    onChange={onChange}
    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
  />
);

// Types
import { QuestionOption, Question, QuestionSet, Passage } from '@/app/types/question-bank';
import { SentenceOrderingEditor, OrderingSentence } from '../editors/SentenceOrderingEditor';
import { MatchingQuestionEditor } from '../editors/MatchingQuestionEditor';

interface ViewEditQuestionModalProps {
  isOpen: boolean;
  questionSet: QuestionSet | null;
  isEditable: boolean;
  onClose: () => void;
  onUpdateQuestionSet: (questionSet: QuestionSet) => void;
  startInEditMode?: boolean; // New prop to automatically start in edit mode
}

export default function ViewEditQuestionModal({
  isOpen,
  questionSet,
  isEditable,
  onClose,
  onUpdateQuestionSet,
  startInEditMode = false
}: ViewEditQuestionModalProps) {
  const [editedQuestionSet, setEditedQuestionSet] = useState<QuestionSet | null>(null);
  const [sentences, setSentences] = useState<OrderingSentence[]>([]);
  
  // Part 1 specific states
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [editingPassage, setEditingPassage] = useState(false);
  const [passageText, setPassageText] = useState('');

  // Part 2 specific states
  const [editingMode, setEditingMode] = useState(false);
  const [editingP2Data, setEditingP2Data] = useState<any[]>([]);

  // Part 3 specific states  
  const [editingP3Passage, setEditingP3Passage] = useState<number | null>(null);
  const [editingP3Question, setEditingP3Question] = useState<number | null>(null);
  const [editingP3PassageText, setEditingP3PassageText] = useState('');
  const [editingP3QuestionData, setEditingP3QuestionData] = useState<any>(null);

  // Part 4 specific states
  const [editingP4Section, setEditingP4Section] = useState<number | null>(null);
  const [editingP4SectionText, setEditingP4SectionText] = useState('');
  const [editingP4SectionAnswer, setEditingP4SectionAnswer] = useState('');
  const [editingP4Title, setEditingP4Title] = useState<boolean>(false);
  const [editingP4TitleText, setEditingP4TitleText] = useState('');

  useEffect(() => {
    if (questionSet) {
      const deepClone = JSON.parse(JSON.stringify(questionSet));
      setEditedQuestionSet(deepClone);
      setPassageText(deepClone.passageText || '');
      setEditingP4TitleText(deepClone.title || '');

      const isReadingPart2 = deepClone.type === 'reading' && deepClone.part === '2';
      if (isReadingPart2) {
        try {
          const parsedSentences: OrderingSentence[] = JSON.parse(deepClone.passageText || '[]');
          setSentences(parsedSentences);
        } catch (error) {
          console.error("Failed to parse sentences from passageText", error);
          setSentences([]);
        }
      } else {
        setSentences([]);
      }
    }
  }, [questionSet]);

  // Automatically start in edit mode for Reading Part 2 when startInEditMode is true
  useEffect(() => {
    if (startInEditMode && editedQuestionSet?.type === 'reading' && editedQuestionSet?.part === 2 && isEditable) {
      // Try to get sentences from multiple possible sources
      let availableSentences = [];
      
      // First try from the sentences state
      if (sentences.length > 0) {
        availableSentences = sentences;
      }
      // Then try from editedQuestionSet.questions[0].sentences
      else if (editedQuestionSet.questions && editedQuestionSet.questions.length > 0 && editedQuestionSet.questions[0]?.sentences && editedQuestionSet.questions[0].sentences.length > 0) {
        availableSentences = editedQuestionSet.questions[0].sentences || [];
      }
      // Finally try parsing from passageText
      else if (editedQuestionSet.passageText) {
        try {
          const parsed = JSON.parse(editedQuestionSet.passageText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            availableSentences = parsed;
          }
        } catch (error) {
          console.error('Error parsing passageText for auto-edit mode:', error);
        }
      }
      
      // If we found sentences, start editing mode
      if (availableSentences.length > 0) {
        setEditingMode(true);
        setEditingP2Data([...availableSentences]);
      }
    }
  }, [startInEditMode, editedQuestionSet, sentences, isEditable]);

  if (!questionSet || !editedQuestionSet) {
    return null;
  }

  const isReadingPart1 = editedQuestionSet.type === 'reading' && editedQuestionSet.part === 1;
  const isReadingPart2 = editedQuestionSet.type === 'reading' && editedQuestionSet.part === 2;
  const isReadingPart3 = editedQuestionSet.type === 'reading' && editedQuestionSet.part === 3;
  const isReadingPart4 = editedQuestionSet.type === 'reading' && editedQuestionSet.part === 4;

  // Part 1 specific handlers
  const handleStartEditing = (idx: number) => {
    if (!isEditable) return;
    setEditingQuestionIndex(idx);
    setEditingData({ ...editedQuestionSet.questions[idx] });
  };

  const handleCancelEditing = () => {
    setEditingQuestionIndex(null);
    setEditingData(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditingData({ ...editingData, [field]: value });
  };

  const handleOptionChange = (key: string, value: string) => {
    setEditingData({
      ...editingData,
      options: { ...editingData.options, [key]: value },
    });
  };

  const handleAnswerChange = (value: string) => {
    setEditingData({ ...editingData, answer: value });
  };

  const handleSaveQuestion = () => {
    if (!editedQuestionSet || editingQuestionIndex === null) return;
    const updatedQuestions = [...editedQuestionSet.questions];
    updatedQuestions[editingQuestionIndex] = editingData;
    setEditedQuestionSet({ ...editedQuestionSet, questions: updatedQuestions });
    setEditingQuestionIndex(null);
    setEditingData(null);
    toast({ title: "Success", description: "Question updated successfully!" });
  };

  const handleStartEditingPassage = () => {
    if (!isEditable) return;
    setEditingPassage(true);
  };

  const handleSavePassage = () => {
    if (!editedQuestionSet) return;
    setEditedQuestionSet({ ...editedQuestionSet, passageText });
    setEditingPassage(false);
    toast({ title: "Success", description: "Passage updated successfully!" });
  };

  const handleCancelEditingPassage = () => {
    setEditingPassage(false);
    setPassageText(editedQuestionSet.passageText || '');
  };

  // Part 2 handlers
  const handleP2StartEditing = () => {
    if (!isEditable) return;
    const questions = editedQuestionSet?.questions || [];
    if (questions.length > 0) {
      const sentences = questions[0]?.sentences || 
        questions.map((q: any, idx: number) => ({
          id: `sentence-${idx}`,
          text: q.text || '',
          isExample: idx === 0
        }));
      
      setEditingP2Data([...sentences]);
      setEditingMode(true);
    }
  };

  const handleP2SaveChanges = () => {
    if (!editedQuestionSet) return;
    const questions = editedQuestionSet.questions || [];
    if (questions.length > 0) {
      const updatedQuestions = [...questions];
      updatedQuestions[0] = {
        ...updatedQuestions[0],
        sentences: editingP2Data
      };
      
      setEditedQuestionSet({
        ...editedQuestionSet,
        questions: updatedQuestions
      });
      
      setEditingMode(false);
      toast({ title: "Success", description: "Sentences updated successfully!" });
    }
  };

  const handleP2CancelEditing = () => {
    setEditingMode(false);
    setEditingP2Data([]);
  };

  const handleP2SentenceChange = (index: number, value: string) => {
    const updatedSentences = [...editingP2Data];
    updatedSentences[index] = {
      ...updatedSentences[index],
      text: value
    };
    setEditingP2Data(updatedSentences);
  };

  const handleP2MoveSentence = (index: number, direction: 'up' | 'down') => {
    const updatedSentences = [...editingP2Data];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < updatedSentences.length) {
      const temp = updatedSentences[index];
      updatedSentences[index] = updatedSentences[newIndex];
      updatedSentences[newIndex] = temp;
      setEditingP2Data(updatedSentences);
    }
  };

  // Part 3 handlers
  const handleP3StartEditingPassage = (index: number) => {
    if (!isEditable) return;
    const passages = editedQuestionSet?.passages || [];
    const passage = passages[index];
    setEditingP3Passage(index);
    setEditingP3PassageText(passage.text || passage.content || '');
  };

  const handleP3SavePassage = () => {
    if (editingP3Passage !== null && editedQuestionSet) {
      const updatedPassages = [...(editedQuestionSet.passages || [])];
      updatedPassages[editingP3Passage] = {
        ...updatedPassages[editingP3Passage],
        text: editingP3PassageText,
        content: editingP3PassageText
      };
      
      setEditedQuestionSet({
        ...editedQuestionSet,
        passages: updatedPassages
      });
      
      setEditingP3Passage(null);
      toast({ title: "Success", description: "Passage updated successfully!" });
    }
  };

  const handleP3StartEditingQuestion = (index: number) => {
    if (!isEditable) return;
    const questions = editedQuestionSet?.questions || [];
    const question = questions[index];
    setEditingP3Question(index);
    setEditingP3QuestionData({
      ...question,
      text: question.text || '',
      answer: question.answer || question.correctPerson || ''
    });
  };

  const handleP3SaveQuestion = () => {
    if (editingP3Question !== null && editingP3QuestionData && editedQuestionSet) {
      const updatedQuestions = [...(editedQuestionSet.questions || [])];
      updatedQuestions[editingP3Question] = {
        ...updatedQuestions[editingP3Question],
        ...editingP3QuestionData,
        correctPerson: editingP3QuestionData.answer
      };
      
      setEditedQuestionSet({
        ...editedQuestionSet,
        questions: updatedQuestions
      });
      
      setEditingP3Question(null);
      setEditingP3QuestionData(null);
      toast({ title: "Success", description: "Question updated successfully!" });
    }
  };

  // Part 4 handlers
  const handleP4StartEditingTitle = () => {
    if (!isEditable) return;
    setEditingP4Title(true);
  };

  const handleP4SaveTitle = () => {
    if (!editedQuestionSet) return;
    setEditedQuestionSet({ ...editedQuestionSet, title: editingP4TitleText });
    setEditingP4Title(false);
    toast({ title: "Success", description: "Title updated successfully!" });
  };

  const handleP4StartEditingSection = (index: number) => {
    if (!isEditable) return;
    const question = editedQuestionSet?.questions[index];
    if (question) {
      setEditingP4Section(index);
      setEditingP4SectionText(question.text || '');
      setEditingP4SectionAnswer(question.answer || '');
    }
  };

  const handleP4SaveSection = () => {
    if (editingP4Section !== null && editedQuestionSet) {
      const updatedQuestions = [...editedQuestionSet.questions];
      updatedQuestions[editingP4Section] = {
        ...updatedQuestions[editingP4Section],
        text: editingP4SectionText,
        answer: editingP4SectionAnswer
      };
      
      setEditedQuestionSet({
        ...editedQuestionSet,
        questions: updatedQuestions
      });
      
      setEditingP4Section(null);
      setEditingP4SectionText('');
      setEditingP4SectionAnswer('');
      toast({ title: "Success", description: "Section updated successfully!" });
    }
  };

  const handleP4CancelEditingSection = () => {
    setEditingP4Section(null);
    setEditingP4SectionText('');
    setEditingP4SectionAnswer('');
  };

  const handleSentencesChange = (newSentences: OrderingSentence[]) => {
    if (!isEditable) return;
    setSentences(newSentences);
  };

  const handleQuestionTextChange = (questionIndex: number, text: string) => {
    if (!isEditable) return;
    setEditedQuestionSet(prev => {
      if (!prev) return null;
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex] = { ...newQuestions[questionIndex], text };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleOptionTextChange = (questionIndex: number, optionIndex: number, text: string) => {
    if (!isEditable) return;
    setEditedQuestionSet(prev => {
      if (!prev) return null;
      const newQuestions = [...prev.questions];
      const question = newQuestions[questionIndex];
      
      if (Array.isArray(question.options)) {
        // Handle array-style options
        const newOptions = [...question.options];
        newOptions[optionIndex] = { ...newOptions[optionIndex], text };
        newQuestions[questionIndex] = { ...question, options: newOptions };
      } else {
        // Handle object-style options (A, B, C, D)
        const optionKey = String.fromCharCode(65 + optionIndex); // A, B, C, D
        const newOptions = { ...question.options };
        newOptions[optionKey as keyof typeof newOptions] = text;
        newQuestions[questionIndex] = { ...question, options: newOptions };
      }
      
      return { ...prev, questions: newQuestions };
    });
  };

  const handleCorrectAnswerChange = (questionIndex: number, optionIndex: number) => {
    if (!isEditable) return;
    setEditedQuestionSet(prev => {
      if (!prev) return null;
      const newQuestions = [...prev.questions];
      const question = newQuestions[questionIndex];
      
      if (Array.isArray(question.options)) {
        const newOptions = question.options.map((opt: QuestionOption, idx: number) => ({ 
          ...opt, 
          isCorrect: idx === optionIndex 
        }));
        newQuestions[questionIndex] = { ...question, options: newOptions };
      } else {
        // For object-style options, set the answer property
        const optionKey = String.fromCharCode(65 + optionIndex); // A, B, C, D
        newQuestions[questionIndex] = { ...question, answer: optionKey };
      }
      
      return { ...prev, questions: newQuestions };
    });
  };

  // Handlers for Reading Part 3 (Matching)
  const handlePassageChange = (index: number, text: string) => {
    if (!isEditable) return;
    setEditedQuestionSet(prev => {
      if (!prev || !prev.passages) return prev;
      const newPassages = [...prev.passages];
      newPassages[index] = { ...newPassages[index], text };
      return { ...prev, passages: newPassages };
    });
  };

  const handleMatchingQuestionChange = (index: number, text: string) => {
    if (!isEditable) return;
    setEditedQuestionSet(prev => {
      if (!prev) return prev;
      const newQuestions = [...prev.questions];
      newQuestions[index] = { ...newQuestions[index], text };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleCorrectPersonChange = (index: number, person: string) => {
    if (!isEditable) return;
    setEditedQuestionSet(prev => {
      if (!prev) return prev;
      const newQuestions = [...prev.questions];
      newQuestions[index] = { ...newQuestions[index], correctPerson: person };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleAddMatchingQuestion = () => {
    if (!isEditable) return;
    setEditedQuestionSet(prev => {
      if (!prev) return prev;
      const newQuestion: Question = {
        id: `q-${Date.now()}`,
        text: '',
        options: [],
        correctPerson: '',
      };
      return { ...prev, questions: [...prev.questions, newQuestion] };
    });
  };

  const handleRemoveMatchingQuestion = (index: number) => {
    if (!isEditable) return;
    setEditedQuestionSet(prev => {
      if (!prev) return prev;
      const newQuestions = [...prev.questions];
      newQuestions.splice(index, 1);
      return { ...prev, questions: newQuestions };
    });
  };

  const validateForm = () => {
    if (!editedQuestionSet) return 'No question set data';

    if (isReadingPart2) {
      if (sentences.length < 3) return 'At least 3 sentences are required';
      if (sentences.some(s => !s.text.trim())) return 'All sentences must have text';
      if (!sentences.some(s => s.isExample)) return 'One sentence must be an example';
    } else if (isReadingPart3) {
      if (!editedQuestionSet.passages || editedQuestionSet.passages.some(p => !p.text.trim() && p.person !== 'D')) return 'All passages (except optional Person D) must have text';
      if (!editedQuestionSet.questions || editedQuestionSet.questions.length === 0) return 'At least one statement is required';
      if (editedQuestionSet.questions.some(q => !q.text.trim())) return 'All statements must have text';
      if (editedQuestionSet.questions.some(q => !q.correctPerson)) return 'Each statement must be matched to a person';
    } else if (isReadingPart4) {
      if (!editedQuestionSet.passageText?.trim()) return 'Passage text is required';
      if (!editedQuestionSet.questions || editedQuestionSet.questions.length === 0) return 'At least one section is required';
      if (editedQuestionSet.questions.some(q => !q.text?.trim())) return 'All sections must have text';
      if (editedQuestionSet.questions.some(q => !q.answer)) return 'Each section must have a matched heading';
      // Check if headings are available
      const headings = editedQuestionSet.headings || (editedQuestionSet.questions.length > 0 ? editedQuestionSet.questions[0].options : null);
      if (!headings) return 'Headings are required for Part 4';
    } else if (editedQuestionSet.part === 1 && editedQuestionSet.type === 'reading') {
      if (!editedQuestionSet.passageText?.trim()) return 'Passage text is required';
      for (let i = 0; i < editedQuestionSet.questions.length; i++) {
        if (!editedQuestionSet.passageText.includes(`[q${editedQuestionSet.id}-${i}]`)) {
          return `Passage must include placeholder for Gap ${i + 1}`;
        }
      }
    } else {
      for (let qIndex = 0; qIndex < editedQuestionSet.questions.length; qIndex++) {
        const q = editedQuestionSet.questions[qIndex];
        if (!q.text.trim()) return `Question ${qIndex + 1} text is required`;
        
        if (Array.isArray(q.options)) {
          if (q.options.some((opt: QuestionOption) => !opt.text.trim())) return `All options in Question ${qIndex + 1} are required`;
          if (!q.options.some((opt: QuestionOption) => opt.isCorrect)) return `A correct answer for Question ${qIndex + 1} is required`;
        } else {
          // Handle object-style options (A, B, C, D)
          const optionValues = Object.values(q.options);
          if (optionValues.some((text: string) => !text.trim())) return `All options in Question ${qIndex + 1} are required`;
          if (!q.answer) return `A correct answer for Question ${qIndex + 1} is required`;
        }
      }
    }
    return null;
  };

  const handleSave = () => {
    const error = validateForm();
    if (error) {
      toast({ title: "Validation Error", description: error, variant: "destructive" });
      return;
    }

    if (editedQuestionSet) {
      const updatedSet = { ...editedQuestionSet };

      if (isReadingPart1) {
        updatedSet.passageText = passageText;
      } else if (isReadingPart2) {
        updatedSet.passageText = JSON.stringify(sentences);
        updatedSet.questions = [];
      } else if (isReadingPart3) {
        // Passages and questions are already in the correct state
        updatedSet.passageText = ''; // Clear this as it's not used for Part 3
      } else if (isReadingPart4) {
        // For Part 4, passageText and questions structure are maintained as-is
        // No special transformation needed
      }

      onUpdateQuestionSet({ ...updatedSet, updatedAt: new Date().toISOString() });
      toast({ title: "Success", description: "Question set updated successfully" });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl font-bold">
              {isEditable ? 'Edit Question Set' : 'View Question Set'}
            </DialogTitle>
            <Badge className={questionSet.isPublic ? "bg-green-600" : "bg-gray-600"}>
              {questionSet.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
          <div className="text-sm text-gray-500 flex justify-between mt-2">
            <span>Part {questionSet.part} • {isReadingPart2 ? `${sentences.length} sentences` : isReadingPart3 ? `${editedQuestionSet.questions.length} statements` : isReadingPart4 ? `${editedQuestionSet.questions.length} sections` : `${questionSet.questions.length} questions`}</span>
            <span>By {questionSet.authorName}</span>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="title">Title</Label>
            {isEditable ? (
              <Input id="title" value={editedQuestionSet.title} onChange={(e) => setEditedQuestionSet({ ...editedQuestionSet, title: e.target.value })} />
            ) : (
              <p className="mt-1 text-lg font-medium">{editedQuestionSet.title}</p>
            )}
          </div>

          {isReadingPart1 ? (
            <div className="space-y-4">
              {/* Passage Section - Email Style */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Passage</h3>
                  {!editingPassage && isEditable && (
                    <Button size="sm" variant="outline" onClick={handleStartEditingPassage}>
                      Edit Passage
                    </Button>
                  )}
                </div>
                {editingPassage ? (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <textarea
                      className="w-full min-h-[200px] p-2 border rounded-md text-sm"
                      value={passageText}
                      onChange={(e) => setPassageText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={handleCancelEditingPassage}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSavePassage}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="email-container bg-white border border-gray-200 rounded-md p-5 shadow-sm">
                      <div className="email-header border-b pb-3 mb-3">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-gray-700">Email Message</p>
                          </div>
                        </div>
                      </div>
                      <div className="email-body">
                        {editedQuestionSet.passageText ? (
                          <div>
                            {(() => {
                              // Email structure: greeting, main content, signature
                              const greetingMatch = editedQuestionSet.passageText.match(/^(Hey|Hi|Hello|Dear)\s+[^,]+,/);
                              let greeting = '';
                              let content = editedQuestionSet.passageText;
                              if (greetingMatch) {
                                greeting = greetingMatch[0];
                                content = content.substring(greeting.length).trim();
                              }
                              let mainContent = content;
                              let signature = '';
                              // Signature: e.g., 'Love,\nHelen' or similar
                              const signatureMatch = content.match(/(Love|Regards|Best|Sincerely|Yours),\s*[\w\s]+$/i);
                              if (signatureMatch) {
                                const signatureStart = content.lastIndexOf(signatureMatch[0]);
                                mainContent = content.substring(0, signatureStart).trim();
                                signature = content.substring(signatureStart).trim();
                              }
                              // Render mainContent with dropdowns
                              const gapRegex = /\[(\d+)\]/g;
                              let lastIndex = 0;
                              let match;
                              const elements: React.ReactNode[] = [];
                              let gapCount = 0;
                              while ((match = gapRegex.exec(mainContent)) !== null) {
                                const start = match.index;
                                const end = gapRegex.lastIndex;
                                elements.push(
                                  <span key={`text-${gapCount}`}>{mainContent.slice(lastIndex, start)}</span>
                                );
                                const gapIdx = parseInt(match[1], 10) - 1;
                                const question = editedQuestionSet.questions[gapIdx];
                                elements.push(
                                  <select
                                    key={`gap-${gapCount}`}
                                    className="mx-1 px-2 py-1 border border-yellow-300 rounded bg-yellow-100 text-sm font-medium min-w-[80px]"
                                    value={question?.answer || ''}
                                    disabled={!isEditable}
                                  >
                                    <option value="" disabled className="text-gray-400">Select...</option>
                                    {question && Object.entries(question.options || {}).map(([key, value]) => (
                                      <option key={key} value={key} className="text-gray-900">
                                        {String(value)}
                                      </option>
                                    ))}
                                  </select>
                                );
                                lastIndex = end;
                                gapCount++;
                              }
                              if (lastIndex < mainContent.length) {
                                elements.push(
                                  <span key="text-final">{mainContent.slice(lastIndex)}</span>
                                );
                              }
                              return (
                                <>
                                  {greeting && <p className="mb-2 font-semibold">{greeting}</p>}
                                  <p className="text-sm whitespace-pre-wrap leading-relaxed mb-4">{elements}</p>
                                  {signature && (
                                    <div className="mt-4">
                                      {signature.split(/\n|\r/).map((line, idx) => (
                                        <p key={idx} className={idx === 0 ? 'font-semibold' : ''}>{line}</p>
                                      ))}
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No passage available</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : isReadingPart2 ? (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Sentences in Correct Order</h3>
                {!editingMode && isEditable && (
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleP2StartEditing}
                      className="flex items-center gap-1"
                    >
                      <span className="h-4 w-4">✏️</span> Edit Sentences
                    </Button>
                  </div>
                )}
              </div>
              
              {editingMode ? (
                <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                  <h4 className="font-medium">Edit Sentences</h4>
                  <div className="space-y-3">
                    {editingP2Data.map((sentence: any, index: number) => (
                      <div key={sentence.id || index} className="flex gap-3 items-center">
                        <div className="flex-none w-8">
                          <span className="font-bold text-gray-500">{index + 1}</span>
                        </div>
                        <Input
                          value={sentence.text}
                          onChange={(e) => handleP2SentenceChange(index, e.target.value)}
                          className="flex-grow"
                        />
                        <div className="flex-none flex gap-1">
                          {index > 0 && !sentence.isExample && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleP2MoveSentence(index, 'up')}
                            >
                              ↑
                            </Button>
                          )}
                          {index < editingP2Data.length - 1 && !sentence.isExample && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleP2MoveSentence(index, 'down')}
                            >
                              ↓
                            </Button>
                          )}
                          <div className="w-6">
                            {sentence.isExample && <Badge variant="default">Ex</Badge>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleP2CancelEditing}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Discard Edits
                    </Button>
                    <Button
                      type="button"
                      onClick={handleP2SaveChanges}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Apply Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {(editedQuestionSet.questions[0]?.sentences || []).map((sentence: any, index: number) => (
                    <div 
                      key={sentence.id || index} 
                      className={`p-3 border rounded-md flex items-center gap-3 ${sentence.isExample ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
                    >
                      <span className="font-bold text-gray-500">{index + 1}</span>
                      <p>{sentence.text}</p>
                      {sentence.isExample && <Badge variant="default">Example</Badge>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : isReadingPart3 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Passages</h3>
                <div className="space-y-4">
                  {(editedQuestionSet.passages || []).map((passage: any, index: number) => (
                    <div key={passage.id || index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-gray-600">Person {passage.person || passage.id || (index + 1)}</p>
                        {isEditable && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleP3StartEditingPassage(index)}
                            className="h-8 px-2"
                          >
                            ✏️
                          </Button>
                        )}
                      </div>
                      
                      {editingP3Passage === index ? (
                        <div className="space-y-3">
                          <textarea
                            rows={4}
                            value={editingP3PassageText}
                            onChange={(e) => setEditingP3PassageText(e.target.value)}
                            className="w-full p-2 text-sm border rounded"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingP3Passage(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleP3SavePassage}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{passage.text || passage.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Questions</h3>
                <div className="space-y-4">
                  {(editedQuestionSet.questions || []).map((q: any, qIndex: number) => {
                    const correctPerson = q.correctPerson || q.answer;
                    return (
                      <div key={q.id || qIndex} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold mb-3">{qIndex + 1}. {q.text}</p>
                          {isEditable && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleP3StartEditingQuestion(qIndex)}
                              className="h-8 px-2 -mt-1"
                            >
                              ✏️
                            </Button>
                          )}
                        </div>
                        
                        {editingP3Question === qIndex ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Question Text</label>
                              <Input
                                value={editingP3QuestionData?.text || ''}
                                onChange={(e) => setEditingP3QuestionData({
                                  ...editingP3QuestionData,
                                  text: e.target.value
                                })}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Correct Person</label>
                              <select
                                value={editingP3QuestionData?.answer || ''}
                                onChange={(e) => setEditingP3QuestionData({
                                  ...editingP3QuestionData,
                                  answer: e.target.value
                                })}
                                className="w-full p-2 border rounded"
                              >
                                {(editedQuestionSet.passages || []).map((p: any, i: number) => (
                                  <option key={i} value={p.person || p.id || (i + 1)}>
                                    Person {p.person || p.id || (i + 1)}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingP3Question(null);
                                  setEditingP3QuestionData(null);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={handleP3SaveQuestion}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <span className="font-semibold text-green-700">Answer: </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Person {correctPerson}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : isReadingPart4 ? (
            <div className="space-y-6">
              {/* Passage Title Section */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-bold text-gray-900">Passage Title</h2>
                  {isEditable && (
                    <Button 
                      onClick={handleP4StartEditingTitle}
                      variant="outline"
                      size="sm"
                    >
                      ✏️ Edit Title
                    </Button>
                  )}
                </div>
                
                {editingP4Title ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingP4TitleText}
                      onChange={(e) => setEditingP4TitleText(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Enter passage title..."
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        onClick={() => setEditingP4Title(false)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleP4SaveTitle}
                        size="sm"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-lg font-medium text-gray-800">
                    {editedQuestionSet.title || 'No title provided'}
                  </p>
                )}
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-3 border-b">
                  <h3 className="text-lg font-semibold mb-3">Match the headings to the paragraphs</h3>
                  <p className="text-sm text-gray-500 mb-4">There is one heading that you will not use.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                  {/* Left column: Sections with individual edit buttons */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Sections:</h4>
                    
                    {/* Display sections with individual edit functionality */}
                    {editedQuestionSet.questions.map((question: any, index: number) => {
                      const sectionText = question.text || '';
                      const matchedHeading = question.options && question.answer ? question.options[question.answer] : '';
                      
                      return (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                          {editingP4Section === index ? (
                            // Edit mode for this section
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Section Text</label>
                                <textarea
                                  rows={4}
                                  value={editingP4SectionText}
                                  onChange={(e) => setEditingP4SectionText(e.target.value)}
                                  className="w-full p-2 border rounded"
                                  placeholder="Enter section content..."
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-1">Matched Heading</label>
                                <select
                                  value={editingP4SectionAnswer}
                                  onChange={(e) => setEditingP4SectionAnswer(e.target.value)}
                                  className="w-full p-2 border rounded"
                                >
                                  <option value="">Select heading...</option>
                                  {(() => {
                                    const headings = editedQuestionSet.headings || 
                                                   (editedQuestionSet.questions.length > 0 ? editedQuestionSet.questions[0].options : null);
                                    
                                    if (headings) {
                                      return Object.entries(headings).map(([key, heading]: [string, any]) => (
                                        <option key={key} value={key}>
                                          {key.replace('Heading', '')}: {heading}
                                        </option>
                                      ));
                                    }
                                    return null;
                                  })()}
                                </select>
                              </div>
                              
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  onClick={handleP4CancelEditingSection}
                                  variant="outline"
                                  size="sm"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={handleP4SaveSection}
                                  size="sm"
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // View mode for this section
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <h5 className="font-semibold text-gray-700">
                                  Section {question.sectionNumber !== undefined ? question.sectionNumber : index}
                                  {question.isExample && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Example</span>}
                                </h5>
                                <div className="flex items-center gap-2">
                                  {matchedHeading && (
                                    <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                      {question.answer}: {matchedHeading}
                                    </div>
                                  )}
                                  {isEditable && (
                                    <Button 
                                      onClick={() => handleP4StartEditingSection(index)}
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-2"
                                    >
                                      ✏️
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm leading-relaxed">
                                {sectionText.replace(/^Section \d+:\s*/, '')}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Fallback if no sections available */}
                    {(!editedQuestionSet.questions || editedQuestionSet.questions.length === 0) && (
                      <div className="text-sm text-gray-500 italic">
                        No sections available
                      </div>
                    )}
                  </div>

                  {/* Right column: Headings */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Available Headings:</h4>
                    <div className="space-y-2">
                      {/* Use headings field if available, otherwise fall back to first question's options */}
                      {(() => {
                        const headings = editedQuestionSet.headings || 
                                       (editedQuestionSet.questions.length > 0 ? editedQuestionSet.questions[0].options : null);
                        
                        if (headings) {
                          return Object.entries(headings).map(([key, heading]: [string, any]) => (
                            <div key={key} className="p-2 border rounded bg-gray-50">
                              <span className="font-medium text-sm">{key.replace('Heading', '')}.</span> {heading}
                            </div>
                          ));
                        } else {
                          return <p className="text-gray-500 text-sm">No headings available</p>;
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <SentenceOrderingEditor sentences={sentences} onChange={handleSentencesChange} readOnly={!isEditable} />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{isEditable ? 'Cancel' : 'Close'}</Button>
          {isEditable && <Button onClick={handleSave} className="bg-[#152C61] hover:bg-[#0f1f45]">Save Changes</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
