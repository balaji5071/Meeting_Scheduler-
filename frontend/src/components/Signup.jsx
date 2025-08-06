import React, { useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/signup', formData);
      login(res.data.token); 
    } catch (err) {
      alert('Error signing up. User might already exist.');
    }
  };

  return (
    <div>
        <form onSubmit={onSubmit}>
        <h2>Sign Up</h2>
        <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Name" required />
        <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email" required />
        <input type="password" name="password" value={formData.password} onChange={onChange} placeholder="Password" required />
        <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Signup;