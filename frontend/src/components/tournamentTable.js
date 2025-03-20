"use client"
import React from 'react';
import {useEffect, useState} from 'react';
import Image from 'next/image';
import TournamentActions from './TournamentActions';
import {useRouter} from 'next/navigation';
import { motion } from 'framer-motion';

export default function TournamentTable(){
    const router = useRouter();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'ongoing', 'completed'

    useEffect(() => {
        fetch('/api/tournament')
        .then(async (res) => {
            if (!res.ok){
                const errorText = await res.text();
                throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
            }
            const text = await res.text();
            return text ? JSON.parse(text) : [];
        }).then((data) => {
            setTournaments(data);
            setLoading(false);
        }).catch((error) => {
            console.error(error);
            setLoading(false);
        });
    }, []);

    const handleDeleteTournament = async (tournamentId) => {
        if (confirm("Вы уверены, что хотите удалить турнир?")) {
          try {
            const res = await fetch(`/api/tournament/${tournamentId}`, {
              method: "DELETE",
            });
            if (!res.ok) {
              throw new Error(`Ошибка: ${res.status}`);
            }
            setTournaments((prev) => prev.filter((t) => t.id !== tournamentId));
            alert("Турнир удалён");
          } catch (error) {
            console.error(error);
            alert("Ошибка при удалении турнира");
          }
        }
    };

    const handleManageTournament = (tournamentId) => {
        router.push(`/tournament/${tournamentId}/manage`);
    };

    // Фильтрация турниров
    const filteredTournaments = filter === 'all' 
        ? tournaments 
        : tournaments.filter(t => t.status === filter);

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'upcoming': return 'bg-blue-500';
            case 'ongoing': return 'bg-[#FF8D0A]';
            case 'completed': return 'bg-green-600';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'upcoming': return 'Предстоящий';
            case 'ongoing': return 'В процессе';
            case 'completed': return 'Завершен';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF8D0A]"></div>
            </div>
        );
    }

    if (!tournaments.length) {
        return (
            <div className="bg-black bg-opacity-80 rounded-xl p-8 text-center">
                <Image src="/dragon-orb-svgrepo-com.svg" width={80} height={80} alt="No tournaments" className="mx-auto mb-4 opacity-30" />
                <h3 className="text-2xl font-bold text-gray-400">Турниры не найдены</h3>
                <p className="text-gray-500 mt-2">Создайте новый турнир, чтобы начать</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Заголовок и фильтры */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">
                    <span className="text-[#FF8D0A]">Турниры</span> ({filteredTournaments.length})
                </h2>
                
                <div className="flex space-x-2 bg-black bg-opacity-50 p-1 rounded-lg">
                    <button 
                        onClick={() => setFilter('all')} 
                        className={`px-3 py-1 rounded-md transition-colors ${filter === 'all' ? 'bg-[#FF8D0A] text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                    >
                        Все
                    </button>
                    <button 
                        onClick={() => setFilter('upcoming')} 
                        className={`px-3 py-1 rounded-md transition-colors ${filter === 'upcoming' ? 'bg-[#FF8D0A] text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                    >
                        Предстоящие
                    </button>
                    <button 
                        onClick={() => setFilter('ongoing')} 
                        className={`px-3 py-1 rounded-md transition-colors ${filter === 'ongoing' ? 'bg-[#FF8D0A] text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                    >
                        Текущие
                    </button>
                    <button 
                        onClick={() => setFilter('completed')} 
                        className={`px-3 py-1 rounded-md transition-colors ${filter === 'completed' ? 'bg-[#FF8D0A] text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                    >
                        Завершенные
                    </button>
                </div>
            </div>

            {/* Сетка турниров */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTournaments.map((tournament) => (
                    <motion.div 
                        key={tournament.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-br from-black to-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-[#FF8D0A] transition-all duration-300 group"
                    >
                        {/* Верхняя часть карточки с фоном дисциплины */}
                        <div className="h-32 bg-gray-800 relative overflow-hidden">
                            <div 
                                className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"
                            ></div>
                            <div className="absolute inset-0 bg-black opacity-70"></div>
                            <div className="relative z-20 h-full p-4 flex items-end">
                                <h3 className="text-2xl font-bold text-white group-hover:text-[#FF8D0A] transition-colors">
                                    {tournament.name}
                                </h3>
                            </div>
                            <div className="absolute top-4 right-4 z-30">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusBadgeClass(tournament.status)}`}>
                                    {getStatusText(tournament.status)}
                                </span>
                            </div>
                        </div>
                        
                        {/* Информация о турнире */}
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500">Дисциплина</p>
                                    <p className="text-sm text-white font-medium">{tournament.discipline}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500">Дата начала</p>
                                    <p className="text-sm text-white font-medium">{tournament.startDate}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500">Судьи:</p>
                                    {tournament.judges && tournament.judges.length > 0 ? (
                                        <div className = "text-sm text-white">
                                        {tournament.judges.map((judge, index) => (
                                          <div key = {judge.id || index} className = "font-medium">
                                            {judge.name || judge.nickname || "Анонимный судья"}
                                            {index < tournament.judges.length - 1 ? ', ' : ''}
                                          </div>
                                        ))}
                                        </div>
                                    ) : (
                                        <p classsName = "text-sm text-gray-400 font-medium"> Не назначен</p>
                                    )}
                                    
                                </div>
                
                            </div>
                            
                            {/* Действия */}
                            <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                                <button 
                                    onClick={() => handleManageTournament(tournament.id)}
                                    className="px-4 py-2 rounded-md bg-[#FF8D0A] bg-opacity-90 hover:bg-opacity-100 text-black font-medium text-sm transition-all transform hover:scale-105"
                                >
                                    Управление
                                </button>
                                
                                <button 
                                    onClick={() => handleDeleteTournament(tournament.id)}
                                    className="p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}