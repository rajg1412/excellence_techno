'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(form),
            headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/profile');
            router.refresh();
        } else {
            const data = await res.json();
            setError(data.message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <form onSubmit={handleSubmit} className="animate-fade" style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '400px', border: '1px solid var(--glass-border)' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>
                {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                    <input
                        type="email"
                        required
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'white' }}
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
                    <input
                        type="password"
                        required
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'white' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--primary)', color: 'white', fontWeight: 'bold' }}>
                    Login
                </button>
                <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Don't have an account? <a href="/register" style={{ color: 'var(--primary)' }}>Register</a>
                </p>
            </form>
        </div>
    );
}
