import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlus, Trash2, Shield, User as UserIcon, Camera, Briefcase, Info } from 'lucide-react';

import { AuthContext } from '../context/AuthContext';

const Users = () => {
    const { user: currentUser } = React.useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', fullName: '', role: 'STAFF', profileImage: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setNewUser({ ...newUser, profileImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/users', newUser);
            setShowModal(false);
            setNewUser({ username: '', password: '', fullName: '', role: 'STAFF', profileImage: '' });
            setImagePreview(null);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user. Ensure you have permission.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (err) {
                alert('Failed to delete user.');
            }
        }
    };

    const adminCount = users.filter(u => u.role === 'ADMIN').length;
    const staffCount = users.filter(u => u.role === 'STAFF').length;

    return (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0">Staff Management</h2>
                    <p className="text-muted small mb-0">Monitor and manage system users and their access levels</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm rounded-pill transition-all hover-scale" onClick={() => setShowModal(true)}>
                    <UserPlus size={18} /> Add New Staff
                </button>
            </div>

            {/* Role Statistics Bar */}
            <div className="row g-3 mb-4">
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm p-3 bg-primary bg-opacity-10 rounded-4">
                        <div className="d-flex align-items-center">
                            <div className="bg-primary text-white p-3 rounded-4 me-3 shadow-sm">
                                <Shield size={24} />
                            </div>
                            <div>
                                <small className="text-muted d-block text-uppercase fw-bold ls-wide" style={{ fontSize: '0.65rem' }}>Administrators</small>
                                <h3 className="mb-0 fw-bold text-primary">{adminCount}</h3>
                                <small className="text-primary-emphasis opacity-75" style={{ fontSize: '0.7rem' }}>Full System Access</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm p-3 bg-info bg-opacity-10 rounded-4">
                        <div className="d-flex align-items-center">
                            <div className="bg-info text-white p-3 rounded-4 me-3 shadow-sm">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <small className="text-muted d-block text-uppercase fw-bold ls-wide" style={{ fontSize: '0.65rem' }}>Staff Members</small>
                                <h3 className="mb-0 fw-bold text-info">{staffCount}</h3>
                                <small className="text-info-emphasis opacity-75" style={{ fontSize: '0.7rem' }}>Billing Operations Only</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm p-3 bg-light rounded-4 h-100 d-flex flex-row align-items-center">
                        <Info size={20} className="text-muted me-3 flex-shrink-0" />
                        <small className="text-muted">
                            Admins can manage products, customers, and other staff members. Staff roles are restricted to billing and invoice management.
                        </small>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {users.length === 0 ? (
                    <div className="col-12 text-center py-5 text-muted">
                        <UserIcon size={48} className="mb-3 opacity-25" />
                        <p>No staff members found. Start by adding one!</p>
                    </div>
                ) : (
                    users.map(u => (
                        <div key={u.id} className="col-md-6 col-lg-4">
                            <div className="card border-0 shadow-sm h-100 user-card overflow-hidden rounded-4 transition-all hover-shadow">
                                <div className={`p-4 text-center border-bottom bg-${u.role === 'ADMIN' ? 'primary' : 'info'} bg-opacity-10`}>
                                    <div className="position-relative d-inline-block mb-3">
                                        {u.profileImage ? (
                                            <img src={u.profileImage} alt={u.fullName} 
                                                className="rounded-circle shadow-sm border border-white border-4" 
                                                style={{ width: '90px', height: '90px', objectFit: 'cover' }} />
                                        ) : (
                                            <div className="rounded-circle bg-white shadow-sm border border-white border-4 d-flex align-items-center justify-content-center text-muted" 
                                                style={{ width: '90px', height: '90px' }}>
                                                <UserIcon size={40} />
                                            </div>
                                        )}
                                        <div className={`position-absolute bottom-0 end-0 badge rounded-pill bg-${u.role === 'ADMIN' ? 'primary' : 'info'} border border-white border-3 p-2 shadow-sm`}>
                                            {u.role === 'ADMIN' ? <Shield size={14} /> : <Briefcase size={14} />}
                                        </div>
                                    </div>
                                    <h5 className="fw-bold mb-1">{u.fullName}</h5>
                                    <p className="text-muted small mb-0">@{u.username}</p>
                                </div>
                                <div className="card-body p-3 bg-white d-flex justify-content-between align-items-center">
                                    <div className="d-flex flex-column">
                                        <span className={`badge bg-${u.role === 'ADMIN' ? 'primary' : 'info'} bg-opacity-10 text-${u.role === 'ADMIN' ? 'primary' : 'info'} fw-bold border-0 mb-1 px-3 py-2 rounded-pill`} style={{ fontSize: '0.7rem' }}>
                                            {u.role}
                                        </span>
                                        <small className="text-muted ps-2" style={{ fontSize: '0.7rem' }}>
                                            {u.role === 'ADMIN' ? 'Full System Access' : 'Billing Access Only'}
                                        </small>
                                    </div>
                                    {currentUser?.role === 'ADMIN' && (
                                        <button className="btn btn-outline-danger border-0 rounded-circle p-2 hover-bg-danger-soft transition-all" 
                                            onClick={() => handleDelete(u.id)} title="Remove Staff Member">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Creation Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }}>
                    <div className="modal-dialog modal-dialog-centered shadow-lg">
                        <div className="modal-content border-0 rounded-4 overflow-hidden">
                            <form onSubmit={handleCreate}>
                                <div className="modal-header border-0 bg-white p-4 pb-0 d-flex justify-content-between align-items-center">
                                    <h5 className="modal-title fw-bold">Create Staff Account</h5>
                                    <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body p-4 pt-4 bg-white">
                                    {error && (
                                        <div className="alert alert-danger border-0 shadow-sm small py-2 rounded-3 mb-4 d-flex align-items-center">
                                            <Info size={16} className="me-2" /> {error}
                                        </div>
                                    )}
                                    
                                    <div className="text-center mb-4">
                                        <div className="position-relative d-inline-block">
                                            {imagePreview ? (
                                                <img src={imagePreview} className="rounded-circle border border-white border-4 shadow-sm" style={{ width: '100px', height: '100px', objectFit: 'cover' }} alt="Preview" />
                                            ) : (
                                                <div className="rounded-circle bg-light border border-white border-4 shadow-sm d-flex align-items-center justify-content-center text-muted" style={{ width: '100px', height: '100px' }}>
                                                    <Camera size={32} />
                                                </div>
                                            )}
                                            <label className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 p-2 shadow-sm border border-white border-3 cursor-pointer transition-all hover-scale">
                                                <Camera size={14} />
                                                <input type="file" className="d-none" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                        <p className="text-muted small mt-2 mb-0 fw-bold text-uppercase ls-wide" style={{ fontSize: '0.65rem' }}>Upload profile photo</p>
                                    </div>

                                    <div className="bg-light p-4 rounded-4">
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-uppercase ls-wide text-muted mb-1" style={{ fontSize: '0.65rem' }}>Full Name</label>
                                            <input type="text" className="form-control border-0 py-2 px-3 rounded-3 shadow-sm" placeholder="e.g. Abhi Raj Singh" required
                                                value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-uppercase ls-wide text-muted mb-1" style={{ fontSize: '0.65rem' }}>Username</label>
                                            <input type="text" className="form-control border-0 py-2 px-3 rounded-3 shadow-sm" placeholder="Choose unique login ID" required
                                                value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label small fw-bold text-uppercase ls-wide text-muted mb-1" style={{ fontSize: '0.65rem' }}>Password</label>
                                                <input type="password" width="100%" className="form-control border-0 py-2 px-3 rounded-3 shadow-sm" placeholder="••••••••" required
                                                    value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label small fw-bold text-uppercase ls-wide text-muted mb-1" style={{ fontSize: '0.65rem' }}>Account Role</label>
                                                <select className="form-select border-0 py-2 px-3 rounded-3 shadow-sm" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                                    <option value="STAFF">Staff</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 pt-0 bg-white">
                                    <button type="button" className="btn btn-link text-decoration-none text-muted fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary px-5 py-2 rounded-pill shadow-sm fw-bold transition-all hover-shadow" disabled={loading}>
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
