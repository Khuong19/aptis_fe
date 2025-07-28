import { useState, useEffect } from 'react';
import { ApiKeysService, ApiKeys } from '@/app/lib/api/apiKeysService';
import { showToast } from '@/app/components/ui/ToastContainer';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load API keys on component mount
  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const keys = await ApiKeysService.getUserApiKeys();
      setApiKeys(keys);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load API keys';
      setError(errorMessage);
      console.error('Error loading API keys:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateApiKeys = async (newApiKeys: ApiKeys) => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Validate API keys before saving
      if (newApiKeys.elevenlabs && !ApiKeysService.isValidApiKeyFormat('elevenlabs', newApiKeys.elevenlabs)) {
        throw new Error('Invalid ElevenLabs API key format');
      }
      
      if (newApiKeys.gemini && !ApiKeysService.isValidApiKeyFormat('gemini', newApiKeys.gemini)) {
        throw new Error('Invalid Gemini API key format');
      }

      await ApiKeysService.updateUserApiKeys(newApiKeys);
      setApiKeys(newApiKeys);
      showToast('API keys updated successfully', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update API keys';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const updateSingleApiKey = async (type: 'elevenlabs' | 'gemini', value: string) => {
    const newApiKeys = { ...apiKeys, [type]: value };
    await updateApiKeys(newApiKeys);
  };

  const validateApiKey = async (type: 'elevenlabs' | 'gemini', apiKey: string): Promise<boolean> => {
    try {
      return await ApiKeysService.validateApiKey(type, apiKey);
    } catch (err) {
      console.error('Error validating API key:', err);
      return false;
    }
  };

  const hasValidApiKeys = (): boolean => {
    return !!(apiKeys.elevenlabs && apiKeys.gemini);
  };

  const hasValidApiKey = (type: 'elevenlabs' | 'gemini'): boolean => {
    return !!apiKeys[type];
  };

  return {
    apiKeys,
    isLoading,
    isSaving,
    error,
    loadApiKeys,
    updateApiKeys,
    updateSingleApiKey,
    validateApiKey,
    hasValidApiKeys,
    hasValidApiKey,
  };
};