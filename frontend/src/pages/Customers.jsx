import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, UserPlus, Phone, MapPin, Edit2, Trash2 } from 'lucide-react';

import { AuthContext } from '../context/AuthContext';

const Customers = () => {
    const { user: currentUser } = React.useContext(AuthContext);
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', profileImage: '', imageName: '' });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        const res = await api.get('/customers');
        setCustomers(res.data);
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setFormData(customer);
        setImagePreview(customer.profileImage || null);
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({ ...formData, profileImage: reader.result, imageName: file.name });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/customers', formData);
            setShowModal(false);
            setEditingCustomer(null);
            setFormData({ name: '', phone: '', email: '', address: '', profileImage: '', imageName: '' });
            setImagePreview(null);
            fetchCustomers();
        } catch (err) {
            alert('Error saving customer');
        }
    };

    const deleteCustomer = async (id) => {
        if (window.confirm('Delete this customer?')) {
            await api.delete(`/customers/${id}`);
            fetchCustomers();
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Customer Directory</h2>
                <button className="btn btn-primary d-flex align-items-center" onClick={() => { setEditingCustomer(null); setFormData({ name: '', phone: '', email: '', address: '', profileImage: '', imageName: '' }); setImagePreview(null); setShowModal(true); }}>
                    <UserPlus size={18} className="me-2" /> Add Customer
                </button>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3">Full Name</th>
                                    <th className="py-3">Phone</th>
                                    <th className="py-3">Email</th>
                                    <th className="py-3">Address</th>
                                    <th className="py-3 text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map(c => (
                                    <tr key={c.id}>
                                        <td className="px-4 fw-semibold text-primary d-flex align-items-center">
                                            {c.profileImage ? (
                                                <img src={c.profileImage} alt={c.name} className="rounded-circle me-3 border border-2 border-white shadow-sm" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                            ) : (
                                                <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3 shadow-sm border border-2 border-white" style={{ width: '40px', height: '40px' }}>
                                                    {c.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            {c.name}
                                        </td>
                                        <td className="text-secondary">{c.phone || '-'}</td>
                                        <td className="text-secondary text-truncate" style={{ maxWidth: '200px' }}>{c.email || '-'}</td>
                                        <td className="text-secondary text-truncate" style={{ maxWidth: '250px' }}>{c.address || '-'}</td>
                                        <td className="text-end px-4">
                                            <button className="btn btn-outline-primary btn-sm me-2 border-0" onClick={() => handleEdit(c)}>
                                                <Edit2 size={16} />
                                            </button>
                                            {currentUser?.role === 'ADMIN' && (
                                                <button className="btn btn-outline-danger btn-sm border-0" onClick={() => deleteCustomer(c.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {customers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            No customers found. Click "Add Customer" to create one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title fw-bold">
                                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-4">
                                    <div className="text-center mb-4">
                                        <div className="position-relative d-inline-block">
                                            {imagePreview ? (
                                                <img src={imagePreview} className="rounded-circle border border-4 border-white shadow" style={{ width: '100px', height: '100px', objectFit: 'cover' }} alt="Preview" />
                                            ) : (
                                                <div className="rounded-circle bg-light border border-4 border-white shadow d-flex align-items-center justify-content-center text-muted" style={{ width: '100px', height: '100px' }}>
                                                    <UserPlus size={40} className="opacity-50" />
                                                </div>
                                            )}
                                            <label className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 p-2 shadow border border-2 border-white cursor-pointer hover-scale">
                                                <Edit2 size={12} />
                                                <input type="file" className="d-none" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                        {formData.imageName && <p className="text-muted small mt-2 mb-0 text-truncate" style={{ maxWidth: '150px', margin: '0 auto' }}>{formData.imageName}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Full Name</label>
                                        <input type="text" className="form-control form-control-lg bg-light border-0" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Phone Number</label>
                                            <input type="text" className="form-control bg-light border-0" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Email Address</label>
                                            <input type="email" className="form-control bg-light border-0" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="mb-0">
                                        <label className="form-label small fw-bold">Address</label>
                                        <textarea className="form-control bg-light border-0" rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 pt-0">
                                    <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary px-4 fw-bold">
                                        {editingCustomer ? 'Update Customer' : 'Save Customer'}
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

export default Customers;
