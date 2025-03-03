"use client";
import {useState} from 'react';

export default function LoginForm({onLogin}){
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await fetch('api/auth/',{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({"username" : userName , "password" : password})
            });
            const data = await res.json();
            if (res.ok){
                onLogin(data.token);
            }
            else {
                setError (data.message || 'Что-то пошло не так');
            }
        }
        catch(err){
            setError('Что-то пошло не так');
            console.log(err);
        }
        
    };

    const handleLogout = () => {
        const res = fetch('api/logout/', {
            method: 'POST',
        });
        res.then(() => {
            onLogin(null);
        })
    }
    return(
        <div className='min-h-[75vh] flex items-center justify-center'>
        <form onSubmit = {handleSubmit}>
                <div>
                    <div className="bg-black bg-opacity-70 p- rounded-lg text-center">
                    <h1 className="text-2xl text-orange-500 mb-4">Добро пожаловать</h1>
                    <p className="text-sm mb-6">Уважаемый организатор, введите Логин и пароль, который вы получили от Админа</p>
                </div>
                <label>
                    <input className = "w-full p-4 mb-4 bg-gray-800 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value = {userName}
                        onChange = {(e) => setUserName(e.target.value)}
                        placeholder="Username"
                    />
                </label>
                <label>

                    <input className = "w-full p-4 mb-4 bg-gray-800 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </label>

            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button className='w-full p-4 bg-orange-500 text-white rounded-lg font-semibold text-lg hover:bg-orange-600 transition duration-300' type ="submit">Login</button>

        </form>
        <button onClick = {handleLogout}>Logout</button>
        </div>
    );
}