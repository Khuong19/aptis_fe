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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/app/components/ui/basic';
import { Loader2, CheckCircle, AlertCircle, Upload, FileText } from 'lucide-react';
import { QuestionSet } from '@/app/types/question-bank';
import * as XLSX from 'xlsx';

// Import preview components
import ReadingPart1 from '../shared/ReadingPart1';
import ReadingPart2 from '../shared/ReadingPart2';
import ReadingPart3 from '../shared/ReadingPart3';
import ReadingPart4 from '../shared/ReadingPart4';

// Extend the QuestionSet type to include C1 level and passage field
type ExtendedQuestionSet = Omit<QuestionSet, 'level'> & {
  level: 'A2' | 'B1' | 'B2' | 'C1';
  passage?: string;
};

interface UploadQuestionSet {
    title: string;
    part: number;
    level: string;
    questions: any[];
    passages?: any[];
    passage?: any;
  }

interface OfficialQuestionUploadFormProps {
  onSuccess: (uploadedSets: QuestionSet[]) => void;
}

export default function OfficialQuestionUploadForm({ onSuccess }: OfficialQuestionUploadFormProps) {
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  
  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Helper function to add user info to questions
  const addUserInfoToQuestions = (questions: any[]): any[] => {
    if (!currentUser) return questions;
    
    return questions.map(question => ({
      ...question,
      user_id: currentUser.id,
      createdBy: currentUser.fullName
    }));
  };

  // Handle editing preview data
  const handleEditPreviewData = (updatedData: any) => {
    console.log('Editing preview data:', updatedData);
    setPreviewData({
      ...previewData,
      ...updatedData
    });
  };
  
  // Part 2 editing state
  const [editingPart2, setEditingPart2] = useState<boolean>(false);
  const [editingPart2Data, setEditingPart2Data] = useState<any[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if the file is an Excel or JSON file
      if (!selectedFile.name.endsWith('.xlsx') && 
          !selectedFile.name.endsWith('.xls') && 
          !selectedFile.name.endsWith('.json')) {
        setError('Please upload an Excel (.xlsx, .xls) or JSON file');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      
      // Auto-generate title from filename if not set
      if (!title) {
        const fileName = selectedFile.name.replace(/\.(xlsx|xls|json)$/, '');
        setTitle(fileName);
      }
    }
  };

  // Function to parse Excel file locally using FileReader and xlsx.js
  const parseExcelFile = (file: File) => {
    setIsLoading(true);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Process the data based on the selected part
        processExcelData(jsonData);
        
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        setError('Failed to parse Excel file. Please check the file format.');
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file. Please try again.');
      setIsLoading(false);
    };
    
    reader.readAsArrayBuffer(file);
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
          // Part 1: Reading comprehension
          processedQuestions = processReadingPart1(processedData);
          break;
        case '2':
          // Part 2: Sentence ordering
          processedQuestions = processReadingPart2(processedData);
          break;
        case '3':
          // Part 3: Matching
          processedQuestions = processReadingPart3(processedData);
          break;
        case '4':
          // Part 4: Multiple choice
          processedQuestions = processReadingPart4(processedData);
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
      
      // Special handling for Part 4
      if (part === '4') {
        console.log('Processed Reading Part 4 questions:', processedQuestions);
      }
      
      // Set preview data with proper structure
      const previewDataObj = {
        title,
        part: parseInt(part),
        level: getLevel(part),
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

  // Process Reading Part 1 (Reading comprehension)
  const processReadingPart1 = (data: any[]): any[] => {
    if (data.length === 0) return [];
    
    console.log('Processing Reading Part 1 data:', data);
    
    // Check if the data has the expected structure
    const firstRow = data[0];
    console.log('First row:', firstRow);
    
    // Support multiple column naming formats
    // Format 1: Passage, Question, OptionA, OptionB, OptionC, Answer
    // Format 2: passage, Question, A, B, C, answer
    // Format 3: Gap 1, A, B, C, answer, passage (for gap-filling exercises)
    
    // Check for column presence with case-insensitive matching
    const hasFormat1 = firstRow.Passage !== undefined && 
                      firstRow.Question !== undefined && 
                      firstRow.OptionA !== undefined;
    
    const hasFormat2 = firstRow.passage !== undefined && 
                      firstRow.Question !== undefined && 
                      firstRow.A !== undefined;
    
    const hasFormat3 = Object.keys(firstRow).some(key => key.toLowerCase().includes('gap')) && 
                      firstRow.A !== undefined && 
                      firstRow.B !== undefined && 
                      firstRow.answer !== undefined;
    
    console.log('Format detection:', { hasFormat1, hasFormat2, hasFormat3 });
    
    if (!hasFormat1 && !hasFormat2 && !hasFormat3) {
      setError('Invalid format for Reading Part 1. Expected columns like: Question, A/B/C, answer, passage OR Gap 1, A/B/C, answer, passage');
      return [];
    }
    
    // Extract passage based on format
    let passage = '';
    if (hasFormat1) {
      passage = firstRow.Passage || '';
    } else if (hasFormat2) {
      passage = firstRow.passage || '';
    } else if (hasFormat3) {
      // For gap-filling exercises, passage might be in a separate column
      passage = firstRow.passage || '';
    }
    
    console.log('Extracted passage:', passage);
    
    // Process questions based on format
    const questions = data.map((row, index) => {
      // Determine question text based on format
      let questionText = '';
      if (row.Question) {
        questionText = row.Question;
      } else if (Object.keys(row).some(key => key.toLowerCase().includes('gap'))) {
        // For gap-filling, use the gap label as the question
        const gapKey = Object.keys(row).find(key => key.toLowerCase().includes('gap'));
        questionText = gapKey || `Gap ${index + 1}`;
      }
      
      // Determine options based on format
      const options: Record<string, string> = {
        A: row.A || row.OptionA || '',
        B: row.B || row.OptionB || '',
        C: row.C || row.OptionC || ''
      };
      
      // Determine answer based on format
      const answer = row.answer || row.Answer || '';
      
      const question = {
        id: index + 1,
        text: questionText,
        options,
        answer,
        part: 1
      };
      
      console.log(`Created question ${index + 1}:`, question);
      return question;
    });
    
    const result = [{
      passage,
      questions
    }];
    
    console.log('Reading Part 1 processing result:', result);
    return result;
  };

  // Process Reading Part 2 (Sentence ordering)
  const processReadingPart2 = (data: any[]): any[] => {
    if (data.length === 0) return [];
    
    // Check for required columns with flexible casing
    const firstRow = data[0];
    const hasRequiredColumns = Object.keys(firstRow).some(key => 
      key.toLowerCase() === 'example' || 
      key.toLowerCase().startsWith('sentence')
    );
    
    if (!hasRequiredColumns) {
      setError('Invalid format for Reading Part 2. Expected columns: Example, Sentence1, Sentence2, etc.');
      return [];
    }
    
    // Extract sentences with flexible key casing
    const sentences: any[] = [];
    
    // Find all keys that match our pattern
    const sentenceKeys = Object.keys(firstRow)
      .filter(key => key.toLowerCase() === 'example' || key.toLowerCase().startsWith('sentence'))
      .sort((a, b) => {
        // Sort Example first, then by sentence number
        if (a.toLowerCase() === 'example') return -1;
        if (b.toLowerCase() === 'example') return 1;
        
        const numA = parseInt(a.toLowerCase().replace('sentence', '')) || 0;
        const numB = parseInt(b.toLowerCase().replace('sentence', '')) || 0;
        return numA - numB;
      });
    
    // Process each row
    data.forEach((row, rowIndex) => {
      sentenceKeys.forEach((key, keyIndex) => {
        const text = row[key];
        if (text) {
          sentences.push({
            id: `${rowIndex}-${keyIndex}`,
            text,
            isExample: key.toLowerCase() === 'example'
          });
        }
      });
    });
    
    // Return as a single question set with questions array
    return [{
      questions: [{ sentences }]
    }];
  };

  // Process Reading Part 3 (Matching)
  const processReadingPart3 = (data: any[]): any[] => {
    if (data.length === 0) return [];
    
    console.log('Processing Reading Part 3 data:', data);
    
    // Check for required columns with flexible casing
    const firstRow = data[0];
    console.log('First row:', firstRow);
    
    const personKeys = Object.keys(firstRow).filter(key => 
      key.toLowerCase().startsWith('person') || 
      key.toLowerCase().includes('person')
    );
    
    const questionKeys = Object.keys(firstRow).filter(key => 
      key.toLowerCase().startsWith('question') || 
      key.toLowerCase().includes('question')
    );
    
    const answerKeys = Object.keys(firstRow).filter(key => 
      key.toLowerCase().startsWith('answer') || 
      key.toLowerCase().includes('answer')
    );
    
    console.log('Found keys:', { personKeys, questionKeys, answerKeys });
    
    if (personKeys.length === 0 || questionKeys.length === 0 || answerKeys.length === 0) {
      setError('Invalid format for Reading Part 3. Expected columns: PersonA/B/C/D, Question1-7, Answer1-7');
      return [];
    }
    
    // Extract passages (persons)
    const passages = personKeys.map((key, index) => {
      // Find first non-empty text for this person
      const personText = data.find(row => row[key])?.[key] || '';
      const passage = {
        id: index + 1,
        person: key.replace(/[^A-D]/gi, ''), // Extract A, B, C, D from PersonA, etc.
        text: personText
      };
      console.log(`Creating passage ${index + 1} for person ${key}:`, passage);
      return passage;
    }).filter(p => p.text); // Filter out empty passages
    
    console.log('Extracted passages:', passages);
    
    // Extract questions and answers
    const questions = questionKeys.map((qKey, index) => {
      // Find corresponding answer key
      const answerKey = answerKeys.find(aKey => {
        const qNum = qKey.replace(/\D/g, '');
        const aNum = aKey.replace(/\D/g, '');
        return qNum === aNum;
      });
      
      if (!answerKey) {
        console.log(`No matching answer key found for question key ${qKey}`);
        return null;
      }
      
      // Find first non-empty question and answer
      const questionRow = data.find(row => row[qKey]);
      if (!questionRow) {
        console.log(`No row with non-empty question found for key ${qKey}`);
        return null;
      }
      
      const question = {
        id: index + 1,
        text: questionRow[qKey],
        correctPerson: questionRow[answerKey],
        answer: questionRow[answerKey], // Include both field names for compatibility
        part: 3
      };
      console.log(`Creating question ${index + 1} for key ${qKey}:`, question);
      return question;
    }).filter(Boolean); // Filter out null entries
    
    // Debug logging
    console.log('Part 3 Processing - Final result:', { passages, questions });
    
    return [{
      passages,
      questions
    }];
  };

  // Process Reading Part 4 (Matching Headings)
  const processReadingPart4 = (data: any[]): any[] => {
    if (data.length === 0) return [];
    
    console.log('Processing Reading Part 4 data:', data);
    
    // Check if the data has the expected structure for Matching Headings
    const firstRow = data[0];
    console.log('First row:', firstRow);
    
    // Check for required columns with case-insensitive matching
    const hasPassageTitle = Object.keys(firstRow).some(key => key.toLowerCase().includes('passagetitle'));
    const hasPassage = Object.keys(firstRow).some(key => key.toLowerCase() === 'passage');
    const hasSection = Object.keys(firstRow).some(key => key.toLowerCase() === 'section');
    const hasSectionText = Object.keys(firstRow).some(key => key.toLowerCase().includes('sectiontext'));
    const hasHeadings = Object.keys(firstRow).some(key => key.toLowerCase().startsWith('heading'));
    const hasAnswer = Object.keys(firstRow).some(key => key.toLowerCase() === 'answer');
    
    console.log('Column check:', { hasPassageTitle, hasPassage, hasSection, hasSectionText, hasHeadings, hasAnswer });
    
    if (!hasPassageTitle || !hasSection || !hasSectionText || !hasHeadings || !hasAnswer) {
      setError('Invalid format for Reading Part 4. Expected columns: PassageTitle, Passage, Section, SectionText, HeadingA-H, Answer');
      return [];
    }
    
    // Find column names with case-insensitive matching
    const passageTitleKey = Object.keys(firstRow).find(key => key.toLowerCase().includes('passagetitle')) || 'PassageTitle';
    const passageKey = Object.keys(firstRow).find(key => key.toLowerCase() === 'passage') || 'Passage';
    const sectionKey = Object.keys(firstRow).find(key => key.toLowerCase() === 'section') || 'Section';
    const sectionTextKey = Object.keys(firstRow).find(key => key.toLowerCase().includes('sectiontext')) || 'SectionText';
    const answerKey = Object.keys(firstRow).find(key => key.toLowerCase() === 'answer') || 'Answer';
    
    // Find all heading columns (HeadingA, HeadingB, etc.)
    const headingKeys = Object.keys(firstRow).filter(key => 
      key.toLowerCase().startsWith('heading')
    ).sort();
    
    console.log('Found keys:', { passageTitleKey, passageKey, sectionKey, sectionTextKey, answerKey, headingKeys });
    
    // Extract passage from the first row
    const passageTitle = firstRow[passageTitleKey] || '';
    const passageText = firstRow[passageKey] || '';
    
    // Extract headings from the first row
    const headings: Record<string, string> = {};
    headingKeys.forEach(key => {
      // Extract the letter from HeadingA, HeadingB, etc.
      const letter = key.replace(/[^A-Z]/gi, '');
      headings[letter] = firstRow[key] || '';
    });
    
    console.log('Extracted headings:', headings);
    
    // Process sections and create questions
    const questions = data
      .map((row, index) => {
        const sectionNumber = row[sectionKey];
        const sectionText = row[sectionTextKey] || '';
        const answer = row[answerKey] || '';
        
        // Create options object from headings
        const options: Record<string, string> = {};
        Object.keys(headings).forEach(letter => {
          options[letter] = headings[letter] || '';
        });
        
        // Check if this is an example row (Section 0)
        const isExample = sectionNumber === 0 || sectionNumber === '0';
        
        return {
          id: index + 1,
          text: `Section ${sectionNumber}: ${sectionText}`,
          options,
          answer,
          part: 4,
          sectionNumber,
          isExample // Add flag to identify example sections
        };
      });
    
    console.log('Processed questions:', questions);
    
    return [{
      passage: passageText,
      passageTitle: passageTitle,
      questions
    }];
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title for the question set.');
      return;
    }
    
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    
    // Parse Excel file locally
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      parseExcelFile(file);
    } else {
      setError('Unsupported file format. Please upload an Excel file (.xlsx, .xls).');
    }
  };

  // Handle final upload to server
  const handleUpload = async () => {
    if (!previewData) {
      setError('No preview data available. Please upload a file first.');
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
        type: 'reading', // Default to reading type
      };
      
      // Special handling for Part 3 (matching)
      if (part === '3' && previewData.passages) {
        questionSet.passages = previewData.passages;
      }
      
      // Special handling for Part 1 and Part 4 (reading comprehension)
      if ((part === '1' || part === '4') && previewData.passage) {
        // Handle both object format and string format for passage
        questionSet.passageText = typeof previewData.passage === 'object' && previewData.passage.text 
          ? previewData.passage.text 
          : previewData.passage;
      }

      // Prepare data for API call
      const apiData = {
        title: finalTitle,
        description: `Official question set for Reading Part ${part}`,
        type: 'reading',
        part: parseInt(part),
        level: questionSet.level || getLevel(part),
        questions: questionSet.questions,
        ...(questionSet.passageText && { passageText: questionSet.passageText }),
        // Include passage field for Reading Part 1 to ensure it's stored in the database
        ...(part === '1' && questionSet.passageText && { passage: questionSet.passageText }),
        ...(questionSet.passages && { passages: questionSet.passages }),
        ...(part === '4' && previewData.questions && previewData.questions.length > 0 && previewData.questions[0].options && { 
          headings: previewData.questions[0].options 
        }),
        // Include passageTitle for Part 4
        ...(part === '4' && previewData.passageTitle && { 
          passageTitle: previewData.passageTitle 
        }),
      };

      // Make API call to save official question
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      let toastId: string | undefined;
      try {
        toastId = toast.loading('Uploading to question bank...');
        const response = await fetch(`${API_URL}/official-questions`, {
          method: 'POST',
          headers,
          body: JSON.stringify(apiData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload question set to server');
        }

        const responseData = await response.json();
        console.log('Official question uploaded successfully:', responseData);
        
        // Call the onSuccess callback with the question set
        onSuccess([questionSet]);
        
        setSuccess('Question set uploaded successfully!');
        toast.success('Upload to question bank successful!', { id: toastId });
        
        // Reset form after successful upload
        setTitle('');
        setFile(null);
        setPreviewData(null);
        setActiveTab('upload');
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
      } catch (error) {
        console.error('Error uploading question set:', error);
        setError('Failed to upload the question set. Please try again.');
        if (toastId) toast.error('Upload to question bank failed!', { id: toastId });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error uploading question set:', error);
      setError('Failed to upload the question set. Please try again.');
    }
  };

  // Removed duplicate declaration of handleEditPreviewData

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          {previewData && <TabsTrigger value="preview">Preview</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a title for the question set"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="part">Reading Part</Label>
                  <Select
                    id="part"
                    value={part}
                    onChange={(e) => setPart(e.target.value)}
                  >
                    <option value="1">Part 1 (A2)</option>
                    <option value="2">Part 2 (B1)</option>
                    <option value="3">Part 3 (B1)</option>
                    <option value="4">Part 4 (C1)</option>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">Upload Excel File</Label>
                  <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                    <input
                      type="file"
                      id="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".xlsx,.xls,.json"
                    />
                    
                    {file ? (
                      <div className="flex items-center justify-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Drag and drop your file here, or{' '}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            browse
                          </button>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Supported formats: .xlsx, .xls
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{success}</p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading || !file}
                    className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Parse File
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          {previewData && (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-bold">{previewData.title || title}</h2>
                      <p className="text-sm text-gray-500">
                        Reading Part {previewData.part || part} ({getLevel(part.toString())})
                      </p>
                    </div>
                    
                    <Button onClick={handleUpload} disabled={isLoading} className="disabled:opacity-50 disabled:cursor-not-allowed">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Upload to Question Bank'
                      )}
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Reading Part 1 Preview */}
                    {part === '1' && previewData && (
                      <ReadingPart1 
                        previewData={previewData} 
                        onEdit={handleEditPreviewData} 
                      />
                    )}
                    
                    {/* Reading Part 2 Preview */}
                    {part === '2' && previewData && (
                      <ReadingPart2 
                        previewData={previewData} 
                        onEdit={handleEditPreviewData} 
                      />
                    )}
                    
                    {/* Reading Part 3 Preview */}
                    {part === '3' && previewData && (
                      <ReadingPart3 
                        previewData={previewData} 
                        onEdit={handleEditPreviewData} 
                      />
                    )}
                    
                    {/* Reading Part 4 Preview */}
                    {part === '4' && previewData && (
                      <ReadingPart4 
                        previewData={previewData} 
                        onEdit={handleEditPreviewData} 
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
