import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ReceiptText, DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AuthContext } from '../context/AuthContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const { user } = React.useContext(AuthContext);
    const [stats, setStats] = useState({ 
        totalInvoices: 0, 
        totalRevenue: 0, 
        lowStockCount: 0, 
        recentInvoices: [],
        salesTrend: {} 
    });

    useEffect(() => {
        api.get('/dashboard/stats').then(res => {
            if (res.data) setStats(res.data);
        });
    }, []);

    const chartData = {
        labels: Object.keys(stats.salesTrend || {}),
        datasets: [
            {
                label: 'Daily Sales (₹)',
                data: Object.values(stats.salesTrend || {}),
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#0d6efd'
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                displayColors: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { callback: (val) => '₹' + val }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="col-md-4">
            <div className={`card border-0 shadow-sm p-4 border-start border-${color} border-5`}>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <small className="text-secondary fw-bold text-uppercase ls-wide" style={{ fontSize: '0.7rem' }}>{title}</small>
                        <h2 className="mb-0 fw-bold mt-1">{value}</h2>
                    </div>
                    <div className={`bg-${color} bg-opacity-10 p-3 rounded-3`}>
                        <Icon size={28} className={`text-${color}`} />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Business Overview</h2>
                <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                    Today is {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
                </span>
            </div>

            <div className="row g-4 mb-4">
                <StatCard title="Total Bills" value={stats.totalInvoices || 0} icon={ReceiptText} color="primary" />
                <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} icon={DollarSign} color="success" />
                <StatCard title="Low Stock Alerts" value={stats.lowStockCount || 0} icon={AlertTriangle} color="danger" />
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold d-flex align-items-center">
                                <TrendingUp size={20} className="me-2 text-primary" /> Sales Trend
                            </h5>
                        </div>
                        <div className="card-body px-4 pb-4">
                            {Object.keys(stats.salesTrend || {}).length > 0 ? (
                                <div style={{ height: '300px' }}>
                                    <Line data={chartData} options={chartOptions} />
                                </div>
                            ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5 text-muted bg-light rounded-3">
                                    <TrendingUp size={48} className="mb-3 opacity-20" />
                                    <p className="mb-0">No sales data available yet</p>
                                    <small>Start creating bills to see the trend</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h5 className="mb-0 fw-bold">Recent Items</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="list-group list-group-flush">
                                {stats.recentInvoices.map(inv => (
                                    <div key={inv.id} className="list-group-item border-0 px-4 py-3 bg-transparent">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="fw-bold small">{inv.invoiceNumber}</div>
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{inv.customer?.name || 'N/A'}</div>
                                            </div>
                                            <div className="text-end">
                                                <div className="fw-bold text-primary">₹{inv.totalAmount || 0}</div>
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {stats.recentInvoices.length === 0 && (
                                    <div className="p-4 text-center text-muted small">No recent transactions</div>
                                )}
                            </div>
                        </div>
                        {stats.recentInvoices.length > 0 && (
                            <div className="card-footer bg-white border-0 p-3 pt-0 text-center">
                                <button className="btn btn-link btn-sm text-decoration-none p-0">View All Bills</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
