import { fetchWithAuth } from '../auth/apiInterceptor';

/**
 * Audio service for frontend
 */

export interface AudioMergeRequest {
  audioFiles: string[];
  questionSetId: string;
}

export interface AudioMergeResponse {
  success: boolean;
  mergedAudioPath?: string;
  message?: string;
  error?: string;
}

export interface AudioAvailabilityResponse {
  success: boolean;
  available: boolean;
  message: string;
}

/**
 * Merge multiple audio files into a single audio file
 */
export const mergeAudioFiles = async (request: AudioMergeRequest): Promise<AudioMergeResponse> => {
  try {
    // Use absolute URL to ensure it goes to backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetchWithAuth(`${apiUrl}/audio/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to merge audio files');
    }

    return await response.json();
  } catch (error) {
    console.error('Error merging audio files:', error);
    throw error;
  }
};

/**
 * Check if audio merging is available
 */
export const checkAudioMergeAvailability = async (): Promise<AudioAvailabilityResponse> => {
  try {
    // Use absolute URL to ensure it goes to backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetchWithAuth(`${apiUrl}/audio/check-availability`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to check audio merge availability');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking audio merge availability:', error);
    throw error;
  }
};

/**
 * Get merged audio URL for Listening Part 3
 */
export const getMergedAudioUrl = async (questionSet: any): Promise<string> => {
  try {
    // Check if we have multiple audio files for Part 3
    if (questionSet.part === 3 && questionSet.audioFiles && questionSet.audioFiles.length > 1) {
      console.log('🔍 questionSet.audioFiles:', questionSet.audioFiles);
      
      // Try to merge audio files
      const mergeRequest: AudioMergeRequest = {
        audioFiles: questionSet.audioFiles,
        questionSetId: questionSet.id
      };

      const mergeResponse = await mergeAudioFiles(mergeRequest);
      
      if (mergeResponse.success && mergeResponse.mergedAudioPath) {
        return `${process.env.NEXT_PUBLIC_API_URL}/uploads/merged/${mergeResponse.mergedAudioPath}`;
      }
    }

    // Fallback to first audio file if merging fails or not needed
    const audioFile = questionSet.audioFiles?.[0];
    return audioFile 
      ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${audioFile.replace("http://localhost:5000/api/uploads/", "")}`
      : "/audio/sample.mp3";

  } catch (error) {
    console.error('Error getting merged audio URL:', error);
    // Fallback to first audio file
    const audioFile = questionSet.audioFiles?.[0];
    return audioFile 
      ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${audioFile.replace("http://localhost:5000/api/uploads/", "")}`
      : "/audio/sample.mp3";
  }
};
