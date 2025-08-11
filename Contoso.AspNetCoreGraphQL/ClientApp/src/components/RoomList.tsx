import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useQuery, useMutation, gql } from '@apollo/client';
import axios from 'axios';

interface Room {
  id: number;
  number: number;
  name: string;
  status: number;
  allowedSmoking: boolean;
}

const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      number
      name
      status
      allowedSmoking
    }
  }
`;

const CREATE_ROOM = gql`
  mutation CreateRoom($number: Int!, $name: String!, $status: RoomStatus!, $allowedSmoking: Boolean!) {
    createRoom(number: $number, name: $name, status: $status, allowedSmoking: $allowedSmoking) {
      id
      number
      name
      status
      allowedSmoking
    }
  }
`;

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    number: 0,
    name: '',
    status: 0,
    allowedSmoking: false
  });
  const [useGraphQL, setUseGraphQL] = useState(true);
  const [error, setError] = useState<string>('');
  
  // GraphQL hooks
  const { data: graphqlData, loading: graphqlLoading, refetch } = useQuery(GET_ROOMS, {
    skip: !useGraphQL,
    onError: (err) => setError(`GraphQL Error: ${err.message}`)
  });
  
  const [createRoomMutation] = useMutation(CREATE_ROOM);

  // REST API functions
  const fetchRoomsRest = async () => {
    try {
      const response = await axios.get<Room[]>('/api/rooms');
      setRooms(response.data);
      setError('');
    } catch (err: any) {
      setError(`REST API Error: ${err.message}`);
    }
  };

  const createRoomRest = async (room: Omit<Room, 'id'>) => {
    try {
      await axios.post('/api/rooms', room);
      fetchRoomsRest();
      setError('');
    } catch (err: any) {
      setError(`REST API Error: ${err.message}`);
    }
  };

  const deleteRoomRest = async (id: number) => {
    try {
      await axios.delete(`/api/rooms/${id}`);
      fetchRoomsRest();
      setError('');
    } catch (err: any) {
      setError(`REST API Error: ${err.message}`);
    }
  };

  useEffect(() => {
    if (useGraphQL && graphqlData) {
      setRooms(graphqlData.rooms);
    } else if (!useGraphQL) {
      fetchRoomsRest();
    }
  }, [useGraphQL, graphqlData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useGraphQL) {
      try {
        await createRoomMutation({
          variables: {
            number: formData.number,
            name: formData.name,
            status: formData.status,
            allowedSmoking: formData.allowedSmoking
          }
        });
        refetch();
        setError('');
      } catch (err: any) {
        setError(`GraphQL Error: ${err.message}`);
      }
    } else {
      await createRoomRest({
        number: formData.number,
        name: formData.name,
        status: formData.status,
        allowedSmoking: formData.allowedSmoking
      });
    }
    
    setShowModal(false);
    setFormData({ number: 0, name: '', status: 0, allowedSmoking: false });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      await deleteRoomRest(id);
    }
  };

  const handleAdd = () => {
    setFormData({ number: 0, name: '', status: 0, allowedSmoking: false });
    setShowModal(true);
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Available';
      case 1: return 'Occupied';
      case 2: return 'Maintenance';
      default: return 'Unknown';
    }
  };

  if (useGraphQL && graphqlLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Rooms Management</h2>
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
            Add Room
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Number</th>
            <th>Name</th>
            <th>Status</th>
            <th>Smoking Allowed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>{room.number}</td>
              <td>{room.name}</td>
              <td>{getStatusText(room.status)}</td>
              <td>{room.allowedSmoking ? 'Yes' : 'No'}</td>
              <td>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDelete(room.id)}
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
          <Modal.Title>Add Room</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Room Number</Form.Label>
              <Form.Control
                type="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
              >
                <option value={0}>Available</option>
                <option value={1}>Occupied</option>
                <option value={2}>Maintenance</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Smoking Allowed"
                checked={formData.allowedSmoking}
                onChange={(e) => setFormData({ ...formData, allowedSmoking: e.target.checked })}
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

export default RoomList;