import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Stack, 
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Chip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { SteakConfig } from '../utils/cookingLogic';

interface SteakTimerCardProps {
  steak: SteakConfig;
  index: number;
  initialDelay: number;
  forceStart?: boolean;
  onStartRequest?: () => void;
}

const playBeep = (count = 1) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now + i * 0.5); // A5
      gain.gain.setValueAtTime(0.1, now + i * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.5 + 0.3);
      
      osc.start(now + i * 0.5);
      osc.stop(now + i * 0.5 + 0.3);
    }
  } catch (e) {
    console.error("Audio error", e);
  }
};

const SteakTimerCard: React.FC<SteakTimerCardProps> = ({ 
  steak, 
  index, 
  initialDelay, 
  forceStart = false,
  onStartRequest 
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [delayLeft, setDelayLeft] = useState(initialDelay);
  const [isWaiting, setIsWaiting] = useState(initialDelay > 0);
  // Ensure timeLeft initializes correctly
  const [timeLeft, setTimeLeft] = useState(steak.steps[0].duration);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<number | null>(null);

  const currentStep = steak.steps[stepIndex];
  
  const totalDuration = steak.steps.reduce((acc, s) => acc + s.duration, 0);
  const completedDuration = isWaiting ? 0 : steak.steps.slice(0, stepIndex).reduce((acc, s) => acc + s.duration, 0) + (currentStep.duration - timeLeft);
  const totalProgress = (completedDuration / totalDuration) * 100;

  // Watch for external forceStart signal
  useEffect(() => {
    if (forceStart && !isRunning && !isFinished) {
      setIsRunning(true);
    }
  }, [forceStart, isFinished]);

  // Timer Interval Logic
  useEffect(() => {
    if (isRunning && !isFinished) {
      timerRef.current = window.setInterval(() => {
        if (isWaiting) {
          setDelayLeft((prev) => {
             if (prev <= 1) {
               // Transition handled in effect below or inline here for state switch
               // For delay, we can safely switch state here as it doesn't conflict with timeLeft
               setIsWaiting(false);
               playBeep(2); 
               return 0;
             }
             return prev - 1;
          });
        } else {
          setTimeLeft((prev) => {
            // Only decrement, do not handle completion here to avoid race conditions
            if (prev <= 0) return 0;
            return prev - 1;
          });
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isFinished, isWaiting]);

  // Monitor Step Completion
  useEffect(() => {
    if (!isWaiting && isRunning && !isFinished && timeLeft === 0) {
      handleStepComplete();
    }
  }, [timeLeft, isWaiting, isRunning, isFinished]);


  const handleStepComplete = () => {
    playBeep(3);
    if (stepIndex < steak.steps.length - 1) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      // Crucial: Set the new time immediately
      setTimeLeft(steak.steps[nextIndex].duration);
    } else {
      setIsFinished(true);
      setIsRunning(false);
      playBeep(5);
    }
  };

  const handleSkipDelay = () => {
    setIsWaiting(false);
    setDelayLeft(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!isRunning && onStartRequest) {
      onStartRequest();
    }
    setIsRunning(!isRunning);
  };

  return (
    <Card 
      elevation={4} 
      sx={{ 
        borderRadius: 3, 
        bgcolor: isFinished ? 'rgba(76, 175, 80, 0.1)' : (isWaiting ? 'rgba(255, 193, 7, 0.05)' : 'background.paper'), 
        position: 'relative', 
        overflow: 'visible',
        border: isWaiting ? '1px dashed #ffca28' : 'none'
      }}
    >
      <CardContent>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Steak #{index + 1}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {steak.doneness} • {steak.thickness}mm
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
             {isFinished ? (
               <Chip label="Ready!" color="success" icon={<CheckCircleIcon />} />
             ) : (
               <Typography 
                 variant="h4" 
                 fontFamily="monospace" 
                 color={isWaiting ? 'warning.main' : (timeLeft < 10 ? 'error' : 'text.primary')}
               >
                 {isWaiting ? formatTime(delayLeft) : formatTime(timeLeft)}
               </Typography>
             )}
          </Box>
        </Stack>

        {/* Status / Step Info */}
        {!isFinished && (
          <Box mb={2}>
            {isWaiting ? (
               <Box>
                 <Typography variant="subtitle2" color="warning.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                   <AccessTimeIcon fontSize="small" /> Delayed Start
                 </Typography>
                 <Typography variant="body2" color="text.secondary">
                   Wait for the timer to finish before starting this steak to synchronize with others.
                 </Typography>
               </Box>
            ) : (
              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {currentStep.name}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(1 - timeLeft / currentStep.duration) * 100} 
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {currentStep.description}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Controls */}
        {!isFinished && (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
             <IconButton 
               onClick={handlePlayPause} 
               color={isRunning ? 'default' : 'primary'}
               sx={{ border: '1px solid', borderColor: 'divider' }}
             >
               {isRunning ? <PauseIcon /> : <PlayArrowIcon />}
             </IconButton>
             
             {isWaiting ? (
               <Button 
                 variant="text" 
                 size="small" 
                 onClick={handleSkipDelay}
                 color="warning"
               >
                 Start Now
               </Button>
             ) : (
               <Button 
                 variant="text" 
                 size="small" 
                 onClick={() => setTimeLeft(0)} // Trigger completion via effect
                 endIcon={<SkipNextIcon />}
                 color="secondary"
               >
                 Skip
               </Button>
             )}
          </Stack>
        )}
        
        {/* Total Progress Overlay (Bottom Border) */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
           <LinearProgress variant="determinate" value={totalProgress} color={isFinished ? "success" : "secondary"} sx={{ height: 4 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SteakTimerCard;