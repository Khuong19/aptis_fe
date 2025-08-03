'use client';

import { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  Input,
  Label,
  Select,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge
} from '@/app/components/ui/basic';
import { Check, ChevronRight, Plus, Search, Shuffle, X } from 'lucide-react';
import { QuestionSet } from '@/app/types/question-bank';
import { QuestionBankService } from '@/app/lib/api/questionBankService';
import { TestsService } from '@/app/lib/api/testsService';
import { showToast } from '@/app/components/ui/ToastContainer';

interface TestCreationFormProps {
  onSuccess: (testData: any) => void;
  initialData?: any;
  isEdit?: boolean;
}

export default function TestCreationForm({ onSuccess, initialData, isEdit }: TestCreationFormProps) {
  const [testTitle, setTestTitle] = useState(initialData?.title || '');
  const [testDescription, setTestDescription] = useState(initialData?.description || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'reading' | 'listening'>('all');
  const [partFilter, setPartFilter] = useState<'all' | '1' | '2' | '3' | '4'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'A2' | 'B1' | 'B2' | 'C1'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'official' | 'ai-generated' | 'manual'>('all');
  const [selectedSets, setSelectedSets] = useState<QuestionSet[]>(initialData?.questionSets || []);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [titleError, setTitleError] = useState('');
  // Thêm state cho thời gian làm bài (phút)
  const [durationMinutes, setDurationMinutes] = useState(
    initialData?.duration ? Math.floor(initialData.duration / 60) : 35
  );

  useEffect(() => {
    if (initialData) {
      setTestTitle(initialData.title || '');
      setTestDescription(initialData.description || '');
      setSelectedSets(initialData.questionSets || []);
      // Khi edit, hiển thị lại giá trị phút nếu có initialData.duration
      if (initialData.duration) {
        setDurationMinutes(Math.floor(initialData.duration / 60));
      }
    }
  }, [initialData]);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        setIsLoading(true);
        const data = await QuestionBankService.getAllQuestionSets();
        setQuestionSets(data);
      } catch (error) {
        console.error('Failed to load question sets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSets();
  }, []);
  
  const filteredQuestionSets = questionSets.filter(set => {
    if (searchQuery && !set.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (typeFilter !== 'all' && set.type !== typeFilter) {
      return false;
    }
    
    if (partFilter !== 'all' && set.part !== parseInt(partFilter)) {
      return false;
    }
    
    if (levelFilter !== 'all' && set.level !== levelFilter) {
      return false;
    }
    
    if (sourceFilter !== 'all' && set.source !== sourceFilter) {
      return false;
    }
    
    return true;
  });
  
  const handleAddSet = (set: QuestionSet) => {
    setSelectedSets(prev => [...prev, set]);
  };
  
  const handleRemoveSet = (id: string) => {
    setSelectedSets(prev => prev.filter(set => set.id !== id));
  };
  
  const handleAutoPick = () => {
    setSelectedSets([]);
    
    const setsByPart: { [key: string]: QuestionSet[] } = {};
    questionSets.forEach(set => {
      if (!setsByPart[set.part]) {
        setsByPart[set.part] = [];
      }
      setsByPart[set.part].push(set);
    });
    
    const newSelectedSets: QuestionSet[] = [];
    Object.keys(setsByPart).forEach(part => {
      const setsForPart = setsByPart[part];
      if (setsForPart.length > 0) {
        const randomIndex = Math.floor(Math.random() * setsForPart.length);
        newSelectedSets.push(setsForPart[randomIndex]);
      }
    });
    
    setSelectedSets(newSelectedSets);
  };
  
  const validateTitle = (title: string) => {
    if (!title.trim()) {
      setTitleError('Test title is required');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleCreateTest = async () => {
    console.log('handleCreateTest called');
    console.log('testTitle:', testTitle);
    console.log('selectedSets:', selectedSets);
    
    if (!validateTitle(testTitle) || selectedSets.length === 0) {
      if (selectedSets.length === 0) {
        showToast('Please select at least one question set', 'error');
      }
      return;
    }

    const payload = {
      title: testTitle,
      description: testDescription,
      questionSets: selectedSets,
      status: 'Draft' as const,
      duration: durationMinutes * 60,
    };
    
    console.log('About to call API with payload:', payload);

    try {
      if (isEdit && initialData?.id) {
        console.log('Updating existing test');
        const updated = await TestsService.updateTest(initialData.id, payload);
        showToast('Test updated successfully', 'success');
        onSuccess(updated);
      } else {
        console.log('Creating new test');
        const created = await TestsService.createTest(payload);
        console.log('Test created successfully:', created);
        showToast('Test created successfully', 'success');
        onSuccess(created);
      }
    } catch (error) {
      console.error(isEdit ? 'Error updating test:' : 'Error creating test:', error);
      showToast('Failed to save test', 'error');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Test details and selected sets */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
              <CardDescription>Enter the basic information for your test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testTitle">Test Title</Label>
                <Input
                  id="testTitle"
                  required
                  value={testTitle}
                  onChange={(e) => {
                    setTestTitle(e.target.value);
                    if (titleError) validateTitle(e.target.value);
                  }}
                  placeholder="Enter test title"
                  className={titleError ? 'border-red-500' : ''}
                />
                {titleError && <p className="text-red-500 text-xs mt-1">{titleError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="testDescription">Description (Optional)</Label>
                <Input
                  id="testDescription"
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                  placeholder="Enter test description"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="durationMinutes">Test duration (minutes)</Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  min={1}
                  max={180}
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(Number(e.target.value))}
                  required
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Selected Question Sets</CardTitle>
              <CardDescription>
                {selectedSets.length === 0 
                  ? 'No question sets selected yet' 
                  : `${selectedSets.length} sets selected (${selectedSets.reduce((total, set) => total + set.questions.length, 0)} questions total)`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSets.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-gray-500">Select question sets from the right panel</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedSets.map((set) => (
                    <div key={set.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                      <div>
                        <div className="font-medium">{set.title}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <Badge variant="outline">Part {set.part}</Badge>
                          <Badge variant="outline">{set.level}</Badge>
                          <span>•</span>
                          <span>{set.questions.length} questions</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveSet(set.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              onClick={() => {
                console.log('Create Test button clicked');
                handleCreateTest();
              }}
              disabled={selectedSets.length === 0 || !testTitle.trim() || titleError !== '' || durationMinutes < 1}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEdit ? 'Save Changes' : 'Create Test'}
            </Button>
          </div>
        </div>
        
        {/* Right side - Question bank browser */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Question Bank</CardTitle>
              <CardDescription>Select question sets to include in your test</CardDescription>
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAutoPick}
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  <Shuffle className="h-4 w-4" />
                  <span>Auto Pick</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and filters */}
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search question sets..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="typeFilter" className="text-xs">Type</Label>
                    <Select
                      value={typeFilter}
                      onValueChange={(value) => setTypeFilter(value as any)}
                    >
                      <option value="all">All Types</option>
                      <option value="reading">Reading</option>
                      <option value="listening">Listening</option>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="partFilter" className="text-xs">Part</Label>
                    <Select
                      value={partFilter}
                      onValueChange={(value) => setPartFilter(value as any)}
                    >
                      <option value="all">All Parts</option>
                      <option value="1">Part 1</option>
                      <option value="2">Part 2</option>
                      <option value="3">Part 3</option>
                      <option value="4">Part 4</option>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="levelFilter" className="text-xs">Level</Label>
                    <Select
                      value={levelFilter}
                      onValueChange={(value) => setLevelFilter(value as any)}
                    >
                      <option value="all">All Levels</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="C1">C1</option>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="sourceFilter" className="text-xs">Source</Label>
                    <Select
                      value={sourceFilter}
                      onValueChange={(value) => setSourceFilter(value as any)}
                    >
                      <option value="all">All Sources</option>
                      <option value="official">Official</option>
                      <option value="ai-generated">AI-Generated</option>
                      <option value="manual">Manual</option>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Question sets list */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading question sets...</p>
                  </div>
                ) : filteredQuestionSets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No question sets found</p>
                  </div>
                ) : (
                  filteredQuestionSets.map((set) => {
                    const isSelected = selectedSets.some(s => s.id === set.id);
                    return (
                      <div 
                        key={set.id} 
                        className={`p-3 border rounded-md transition-colors ${
                          isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{set.title}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                              <Badge variant="outline">Part {set.part}</Badge>
                              <Badge variant="outline">{set.level}</Badge>
                              
                              {/* Source badge */}
                              {set.source === 'official' ? (
                                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                  Official
                                </Badge>
                              ) : set.source === 'ai-generated' ? (
                                <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                                  AI-Generated
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                                  Manual
                                </Badge>
                              )}
                              
                              <span>•</span>
                              <span>{set.questions.length} questions</span>
                            </div>
                          </div>
                          
                          <Button
                            variant={isSelected ? "outline" : "default"}
                            size="sm"
                            onClick={() => isSelected ? handleRemoveSet(set.id) : handleAddSet(set)}
                            className={`h-8 transition-all ${isSelected 
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800' 
                              : 'bg-[#152C61] hover:bg-[#0f1f45]'}`}
                          >
                            {isSelected ? (
                              <span className="flex items-center whitespace-nowrap">
                                <Check className="h-4 w-4 mr-1" />
                                <span>Added</span>
                              </span>
                            ) : (
                              <span className="flex items-center whitespace-nowrap">
                                <Plus className="h-4 w-4 mr-1" />
                                <span>Add</span>
                              </span>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
