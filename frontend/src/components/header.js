"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    setIsLoggedIn(!!token);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUsername(parsedUser.nickname || parsedUser.username);
        setIsOrganizer(parsedUser.role === "ORGANIZER");
      } catch (e) {
        console.error("Ошибка при разборе данных пользователя", e);
      }
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsOrganizer(false);
    window.location.href = "/";
  };

  return (
    <header>
      <nav className="bg-black shadow-sm grid grid-cols-12 gap-6 px-[18%] h-[7vh] sticky top-0 place-items-center">
        <Link href="/">
          <Image
            aria-hidden
            src="/logo.svg"
            alt="Window icon"
            width={49}
            height={49}
          />
        </Link>
        <h2 className="text-4xl col-start-4 col-span-2 mx-auto">
          Турниры
        </h2>
        <h2 className="text-4xl col-start-8 col-span-2 mx-auto">
          Девлог
        </h2>
        
        <div className="col-start-11">
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <span className="text-white text-md">{username}</span>
              
              {isOrganizer && (
                <Link 
                  href="/dashboard" 
                  className="px-3 py-1 bg-[#1c223a] hover:bg-[#151827] rounded text-white text-sm"
                >
                  Панель
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-[#e1523d] hover:bg-red-700 rounded text-white text-sm"
              >
                Выход
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="px-4 py-2 bg-[#FF8D0A] hover:bg-[#f5dbbe] hover:text-black text-white rounded-md"
            >
              Вход
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}