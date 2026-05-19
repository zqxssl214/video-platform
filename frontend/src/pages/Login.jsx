import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    try {
      const res = await fetch(`${API_URL}/api/login`, {
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '95vh', padding: '20px' }}>
      
      {/* КНОПКА ВОЗВРАТА НА ГЛАВНУЮ */}
      <div style={{ width: '100%', maxWidth: '460px', marginBottom: '15px', display: 'flex', justifyContent: 'flex-start' }}>
        <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '16px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }}
             onMouseEnter={(e) => e.target.style.color = '#fff'}
             onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}>
          ← На главную
        </Link>
      </div>

      <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '35px', letterSpacing: '4px' }}>YADRO</div>
      
      {/* ТАБЫ */}
      <div style={{ display: 'flex', gap: '30px', marginBottom: '25px', fontSize: '18px' }}>
        <Link to="/register" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Регистрация</Link>
        <span style={{ fontWeight: 'bold', borderBottom: '3px solid #fff', paddingBottom: '6px' }}>Код доступа</span>
      </div>

      <div className="blueprint-card" style={{ width: '100%', boxSizing: 'border-box' }}>        <form onSubmit={handleLogin}>
          <div style={{ fontSize: '15px', color: '#444', textAlign: 'center', marginBottom: '25px', fontWeight: '500', lineHeight: '1.6' }}>
            Укажите электронную почту для проверки доступа к трансляции
          </div>
          
          <input 
            type="email" 
            placeholder="my_email@mail.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', boxSizing: 'border-box', padding: '14px', marginBottom: '25px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '16px', outline: 'none' }}
          />

          <button type="submit" style={{ width: '100%', padding: '16px', background: '#3b38b6', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '17px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(59,56,182,0.35)' }}>
            Войти по почте
          </button>
        </form>

        {status && <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '16px', fontWeight: 'bold', color: 'green' }}>{status}</p>}
        {error && <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '16px', fontWeight: 'bold', color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}