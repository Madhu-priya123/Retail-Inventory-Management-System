import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Printer, FileText, Download, Calendar, User } from 'lucide-react';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await api.get('/invoices');
            setInvoices(res.data || []);
        } catch (err) {
            console.error('Failed to fetch invoices', err);
        }
    };

    const downloadPdf = async (id, invoiceNumber) => {
        try {
            const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${invoiceNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            alert('Error downloading PDF');
        }
    };

    const filteredInvoices = invoices.filter(inv => 
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Invoice History</h2>
                <div className="d-flex gap-3">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><Search size={18} className="text-muted" /></span>
                        <input type="text" className="form-control border-start-0 ps-0" placeholder="Search invoices..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3">Invoice #</th>
                                    <th className="py-3">Customer</th>
                                    <th className="py-3">Date</th>
                                    <th className="py-3">Payment</th>
                                    <th className="py-3">Amount</th>
                                    <th className="py-3 text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map(inv => (
                                    <tr key={inv.id}>
                                        <td className="px-4 fw-bold text-primary">
                                            <FileText size={16} className="me-2 opacity-50" />
                                            {inv.invoiceNumber}
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light rounded-circle p-2 me-2">
                                                    <User size={14} className="text-secondary" />
                                                </div>
                                                <div>
                                                    <div className="fw-semibold small">{inv.customer?.name || 'N/A'}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>{inv.customer?.phone || 'No phone'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="small text-secondary">
                                                <Calendar size={14} className="me-1 opacity-50" />
                                                {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill px-3 ${
                                                inv.paymentMethod === 'CASH' ? 'bg-success-subtle text-success border border-success' :
                                                inv.paymentMethod === 'CARD' ? 'bg-primary-subtle text-primary border border-primary' :
                                                'bg-info-subtle text-info border border-info'
                                            }`}>
                                                {inv.paymentMethod || 'CASH'}
                                            </span>
                                        </td>
                                        <td className="fw-bold">₹{inv.totalAmount ? inv.totalAmount.toLocaleString('en-IN') : '0.00'}</td>
                                        <td className="text-end px-4">
                                            <button className="btn btn-outline-dark btn-sm rounded-pill px-3 d-inline-flex align-items-center" onClick={() => downloadPdf(inv.id, inv.invoiceNumber)}>
                                                <Download size={14} className="me-1" /> PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredInvoices.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            <FileText size={48} className="mb-3 opacity-20" />
                                            <p className="mb-0">No invoices found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoices;
