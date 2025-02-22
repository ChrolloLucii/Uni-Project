"use client";
import Image from "next/image";
import LoginForm from "../../components/loginForm";
import CreateTournamentButton from "@/components/CreateTournamentButton";
export default function Login() {
    const handleLogin = (token) => {
      console.log('logged in, your token:', token);
      localStorage.setItem('token', token);
    }

  return (
    <main>
      <h1>Вход</h1>
      <LoginForm onLogin={handleLogin} />
      <CreateTournamentButton/>
      </main>
  );
}
