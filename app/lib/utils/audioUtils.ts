/**
 * Utility functions for handling audio URLs in the listening question bank
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Generate audio URL for listening files
 * @param folderName - The folder name containing the audio files
 * @param fileName - The audio file name
 * @returns Full URL to the audio file
 */
export const getListeningAudioUrl = (folderName: string, fileName: string): string => {
  return `${API_BASE_URL}/uploads/listening/${folderName}/${fileName}`;
};

/**
 * Generate audio URL for a specific segment
 * @param folderName - The folder name containing the audio files
 * @param segmentIndex - The index of the segment
 * @returns Full URL to the segment audio file
 */
export const getSegmentAudioUrl = (folderName: string, segmentIndex: number): string => {
  return getListeningAudioUrl(folderName, `segment-${segmentIndex}.mp3`);
};

/**
 * Generate audio URL for a conversation
 * @param folderName - The folder name containing the audio files
 * @param conversationIndex - The index of the conversation
 * @returns Full URL to the conversation audio file
 */
export const getConversationAudioUrl = (folderName: string, conversationIndex: number): string => {
  return getListeningAudioUrl(folderName, `conversation-${conversationIndex}.mp3`);
};

/**
 * Generate audio URL for a lecture
 * @param folderName - The folder name containing the audio files
 * @param lectureIndex - The index of the lecture
 * @returns Full URL to the lecture audio file
 */
export const getLectureAudioUrl = (folderName: string, lectureIndex: number): string => {
  return getListeningAudioUrl(folderName, `lecture-${lectureIndex}.mp3`);
};

/**
 * Generate audio URL for a speaker in discussion
 * @param folderName - The folder name containing the audio files
 * @param speakerIndex - The index of the speaker
 * @returns Full URL to the speaker audio file
 */
export const getSpeakerAudioUrl = (folderName: string, speakerIndex: number): string => {
  return getListeningAudioUrl(folderName, `speaker-${speakerIndex}.mp3`);
};

/**
 * Check if an audio URL is valid
 * @param url - The audio URL to check
 * @returns Promise<boolean> - Whether the audio file exists
 */
export const checkAudioUrlExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking audio URL:', error);
    return false;
  }
};

/**
 * Get the base folder name for a listening question set
 * @param part - The listening part number
 * @param timestamp - Optional timestamp, defaults to current time
 * @returns Folder name for the question set
 */
export const getListeningFolderName = (part: number, timestamp?: number): string => {
  const time = timestamp || Date.now();
  return `listening_${part}_${time}`;
}; 