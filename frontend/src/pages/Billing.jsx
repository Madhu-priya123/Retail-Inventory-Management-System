import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Trash2, Printer, CheckCircle, ReceiptText } from 'lucide-react';

const Billing = () => {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [loading, setLoading] = useState(false);
    const [lastInvoice, setLastInvoice] = useState(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '' });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        const [customerRes, productRes] = await Promise.all([
            api.get('/customers'),
            api.get('/products')
        ]);
        setCustomers(customerRes.data);
        setProducts(productRes.data);
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            if (existing.quantity >= product.quantity) {
                alert('Stock limit reached');
                return;
            }
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                if (newQty > 0 && newQty <= products.find(p => p.id === id).quantity) {
                    return { ...item, quantity: newQty };
                }
            }
            return item;
        }));
    };

    const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity * (item.gst / 100)), 0);
    const totalAmount = subTotal + gstTotal;

    const handleQuickCustomer = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/customers', newCustomer);
            setCustomers([...customers, res.data]);
            setSelectedCustomer(res.data.id);
            setShowCustomerModal(false);
            setNewCustomer({ name: '', phone: '', email: '', address: '' });
        } catch (err) {
            alert('Error adding customer');
        } finally {
            setLoading(false);
        }
    };

    const generateInvoice = async () => {
        if (!selectedCustomer || cart.length === 0) {
            alert('Select customer and add products');
            return;
        }
        setLoading(true);
        try {
            const request = {
                customerId: selectedCustomer,
                paymentMethod,
                items: cart.map(item => ({ productId: item.id, quantity: item.quantity }))
            };
            const res = await api.post('/invoices', request);
            setLastInvoice(res.data);
            setCart([]);
            setSelectedCustomer('');
        } catch (err) {
            alert(err.response?.data?.message || 'Billing error');
        } finally {
            setLoading(false);
        }
    };

    const downloadPdf = async (id) => {
        const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.barcode.includes(searchQuery)
    );

    return (
        <div className="row g-4">
            <div className="col-md-7">
                <div className="card h-100">
                    <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Select Items</h5>
                        <div className="input-group w-50">
                            <span className="input-group-text bg-transparent border-end-0"><Search size={16}/></span>
                            <input type="text" className="form-control border-start-0 ps-0" placeholder="Search barcode/name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        </div>
                    </div>
                    <div className="card-body overflow-auto" style={{ maxHeight: '500px' }}>
                        <div className="row g-3">
                            {filteredProducts.map(p => (
                                <div className="col-md-6" key={p.id}>
                                    <div className={`card p-3 border h-100 ${p.quantity === 0 ? 'opacity-50' : 'hover-shadow'}`} style={{ cursor: p.quantity > 0 ? 'pointer' : 'default' }} onClick={() => p.quantity > 0 && addToCart(p)}>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h6 className="mb-1">{p.name}</h6>
                                                <small className="text-muted d-block">{p.category}</small>
                                                <span className="fw-bold">₹{p.price}</span>
                                            </div>
                                            <div className="text-end">
                                                <small className={`badge ${p.quantity < 10 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>Stock: {p.quantity}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-5">
                <div className="card h-100 border-primary">
                    <div className="card-header bg-primary text-white py-3">
                        <h5 className="mb-0 text-white">Current Bill</h5>
                    </div>
                    <div className="card-body d-flex flex-column">
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <label className="form-label small fw-bold mb-0">Customer</label>
                                <button className="btn btn-link btn-sm p-0 d-flex align-items-center text-decoration-none" onClick={() => setShowCustomerModal(true)}>
                                    <Plus size={14} className="me-1" /> New Customer
                                </button>
                            </div>
                            <select className="form-select" value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
                                <option value="">-- Choose Customer --</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
                            </select>
                        </div>

                        <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '300px' }}>
                            {cart.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <ReceiptText size={48} className="opacity-25 mb-2" />
                                    <p>Cart is empty</p>
                                </div>
                            ) : (
                                <table className="table table-sm table-borderless align-middle">
                                    <thead>
                                        <tr className="border-bottom small text-muted">
                                            <th>Item</th>
                                            <th className="text-center">Qty</th>
                                            <th className="text-end">Total</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map(item => (
                                            <tr key={item.id} className="border-bottom-dashed">
                                                <td>
                                                    <span className="d-block small fw-bold">{item.name}</span>
                                                    <small className="text-muted">₹{item.price} + {item.gst}%</small>
                                                </td>
                                                <td className="text-center">
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <button className="btn btn-sm p-0 px-1 border" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                                        <span className="mx-2">{item.quantity}</span>
                                                        <button className="btn btn-sm p-0 px-1 border" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                                    </div>
                                                </td>
                                                <td className="text-end fw-bold">₹{(item.price * item.quantity * (1 + item.gst/100)).toFixed(2)}</td>
                                                <td className="text-end">
                                                    <button className="btn text-danger p-0" onClick={() => removeFromCart(item.id)}><Trash2 size={14}/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="border-top pt-3">
                            <div className="d-flex justify-content-between mb-1">
                                <span className="text-muted small">Subtotal</span>
                                <span>₹{subTotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                <span className="text-muted small">Tax (GST)</span>
                                <span>₹{gstTotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <h4 className="fw-bold">Total</h4>
                                <h4 className="fw-bold text-primary">₹{totalAmount.toFixed(2)}</h4>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Payment Method</label>
                                <div className="d-flex gap-2">
                                    {['CASH', 'CARD', 'UPI'].map(m => (
                                        <button key={m} className={`btn btn-sm py-2 flex-grow-1 ${paymentMethod === m ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPaymentMethod(m)}>{m}</button>
                                    ))}
                                </div>
                            </div>

                            <button className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center" onClick={generateInvoice} disabled={loading || cart.length === 0}>
                                {loading ? 'Processing...' : <><CheckCircle size={20} className="me-2" /> Complete Bill</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {lastInvoice && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0">
                            <div className="modal-body text-center p-5">
                                <div className="bg-success-subtle text-success d-inline-block p-3 rounded-circle mb-3">
                                    <CheckCircle size={64} />
                                </div>
                                <h2 className="fw-bold">Success!</h2>
                                <p className="text-muted mb-4">Invoice <strong>{lastInvoice.invoiceNumber}</strong> has been generated successfully.</p>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-dark py-2 d-flex align-items-center justify-content-center" onClick={() => downloadPdf(lastInvoice.id)}>
                                        <Printer size={18} className="me-2" /> Print/Download PDF
                                    </button>
                                    <button className="btn btn-outline-secondary py-2" onClick={() => setLastInvoice(null)}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCustomerModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title fw-bold">Quick Add Customer</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCustomerModal(false)}></button>
                            </div>
                            <form onSubmit={handleQuickCustomer}>
                                <div className="modal-body p-4">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Full Name</label>
                                            <input type="text" className="form-control" required value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Phone Number</label>
                                            <input type="text" className="form-control" required value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Email (Optional)</label>
                                            <input type="email" className="form-control" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-bold">Address</label>
                                            <textarea className="form-control" rows="2" value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 pt-0">
                                    <button type="button" className="btn btn-light" onClick={() => setShowCustomerModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-dark px-4 fw-bold" disabled={loading}>
                                        {loading ? 'Adding...' : 'Save Customer'}
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

export default Billing;
