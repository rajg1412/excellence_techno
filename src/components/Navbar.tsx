'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
        router.refresh();
    };

    return (
        <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)' }}>
            <h1 onClick={() => router.push('/')} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', cursor: 'pointer' }}>TechHub</h1>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <a href="/">Home</a>

                {user ? (
                    <>
                        <a href="/profile">Profile</a>
                        {user.role === 'admin' && <a href="/admin">Admin Panel</a>}
                        <button
                            onClick={handleLogout}
                            style={{ background: 'var(--danger)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <a href="/login" style={{ color: 'var(--primary)' }}>Login</a>
                        <a href="/register" style={{ border: '1px solid var(--primary)', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>Register</a>
                    </>
                )}
            </div>
        </nav>
    );
}
