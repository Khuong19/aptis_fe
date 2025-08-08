'use client';

import { useState, useEffect } from 'react';

// Import shared types
import { QuestionSet, Comment } from '@/app/types/question-bank';
import { QuestionBankService } from '@/app/lib/api/questionBankService';
import { useAuthContext } from '@/app/lib/contexts/AuthContext';

// Import components
import QuestionBankHeader from '../components/QuestionBankHeader';
import QuestionBankFilters from '../components/QuestionBankFilters';
import QuestionSetCard from '../components/QuestionSetCard';
import EmptyQuestionBankState from '../components/EmptyQuestionBankState';
import QuestionBankModals from '../components/QuestionBankModals';

export default function EnhancedQuestionBankManager() {
  const { user } = useAuthContext();
  // State for tabs
  const [activeTab, setActiveTab] = useState<'ai' | 'excel' | 'manual' | 'my-sets'>('ai');
  
  // State for modals
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState<boolean>(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
  
  // State for current selections
  const [viewingQuestionSet, setViewingQuestionSet] = useState<QuestionSet | null>(null);
  const [currentQuestionSet, setCurrentQuestionSet] = useState<QuestionSet | null>(null);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<QuestionSet | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'ai-generated' | 'official'>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'my' | 'public'>('all');
  const [partFilter, setPartFilter] = useState<'all' | '1' | '2' | '3' | '4'>('all');
  const [accessFilter, setAccessFilter] = useState<'all' | 'public' | 'private'>('all');
  
  // Data state
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Loading and error state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  


  // Fetch question sets from API
  useEffect(() => {
    const fetchQuestionSets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Use filtered method to only get reading questions
        const fetchedQuestionSets = await QuestionBankService.getQuestionSetsWithFilter({ 
          type: 'reading' 
        });
        setQuestionSets(fetchedQuestionSets);
        
      } catch (err) {
        
        setError('Cannot fetch question sets');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionSets();
  }, []);



  // Filter question sets with all filters
  // Note: All questionSets are already filtered to be reading type from API call
  const filteredQuestionSets = questionSets.filter(qs => {
    // Text search filter
    const matchesSearch = searchTerm === '' || 
      qs.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter (now filtering by source: ai-generated/official)
    const matchesType = typeFilter === 'all' || 
      qs.source === typeFilter;
    
    // Visibility filter (all/my/public)
    const matchesVisibility = 
      visibilityFilter === 'all' ||
      (visibilityFilter === 'my' && user?.id && qs.authorId === user.id) ||
      (visibilityFilter === 'public' && qs.isPublic && (!user?.id || qs.authorId !== user.id));
    
    // Part filter (if applicable)
    const matchesPart = partFilter === 'all' || 
      qs.part?.toString() === partFilter;
    
    // Access filter (public/private)
    const matchesAccess = accessFilter === 'all' || 
      (accessFilter === 'public' && qs.isPublic) ||
      (accessFilter === 'private' && !qs.isPublic);
    
    return matchesSearch && matchesType && matchesVisibility && matchesPart && matchesAccess;
  });
  
  // Handlers for question set operations
  const handleCreateQuestionSet = async (newSet: QuestionSet) => {
    try {
      setError(null);
      const createdSet = await QuestionBankService.createQuestionSet(newSet);
      setQuestionSets(prev => [...prev, createdSet]);
      setIsNewModalOpen(false);
    } catch (err) {
      setError('Cannot create question set');
    }
  };
  
  const handleViewQuestionSet = (set: QuestionSet) => {
    setViewingQuestionSet(set);
    setIsViewModalOpen(true);
  };
  
  const handleEditQuestionSet = (set: QuestionSet) => {
    setCurrentQuestionSet(set);
    setEditMode(true);
    setIsViewEditModalOpen(true);
  };
  
  const handleSaveQuestionSet = async (updatedSet: QuestionSet) => {
    try {
      setError(null);
      
      // Call API to update in database
      const savedSet = await QuestionBankService.updateQuestionSet(updatedSet.id, updatedSet);
      
      // Update local state with saved data
      setQuestionSets(prev => 
        prev.map(qs => qs.id === updatedSet.id ? savedSet : qs)
      );
      
      setIsViewEditModalOpen(false);
      setEditMode(false);
    } catch (err) {
      console.error('Error saving question set:', err);
      setError('Cannot save question set. Please try again.');
      // Don't close modal on error so user can retry
    }
  };
  
  const handleDeleteQuestionSet = async (setId: string, source?: string) => {
    try {
      setError(null);
      await QuestionBankService.deleteQuestionSet(setId, source);
      setQuestionSets(prev => prev.filter(qs => qs.id !== setId));
    } catch (err) {
      setError('Cannot delete question set');
    }
  };
  
  const handleOpenComments = (set: QuestionSet) => {
    setSelectedQuestionSet(set);
    setIsCommentModalOpen(true);
  };
  
  // Internal handler for adding comments
  const handleAddComment = (comment: Comment) => {
    setComments(prev => [...prev, comment]);
    // Optionally close the comment modal
    // setIsCommentModalOpen(false);
  };
  
  // Adapter function to match CommentModal's expected prop signature
  const handleAddCommentFromModal = (questionSetId: string, text: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      questionSetId,
      authorId: user?.id || 'unknown',
      authorName: (user as any)?.fullName || 'Unknown',
      text,
      createdAt: new Date().toISOString()
    };
    handleAddComment(newComment);
  };


  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with title and new question set button */}
      <QuestionBankHeader onNewQuestionSet={() => setIsNewModalOpen(true)} />
      
      {/* Search and filters */}
      <QuestionBankFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        partFilter={partFilter}
        setPartFilter={setPartFilter}
        accessFilter={accessFilter}
        setAccessFilter={setAccessFilter}
      />
      

      

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      ) : (
        /* Question sets grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestionSets.length === 0 && questionSets.length > 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try changing filters or search term
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('all');
                    setVisibilityFilter('all');
                    setPartFilter('all');
                    setAccessFilter('all');
                  }}
                  className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : filteredQuestionSets.length === 0 && questionSets.length === 0 ? (
            <EmptyQuestionBankState />
          ) : (
            filteredQuestionSets.map((set, index) => (
              <QuestionSetCard 
                key={set.id || `question-set-${index}`}
                set={set}
                onView={handleViewQuestionSet}
                onEdit={handleEditQuestionSet}
              />
            ))
          )}
        </div>
      )}
      
      {/* Modals */}
      <QuestionBankModals
        // New Question Set Modal
        isNewModalOpen={isNewModalOpen}
        setIsNewModalOpen={setIsNewModalOpen}
        handleCreateQuestionSet={handleCreateQuestionSet}
        currentUserId={user?.id || ''}
        currentUserName={(user as any)?.fullName || 'Unknown'}
        
        // View Question Set Modal
        isViewModalOpen={isViewModalOpen}
        setIsViewModalOpen={setIsViewModalOpen}
        viewingQuestionSet={viewingQuestionSet}
        
        // View/Edit Question Set Modal
        isViewEditModalOpen={isViewEditModalOpen}
        setIsViewEditModalOpen={setIsViewEditModalOpen}
        currentQuestionSet={currentQuestionSet}
        editMode={editMode}
        setEditMode={setEditMode}
        handleSaveQuestionSet={handleSaveQuestionSet}
        
        // Comment Modal
        isCommentModalOpen={isCommentModalOpen}
        setIsCommentModalOpen={setIsCommentModalOpen}
        selectedQuestionSet={selectedQuestionSet}
        comments={comments}
        handleAddCommentFromModal={handleAddCommentFromModal}
      />
    </div>
  );
}
