"use client";
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function LoginForm({onLogin}){
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"username": userName, "password": password})
            });
    
            if (res.status === 200) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Используем onLogin вместо setLoggedIn
                if (onLogin) onLogin(data.token);
                
                // Редирект на основе роли
                if (data.user.role === 'ORGANIZER') {
                    router.push('/dashboard'); 
                } else {
                    router.push('/');
                }
                
                console.log('Авторизация успешна!');
            } else {
                setError('Неверное имя пользователя или пароль');
            }
        } catch(err) {
            setError('Что-то пошло не так');
            console.log(err);
        }
    };

    return(
        <div className='min-h-[75vh] flex items-center justify-center'>
            <form onSubmit={handleSubmit}>
                <div>
                    <div className="bg-black bg-opacity-70 p- rounded-lg text-center">
                        <h1 className="text-2xl text-[#f44e1c] mb-4">Добро пожаловать</h1>
                        <p className="text-md mb-6">Уважаемый организатор, введите Логин и пароль, который вы получили от Админа</p>
                        <p className="text-sm mb-6 text-[#a8e4a0]">Если вы - судья, введите валидные данные</p>
                    </div>
                    <label>
                        <input className="w-full p-4 mb-4 bg-[#1C223A] text-[#E5D4B6] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Username"
                        />
                    </label>
                    <label>
                        <input className="w-full p-4 mb-4 bg-[#1C223A] text-[#E5D4B6] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </label>
                </div>

                {error && <p style={{ color: '#ff8243' }}>{error}</p>}
                <button className='w-full p-4 bg-[#f44e1c] text-black rounded-lg font-semibold text-lg hover:bg-orange-600 transition duration-300' type="submit">Вход</button>
            </form>
        </div>
    );
}