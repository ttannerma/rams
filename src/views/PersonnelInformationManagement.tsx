import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import usePersonnel, { type Personnel } from '../api/usePersonnel';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import useFactories, { type Factory } from '../api/useFactories';
import { MenuItem } from '@mui/material';

const PersonnelInformationManagement = () => {
  const [personnelName, setPersonnelName] = useState('');
  const [personnelEmail, setPersonnelEmail] = useState('');
  const [selectedFactories, setSelectedFactories] = useState<Factory['name'][]>(
    []
  );

  const { getFactories } = useFactories();
  const { getAllPersonnel, addNewPersonnel, deletePersonnel } = usePersonnel();

  const addNewPersonnelMutation = useMutation({
    mutationFn: addNewPersonnel,
    onSuccess: () => {
      // Clear input fields and refetch personnel
      setPersonnelName('');
      setPersonnelEmail('');
      setSelectedFactories([]);
      refetch();
    },
  });

  const deletePersonnelMutation = useMutation({
    mutationFn: deletePersonnel,
    onSuccess: () => {
      refetch();
    },
  });

  const { data: factoriesData } = useQuery({
    queryKey: ['factories'],
    queryFn: getFactories,
  });

  const { data: personnelData, refetch } = useQuery({
    queryKey: ['personnel'],
    queryFn: getAllPersonnel,
  });

  const handleNewPersonnelAddClick = () => {
    const trimmedName = personnelName.trim();
    const trimmedEmail = personnelEmail.trim();

    if (trimmedName === '') {
      alert('Please enter a valid name');
      return;
    }

    if (trimmedEmail === '') {
      alert('Please enter a valid email');
      return;
    }

    if (
      personnelData &&
      personnelData.some(
        (person) => person.email.toUpperCase() === trimmedEmail.toUpperCase()
      )
    ) {
      alert('Personnel with this email already exists');
      return;
    }

    const newPersonnel = {
      name: personnelName,
      email: trimmedEmail,
      factories: selectedFactories,
    };

    addNewPersonnelMutation.mutate(newPersonnel);
  };

  const handlePersonnelDeleteClick = (personnel: Personnel) => {
    deletePersonnelMutation.mutate(personnel);
  };

  return (
    <Box>
      <Typography variant="h4">2. Personnel information</Typography>
      <Box>
        <Box>
          <TextField
            label="Full name"
            variant="outlined"
            sx={{ mt: 2, mr: 2 }}
            value={personnelName}
            onChange={(e) => setPersonnelName(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            sx={{ mt: 2, mr: 2 }}
            value={personnelEmail}
            onChange={(e) => setPersonnelEmail(e.target.value)}
          />
          <FormControl sx={{ mt: '16px', '& .MuiInputBase-root': { m: 0 } }}>
            <InputLabel id="factory-select-label">
              Assigned factories
            </InputLabel>
            <Select
              value={selectedFactories}
              labelId="factory-select-label"
              id="factory-select"
              label="Assigned factories"
              onChange={(e) => {
                const selectedOptions = e.target.value as Factory['name'][];
                setSelectedFactories(selectedOptions);
              }}
              multiple
              sx={{ width: '200px', mt: 2, mr: 2 }}
            >
              {factoriesData &&
                factoriesData.map((factory) => (
                  <MenuItem value={factory.name}>{factory.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{ ml: 2, mt: 2, mb: 4 }}
            onClick={handleNewPersonnelAddClick}
            disabled={
              addNewPersonnelMutation.isPending ||
              !personnelName ||
              !personnelEmail ||
              selectedFactories.length === 0
            }
          >
            Add personnel
          </Button>
        </Box>
        <Box>
          {personnelData &&
            personnelData.map((person) => (
              <Box
                key={person.personalId}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  mb: 2,
                  p: 2,
                  border: '1px solid black',
                  borderRadius: '8px',
                }}
              >
                <Box>
                  <Typography>Name: {person.name}</Typography>
                  <Typography>Personal id: {person.personalId}</Typography>
                  <Typography>Email: {person.email}</Typography>
                  <Typography>Assigned factories:</Typography>
                  <Box>
                    {person.factories.map((factory: string, idx: number) => (
                      <Typography key={idx}>
                        {idx + 1}. {factory}
                      </Typography>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ alignContent: 'center', ml: 'auto' }}>
                  <Button
                    variant="outlined"
                    sx={{ mt: 1, width: '150px', ml: 'auto' }}
                    color="error"
                    onClick={() => handlePersonnelDeleteClick(person)}
                  >
                    Delete Personnel
                  </Button>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PersonnelInformationManagement;
