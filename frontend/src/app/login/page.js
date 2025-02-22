"use client";
import Image from "next/image";
import LoginForm from "../../components/loginForm";

export default function Login() {
    const handleLogin = (token) => {
      console.log('logged in, your token:', token);

      localStorage.setItem('authToken', token);
    }

  return (
    <main>
      <h1>Вход</h1>
      <LoginForm onLogin={handleLogin} />
      </main>
  );
}
