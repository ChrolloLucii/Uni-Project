"use client"
import { useState, useEffect } from "react";
import Header from "@/components/header";
import Body from "@/components/body";
import Footer from "@/components/footer";
import CreateTournamentButton from "@/components/CreateTournamentButton";
import Link from "next/link";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    setIsLoggedIn(!!token);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsOrganizer(parsedUser.role === "ORGANIZER");
      } catch (e) {
        console.error("Ошибка при разборе данных пользователя", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[url('/circle-scatter-haikei.svg')] bg-cover bg-center">
      <Header />
      
      <main className="flex-grow">
        {isLoggedIn && isOrganizer && (
          <div className="flex justify-end p-4">
          </div>
        )}
        
        <Body />
      </main>
      
      <Footer />
    </div>
  );
}