"use client"
import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

export default function InviteRegistration(){
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: '',
    email: '',
  });
  
  const [error, setError] = useState('');


  const handleChange = (e) => {
    setFormData(prev => ({...prev, [e.target.name] : e.target.value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch('/api/register', {

            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({token, ...formData})
        });
        const data = await res.json();
     if (res.ok){
         router.push('/login');
     } else{
        setError(data.message);
     }
    }
    catch(error){
      setError('Something went Wrong!!!')
    }
  }
  if (!token) return <p> Invalid link</p>
  return(
    <div>
      <h2>Регистрация по инвайту</h2>

      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="nickname"
          placeholder="Nickname"
          value={formData.nickname}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Зарегистрироваться</button>
      </form>

    </div>

  )
};