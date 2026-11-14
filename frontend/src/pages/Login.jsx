import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            login(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
                <div className="text-center mb-4">
                    <h3 className="text-primary fw-bold">Retail Billing Login</h3>
                    <p className="text-muted">Enter credentials to access dashboard</p>
                </div>
                {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Username</label>
                        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Password</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center">
                        <LogIn size={18} className="me-2" /> Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
