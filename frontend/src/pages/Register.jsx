import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, last_name: lastName, first_name: firstName })
      });
      if (res.ok) {
        localStorage.setItem('userName', firstName);
        setStatus('Регистрация успешна! Входим...');
        setTimeout(() => navigate('/'), 1200);
      }
    } catch { setStatus('Ошибка сервера'); }
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

      <div style={{ fontSize: '36px', fontWeight: '900', marginBottom: '35px', letterSpacing: '4px', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>YADRO</div>
      
      {/* ТАБЫ (Увеличенные) */}
      <div style={{ display: 'flex', gap: '30px', marginBottom: '25px', fontSize: '18px' }}>
        <span style={{ fontWeight: 'bold', borderBottom: '3px solid #fff', paddingBottom: '6px' }}>Регистрация</span>
        <Link to="/login" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Код доступа</Link>
      </div>

      {/* КАРТОЧКА (Увеличена ширина до 460px и все внутренние отступы) */}
      <div className="blueprint-card" style={{ width: '100%', maxWidth: '460px', padding: '40px', borderRadius: '24px', boxSizing: 'border-box' }}>
        <form onSubmit={handleRegister}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#121042', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Данные для авторизации</div>
          
          <label style={{ fontSize: '14px', color: '#444', fontWeight: '600' }}>Электронная почта *</label>
          <input type="email" placeholder="my_email@mail.com" value={email} onChange={e => setEmail(e.target.value)} required 
                 style={{ width: '100%', boxSizing:'border-box', padding: '14px', margin: '8px 0 24px 0', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '16px', outline: 'none' }}/>

          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#121042', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Прочие данные</div>

          <label style={{ fontSize: '14px', color: '#444', fontWeight: '600' }}>Фамилия *</label>
          <input type="text" placeholder="Введите фамилию" value={lastName} onChange={e => setLastName(e.target.value)} required
                 style={{ width: '100%', boxSizing:'border-box', padding: '14px', margin: '8px 0 18px 0', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '16px', outline: 'none' }}/>

          <label style={{ fontSize: '14px', color: '#444', fontWeight: '600' }}>Имя *</label>
          <input type="text" placeholder="Введите имя" value={firstName} onChange={e => setFirstName(e.target.value)} required
                 style={{ width: '100%', boxSizing:'border-box', padding: '14px', margin: '8px 0 30px 0', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '16px', outline: 'none' }}/>

          <button type="submit" style={{ width: '100%', padding: '16px', background: '#3b38b6', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '17px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(59,56,182,0.35)' }}>Отправить</button>
        </form>
        {status && <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '16px', fontWeight: 'bold', color: '#3b38b6' }}>{status}</p>}
      </div>
    </div>
  );
}