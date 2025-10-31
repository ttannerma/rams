export interface Reservation {
  id: string;
  personalId: string[];
  factoryName: string;
  startTime: string;
  endTime: string;
}

const useReservations = () => {
  const API_URL = 'http://localhost:8080/reservations';

  const getReservations = async (): Promise<Reservation[]> => {
    try {
      const reservations: Reservation[] = await fetch(API_URL).then((res) =>
        res.json()
      );
      return reservations;
    } catch (err) {
      console.error(err, 'Error fetching reservations');
      return [];
    }
  };

  const addNewReservation = async (
    reservation: Reservation
  ): Promise<Reservation> => {
    try {
      const newReservation: Reservation = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
      }).then((res) => res.json());
      return newReservation;
    } catch (err) {
      console.error(err, 'Error adding new reservation');
      throw err;
    }
  };

  const deleteReservation = async (
    reservation: Reservation
  ): Promise<Reservation> => {
    try {
      const reservationId = reservation.id;
      const result = await fetch(`${API_URL}/${reservationId}`, {
        method: 'DELETE',
      }).then((res) => res.json());
      return result;
    } catch (err) {
      console.error(err, 'Error deleting reservation');
      throw err;
    }
  };
  return { getReservations, addNewReservation, deleteReservation };
};

export default useReservations;
