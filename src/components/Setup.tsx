import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  Chip, 
  Button, 
  Stack, 
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { DONENESS_LEVELS, mmToInch, calculateSteps, type Doneness, type SteakConfig } from '../utils/cookingLogic';

interface SetupProps {
  onStart: (steaks: SteakConfig[], synchronize: boolean) => void;
}

const Setup: React.FC<SetupProps> = ({ onStart }) => {
  const [thickness, setThickness] = useState<number>(25);
  const [doneness, setDoneness] = useState<Doneness>('Medium Rare');
  const [steaks, setSteaks] = useState<SteakConfig[]>([]);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);

  const handleAddSteak = () => {
    const newSteak: SteakConfig = {
      id: Date.now().toString(),
      thickness,
      doneness,
      steps: calculateSteps(thickness, doneness)
    };
    setSteaks([...steaks, newSteak]);
  };

  const handleRemoveSteak = (id: string) => {
    setSteaks(steaks.filter(s => s.id !== id));
  };

  const handleStartClick = () => {
    if (steaks.length > 1) {
      setSyncDialogOpen(true);
    } else {
      onStart(steaks, false);
    }
  };

  const handleSyncConfirm = (sync: boolean) => {
    setSyncDialogOpen(false);
    onStart(steaks, sync);
  };

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2, pb: 10 }}>
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Steak Timer
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your feast
        </Typography>
      </Box>

      {/* Configuration Section */}
      <Paper sx={{ p: 3, borderRadius: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Add New Steak
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Thickness: <strong>{thickness} mm</strong> ({mmToInch(thickness)}")
          </Typography>
          <Slider
            value={thickness}
            onChange={(_, val) => setThickness(val as number)}
            min={10}
            max={60}
            step={1}
            valueLabelDisplay="auto"
            color="secondary"
            marks={[
              { value: 10, label: '1cm' },
              { value: 25, label: '1"' },
              { value: 50, label: '2"' }
            ]}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom sx={{ mb: 1 }}>
            Doneness: <strong>{doneness}</strong>
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
            {DONENESS_LEVELS.map((level) => (
              <Chip
                key={level}
                label={level}
                onClick={() => setDoneness(level)}
                color={doneness === level ? 'primary' : 'default'}
                variant={doneness === level ? 'filled' : 'outlined'}
                clickable
              />
            ))}
          </Stack>
        </Box>

        <Button 
          variant="outlined" 
          fullWidth
          size="large" 
          onClick={handleAddSteak}
          startIcon={<AddCircleIcon />}
          sx={{ py: 1.5, borderStyle: 'dashed', borderWidth: 2 }}
        >
          Add to Order
        </Button>
      </Paper>

      {/* Order List Section */}
      {steaks.length > 0 && (
        <Paper sx={{ borderRadius: 4, overflow: 'hidden' }} elevation={3}>
          <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
             <Typography variant="subtitle1" fontWeight="bold">
               Current Order ({steaks.length})
             </Typography>
          </Box>
          <List disablePadding>
            {steaks.map((steak, index) => (
              <React.Fragment key={steak.id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveSteak(steak.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`Steak #${index + 1} - ${steak.doneness}`}
                    secondary={`${steak.thickness}mm (${mmToInch(steak.thickness)}")`}
                  />
                </ListItem>
                {index < steaks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Start Button Fixed at Bottom */}
      <Box sx={{ position: 'fixed', bottom: 20, left: 0, right: 0, px: 2, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          size="large" 
          disabled={steaks.length === 0}
          onClick={handleStartClick}
          startIcon={<RestaurantIcon />}
          sx={{ 
            py: 2, 
            width: '100%', 
            maxWidth: 600, 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            boxShadow: 6,
            borderRadius: 8
          }}
        >
          Start Cooking ({steaks.length})
        </Button>
      </Box>

      {/* Sync Dialog */}
      <Dialog
        open={syncDialogOpen}
        onClose={() => setSyncDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Synchronize Cooking Times?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            We can add start delays so that all your steaks finish cooking at the exact same time.
            <br/><br/>
            <strong>Yes, Synchronize:</strong> Some timers will wait to start.
            <br/>
            <strong>No, Cook Now:</strong> All timers will start immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleSyncConfirm(false)}>No, Cook Now</Button>
          <Button onClick={() => handleSyncConfirm(true)} variant="contained" autoFocus>
            Yes, Synchronize
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Setup;
