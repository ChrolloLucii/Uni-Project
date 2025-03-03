"use client";
import Image from "next/image";
import LoginForm from "../../components/loginForm";
import CreateTournamentButton from "@/components/CreateTournamentButton";
import Footer from "@/components/footer";
export default function Login() {
    const handleLogin = (token) => {
      console.log('logged in, your token:', token);
      localStorage.setItem('token', token);
    }

  return (
    <main className="min-h-screen flex flex-col bg-[url('/circle-scatter-haikei.svg')] bg-cover bg-center">
      <h1>Вход</h1>
      <LoginForm onLogin={handleLogin} />
      <CreateTournamentButton/>
      <Footer/>
      </main>
  );
}
