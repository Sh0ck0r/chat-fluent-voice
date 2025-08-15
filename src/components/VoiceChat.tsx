import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Globe, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
];

interface VoiceChatProps {
  className?: string;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ className }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('en-US');
  const [toLanguage, setToLanguage] = useState('es-ES');
  const [isConnected, setIsConnected] = useState(false);
  const [volume, setVolume] = useState(true);
  
  const recognitionRef = useRef<typeof SpeechRecognition.prototype | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  const initializeSpeechServices = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = fromLanguage;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setCurrentText(transcript);
        
        if (event.results[event.results.length - 1].isFinal) {
          translateText(transcript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        toast({
          title: "Speech Recognition Error",
          description: "Please check your microphone permissions.",
          variant: "destructive"
        });
        setIsListening(false);
      };
    }
    
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, [fromLanguage, toast]);

  const translateText = async (text: string) => {
    // Simple demo translation - in production, you'd use a real translation API
    const translations = {
      'hello': { es: 'hola', fr: 'bonjour', de: 'hallo', it: 'ciao' },
      'goodbye': { es: 'adiós', fr: 'au revoir', de: 'auf wiedersehen', it: 'ciao' },
      'thank you': { es: 'gracias', fr: 'merci', de: 'danke', it: 'grazie' },
      'how are you': { es: '¿cómo estás?', fr: 'comment allez-vous?', de: 'wie geht es dir?', it: 'come stai?' }
    };
    
    const targetLang = toLanguage.split('-')[0];
    const lowerText = text.toLowerCase();
    
    let translated = text;
    for (const [en, trans] of Object.entries(translations)) {
      if (lowerText.includes(en)) {
        translated = translated.replace(new RegExp(en, 'gi'), trans[targetLang as keyof typeof trans] || en);
      }
    }
    
    setTranslatedText(translated);
    if (volume && translated !== text) {
      speakText(translated);
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current && text) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = toLanguage;
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      initializeSpeechServices();
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      initializeSpeechServices();
      toast({
        title: "Connected!",
        description: "Voice chat is now active. Click the microphone to start.",
      });
    } else {
      setIsListening(false);
      setCurrentText('');
      setTranslatedText('');
      toast({
        title: "Disconnected",
        description: "Voice chat session ended.",
      });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <Card className="p-6 bg-voice-surface border-voice-surface-variant backdrop-blur-xl shadow-voice">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-voice-secondary" />
            <h2 className="text-xl font-semibold text-foreground">Live Voice Translation</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="animate-bounce-in">
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVolume(!volume)}
              className="border-voice-surface-variant hover:bg-voice-surface-variant"
            >
              {volume ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        {/* Language Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">From</label>
            <Select value={fromLanguage} onValueChange={setFromLanguage}>
              <SelectTrigger className="bg-voice-surface-variant border-voice-surface-variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={toggleConnection}
              variant={isConnected ? "destructive" : "default"}
              className="bg-gradient-primary hover:opacity-90 transition-smooth"
            >
              {isConnected ? "Disconnect" : "Connect"}
            </Button>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">To</label>
            <Select value={toLanguage} onValueChange={setToLanguage}>
              <SelectTrigger className="bg-voice-surface-variant border-voice-surface-variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Voice Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="p-6 bg-voice-surface border-voice-surface-variant backdrop-blur-xl shadow-voice">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">Speaking</h3>
            <Badge variant="outline" className="text-voice-secondary border-voice-secondary">
              {LANGUAGES.find(l => l.code === fromLanguage)?.flag} {LANGUAGES.find(l => l.code === fromLanguage)?.name}
            </Badge>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={toggleListening}
              disabled={!isConnected}
              className={`w-24 h-24 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-gradient-accent animate-pulse-glow'
                  : 'bg-gradient-primary hover:opacity-90'
              }`}
            >
              {isListening ? (
                <Mic className="w-8 h-8 text-white animate-speaking" />
              ) : (
                <MicOff className="w-8 h-8 text-white" />
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              {isConnected ? (isListening ? 'Listening...' : 'Click to start speaking') : 'Connect to enable voice chat'}
            </p>
            
            <div className="w-full min-h-[100px] p-4 bg-voice-surface-variant rounded-lg border border-voice-surface-variant">
              <p className="text-foreground text-sm leading-relaxed">
                {currentText || 'Your spoken words will appear here...'}
              </p>
            </div>
          </div>
        </Card>

        {/* Output Section */}
        <Card className="p-6 bg-voice-surface border-voice-surface-variant backdrop-blur-xl shadow-voice">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">Translation</h3>
            <Badge variant="outline" className="text-voice-accent border-voice-accent">
              {LANGUAGES.find(l => l.code === toLanguage)?.flag} {LANGUAGES.find(l => l.code === toLanguage)?.name}
            </Badge>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSpeaking 
                ? 'bg-gradient-accent animate-pulse-glow' 
                : 'bg-voice-surface-variant'
            }`}>
              <Volume2 className={`w-8 h-8 transition-colors ${
                isSpeaking ? 'text-white animate-speaking' : 'text-muted-foreground'
              }`} />
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              {isSpeaking ? 'Speaking translation...' : 'Translation will be spoken here'}
            </p>
            
            <div className="w-full min-h-[100px] p-4 bg-voice-surface-variant rounded-lg border border-voice-surface-variant">
              <p className="text-foreground text-sm leading-relaxed">
                {translatedText || 'Translated text will appear here...'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};