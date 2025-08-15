import React from 'react';
import { VoiceChat } from '@/components/VoiceChat';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { Mic, Globe, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow animate-bounce-in">
                <Mic className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Live Voice <span className="bg-gradient-primary bg-clip-text text-transparent">Translation</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Break down language barriers with real-time voice translation. 
              Speak naturally and communicate instantly across languages.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-voice-surface border-voice-surface-variant backdrop-blur-xl shadow-card text-center">
              <div className="w-12 h-12 bg-voice-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Speech</h3>
              <p className="text-muted-foreground text-sm">
                Advanced speech recognition with continuous listening and instant transcription.
              </p>
            </Card>

            <Card className="p-6 bg-voice-surface border-voice-surface-variant backdrop-blur-xl shadow-card text-center">
              <div className="w-12 h-12 bg-voice-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Multi-language</h3>
              <p className="text-muted-foreground text-sm">
                Support for 10+ languages with accurate translation and natural voice synthesis.
              </p>
            </Card>

            <Card className="p-6 bg-voice-surface border-voice-surface-variant backdrop-blur-xl shadow-card text-center">
              <div className="w-12 h-12 bg-voice-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Instant Results</h3>
              <p className="text-muted-foreground text-sm">
                Lightning-fast processing with minimal latency for seamless conversations.
              </p>
            </Card>
          </div>

          {/* Connection Status */}
          <ConnectionStatus isConnected={false} participantCount={1} className="mb-8" />

          {/* Main Voice Chat Interface */}
          <VoiceChat />
        </div>
      </div>
    </div>
  );
};

export default Index;