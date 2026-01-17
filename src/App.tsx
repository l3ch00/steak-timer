import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import Setup from './components/Setup';
import CookingDashboard from './components/CookingDashboard';
import type { SteakConfig } from './utils/cookingLogic';

function App() {
  const [steaks, setSteaks] = useState<SteakConfig[]>([]);
  const [isCooking, setIsCooking] = useState(false);
  const [synchronize, setSynchronize] = useState(false);

  const handleStart = (configuredSteaks: SteakConfig[], shouldSync: boolean) => {
    setSteaks(configuredSteaks);
    setSynchronize(shouldSync);
    setIsCooking(true);
  };

  const handleFinish = () => {
    setIsCooking(false);
    setSteaks([]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        overflowX: 'hidden'
      }}>
        {!isCooking ? (
          <Setup onStart={handleStart} />
        ) : (
          <CookingDashboard 
            steaks={steaks} 
            synchronize={synchronize}
            onFinish={handleFinish} 
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;