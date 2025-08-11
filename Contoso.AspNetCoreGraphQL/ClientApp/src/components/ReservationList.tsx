import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useQuery, useMutation, gql } from '@apollo/client';
import axios from 'axios';

interface Reservation {
  id: number;
  roomId: number;
  guestId: number;
  checkinDate: string;
  checkoutDate: string;
  room?: {
    number: number;
    name: string;
  };
  guest?: {
    name: string;
  };
}

interface Guest {
  id: number;
  name: string;
}

interface Room {
  id: number;
  number: number;
  name: string;
}

const GET_RESERVATIONS = gql`
  query GetReservations {
    reservations {
      id
      roomId
      guestId
      checkinDate
      checkoutDate
      room {
        number
        name
      }
      guest {
        name
      }
    }
  }
`;

const CREATE_RESERVATION = gql`
  mutation CreateReservation($checkinDate: DateTime!, $checkoutDate: DateTime!, $roomId: Int!, $guestId: Int!) {
    createReservation(checkinDate: $checkinDate, checkoutDate: $checkoutDate, roomId: $roomId, guestId: $guestId) {
      id
      checkinDate
      checkoutDate
      roomId
      guestId
    }
  }
`;

const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    roomId: 0,
    guestId: 0,
    checkinDate: '',
    checkoutDate: ''
  });
  const [useGraphQL, setUseGraphQL] = useState(true);
  const [error, setError] = useState<string>('');
  
  // GraphQL hooks
  const { data: graphqlData, loading: graphqlLoading, refetch } = useQuery(GET_RESERVATIONS, {
    skip: !useGraphQL,
    onError: (err) => setError(`GraphQL Error: ${err.message}`)
  });
  
  const [createReservationMutation] = useMutation(CREATE_RESERVATION);

  // REST API functions
  const fetchData = async () => {
    try {
      const [reservationsRes, guestsRes, roomsRes] = await Promise.all([
        axios.get<Reservation[]>('/api/reservations'),
        axios.get<Guest[]>('/api/guests'),
        axios.get<Room[]>('/api/rooms')
      ]);
      setReservations(reservationsRes.data);
      setGuests(guestsRes.data);
      setRooms(roomsRes.data);
      setError('');
    } catch (err: any) {
      setError(`REST API Error: ${err.message}`);
    }
  };

  const createReservationRest = async (reservation: Omit<Reservation, 'id' | 'room' | 'guest'>) => {
    try {
      await axios.post('/api/reservations', reservation);
      fetchData();
      setError('');
    } catch (err: any) {
      setError(`REST API Error: ${err.message}`);
    }
  };

  const deleteReservationRest = async (id: number) => {
    try {
      await axios.delete(`/api/reservations/${id}`);
      fetchData();
      setError('');
    } catch (err: any) {
      setError(`REST API Error: ${err.message}`);
    }
  };

  useEffect(() => {
    if (useGraphQL && graphqlData) {
      setReservations(graphqlData.reservations);
    } else if (!useGraphQL) {
      fetchData();
    }
  }, [useGraphQL, graphqlData]);

  // Always load guests and rooms for dropdowns
  useEffect(() => {
    const loadGuestsAndRooms = async () => {
      try {
        const [guestsRes, roomsRes] = await Promise.all([
          axios.get<Guest[]>('/api/guests'),
          axios.get<Room[]>('/api/rooms')
        ]);
        setGuests(guestsRes.data);
        setRooms(roomsRes.data);
      } catch (err: any) {
        console.error('Failed to load guests and rooms:', err);
      }
    };
    loadGuestsAndRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useGraphQL) {
      try {
        await createReservationMutation({
          variables: {
            checkinDate: formData.checkinDate,
            checkoutDate: formData.checkoutDate,
            roomId: formData.roomId,
            guestId: formData.guestId
          }
        });
        refetch();
        setError('');
      } catch (err: any) {
        setError(`GraphQL Error: ${err.message}`);
      }
    } else {
      await createReservationRest({
        roomId: formData.roomId,
        guestId: formData.guestId,
        checkinDate: formData.checkinDate,
        checkoutDate: formData.checkoutDate
      });
    }
    
    setShowModal(false);
    setFormData({ roomId: 0, guestId: 0, checkinDate: '', checkoutDate: '' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      await deleteReservationRest(id);
    }
  };

  const handleAdd = () => {
    setFormData({
      roomId: 0,
      guestId: 0,
      checkinDate: new Date().toISOString().split('T')[0],
      checkoutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] // tomorrow
    });
    setShowModal(true);
  };

  if (useGraphQL && graphqlLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Reservations Management</h2>
        <div>
          <Form.Check 
            type="switch"
            id="api-switch"
            label={`Using ${useGraphQL ? 'GraphQL' : 'REST API'}`}
            checked={useGraphQL}
            onChange={(e) => setUseGraphQL(e.target.checked)}
            className="d-inline me-3"
          />
          <Button variant="primary" onClick={handleAdd}>
            Add Reservation
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Guest</th>
            <th>Room</th>
            <th>Check-in Date</th>
            <th>Check-out Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{reservation.guest?.name || `Guest ID: ${reservation.guestId}`}</td>
              <td>{reservation.room ? `${reservation.room.number} - ${reservation.room.name}` : `Room ID: ${reservation.roomId}`}</td>
              <td>{new Date(reservation.checkinDate).toLocaleDateString()}</td>
              <td>{new Date(reservation.checkoutDate).toLocaleDateString()}</td>
              <td>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDelete(reservation.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Reservation</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Guest</Form.Label>
              <Form.Select
                value={formData.guestId}
                onChange={(e) => setFormData({ ...formData, guestId: parseInt(e.target.value) })}
                required
              >
                <option value={0}>Select a guest...</option>
                {guests.map((guest) => (
                  <option key={guest.id} value={guest.id}>
                    {guest.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Room</Form.Label>
              <Form.Select
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: parseInt(e.target.value) })}
                required
              >
                <option value={0}>Select a room...</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.number} - {room.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Check-in Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.checkinDate}
                onChange={(e) => setFormData({ ...formData, checkinDate: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Check-out Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.checkoutDate}
                onChange={(e) => setFormData({ ...formData, checkoutDate: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ReservationList;