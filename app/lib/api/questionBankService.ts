import { fetchWithAuth } from '../auth/apiInterceptor';
import { QuestionSet, Comment } from '@/app/types/question-bank';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class QuestionBankService {
  /**
   * Get all question sets (including AI-generated and official)
   */
  static async getAllQuestionSets(): Promise<QuestionSet[]> {
    try {
      
      const [aiResponse, officialResponse] = await Promise.all([
        fetchWithAuth(`${API_BASE_URL}/ai-questions`),
        fetchWithAuth(`${API_BASE_URL}/official-questions`)
      ]);

      if (!aiResponse.ok || !officialResponse.ok) {
        throw new Error(`Failed to fetch question sets - AI: ${aiResponse.status}, Official: ${officialResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const officialData = await officialResponse.json();

      const aiQuestionSets: QuestionSet[] = Array.isArray(aiData) ? aiData : aiData.data || [];
      const officialQuestionSets: QuestionSet[] = Array.isArray(officialData) 
        ? officialData 
        : officialData.data || [];



      // Transform official questions to match frontend interface
      const transformedOfficialSets: QuestionSet[] = officialQuestionSets.map((set, index) => {
        const transformed = {
          ...set,
          // ✅ FIX: Generate ID if empty/missing
          id: set.id && set.id.trim() !== '' ? set.id : `official-${Date.now()}-${index}`,
          authorId: (set as any).uploadedBy || (set as any).createdBy || 'unknown',
          authorName: 'Official',
          isPublic: true,
          type: set.type || 'reading',
          source: 'official' as const
        };
        
        if (!set.id || set.id.trim() === '') {
        }
        
        return transformed;
      });

      // Transform AI questions to match frontend interface  
      const transformedAISets: QuestionSet[] = aiQuestionSets.map((set, index) => {
        const transformed = {
          ...set,
          // ✅ FIX: Generate ID if empty/missing
          id: set.id && set.id.trim() !== '' ? set.id : `ai-${Date.now()}-${index}`,
          authorId: (set as any).createdBy || 'unknown',
          authorName: 'AI Generated',
          isPublic: set.isPublic !== false, // Default to true if not specified
          type: set.type || 'reading',
          source: set.source || 'ai-generated'
        };
        
        if (!set.id || set.id.trim() === '') {
        }
        
        return transformed;
      });

      // Combine sets and ensure unique IDs
      const allSets = [...transformedAISets, ...transformedOfficialSets];
      
      // Filter out sets without valid IDs and ensure unique IDs
      const validSets = allSets.filter(set => set.id && set.id.trim() !== '');
      const uniqueSets = validSets.filter((set, index, arr) => 
        arr.findIndex(s => s.id === set.id) === index
      );
      
      
      return uniqueSets;
    } catch (error) {
      console.error('Error in getAllQuestionSets:', error);
      throw error;
    }
  }

  /**
   * Get question set by ID
   */
  static async getQuestionSetById(id: string): Promise<QuestionSet | null> {
    try {
      let response = await fetchWithAuth(`${API_BASE_URL}/ai-questions/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          ...data,
          authorId: data.createdBy || 'unknown',
          authorName: 'AI Generated',
          isPublic: data.isPublic !== false,
          type: data.type || 'reading',
          source: data.source || 'ai-generated'
        };
      }

      response = await fetchWithAuth(`${API_BASE_URL}/official-questions/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        const officialData = data.data || data;
        return {
          ...officialData,
          authorId: officialData.uploadedBy || officialData.createdBy || 'unknown',
          authorName: 'Official',
          isPublic: true,
          type: officialData.type || 'reading',
          source: 'official'
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching question set by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new question set (AI-generated)
   */
  static async createQuestionSet(questionSet: Partial<QuestionSet>): Promise<QuestionSet> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/ai-questions`, {
        method: 'POST',
        body: JSON.stringify({
          title: questionSet.title,
          description: questionSet.content || '',
          type: questionSet.type || 'reading',
          part: questionSet.part,
          level: questionSet.level,
          questions: questionSet.questions || [],
          passageText: questionSet.passageText,
          passages: questionSet.passages,
          paragraphs: questionSet.paragraphs,
          headings: questionSet.headings
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create question set');
      }

      const data = await response.json();
      return {
        ...data.data,
        authorId: data.data.createdBy || 'unknown',
        authorName: 'AI Generated',
        isPublic: data.data.isPublic !== false,
        type: data.data.type || 'reading',
        source: 'ai-generated'
      };
    } catch (error) {
      console.error('Error creating question set:', error);
      throw error;
    }
  }

  /**
   * Update question set
   */
  static async updateQuestionSet(id: string, questionSet: Partial<QuestionSet>): Promise<QuestionSet> {
    try {
      // Determine which endpoint to use based on source
      const isOfficial = questionSet.source === 'official';
      const endpoint = isOfficial 
        ? `${API_BASE_URL}/official-questions/${id}`
        : `${API_BASE_URL}/ai-questions/${id}`;

      const response = await fetchWithAuth(endpoint, {
        method: 'PUT',
        body: JSON.stringify({
          title: questionSet.title,
          description: questionSet.content || '',
          type: questionSet.type || 'reading',
          part: questionSet.part,
          level: questionSet.level,
          questions: questionSet.questions || [],
          passageText: questionSet.passageText,
          passages: questionSet.passages,
          paragraphs: questionSet.paragraphs,
          headings: questionSet.headings,
          isPublic: questionSet.isPublic
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update question set');
      }

      const data = await response.json();
      const updatedData = data.data || data;
      
      return {
        ...updatedData,
        id: id, // Ensure ID is preserved
        authorId: updatedData.createdBy || updatedData.uploadedBy || questionSet.authorId || 'unknown',
        authorName: isOfficial ? 'Official' : 'AI Generated',
        isPublic: updatedData.isPublic !== false,
        type: updatedData.type || 'reading',
        source: questionSet.source || (isOfficial ? 'official' : 'ai-generated')
      };
    } catch (error) {
      console.error('Error updating question set:', error);
      throw error;
    }
  }

  /**
   * Delete question set
   */
  static async deleteQuestionSet(id: string, source?: string): Promise<void> {
    try {
      let endpoint = `${API_BASE_URL}/ai-questions/${id}`;
      
      if (source === 'official') {
        endpoint = `${API_BASE_URL}/official-questions/${id}`;
      }

      const response = await fetchWithAuth(endpoint, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete question set');
      }
    } catch (error) {
      console.error('Error deleting question set:', error);
      throw error;
    }
  }

  /**
    * Get question sets with filter
   */
  static async getQuestionSetsWithFilter(filters: {
    type?: string;
    part?: string | number;
    level?: string;
    source?: string;
  }): Promise<QuestionSet[]> {
    try {
      const questionSets = await this.getAllQuestionSets();
      
      return questionSets.filter(qs => {
        if (filters.type && filters.type !== 'all' && qs.type !== filters.type) {
          return false;
        }
        if (filters.part && filters.part !== 'all' && qs.part?.toString() !== filters.part.toString()) {
          return false;
        }
        if (filters.level && filters.level !== 'all' && qs.level !== filters.level) {
          return false;
        }
        if (filters.source && filters.source !== 'all' && qs.source !== filters.source) {
          return false;
        }
        return true;
      });
    } catch (error) {
      console.error('Error fetching filtered question sets:', error);
      throw error;
    }
  }
} 