import React, { useState } from 'react';
import api from '../services/api';
import { Lock, Key, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [settings, setSettings] = useState({
        theme: 'default',
        email: '',
        autoEmailPdf: false
    });

    React.useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setSettings({
                theme: res.data.theme || 'default',
                email: res.data.email || '',
                autoEmailPdf: res.data.autoEmailPdf || false
            });
            document.body.setAttribute('data-theme', res.data.theme || 'default');
        } catch (err) {
            console.error('Failed to fetch profile', err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'danger', text: 'Passwords do not match!' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put('/users/profile/password', { newPassword });
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setMessage({ type: 'danger', text: 'Failed to update password.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/users/profile/settings', settings);
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
            document.body.setAttribute('data-theme', settings.theme);
        } catch (err) {
            setMessage({ type: 'danger', text: 'Failed to save settings.' });
        } finally {
            setLoading(false);
        }
    };

    const themes = [
        { id: 'default', name: 'Light (Blue)', color: '#0d6efd' },
        { id: 'dark', name: 'Dark Mode', color: '#212529' },
        { id: 'ocean', name: 'Ocean Teal', color: '#008080' },
        { id: 'sunset', name: 'Sunset Orange', color: '#f97316' }
    ];

    return (
        <div className="animate-fade-in max-w-md mx-auto">
            <div className="mb-4">
                <h2 className="fw-bold mb-0 text-center">Your Profile</h2>
                <p className="text-muted text-center">Manage your account security</p>
            </div>

            <div className="card border-0 shadow-sm mx-auto mb-4" style={{ maxWidth: '450px' }}>
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">Application Settings</h5>
                    
                    <form onSubmit={handleSettingsSave}>
                        <div className="mb-4">
                            <label className="form-label small fw-bold">Select Theme</label>
                            <div className="row g-2">
                                {themes.map(t => (
                                    <div key={t.id} className="col-6">
                                        <div 
                                            className={`p-3 border rounded cursor-pointer text-center ${settings.theme === t.id ? 'border-primary border-2 shadow-sm' : ''}`}
                                            style={{ cursor: 'pointer', backgroundColor: t.id === 'dark' ? '#212529' : '#f8f9fa', color: t.id === 'dark' ? '#fff' : '#000' }}
                                            onClick={() => setSettings({ ...settings, theme: t.id })}
                                        >
                                            <div className="rounded-circle mx-auto mb-2" style={{ backgroundColor: t.color, width: '20px', height: '20px' }}></div>
                                            <span className="small">{t.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold">Notification Email</label>
                            <input type="email" className="form-control bg-light" 
                                placeholder="name@example.com"
                                value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} />
                            <div className="form-text small">Email where you want to receive system alerts.</div>
                        </div>

                        <div className="form-check form-switch mb-4">
                            <input className="form-check-input" type="checkbox" id="autoEmail"
                                checked={settings.autoEmailPdf} onChange={e => setSettings({ ...settings, autoEmailPdf: e.target.checked })} />
                            <label className="form-check-label small fw-bold" htmlFor="autoEmail">
                                Auto Email Invoice PDF to Customer
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm" disabled={loading}>
                            Save Preferences
                        </button>
                    </form>
                </div>
            </div>

            <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '450px' }}>
                <div className="card-body p-4">
                    <div className="text-center mb-4">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block">
                            <Lock size={32} className="text-primary" />
                        </div>
                    </div>

                    {message.text && (
                        <div className={`alert alert-${message.type} d-flex align-items-center gap-2 small py-2`}>
                            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdate}>
                        <h5 className="fw-bold mb-3 text-center">Change Password</h5>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">New Password</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <Key size={18} className="text-muted" />
                                </span>
                                <input type="password" width="100%" className="form-control border-start-0 bg-light" 
                                    placeholder="Enter new password" required
                                    value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold">Confirm Password</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <Key size={18} className="text-muted" />
                                </span>
                                <input type="password" width="100%" className="form-control border-start-0 bg-light" 
                                    placeholder="Re-type new password" required
                                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-outline-primary w-100 py-2 fw-bold" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
