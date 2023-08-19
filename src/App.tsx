import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
  id: number;
  name: string;
  email: string;
}

const CrudApp: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const apiUrl = 'http://localhost:3000/api/users/';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiUrl);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async () => {
    try {
      const newUser: User = {
        id: 0,
        name,
        email,
      };
      const response = await axios.post(apiUrl, newUser);
      setUsers([...users, response.data]);
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const editUser = (id: number) => {
    const userToEdit = users.find((user) => user.id === id);
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setEditingUserId(id);
    }
  };

  const updateUser = async () => {
    try {
      if (editingUserId !== null) {
        const updatedUser: User = {
          id: editingUserId,
          name,
          email,
        };
        await axios.put(`${apiUrl}/${editingUserId}`, updatedUser);
        const updatedUsers = users.map((user) =>
          user.id === editingUserId ? updatedUser : user
        );
        setUsers(updatedUsers);
        setName('');
        setEmail('');
        setEditingUserId(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">CRUD App for Users</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {editingUserId !== null ? (
          <button className="btn btn-primary mt-2" onClick={updateUser}>
            Update User
          </button>
        ) : (
          <button className="btn btn-success mt-2" onClick={createUser}>
            Add User
          </button>
        )}
      </div>
      <ul className="list-group">
        {users.map((user) => (
          <li className="list-group-item d-flex justify-content-between" key={user.id}>
            <div>
              {user.id} - {user.name} - {user.email}
            </div>
            <div>
              <button className="btn btn-warning mr-2" onClick={() => editUser(user.id)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => deleteUser(user.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudApp;
