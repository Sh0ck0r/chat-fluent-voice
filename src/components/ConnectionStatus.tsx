import React from 'react';
import { Wifi, WifiOff, Users, Globe2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConnectionStatusProps {
  isConnected: boolean;
  participantCount?: number;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  participantCount = 1,
  className 
}) => {
  return (
    <Card className={`p-4 bg-voice-surface border-voice-surface-variant backdrop-blur-xl shadow-card ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isConnected ? 'bg-voice-accent' : 'bg-muted'}`}>
            {isConnected ? (
              <Wifi className="w-4 h-4 text-white" />
            ) : (
              <WifiOff className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isConnected ? 'Ready for voice chat' : 'Click connect to start'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-voice-secondary border-voice-secondary">
            <Users className="w-3 h-3 mr-1" />
            {participantCount}
          </Badge>
          <Badge variant="outline" className="text-voice-accent border-voice-accent">
            <Globe2 className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>
      </div>
    </Card>
  );
};