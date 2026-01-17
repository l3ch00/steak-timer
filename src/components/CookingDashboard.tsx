import React, { useMemo, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Stack, 
  Container
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { SteakConfig } from '../utils/cookingLogic';
import SteakTimerCard from './SteakTimerCard';

interface CookingDashboardProps {
  steaks: SteakConfig[];
  synchronize: boolean;
  onFinish: () => void;
}

const CookingDashboard: React.FC<CookingDashboardProps> = ({ steaks, synchronize, onFinish }) => {
  const [globalStarted, setGlobalStarted] = useState(false);

  // Calculate synchronization delays
  const steakDelays = useMemo(() => {
    if (!synchronize) {
      return new Array(steaks.length).fill(0);
    }
    const durations = steaks.map(s => s.steps.reduce((acc, step) => acc + step.duration, 0));
    const maxDuration = Math.max(...durations);
    return durations.map(d => maxDuration - d);
  }, [steaks, synchronize]);

  const handleGlobalStartRequest = () => {
    if (synchronize && !globalStarted) {
      setGlobalStarted(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 12 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Cooking in Progress
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {synchronize 
            ? "Timers are synchronized. Starting one will start all."
            : "Cooking each steak independently."}
        </Typography>
      </Box>

      <Stack spacing={3}>
        {steaks.map((steak, index) => (
          <SteakTimerCard 
            key={steak.id} 
            steak={steak} 
            index={index} 
            initialDelay={steakDelays[index]}
            forceStart={synchronize ? globalStarted : undefined}
            onStartRequest={handleGlobalStartRequest}
          />
        ))}
      </Stack>

      <Box sx={{ position: 'fixed', bottom: 20, left: 0, right: 0, px: 2, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="inherit"
          size="large" 
          onClick={onFinish}
          startIcon={<ArrowBackIcon />}
          sx={{ 
            py: 2, 
            width: '100%', 
            maxWidth: 600, 
            fontSize: '1.1rem', 
            fontWeight: 'bold',
            boxShadow: 6,
            borderRadius: 8,
            bgcolor: 'background.paper',
            color: 'text.primary'
          }}
        >
          Finish Cooking
        </Button>
      </Box>
    </Container>
  );
};

export default CookingDashboard;