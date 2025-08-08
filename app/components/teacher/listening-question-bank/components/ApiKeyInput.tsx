'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription,
} from '@/app/components/ui/basic';
import { Eye, EyeOff, Key, Save, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useApiKeys } from '@/app/hooks/useApiKeys';

interface ApiKeyInputProps {
  onKeysUpdated?: (keys: { elevenlabs?: string; gemini?: string }) => void;
  showTitle?: boolean;
  compact?: boolean;
  showElevenLabs?: boolean;
  showGemini?: boolean;
}

export default function ApiKeyInput({ 
  onKeysUpdated, 
  showTitle = true, 
  compact = false, 
  showElevenLabs = true, 
  showGemini = true 
}: ApiKeyInputProps) {
  const { apiKeys, isSaving, updateApiKeys, hasValidApiKey } = useApiKeys();
  const [showElevenLabsInput, setShowElevenLabsInput] = useState(false);
  const [showGeminiInput, setShowGeminiInput] = useState(false);
  const [localKeys, setLocalKeys] = useState({
    elevenlabs: apiKeys.elevenlabs || '',
    gemini: apiKeys.gemini || '',
  });

  // Update local state when API keys change
  React.useEffect(() => {
    setLocalKeys({
      elevenlabs: apiKeys.elevenlabs || '',
      gemini: apiKeys.gemini || '',
    });
  }, [apiKeys]);

  const handleSave = async () => {
    try {
      await updateApiKeys(localKeys);
      onKeysUpdated?.(localKeys);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleKeyChange = (type: 'elevenlabs' | 'gemini', value: string) => {
    setLocalKeys(prev => ({ ...prev, [type]: value }));
  };

  const hasChanges = () => {
    return localKeys.elevenlabs !== (apiKeys.elevenlabs || '') ||
           localKeys.gemini !== (apiKeys.gemini || '');
  };

  const isValidFormat = (type: 'elevenlabs' | 'gemini', value: string) => {
    if (!value) return true; // Empty is valid (optional)
    
    switch (type) {
      case 'elevenlabs':
        return value.startsWith('sk_') && value.length >= 32;
      case 'gemini':
        return value.length >= 32;
      default:
        return false;
    }
  };

  const CardWrapper = compact ? React.Fragment : Card;
  const CardProps = compact ? {} : { className: "border-blue-200 bg-blue-50" };

  return (
    <CardWrapper {...CardProps}>
      {!compact && (
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Key className="w-5 h-5" />
            <span>API Keys Configuration</span>
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className={compact ? "space-y-4" : "space-y-6"}>
        {showTitle && compact && (
          <div className="flex items-center space-x-2 mb-4">
            <Key className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">API Keys</h3>
          </div>
        )}

        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <p className="font-medium">Required for AI generation:</p>
            <ul className="text-sm mt-1 space-y-1">
              {showElevenLabs && <li>• <strong>ElevenLabs API Key</strong>: For audio generation</li>}
              {showGemini && <li>• <strong>Gemini API Key</strong>: For text generation</li>}
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {/* ElevenLabs API Key */}
          {showElevenLabs && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="elevenlabs-key" className="text-sm font-medium">
                  ElevenLabs API Key
                </Label>
                <div className="flex items-center space-x-2">
                  {hasValidApiKey('elevenlabs') && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowElevenLabsInput(!showElevenLabsInput)}
                    className="h-6 w-6 p-0"
                  >
                    {showElevenLabsInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Input
                id="elevenlabs-key"
                type={showElevenLabsInput ? "text" : "password"}
                value={localKeys.elevenlabs}
                onChange={(e) => handleKeyChange('elevenlabs', e.target.value)}
                placeholder="sk_..."
                className={`${!isValidFormat('elevenlabs', localKeys.elevenlabs) && localKeys.elevenlabs ? 'border-red-500' : ''}`}
              />
              {!isValidFormat('elevenlabs', localKeys.elevenlabs) && localKeys.elevenlabs && (
                <p className="text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Invalid format. Should start with 'sk_' and be at least 32 characters.</span>
                </p>
              )}
            </div>
          )}

          {/* Gemini API Key */}
          {showGemini && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="gemini-key" className="text-sm font-medium">
                  Gemini API Key
                </Label>
                <div className="flex items-center space-x-2">
                  {hasValidApiKey('gemini') && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowGeminiInput(!showGeminiInput)}
                    className="h-6 w-6 p-0"
                  >
                    {showGeminiInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Input
                id="gemini-key"
                type={showGeminiInput ? "text" : "password"}
                value={localKeys.gemini}
                onChange={(e) => handleKeyChange('gemini', e.target.value)}
                placeholder="Enter your Gemini API key..."
                className={`${!isValidFormat('gemini', localKeys.gemini) && localKeys.gemini ? 'border-red-500' : ''}`}
              />
              {!isValidFormat('gemini', localKeys.gemini) && localKeys.gemini && (
                <p className="text-xs text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Invalid format. Should be at least 32 characters.</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        {hasChanges() && (
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save API Keys</span>
                </>
              )}
            </Button>
          </div>
        )}

        {/* API Key Status */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${hasValidApiKey('elevenlabs') ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className={hasValidApiKey('elevenlabs') ? 'text-green-700' : 'text-gray-500'}>
              ElevenLabs {hasValidApiKey('elevenlabs') ? 'Ready' : 'Not Set'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${hasValidApiKey('gemini') ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className={hasValidApiKey('gemini') ? 'text-green-700' : 'text-gray-500'}>
              Gemini {hasValidApiKey('gemini') ? 'Ready' : 'Not Set'}
            </span>
          </div>
        </div>
      </CardContent>
    </CardWrapper>
  );
}