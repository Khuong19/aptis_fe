'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  Button, 
  Label,
  Input,
  Card,
  CardContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/app/components/ui/basic';
import { Loader2, CheckCircle, AlertCircle, Upload, FileText } from 'lucide-react';
import { QuestionSet } from '@/app/types/question-bank';
import * as XLSX from 'xlsx';

// Import preview components
import ListeningPart1 from '../shared/ListeningPart1';
import ListeningPart2 from '../shared/ListeningPart2';
import ListeningPart3 from '../shared/ListeningPart3';
import ListeningPart4 from '../shared/ListeningPart4';

// Extend the QuestionSet type to include C1 level and passage field
type ExtendedQuestionSet = Omit<QuestionSet, 'level'> & {
  level: 'A2' | 'B1' | 'B2' | 'C1';
  passage?: string;
};

interface ListeningOfficialQuestionUploadFormProps {
  onSuccess: (newSets: QuestionSet[]) => void;
}

export default function ListeningOfficialQuestionUploadForm({ onSuccess }: ListeningOfficialQuestionUploadFormProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [part, setPart] = useState('1');
  
  // Determine level based on part
  const getLevel = (selectedPart: string): 'A2' | 'B1' | 'C1' => {
    switch (selectedPart) {
      case '1':
        return 'A2';
      case '2':
      case '3':
        return 'B1';
      case '4':
        return 'C1';
      default:
        return 'B1';
    }
  };
  const [file, setFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  
  // File input references
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Preview state
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [showAllQuestions, setShowAllQuestions] = useState<boolean>(false);
  
  // Current user state
  const [currentUser, setCurrentUser] = useState<{ id: string; fullName: string } | null>(null);

  // Fetch current user info on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';
        if (token) {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          const response = await fetch(`${API_URL}/auth/user`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setCurrentUser({
              id: data.user.id,
              fullName: data.user.fullName
            });
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
        setError('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleAudioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'mp3' && fileExtension !== 'wav' && fileExtension !== 'm4a') {
        setError('Please select a valid audio file (.mp3, .wav, or .m4a)');
        return;
      }
      
      // Create URL for preview
      const url = URL.createObjectURL(selectedFile);
      setAudioFile(selectedFile);
      setAudioUrl(url);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an Excel file first');
      return;
    }

    if (!audioFile) {
      setError('Please select an audio file (MP3, WAV, or M4A)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await readExcelFile(file);
      processExcelData(data);
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process the Excel file. Please check the format and try again.');
      setIsLoading(false);
    }
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Process Excel data based on the selected part
  const processExcelData = (data: any[]) => {
    if (!data || data.length === 0) {
      setError('The Excel file is empty.');
      setIsLoading(false);
      return;
    }
    
    try {
      // Convert header row to object keys
      const headers = data[0];
      const rows = data.slice(1);
      
      // Convert rows to objects with headers as keys
      const processedData = rows.map(row => {
        const obj: Record<string, any> = {};
        headers.forEach((header: string, index: number) => {
          if (header) {
            obj[header] = row[index];
          }
        });
        return obj;
      });
      
      // Process data based on part
      let processedQuestions: any[] = [];
      
      switch (part) {
        case '1':
          // Part 1: Listening comprehension
          processedQuestions = processListeningPart1(processedData);
          break;
        case '2':
          // Part 2: Sentence ordering
          processedQuestions = processListeningPart2(processedData);
          break;
        case '3':
          // Part 3: Matching
          processedQuestions = processListeningPart3(processedData);
          break;
        case '4':
          // Part 4: Multiple choice
          processedQuestions = processListeningPart4(processedData);
          break;
        default:
          setError(`Unsupported part: ${part}`);
          setIsLoading(false);
          return;
      }
      
      // Set preview data
      if (processedQuestions.length === 0) {
        setError('No valid questions found in the Excel file.');
        setIsLoading(false);
        return;
      }
      
      // Set preview data with proper structure
      const previewDataObj = {
        title,
        part: parseInt(part),
        level: getLevel(part),
        audioUrl: audioUrl, // Add audio URL for preview
        ...processedQuestions[0]
      };
      
      setPreviewData(previewDataObj);
      setActiveTab('preview');
      setIsLoading(false);
      
      setSuccess('File parsed successfully. Please review the questions before uploading.');
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      setError('Failed to parse the Excel file. Please check the format and try again.');
    }
  };

  // Process Listening Part 1 (Conversations with segments and questions)
  const processListeningPart1 = (data: any[]): any[] => {
    if (data.length === 0) return [];
    
    console.log('Processing Listening Part 1 data:', data);
    
    // Check if the data has the expected structure for conversations
    const firstRow = data[0];
    console.log('First row:', firstRow);
    
    // Required columns for Part 1: conversation_title, context, difficulty, speaker_1_text, speaker_2_text, question_text, options, answer
    const requiredColumns = [
      'conversation_title', 'context', 'difficulty', 'speaker_1_text', 'speaker_2_text', 
      'question_text', 'option_A', 'option_B', 'option_C', 'answer'
    ];
    
    const hasRequiredColumns = requiredColumns.every(col => 
      Object.keys(firstRow).some(key => key.toLowerCase() === col.toLowerCase())
    );
    
    if (!hasRequiredColumns) {
      setError('Invalid format for Listening Part 1. Expected columns: conversation_title, context, difficulty, speaker_1_text, speaker_2_text, question_text, option_A, option_B, option_C, answer');
      return [];
    }
    
    // Group data by conversation_title
    const conversationGroups: Record<string, any[]> = {};
    data.forEach(row => {
      const convId = row.conversation_title || row.Conversation_title;
      if (!conversationGroups[convId]) {
        conversationGroups[convId] = [];
      }
      conversationGroups[convId].push(row);
    });
    
    // Process conversations with segments and questions
    const conversations = Object.entries(conversationGroups).map(([convId, rows]) => {
      const firstRowOfConv = rows[0];
      
      // Create segments array from speaker texts
      const segments = [];
      if (firstRowOfConv.speaker_1_text || firstRowOfConv.Speaker_1_text) {
        segments.push({
          id: 'seg-1',
          text: firstRowOfConv.speaker_1_text || firstRowOfConv.Speaker_1_text || '',
          speaker: firstRowOfConv.speaker_1 || firstRowOfConv.Speaker_1 || 'Speaker 1',
          order: 1
        });
      }
      if (firstRowOfConv.speaker_2_text || firstRowOfConv.Speaker_2_text) {
        segments.push({
          id: 'seg-2',
          text: firstRowOfConv.speaker_2_text || firstRowOfConv.Speaker_2_text || '',
          speaker: firstRowOfConv.speaker_2 || firstRowOfConv.Speaker_2 || 'Speaker 2',
          order: 2
        });
      }
      if (firstRowOfConv.speaker_3_text || firstRowOfConv.Speaker_3_text) {
        segments.push({
          id: 'seg-3',
          text: firstRowOfConv.speaker_3_text || firstRowOfConv.Speaker_3_text || '',
          speaker: firstRowOfConv.speaker_3 || firstRowOfConv.Speaker_3 || 'Speaker 3',
          order: 3
        });
      }
      if (firstRowOfConv.speaker_4_text || firstRowOfConv.Speaker_4_text) {
        segments.push({
          id: 'seg-4',
          text: firstRowOfConv.speaker_4_text || firstRowOfConv.Speaker_4_text || '',
          speaker: firstRowOfConv.speaker_4 || firstRowOfConv.Speaker_4 || 'Speaker 4',
          order: 4
        });
      }
      
      // Create question object
      const question = {
        id: firstRowOfConv.question_id || `q-${convId}`,
        text: firstRowOfConv.question_text || firstRowOfConv.Question_text || '',
        options: {
          A: firstRowOfConv.option_A || firstRowOfConv.Option_A || '',
          B: firstRowOfConv.option_B || firstRowOfConv.Option_B || '',
          C: firstRowOfConv.option_C || firstRowOfConv.Option_C || ''
        },
        answer: firstRowOfConv.answer || firstRowOfConv.Answer || ''
      };
      
      return {
        id: convId,
        title: firstRowOfConv.conversation_title || firstRowOfConv.Conversation_title || `Conversation ${convId}`,
        context: firstRowOfConv.context || firstRowOfConv.Context || '',
        difficulty: firstRowOfConv.difficulty || firstRowOfConv.Difficulty || 'A2+',
        segments,
        question,
        audioUrl: firstRowOfConv.conversation_audioUrl || firstRowOfConv.Conversation_audioUrl || firstRowOfConv.audio_url || ''
      };
    });
    
    const result = [{
      conversations
    }];
    
    console.log('Listening Part 1 processing result:', result);
    return result;
  };

  // Process Listening Part 2 (Monologue with 4 people matching format)
  const processListeningPart2 = (data: any[]): any[] => {
    if (data.length === 0) return [];
    
    console.log('Processing Listening Part 2 data:', data);
    
    // Check for required columns for monologue
    const firstRow = data[0];
    const requiredColumns = [
      'topic', 'person_1_text', 'person_2_text', 'person_3_text', 'person_4_text', 
      'option_A', 'option_B', 'option_C', 'option_D', 'option_E', 'option_F', 
      'person_1_answer', 'person_2_answer', 'person_3_answer', 'person_4_answer'
    ];
    
    const hasRequiredColumns = requiredColumns.every(col => 
      Object.keys(firstRow).some(key => key.toLowerCase() === col.toLowerCase())
    );
    
    if (!hasRequiredColumns) {
      setError('Invalid format for Listening Part 2. Expected columns: topic, person_1_text, person_2_text, person_3_text, person_4_text, option_A, option_B, option_C, option_D, option_E, option_F, person_1_answer, person_2_answer, person_3_answer, person_4_answer');
      return [];
    }
    
    // Extract monologue data from first row
    const monologue = {
      id: firstRow.id || `monologue-1`,
      title: `Listening Part 2 - ${firstRow.topic || firstRow.Topic || 'Topic'}`,
      topic: firstRow.topic || firstRow.Topic || '',
      introduction: `Four people are discussing their views on ${firstRow.topic || firstRow.Topic || 'the topic'}. Complete the sentences. Use each answer only once. You will not need two of the reasons.`,
      options: [
        firstRow.option_A || firstRow.Option_A || '',
        firstRow.option_B || firstRow.Option_B || '',
        firstRow.option_C || firstRow.Option_C || '',
        firstRow.option_D || firstRow.Option_D || '',
        firstRow.option_E || firstRow.Option_E || '',
        firstRow.option_F || firstRow.Option_F || ''
      ],
      segments: [
        {
          id: 'seg-1',
          text: firstRow.person_1_text || firstRow.Person_1_text || '',
          speaker: 'Person 1',
          order: 1
        },
        {
          id: 'seg-2',
          text: firstRow.person_2_text || firstRow.Person_2_text || '',
          speaker: 'Person 2',
          order: 2
        },
        {
          id: 'seg-3',
          text: firstRow.person_3_text || firstRow.Person_3_text || '',
          speaker: 'Person 3',
          order: 3
        },
        {
          id: 'seg-4',
          text: firstRow.person_4_text || firstRow.Person_4_text || '',
          speaker: 'Person 4',
          order: 4
        }
      ],
      audioUrl: firstRow.audioUrl || firstRow.AudioUrl || firstRow.audio_url || ''
    };
    
    // Process questions (matching format)
    const questions = [
      {
        id: 'q-1',
        text: 'Person 1',
        sentence: firstRow.person_1_sentence || firstRow.Person_1_sentence || firstRow.option_A || firstRow.Option_A || '',
        answer: firstRow.person_1_answer || firstRow.Person_1_answer || 'A',
        position: 1
      },
      {
        id: 'q-2',
        text: 'Person 2',
        sentence: firstRow.person_2_sentence || firstRow.Person_2_sentence || firstRow.option_B || firstRow.Option_B || '',
        answer: firstRow.person_2_answer || firstRow.Person_2_answer || 'B',
        position: 2
      },
      {
        id: 'q-3',
        text: 'Person 3',
        sentence: firstRow.person_3_sentence || firstRow.Person_3_sentence || firstRow.option_C || firstRow.Option_C || '',
        answer: firstRow.person_3_answer || firstRow.Person_3_answer || 'C',
        position: 3
      },
      {
        id: 'q-4',
        text: 'Person 4',
        sentence: firstRow.person_4_sentence || firstRow.Person_4_sentence || firstRow.option_D || firstRow.Option_D || '',
        answer: firstRow.person_4_answer || firstRow.Person_4_answer || 'D',
        position: 4
      }
    ];
    
    const result = [{
      monologue,
      questions
    }];
    
    console.log('Listening Part 2 processing result:', result);
    return result;
  };

  // Process Listening Part 3 (Discussion)
  const processListeningPart3 = (data: any[]): any[] => {
    if (data.length === 0) return [];
    
    console.log('Processing Listening Part 3 data:', data);
    
    // Check for required columns for discussion
    const firstRow = data[0];
    const requiredColumns = [
      'speaker_1_line_1', 'speaker_2_line_1', 'speaker_1_line_2', 'speaker_2_line_2',
      'question_1_text', 'question_1_answer', 'question_2_text', 'question_2_answer', 
      'question_3_text', 'question_3_answer', 'question_4_text', 'question_4_answer'
    ];
    
    const hasRequiredColumns = requiredColumns.every(col => 
      Object.keys(firstRow).some(key => key.toLowerCase() === col.toLowerCase())
    );
    
    if (!hasRequiredColumns) {
      setError('Invalid format for Listening Part 3. Expected columns: speaker_1_line_1, speaker_2_line_1, speaker_1_line_2, speaker_2_line_2, question_1_text, question_1_answer, question_2_text, question_2_answer, question_3_text, question_3_answer, question_4_text, question_4_answer');
      return [];
    }
    
    // Create discussion array from speaker lines
    const discussion = [];
    
    // Add speaker 1 line 1 (Man)
    if (firstRow.speaker_1_line_1 || firstRow.Speaker_1_line_1) {
      discussion.push({
        speaker: "Man",
        text: firstRow.speaker_1_line_1 || firstRow.Speaker_1_line_1 || ''
      });
    }
    
    // Add speaker 2 line 1 (Woman)
    if (firstRow.speaker_2_line_1 || firstRow.Speaker_2_line_1) {
      discussion.push({
        speaker: "Woman",
        text: firstRow.speaker_2_line_1 || firstRow.Speaker_2_line_1 || ''
      });
    }
    
    // Add speaker 1 line 2 (Man)
    if (firstRow.speaker_1_line_2 || firstRow.Speaker_1_line_2) {
      discussion.push({
        speaker: "Man",
        text: firstRow.speaker_1_line_2 || firstRow.Speaker_1_line_2 || ''
      });
    }
    
    // Add speaker 2 line 2 (Woman)
    if (firstRow.speaker_2_line_2 || firstRow.Speaker_2_line_2) {
      discussion.push({
        speaker: "Woman",
        text: firstRow.speaker_2_line_2 || firstRow.Speaker_2_line_2 || ''
      });
    }
    
    // Process questions
    const questions = [
      {
        id: 'q1',
        text: firstRow.question_1_text || firstRow.Question_1_text || '',
        options: {
          A: "Man",
          B: "Woman",
          C: "Both"
        },
        answer: firstRow.question_1_answer || firstRow.Question_1_answer || 'A',
        correctPerson: firstRow.question_1_correct_person || firstRow.Question_1_correct_person || 'man'
      },
      {
        id: 'q2',
        text: firstRow.question_2_text || firstRow.Question_2_text || '',
        options: {
          A: "Man",
          B: "Woman",
          C: "Both"
        },
        answer: firstRow.question_2_answer || firstRow.Question_2_answer || 'B',
        correctPerson: firstRow.question_2_correct_person || firstRow.Question_2_correct_person || 'woman'
      },
      {
        id: 'q3',
        text: firstRow.question_3_text || firstRow.Question_3_text || '',
        options: {
          A: "Man",
          B: "Woman",
          C: "Both"
        },
        answer: firstRow.question_3_answer || firstRow.Question_3_answer || 'A',
        correctPerson: firstRow.question_3_correct_person || firstRow.Question_3_correct_person || 'man'
      },
      {
        id: 'q4',
        text: firstRow.question_4_text || firstRow.Question_4_text || '',
        options: {
          A: "Man",
          B: "Woman",
          C: "Both"
        },
        answer: firstRow.question_4_answer || firstRow.Question_4_answer || 'B',
        correctPerson: firstRow.question_4_correct_person || firstRow.Question_4_correct_person || 'woman'
      }
    ];
    
    const result = [{
      discussion,
      questions
    }];
    
    console.log('Listening Part 3 processing result:', result);
    return result;
  };

  // Process Listening Part 4 (Lectures)
  const processListeningPart4 = (data: any[]): any[] => {
    if (data.length === 0) return [];
    
    console.log('Processing Listening Part 4 data:', data);
    
    // Check for required columns for lectures
    const firstRow = data[0];
    const requiredColumns = [
      'lecture_id', 'lecture_topic', 'speaker', 'audioText', 'question_id', 'questionText',
      'optionA', 'optionB', 'optionC', 'answer'
    ];
    
    const hasRequiredColumns = requiredColumns.every(col => 
      Object.keys(firstRow).some(key => key.toLowerCase() === col.toLowerCase())
    );
    
    if (!hasRequiredColumns) {
      setError('Invalid format for Listening Part 4. Expected columns: lecture_id, lecture_topic, speaker, audioText, question_id, questionText, optionA, optionB, optionC, answer');
      return [];
    }
    
    // Group data by lecture_id
    const lectureGroups: Record<string, any[]> = {};
    data.forEach(row => {
      const lectureId = row.lecture_id || row.Lecture_id;
      if (!lectureGroups[lectureId]) {
        lectureGroups[lectureId] = [];
      }
      lectureGroups[lectureId].push(row);
    });
    
    // Process lectures with questions
    const lectures = Object.entries(lectureGroups).map(([lectureId, rows]) => {
      const firstRowOfLecture = rows[0];
      
      // Process questions for this lecture
      const questions = rows.map((row, index) => {
        const options: Record<string, string> = {
          A: row.optionA || row.OptionA || '',
          B: row.optionB || row.OptionB || '',
          C: row.optionC || row.OptionC || ''
        };
        
        return {
          id: row.question_id || row.Question_id || `q-${index + 1}`,
          text: row.questionText || row.QuestionText || '',
          options,
          answer: row.answer || row.Answer || ''
        };
      });
      
      return {
        id: lectureId,
        topic: firstRowOfLecture.lecture_topic || firstRowOfLecture.Lecture_topic || '',
        speaker: firstRowOfLecture.speaker || firstRowOfLecture.Speaker || 'Lecturer',
        audioText: firstRowOfLecture.audioText || firstRowOfLecture.AudioText || '',
        questions
      };
    });
    
    const result = [{
      lectures
    }];
    
    console.log('Listening Part 4 processing result:', result);
    return result;
  };

  const handleUploadToServer = async () => {
    if (!previewData) {
      setError('No preview data available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Determine title: use passageTitle for Part 4, otherwise use form title
      const finalTitle = part === '4' && previewData.passageTitle 
        ? previewData.passageTitle 
        : title;

      // Prepare the question set data with required QuestionSet fields
      const questionSet: QuestionSet = {
        id: '', // Will be generated by backend
        authorId: currentUser?.id || '', 
        authorName: currentUser?.fullName || '', 
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: finalTitle,
        part: parseInt(part),
        level: getLevel(part),
        questions: previewData.questions || [], 
        type: 'listening', // Set to listening type
      };
      
      // Special handling for Part 3 (matching)
      if (part === '3' && previewData.passages) {
        questionSet.passages = previewData.passages;
      }
      
      // Special handling for Part 1 and Part 4 (listening comprehension)
      if ((part === '1' || part === '4') && previewData.passage) {
        // Handle both object format and string format for passage
        questionSet.passageText = typeof previewData.passage === 'object' && previewData.passage.text 
          ? previewData.passage.text 
          : previewData.passage;
      }

      // Upload audio file first if available
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';
      let audioUrl: string | null = null;
      if (audioFile) {
        try {
          const formData = new FormData();
          formData.append('audio', audioFile);
          
          const audioResponse = await fetch(`${API_URL}/upload-audio`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData,
          });
          
          if (audioResponse.ok) {
            const audioData = await audioResponse.json();
            audioUrl = audioData.audioUrl;
          }
        } catch (audioError) {
          console.error('Error uploading audio:', audioError);
          // Continue without audio if upload fails
        }
      }

      // --- BỔ SUNG AUDIO URL CHO PART 1-2-3 ---
      let questionsWithAudio = questionSet.questions;
      let monologueWithAudio = previewData.monologue;
      let conversationsWithAudio = previewData.conversations;
      let speakersWithAudio = previewData.speakers;
      // Part 1: conversations
      if (part === '1' && Array.isArray(previewData.conversations)) {
        conversationsWithAudio = previewData.conversations.map((conv: any, idx: number) => {
          if (!conv) return conv;
          if (audioUrl) {
            return { ...conv, audioUrl };
          }
          return conv;
        });
      }
      // Part 2: monologue
      if (part === '2' && previewData.monologue && audioUrl) {
        monologueWithAudio = { ...previewData.monologue, audioUrl };
      }
      // Part 3: speakers
      if (part === '3' && Array.isArray(previewData.speakers)) {
        speakersWithAudio = previewData.speakers.map((spk: any, idx: number) => {
          if (!spk) return spk;
          if (audioUrl) {
            return { ...spk, audioUrl };
          }
          return spk;
        });
      }
      // Part 4: lectures
      let lecturesWithAudio = previewData.lectures;
      if (part === '4' && Array.isArray(previewData.lectures)) {
        lecturesWithAudio = previewData.lectures.map((lecture: any, idx: number) => {
          if (!lecture) return lecture;
          if (audioUrl) {
            return { ...lecture, audioUrl };
          }
          return lecture;
        });
      }
      // --- END BỔ SUNG ---

      // Prepare data for API call
      const apiData = {
        title: finalTitle,
        description: `Official listening question set for Part ${part}`,
        type: 'listening',
        part: parseInt(part),
        level: questionSet.level || getLevel(part),
        questions: questionsWithAudio,
        conversations: conversationsWithAudio,
        monologue: monologueWithAudio,
        speakers: speakersWithAudio,
        lectures: lecturesWithAudio,
        ...(questionSet.passageText && { passageText: questionSet.passageText }),
        ...(part === '1' && questionSet.passageText && { passage: questionSet.passageText }),
        ...(questionSet.passages && { passages: questionSet.passages }),
        ...(part === '4' && previewData.passageTitle && { passageTitle: previewData.passageTitle }),
        ...(audioUrl && { audioUrl }),
        ...(audioUrl && { audioFiles: [audioUrl], totalAudioDuration: 45 }),
      };
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      let toastId: string | undefined;
      
      try {
        toastId = toast.loading('Uploading listening question set...');
        
        // Add audio URL to API data if available
        if (audioUrl) {
          apiData.audioFiles = [audioUrl];
          apiData.totalAudioDuration = 45; // Estimate duration
        }
        
        const response = await fetch(`${API_URL}/listening-question-bank`, {
          method: 'POST',
          headers,
          body: JSON.stringify(apiData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload question set');
        }

        const savedData = await response.json();
        
        toast.success('Listening question set uploaded successfully!', { id: toastId });
        
        // Call onSuccess callback with the data from new API structure
        onSuccess([savedData.data]);
        
        // Reset form
        setFile(null);
        setAudioFile(null);
        setAudioUrl(null);
        setTitle('');
        setPart('1');
        setPreviewData(null);
        setActiveTab('upload');
        setSuccess(null);
        
        // Reset file inputs
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (audioInputRef.current) {
          audioInputRef.current.value = '';
        }
        
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(error instanceof Error ? error.message : 'Upload failed', { id: toastId });
        setError(error instanceof Error ? error.message : 'Upload failed');
      }
      
    } catch (error) {
      console.error('Error preparing upload:', error);
      setError('Failed to prepare upload data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="upload">Upload Excel</TabsTrigger>
          <TabsTrigger value="preview" disabled={!previewData}>Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Question Set Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for the question set"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="part">Question Part</Label>
                  <Select value={part} onValueChange={setPart}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select part" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Part 1</SelectItem>
                      <SelectItem value="2">Part 2</SelectItem>
                      <SelectItem value="3">Part 3</SelectItem>
                      <SelectItem value="4">Part 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="file">Excel File</Label>
                  <div className="mt-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload an Excel file with the appropriate format for Listening Part {part}
                  </p>
                </div>

                <div>
                  <Label htmlFor="audio">Audio File</Label>
                  <div className="mt-1">
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept=".mp3,.wav,.m4a"
                      onChange={handleAudioFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload an audio file (MP3, WAV, or M4A) for the listening questions
                  </p>
                  {audioUrl && (
                    <div className="mt-2">
                      <audio controls className="w-full">
                        <source src={audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleUpload} 
                    disabled={!file || !audioFile || isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Process Files
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Success</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{success}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {previewData ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Preview Listening Questions</h3>
                <Button
                  onClick={handleUploadToServer}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload to Question Bank
                    </>
                  )}
                </Button>
              </div>

              {/* Render different components based on part */}
              {part === '1' && (
                <ListeningPart1 
                  previewData={previewData} 
                  onEdit={(updatedData) => setPreviewData(updatedData)}
                />
              )}
              {part === '2' && (
                <ListeningPart2 
                  previewData={previewData} 
                  onEdit={(updatedData) => setPreviewData(updatedData)}
                />
              )}
              {part === '3' && (
                <ListeningPart3 
                  previewData={previewData} 
                  onEdit={(updatedData) => setPreviewData(updatedData)}
                />
              )}
              {part === '4' && (
                <ListeningPart4 
                  previewData={previewData} 
                  onEdit={(updatedData) => setPreviewData(updatedData)}
                />
              )}
            </>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-md">
              <p className="text-gray-500">
                No preview data available. Please upload and process a file first.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 