import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

import { AuthContext } from '../context/AuthContext';

const Inventory = () => {
    const { user: currentUser } = React.useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '', gst: '', barcode: '', productImage: '', imageName: '' });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await api.get('/products');
        setProducts(res.data);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: product.quantity,
            gst: product.gst,
            barcode: product.barcode,
            productImage: product.productImage || '',
            imageName: product.imageName || ''
        });
        setImagePreview(product.productImage || null);
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({ ...formData, productImage: reader.result, imageName: file.name });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.post('/products', formData);
            } else {
                await api.post('/products', formData);
            }
            setShowModal(false);
            setEditingProduct(null);
            setFormData({ name: '', category: '', price: '', quantity: '', gst: '', barcode: '', productImage: '', imageName: '' });
            setImagePreview(null);
            fetchProducts();
        } catch (err) {
            alert('Error saving product');
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Delete this product?')) {
            await api.delete(`/products/${id}`);
            fetchProducts();
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Product Inventory</h2>
                <button className="btn btn-primary d-flex align-items-center shadow-sm" onClick={() => { setEditingProduct(null); setFormData({ name: '', category: '', price: '', quantity: '', gst: '', barcode: '', productImage: '', imageName: '' }); setImagePreview(null); setShowModal(true); }}>
                    <Plus size={18} className="me-2" /> Add Product
                </button>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3">Barcode</th>
                                    <th className="py-3">Image</th>
                                    <th className="py-3">Name</th>
                                    <th className="py-3">Category</th>
                                    <th className="py-3">Price</th>
                                    <th className="py-3">Stock</th>
                                    <th className="py-3">GST (%)</th>
                                    <th className="py-3 text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className={p.quantity < 10 ? 'table-warning' : ''}>
                                        <td className="px-4 font-monospace small">{p.barcode}</td>
                                        <td>
                                            {p.productImage ? (
                                                <img src={p.productImage} alt={p.name} className="rounded-circle border shadow-sm" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                            ) : (
                                                <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center shadow-sm border" style={{ width: '40px', height: '40px' }}>
                                                    {p.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="fw-semibold">{p.name}</td>
                                        <td><span className="badge bg-light text-dark border">{p.category}</span></td>
                                        <td className="fw-bold">₹{p.price}</td>
                                        <td>
                                            <span className={`fw-bold ${p.quantity < 10 ? 'text-danger' : 'text-success'}`}>
                                                {p.quantity}
                                            </span>
                                        </td>
                                        <td>{p.gst}%</td>
                                        <td className="text-end px-4">
                                            <button className="btn btn-outline-primary btn-sm me-2 border-0" onClick={() => handleEdit(p)}>
                                                <Edit2 size={16} />
                                            </button>
                                            {currentUser?.role === 'ADMIN' && (
                                                <button className="btn btn-outline-danger btn-sm border-0" onClick={() => deleteProduct(p.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
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
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
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
                                                    <span className="fw-bold fs-4 opacity-50">Image</span>
                                                </div>
                                            )}
                                            <label className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 p-2 shadow border border-2 border-white cursor-pointer hover-scale">
                                                <Edit2 size={12} />
                                                <input type="file" className="d-none" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                        {formData.imageName && <p className="text-muted small mt-2 mb-0 text-truncate" style={{ maxWidth: '150px', margin: '0 auto' }}>{formData.imageName}</p>}
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Product Name</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Barcode</label>
                                            <input type="text" className="form-control bg-light border-0" required value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold">Category</label>
                                            <input type="text" className="form-control bg-light border-0" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-bold">Price</label>
                                            <input type="number" className="form-control bg-light border-0" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-bold">Stock</label>
                                            <input type="number" className="form-control bg-light border-0" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-bold">GST (%)</label>
                                            <input type="number" className="form-control bg-light border-0" required value={formData.gst} onChange={e => setFormData({...formData, gst: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 pt-0">
                                    <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary px-4 fw-bold">
                                        {editingProduct ? 'Update Product' : 'Save Product'}
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

export default Inventory;
