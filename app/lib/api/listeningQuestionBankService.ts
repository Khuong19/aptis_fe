import { fetchWithAuth } from '../auth/apiInterceptor';
import { QuestionSet } from '@/app/types/question-bank';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
}

export const ListeningQuestionBankService = {
    async getAllQuestionSets(): Promise<QuestionSet[]> {
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
    },

  createQuestionSet: async (newSet: Partial<QuestionSet>): Promise<QuestionSet> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/listening-question-bank`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSet),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  updateQuestionSet: async (id: string, updatedSet: Partial<QuestionSet>): Promise<QuestionSet> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedSet),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  deleteQuestionSet: async (id: string): Promise<void> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete question set');
    }
  },
};
