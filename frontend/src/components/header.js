"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from 'js-cookie';
import { FaTrophy, FaCommentDots, FaUserCircle, FaCog } from 'react-icons/fa';  // пример использования react-icons

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    const userData = Cookies.get("user");
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
    Cookies.remove("token");
    Cookies.remove("user");
    setIsLoggedIn(false);
    setIsOrganizer(false);
    window.location.href = "/";
  };

  return (
    <header className="bg-black w-full shadow-md">
      <nav className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center space-x-4">
          {/* Логотип */}
          <Link href="/">
            <Image src="/logo.svg" alt="Логотип" width={50} height={50} />
          </Link>
          {/* Слоган/Название */}
          <div className="text-white text-2xl font-bold">
            BracketForge
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Меню навигации (иконки) */}
          <Link href="/tournaments" className="flex items-center text-white hover:text-orange-500">
            <FaTrophy className="mr-2" />
            <span>Турниры</span>
          </Link>
          <Link href="/devlog" className="flex items-center text-white hover:text-orange-500">
            <FaCommentDots className="mr-2" />
            <span>Devlog</span>
          </Link>
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-white">
                <FaUserCircle className="mr-2" />
                <span>{username}</span>
              </div>
              {isOrganizer && (
                <Link href="/dashboard" className="flex items-center text-white hover:text-orange-500">
                  <FaCog className="mr-2" />
                  <span>Панель управления</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:text-red-500"
              >
                <span>Выход</span>
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-md text-white">
              Вход
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}