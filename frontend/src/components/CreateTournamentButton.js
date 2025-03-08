"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasOrganizerAccess } from '@/utils/authUtil';

export default function CreateTournamentButton({ className }) {
  const router = useRouter();
  const [canCreateTournament, setCanCreateTournament] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      try {
        const hasAccess = await hasOrganizerAccess();
        setCanCreateTournament(hasAccess);
      } catch (error) {
        console.error('Ошибка при проверке доступа:', error);
        setCanCreateTournament(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAccess();
  }, []);

  const handleCreateTournament = () => {
    router.push('/tournamentCreation');
  };

  // Не показываем кнопку во время загрузки или если нет прав
  if (isLoading || !canCreateTournament) {
    return null;
  }

  // Основные стили кнопки
  const buttonStyles = className || "px-5 py-2 bg-[#FF8D0A] hover:bg-[#e57800] text-white rounded-md transition-colors";

  return (
    <button 
      onClick={handleCreateTournament}
      className={buttonStyles}
      aria-label="Создать новый турнир"
    >
      Создать турнир
    </button>
  );
}