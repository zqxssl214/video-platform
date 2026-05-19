import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'Нина');
  const [isEditingName, setIsEditingName] = useState(false);
  const [videos, setVideos] = useState([]);

  const loadData = async () => {
    try {
      const resV = await fetch('http://127.0.0.1:5000/api/videos');
      const dataV = await resV.json();
      setVideos(dataV);

      const resC = await fetch('http://127.0.0.1:5000/api/chat');
      const dataC = await resC.json();
      setMessages(dataC);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userName, text: inputText })
      });
      setInputText('');
      loadData();
    } catch (e) { console.error(e); }
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', file.name.split('.')[0]);

    try {
      await fetch('http://127.0.0.1:5000/api/upload', { method: 'POST', body: formData });
      loadData();
    } catch (e) { alert('Ошибка загрузки'); }
  };

  return (
    <div style={{ padding: '30px 50px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* ХЕДЕР */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
        <div style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '4px', color: '#fff' }}>YADRO</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link to="/register" className="nav-link">Регистрация</Link>
          <Link to="/login" className="nav-link">Вход</Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '10px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '30px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>{userName}</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', cursor: 'pointer' }}>
              👤
            </div>
          </div>
        </div>
      </header>

      {/* СЕТКА ПЛЕЕРА И ЧАТА */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.7fr 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* ЛЕВАЯ ЧАСТЬ: ПЛЕЕР */}
        <div>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '20px', padding: '8px', aspectRatio: '16/9', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>
            {videos.length > 0 ? (
              <video src={videos[videos.length - 1].url} controls autoPlay style={{ width: '100%', height: '100%', borderRadius: '14px' }} />
            ) : (
              <div style={{ textAlign: 'center', opacity: 0.6 }}>
                <p style={{ fontSize: '60px', margin: '0 0 15px 0' }}>🔺</p>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>Ожидание видеопотока YADRO...</p>
              </div>
            )}

            <label style={{ position: 'absolute', bottom: '25px', left: '25px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.25)' }}>
              📁 Загрузить поток
              <input type="file" accept="video/*" onChange={handleUploadVideo} style={{ display: 'none' }} />
            </label>
          </div>
          <h2 style={{ marginTop: '25px', fontSize: '22px', fontWeight: '600', color: '#fff', letterSpacing: '0.5px' }}>
            {videos.length > 0 ? videos[videos.length - 1].title : 'Трансляция не запущена'}
          </h2>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: ЧАТ */}
        <div style={{ background: 'rgba(15, 13, 58, 0.75)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', height: '600px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
          
          {/* Убрали лишнюю вкладку, оставили чистый заголовок */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '18px 24px', fontSize: '15px' }}>
            <span style={{ fontWeight: 'bold', borderBottom: '2px solid #7c75ff', paddingBottom: '10px', color: '#fff', letterSpacing: '0.5px' }}>Общий чат</span>
          </div>

          {/* Сообщения */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#b4b7ff', fontWeight: '700' }}>{msg.user}</span>
                  <span style={{ fontSize: '12px', opacity: 0.5 }}>❤️ {msg.likes}</span>
                </div>
                <div style={{ fontSize: '14px', color: '#f5f5f5', lineHeight: '1.45' }}>{msg.text}</div>
              </div>
            ))}
          </div>

          {/* Форма */}
          <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
            <textarea 
              className="blueprint-card"
              rows="2"
              placeholder="Текст сообщения..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', resize: 'none', outline: 'none', marginBottom: '12px', fontWeight: '500' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>
                Имя в чате: {isEditingName ? (
                  <input 
                    value={userName} 
                    onChange={(e) => {
                      setUserName(e.target.value);
                      localStorage.setItem('userName', e.target.value);
                    }} 
                    onBlur={() => setIsEditingName(false)}
                    autoFocus
                    style={{ background: '#252175', color: '#fff', border: '1px solid #7c75ff', padding: '3px 8px', borderRadius: '4px', width: '90px', outline: 'none' }}
                  />
                ) : (
                  <span onClick={() => setIsEditingName(true)} style={{ textDecoration: 'underline', cursor: 'pointer', color: '#b4b7ff', fontWeight: '600' }}>{userName}</span>
                )}
              </div>
              <button type="submit" style={{ background: '#5851f2', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(88,81,242,0.4)' }}>Отправить</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}