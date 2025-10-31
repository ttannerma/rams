import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import useReservations, { type Reservation } from "../api/useReservations";
import { useMutation, useQuery } from "@tanstack/react-query";
import usePersonnel, { type Personnel } from "../api/usePersonnel";
import useFactories, { type Factory } from "../api/useFactories";
import { useEffect, useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const ReservationsManagement = () => {

  const [selectedPersonnelIds, setSelectedPersonnelIds] =  useState<Personnel["personalId"][]>([]);

  const [selectedFactory, setSelectedFactory] = useState<Factory["name"]>("");
  const [assignedFactories, setAssignedFactories] = useState<Factory[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const { getReservations, addNewReservation, deleteReservation } = useReservations()
  const { getAllPersonnel } = usePersonnel()
  const { getFactories } = useFactories()

  const reservationsMutation = useMutation({
    mutationFn: addNewReservation,
    onSuccess: () => {
      refetch();
      clearForm();
    }
  })

  const reservationDeleteMutation = useMutation({
    mutationFn: deleteReservation,
    onSuccess: () => {
      refetch();
    }
  })

  const { data: reservationsData, refetch } = useQuery({
    queryKey: ['reservations'],
    queryFn: getReservations,
  })

  const { data: personnelData } = useQuery({
    queryKey: ['personnel'],
    queryFn: getAllPersonnel,
  })

  const { data: factoriesData } = useQuery({
    queryKey: ['factories'],
    queryFn: getFactories,
  })

  const handleTimeChange = (type: "start" | "end", value: Date) => {
    if(type === "start") {
      setStartTime(value);
    } else {
      setEndTime(value);
    }
  }

  const handleCreateReservationClick = () => {
    const newReservation: Reservation = {
      id: "", // ID will be assigned by the backend
      personalId: selectedPersonnelIds, // Assuming single selection for simplicity
      factoryName: selectedFactory,
      startTime: startTime ? startTime.toISOString() : "",
      endTime: endTime ? endTime.toISOString() : "",
    }

    reservationsMutation.mutate(newReservation);
  }

  const clearForm = () => {
    setSelectedPersonnelIds([]);
    setSelectedFactory("");
    setStartTime(null);
    setEndTime(null);
  }

  useEffect(() => {
    const selectedPersons = selectedPersonnelIds
      .map((id) => personnelData?.find(person => person.personalId === id))
      .filter((person) => person !== undefined);

    const assignedFactories = selectedPersons
      .flatMap((person) => person.factories)
      .map((factoryName) => factoriesData?.find(factory => factory.name === factoryName))
      .filter((factory) => factory !== undefined) as Factory[];

    const uniqueAssignedFactories = Array.from(new Set(assignedFactories.map(f => f.name)))
      .map(name => assignedFactories.find(f => f.name === name)) as Factory[];

    setAssignedFactories(uniqueAssignedFactories);

  }, [factoriesData, personnelData, selectedPersonnelIds])
  
  return (
    <Box>
      <Box>
        <Typography variant="h4">3. Reservation management</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Typography variant="h6" mt={2}>Create a reservation</Typography>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <FormControl sx={{ mt: "16px", "& .MuiInputBase-root": { m: 0 } }}>
                <InputLabel id="personnel-select-label">
                  Personnel
                </InputLabel>
                <Select
                  multiple
                  value={selectedPersonnelIds}
                  labelId="personnel-select-label"
                  id="personnel-select"
                  label="Personnel"
                  onChange={(e) => {
                    const selectedOptions = e.target.value as Personnel["personalId"][];
                    setSelectedPersonnelIds(selectedOptions);
                  }}
                  sx={{ width: "200px", mt: 2, mr: 2 }}
                >
                  {personnelData &&
                    personnelData.map((personnel) => (
                      <MenuItem value={personnel.personalId}>{personnel.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <FormControl sx={{ mt: "16px", "& .MuiInputBase-root": { m: 0 } }}>
                <InputLabel id="assigned-factory-select-label">
                  Factory
                </InputLabel>
                <Select
                  value={selectedFactory}
                  labelId="personnel-select-label"
                  id="personnel-select"
                  label="Personnel"
                  onChange={(e) => {
                    const selectedOption = e.target.value as Factory["name"];
                    setSelectedFactory(selectedOption);
                  }}
                  sx={{ width: "200px", mt: 2, mr: 2 }}
                >
                  {assignedFactories &&
                    assignedFactories.map((factory) => (
                      <MenuItem value={factory.name}>{factory.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 2, width: "250px"}}>
              <DateTimePicker
                ampm={false}
                label="Start time"
                value={startTime}
                onChange={(newValue) => handleTimeChange("start", newValue as Date)}
                minDateTime={new Date()}
                format="dd.MM.yyyy HH:mm"
              />
              <DateTimePicker
                ampm={false}
                label="End time"
                value={endTime}
                onChange={(newValue) => handleTimeChange("end", newValue as Date)}
                minDateTime={startTime || new Date()}
                format="dd.MM.yyyy HH:mm"
                />
            </Box>
            <Box>
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleCreateReservationClick} 
              disabled={reservationsMutation.isPending || selectedPersonnelIds.length === 0 || !selectedFactory || !startTime || !endTime}>
                Create reservation
              </Button>
            </Box>
          </Box>
      </Box>
      <Box>
        {reservationsData && reservationsData.map((reservation) => (
          <Box key={reservation.id} sx={{ mt: 4, p: 2, border: "1px solid #ccc", borderRadius: "8px" }}>
            <Typography>Reservation ID: {reservation.id}</Typography>
            <Typography>Factory: {reservation.factoryName}</Typography>
            <Typography>Personnel IDs: </Typography>
            <Typography>Start Time: {new Date(reservation.startTime).toLocaleString()}</Typography>
            <Typography>End Time: {new Date(reservation.endTime).toLocaleString()}</Typography>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 2 }}
              onClick={() => reservationDeleteMutation.mutate(reservation)}
              disabled={reservationDeleteMutation.isPending}
            >
              Delete reservation
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  )
};

export default ReservationsManagement;