"use client";
import Image from "next/image";
import LoginForm from "../../components/loginForm";
import CreateTournamentButton from "@/components/CreateTournamentButton";
import Footer from "@/components/footer";
import { Cookies } from "js-cookie";
export default function Login() {
    const handleLogin = (token) => {
      console.log('logged in, your token:', token);
    }

  return (
    <main className="min-h-screen flex flex-col bg-[url('/circle-scatter-haikei.svg')] bg-cover bg-center">
      <LoginForm onLogin={handleLogin} />
      <Footer/>
      </main>
  );
}
