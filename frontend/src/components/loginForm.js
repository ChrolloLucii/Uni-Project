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
    return(
        <form onSubmit = {handleSubmit}>
            <div>
                <label>
                    Username :
                    <input className = "text-black"
                        value = {userName}
                        onChange = {(e) => setUserName(e.target.value)}
                        placeholder="Enter Username"
                    />
                </label>
                <label>
                    Password
                    <input className = "text-black"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                    />
                </label>

            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type ="submit">Login</button>
        </form>
    );
}