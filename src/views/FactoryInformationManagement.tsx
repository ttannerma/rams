import { Box, Button, TextField, Typography } from '@mui/material';
import useFactories, { type Factory } from '../api/useFactories';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const FactoryInformationManagement = () => {
  const [newFactoryName, setNewFactoryName] = useState('');
  const [newFactoryTimezone, setNewFactoryTimezone] = useState('');

  const { getFactories, addNewFactory, deleteFactory } = useFactories();

  const { data: factories, refetch } = useQuery({
    queryKey: ['factories'],
    queryFn: getFactories,
  });

  const addNewFactoryMutation = useMutation({
    mutationFn: addNewFactory,
    onSuccess: () => {
      // Clear input fields and refetch factories
      setNewFactoryName('');
      setNewFactoryTimezone('');

      refetch();
    },
  });

  const deleteFactoryMutation = useMutation({
    mutationFn: deleteFactory,
    onSuccess: () => {
      refetch();
    },
  });

  const handleAddNewFactoryClick = () => {
    // Check for duplicate factory names
    const factoriesExist = factories && factories.length > 0;
    if (
      factoriesExist &&
      factories?.some(
        (factoryName) =>
          factoryName.name.toUpperCase() === newFactoryName.toUpperCase()
      )
    ) {
      alert('Factory with this name already exists');
      return;
    }

    // Validate timezone exists
    if (!newFactoryTimezone) {
      alert('Please enter a valid timezone');
      return;
    }

    const newFactory: Factory = {
      name: newFactoryName.trim(), // Trim whitespace from name and timezone
      timezone: newFactoryTimezone.trim(),
    };

    addNewFactoryMutation.mutate(newFactory);
  };

  const handleDeleteFactoryClick = (factory: Factory) => {
    deleteFactoryMutation.mutate(factory);
  };

  return (
    <Box>
      <Typography variant="h4">1. Factory Information</Typography>
      <Box>
        <TextField
          label="Factory Name"
          variant="outlined"
          sx={{ mt: 2, mr: 2 }}
          value={newFactoryName}
          onChange={(e) => setNewFactoryName(e.target.value)}
        />
        <TextField
          label="Timezone"
          variant="outlined"
          sx={{ mt: 2, mr: 2 }}
          value={newFactoryTimezone}
          onChange={(e) => setNewFactoryTimezone(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ mt: 2, mb: 4 }}
          onClick={handleAddNewFactoryClick}
          disabled={
            addNewFactoryMutation.isPending ||
            !newFactoryName ||
            !newFactoryTimezone
          }
        >
          Add Factory
        </Button>
      </Box>
      <Box>
        {factories?.length === 0 && (
          <Typography>No factories available.</Typography>
        )}
        {factories?.map((factory) => (
          <Box
            key={factory.name}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              mb: 2,
              p: 2,
              border: '1px solid black',
              borderRadius: '8px',
            }}
          >
            <Box sx={{ my: 'auto' }}>
              <Typography variant="h6">Name: {factory.name}</Typography>
              <Typography>Timezone: {factory.timezone}</Typography>
            </Box>
            <Button
              variant="outlined"
              sx={{ mt: 1, width: '150px', ml: 'auto' }}
              color="error"
              onClick={() => handleDeleteFactoryClick(factory)}
            >
              {' '}
              Delete Factory
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
export default FactoryInformationManagement;
