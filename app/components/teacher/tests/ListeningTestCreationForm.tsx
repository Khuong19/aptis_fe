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
import { Check, ChevronRight, Plus, Search, Shuffle, X, Headphones } from 'lucide-react';
import { QuestionSet } from '@/app/types/question-bank';
import { QuestionBankService } from '@/app/lib/api/questionBankService';
import { TestsService } from '@/app/lib/api/testsService';
import { showToast } from '@/app/components/ui/ToastContainer';

interface ListeningTestCreationFormProps {
  onSuccess: (testData: any) => void;
  initialData?: any;
  isEdit?: boolean;
}

export default function ListeningTestCreationForm({ onSuccess, initialData, isEdit }: ListeningTestCreationFormProps) {
  const [testTitle, setTestTitle] = useState(initialData?.title || '');
  const [testDescription, setTestDescription] = useState(initialData?.description || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [partFilter, setPartFilter] = useState<'all' | '1' | '2' | '3' | '4'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'A2' | 'B1' | 'B2' | 'C1'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'official' | 'ai-generated' | 'manual'>('all');
  const [selectedSets, setSelectedSets] = useState<QuestionSet[]>(initialData?.questionSets || []);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [titleError, setTitleError] = useState('');
  // Duration for listening tests (typically 35-40 minutes)
  const [durationMinutes, setDurationMinutes] = useState(
    initialData?.duration ? Math.floor(initialData.duration / 60) : 35
  );

  useEffect(() => {
    if (initialData) {
      setTestTitle(initialData.title || '');
      setTestDescription(initialData.description || '');
      setSelectedSets(initialData.questionSets || []);
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
        // Filter only listening question sets
        const listeningQuestionSets = data.filter(set => set.type === 'listening');
        setQuestionSets(listeningQuestionSets);
      } catch (error) {
        console.error('Failed to load listening question sets:', error);
        showToast('Failed to load question sets', 'error');
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
    // For listening tests, try to get one set from each part (1-4)
    [1, 2, 3, 4].forEach(part => {
      const setsForPart = setsByPart[part.toString()];
      if (setsForPart && setsForPart.length > 0) {
        const randomIndex = Math.floor(Math.random() * setsForPart.length);
        newSelectedSets.push(setsForPart[randomIndex]);
      }
    });
    
    setSelectedSets(newSelectedSets);
    showToast(`Auto-selected ${newSelectedSets.length} listening question sets`, 'success');
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
    if (!validateTitle(testTitle) || selectedSets.length === 0) {
      if (selectedSets.length === 0) {
        showToast('Please select at least one listening question set', 'error');
      }
      return;
    }

    const payload = {
      title: testTitle,
      description: testDescription,
      questionSets: selectedSets,
      status: 'Draft' as const,
      duration: durationMinutes * 60,
      type: 'listening' as const,
    };

    try {
      if (isEdit && initialData?.id) {
        const updated = await TestsService.updateTest(initialData.id, payload);
        showToast('Listening test updated successfully', 'success');
        onSuccess(updated);
      } else {
        const created = await TestsService.createTest(payload);
        showToast('Listening test created successfully', 'success');
        onSuccess(created);
      }
    } catch (error) {
      console.error(isEdit ? 'Error updating test:' : 'Error creating test:', error);
      showToast('Failed to save listening test', 'error');
    }
  };

  const getTotalQuestions = () => {
    return selectedSets.reduce((total, set) => total + (set.questions?.length || 0), 0);
  };

  const getEstimatedDuration = () => {
    // Listening tests typically take more time due to audio playback
    const baseTime = selectedSets.length * 8; // 8 minutes per part on average
    const questionTime = getTotalQuestions() * 1.5; // 1.5 minutes per question
    return Math.ceil(baseTime + questionTime);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Headphones className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Listening Test' : 'Create New Listening Test'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Test details and selected sets */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
              <CardDescription>Enter the basic information for your listening test</CardDescription>
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
                  placeholder="Enter listening test title"
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
              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Test Duration (minutes)</Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  min={15}
                  max={180}
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(Number(e.target.value))}
                  required
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Recommended: {getEstimatedDuration()} minutes based on selected question sets
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Selected Question Sets</CardTitle>
              <CardDescription>
                {selectedSets.length === 0 
                  ? 'No listening question sets selected yet' 
                  : `${selectedSets.length} sets selected (${getTotalQuestions()} questions total)`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSets.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <Headphones className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Select listening question sets from the right panel</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedSets.map((set) => (
                    <div key={set.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <Headphones className="h-4 w-4 text-blue-600" />
                          {set.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <Badge variant="outline">Part {set.part}</Badge>
                          <Badge variant="outline">{set.level}</Badge>
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                            Listening
                          </Badge>
                          <span>•</span>
                          <span>{set.questions?.length || 0} questions</span>
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
              onClick={handleCreateTest}
              disabled={selectedSets.length === 0 || !testTitle.trim() || titleError !== '' || durationMinutes < 1}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Headphones className="h-4 w-4 mr-2" />
              {isEdit ? 'Save Changes' : 'Create Listening Test'}
            </Button>
          </div>
        </div>
        
        {/* Right side - Question bank browser */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Listening Question Bank</CardTitle>
              <CardDescription>Select listening question sets to include in your test</CardDescription>
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
                      placeholder="Search listening question sets..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
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
                      <option value="B2">B2</option>
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500">Loading listening question sets...</p>
                  </div>
                ) : filteredQuestionSets.length === 0 ? (
                  <div className="text-center py-8">
                    <Headphones className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No listening question sets found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
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
                            <div className="font-medium flex items-center gap-2">
                              <Headphones className="h-4 w-4 text-blue-600" />
                              {set.title}
                            </div>
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
                              <span>{set.questions?.length || 0} questions</span>
                            </div>
                          </div>
                          
                          <Button
                            variant={isSelected ? "outline" : "default"}
                            size="sm"
                            onClick={() => isSelected ? handleRemoveSet(set.id) : handleAddSet(set)}
                            className={`h-8 transition-all ${isSelected 
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800' 
                              : 'bg-blue-600 hover:bg-blue-700'}`}
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