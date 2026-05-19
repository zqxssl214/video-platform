import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    try {
      const res = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userName', data.user.first_name);
        setStatus('Вход выполнен! Перенаправление...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch {
      setError('Не удалось связаться с сервером');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 20px' }}>
      
      <div style={{ width: '100%', maxWidth: '540px', marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ← На главную
        </Link>
      </div>

      <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: '40px', letterSpacing: '6px' }}>YADRO</div>
      
      <div style={{ display: 'flex', gap: '40px', marginBottom: '30px', fontSize: '22px' }}>
        <Link to="/register" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Регистрация</Link>
        <span style={{ fontWeight: 'bold', borderBottom: '3px solid #fff', paddingBottom: '8px' }}>Код доступа</span>
      </div>

      <div className="blueprint-card" style={{ width: '100%', maxWidth: '540px', padding: '55px 50px', borderRadius: '28px', boxSizing: 'border-box' }}>