import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useQuery, useMutation, gql } from '@apollo/client';
import axios from 'axios';

interface Guest {
  id: number;
  name: string;
  registerDate: string;
}

const GET_GUESTS = gql`
  query GetGuests {
    guests {
      id
      name
      registerDate
    }
  }
`;

const CREATE_GUEST = gql`
  mutation CreateGuest($name: String!, $registerDate: DateTime!) {
    createGuest(name: $name, registerDate: $registerDate) {
      id
      name
      registerDate
    }
  }
`;

const UPDATE_GUEST = gql`
  mutation UpdateGuest($id: Int!, $name: String!, $registerDate: DateTime!) {
    updateGuest(id: $id, name: $name, registerDate: $registerDate) {
      id
      name
      registerDate
    }
  }
`;

const DELETE_GUEST = gql`
  mutation DeleteGuest($id: Int!) {
    deleteGuest(id: $id)
  }
`;

const GuestList: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [formData, setFormData] = useState({ name: '', registerDate: '' });
  const [useGraphQL, setUseGraphQL] = useState(true);
  const [error, setError] = useState<string>('');
  
  // GraphQL hooks
  const { data: graphqlData, loading: graphqlLoading, refetch } = useQuery(GET_GUESTS, {
    skip: !useGraphQL,
    onError: (err) => setError(`GraphQL Error: ${err.message}`)
  });
  
  const [createGuestMutation] = useMutation(CREATE_GUEST);
  const [updateGuestMutation] = useMutation(UPDATE_GUEST);
  const [deleteGuestMutation] = useMutation(DELETE_GUEST);

  // REST API functions
  const fetchGuestsRest = async () => {
    try {
      const response = await axios.get<Guest[]>('/api/guests');
      setGuests(response.data);
      setError('');
    } catch (err: any) {
      setError(`REST API Error: ${err.message}`);
    }
  };

  const createGuestRest = async (guest: Omit<Guest, 'id'>) => {
    try {
      await axios.post('/api/guests', guest);
      fetchGuestsRest();
      setError('');
    } catch (err: any) {
      setError(`REST API Error: ${err.message}`);
    }
  };

  const updateGuestRest = async (guest: Guest) => {
    try {
      await axios.put(`/api/guests/${guest.id}`, guest);
      fetchGuestsRest();
      setError('');
    } catch (err: any) {
      setError(`REST API Error: ${err.message}`);
    }
  };

  const deleteGuestRest = async (id: number) => {
    try {
      await axios.delete(`/api/guests/${id}`);
      fetchGuestsRest();
      setError('');
    } catch (err: any) {
      setError(`REST API Error: ${err.message}`);
    }
  };

  useEffect(() => {
    if (useGraphQL && graphqlData) {
      setGuests(graphqlData.guests);
    } else if (!useGraphQL) {
      fetchGuestsRest();
    }
  }, [useGraphQL, graphqlData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useGraphQL) {
      try {
        if (editingGuest) {
          await updateGuestMutation({
            variables: {
              id: editingGuest.id,
              name: formData.name,
              registerDate: formData.registerDate
            }
          });
        } else {
          await createGuestMutation({
            variables: {
              name: formData.name,
              registerDate: formData.registerDate
            }
          });
        }
        refetch();
        setError('');
      } catch (err: any) {
        setError(`GraphQL Error: ${err.message}`);
      }
    } else {
      if (editingGuest) {
        await updateGuestRest({
          ...editingGuest,
          name: formData.name,
          registerDate: formData.registerDate
        });
      } else {
        await createGuestRest({
          name: formData.name,
          registerDate: formData.registerDate
        });
      }
    }
    
    setShowModal(false);
    setEditingGuest(null);
    setFormData({ name: '', registerDate: '' });
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      registerDate: guest.registerDate.split('T')[0] // Format for date input
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      if (useGraphQL) {
        try {
          await deleteGuestMutation({ variables: { id } });
          refetch();
          setError('');
        } catch (err: any) {
          setError(`GraphQL Error: ${err.message}`);
        }
      } else {
        await deleteGuestRest(id);
      }
    }
  };

  const handleAdd = () => {
    setEditingGuest(null);
    setFormData({ name: '', registerDate: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  if (useGraphQL && graphqlLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Guests Management</h2>
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
            Add Guest
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Register Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.id}>
              <td>{guest.id}</td>
              <td>{guest.name}</td>
              <td>{new Date(guest.registerDate).toLocaleDateString()}</td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEdit(guest)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDelete(guest.id)}
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
          <Modal.Title>{editingGuest ? 'Edit Guest' : 'Add Guest'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
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
              <Form.Label>Register Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.registerDate}
                onChange={(e) => setFormData({ ...formData, registerDate: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingGuest ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default GuestList;