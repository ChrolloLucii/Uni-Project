"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function JudgeRegistration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nickname: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    // Проверка валидности токена
    if (!token) {
      setLoading(false);
      setError('Недействительная ссылка приглашения');
      return;
    }

    fetch(`http://localhost:4000/api/invites/verify-token?token=${token}`)
      .then(res => {
        if (!res.ok) throw new Error('Токен недействителен или уже использован');
        return res.json();
      })
      .then(data => {
        if (!data.valid) throw new Error('Недействительный токен');
        setTokenValid(true);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch('http://localhost:4000/api/invites/register-judge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        ...formData
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Ошибка при регистрации');
      return res.json();
    })
    .then(data => {
      alert('Регистрация успешна! Теперь вы можете войти в систему.');
      router.push('/login');
    })
    .catch(err => {
      console.error('Ошибка:', err);
      setError(err.message);
      setLoading(false);
    });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">
    <div className="text-xl font-semibold">Загрузка...</div>
  </div>;

  if (!tokenValid) return <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p className="font-bold">Ошибка</p>
      <p>{error || 'Недействительная ссылка приглашения'}</p>
    </div>
    <button 
      onClick={() => router.push('/')}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Вернуться на главную
    </button>
  </div>;

  return (
    <div className="flex min-h-screen bg-[url('/circle-scatter-haikei.svg')] bg-cover bg-center items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1c223a] p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-white">Регистрация судьи</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Имя пользователя</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
              placeholder="Введите имя пользователя"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
              placeholder="Введите email"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Никнейм</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
              placeholder="Введите никнейм"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
              placeholder="Введите пароль"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 hover:bg-[#b94432] bg-[#e1523d] text-white font-medium rounded-lg"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
}