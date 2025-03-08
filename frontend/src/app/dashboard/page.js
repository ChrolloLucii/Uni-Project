"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasOrganizerAccess } from '@/utils/authUtil';

export default function OrganizerDashboard() {
  const router = useRouter();
  const [inviteTokens, setInviteTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);
  const [organizerName, setOrganizerName] = useState("");

  // Проверка авторизации и загрузка данных
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !hasOrganizerAccess(token)) {
      router.push('/login?redirect=dashboard');
      return;
    }

 
    fetch('http://localhost:4000/api/organizer/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Не удалось загрузить профиль');
      return res.json();
    })
    .then(data => {
      setOrganizerName(data.name || 'Организатор');
      
   
      return fetch('http://localhost:4000/api/organizer/judge-tokens', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    })
    .then(res => {
      if (!res.ok) throw new Error('Не удалось загрузить токены приглашений');
      return res.json();
    })
    .then(tokens => {
      setInviteTokens(tokens);
      setLoading(false);
    })
    .catch(err => {
      console.error('Ошибка:', err);
      setError(err.message);
      setLoading(false);
    });
  }, [router]);


  const generateToken = () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:4000/api/organizer/generate-judge-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Не удалось создать приглашение');
      return res.json();
    })
    .then(newToken => {
      setInviteTokens([...inviteTokens, newToken]);
      setLoading(false);
    })
    .catch(err => {
      console.error('Ошибка:', err);
      setError(err.message);
      setLoading(false);
    });
  };


  const copyInviteLink = (token) => {
    const link = `${window.location.origin}/judge/register?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(token);
    setTimeout(() => setCopiedLink(null), 2000);
  };


  const deleteToken = (id) => {
    if (!confirm('Вы действительно хотите удалить это приглашение?')) return;

    const token = localStorage.getItem('token');
    
    fetch(`http://localhost:4000/api/organizer/judge-tokens/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Не удалось удалить приглашение');
      setInviteTokens(inviteTokens.filter(t => t.id !== id));
    })
    .catch(err => {
      console.error('Ошибка:', err);
      setError(err.message);
    });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">
    <div className="text-2xl font-semibold text-white">Загрузка...</div>
  </div>;

  if (error) return <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="text-xl font-semibold text-red-500 mb-4">Ошибка: {error}</div>
    <button 
      onClick={() => router.push('/login')}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Вернуться на страницу входа
    </button>
  </div>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Панель управления организатора: {organizerName}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Секция управления турнирами */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">Мои турниры</h2>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => router.push('/tournamentCreation')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                Создать новый турнир
              </button>
            </div>
            <p className="text-gray-400">Перейдите на главную страницу, чтобы увидеть список всех турниров</p>
          </div>
          
          {/* Секция управления судьями */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">Управление судьями</h2>
            <div className="flex justify-end mb-4">
              <button
                onClick={generateToken}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Создание..." : "Сгенерировать приглашение для судьи"}
              </button>
            </div>
            
            {inviteTokens.length === 0 ? (
              <p className="text-gray-400">Нет активных приглашений для судей</p>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Активные приглашения:</h3>
                {inviteTokens.map((token) => (
                  <div key={token.id} className="bg-gray-700 p-4 rounded-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="mb-2 sm:mb-0">
                        <p className="text-sm text-gray-300">
                          Создано: {new Date(token.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-300">
                          Статус: {token.used ? 'Использовано' : 'Активно'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyInviteLink(token.token)}
                          className={`px-3 py-1 rounded text-sm ${
                            copiedLink === token.token
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-600 text-white hover:bg-gray-500'
                          }`}
                        >
                          {copiedLink === token.token ? 'Скопировано!' : 'Скопировать ссылку'}
                        </button>
                        <button
                          onClick={() => deleteToken(token.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                          disabled={token.used}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 bg-gray-800 p-2 rounded text-gray-300 text-xs font-mono break-all">
                      {token.token}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}