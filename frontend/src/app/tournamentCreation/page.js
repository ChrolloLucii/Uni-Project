"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"

export default function TournamentForm() {
    const router = useRouter();
    const [tournament, setTournament] = useState({
        name: "",
        description: "",
        discipline: "",
        startDate: "",
        endDate: "",
        status: "upcoming",
        teams: [],
        judges: []
    });
    const disciplines = ["dota2", "counterStrike2", "TEKKEN", "OSU!"];

    const handleTournamentChange = (e) => {
        const { name, value } = e.target;
        setTournament((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTournamentSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/tournament', {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(tournament)
            });
            if (!res.ok) {
                throw new Error(`ошибка: ${res.status}`);
            }
            const data = await res.json();
            console.log("Турнир создан", data);
            // Используем нотификацию вместо alert
            const notificationElement = document.getElementById("notification");
            notificationElement.classList.remove("hidden");
            setTimeout(() => {
                router.push(`/tournament/${data.id}/manage`);
            }, 1500);
        }
        catch (error) {
            console.error(error);
            const errorElement = document.getElementById("error-notification");
            errorElement.textContent = "Ошибка создания турнира. Пожалуйста, проверьте данные и попробуйте снова.";
            errorElement.classList.remove("hidden");
            setTimeout(() => {
                errorElement.classList.add("hidden");
            }, 5000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[url('/circle-scatter-haikei.svg')] bg-cover bg-center">
            <Header />
            
            <main className="flex-grow flex items-center justify-center px-4 py-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl bg-[#1c223a] bg-opacity-90 p-8 rounded-lg shadow-xl"
                >
                    <h1 className="text-3xl font-bold text-center mb-8  border-b border-[indigo-500] pb-2">
                        Создание нового турнира
                    </h1>
                    
                    {/* Уведомление об успешном создании */}
                    <div id="notification" className="hidden mb-6 p-3 bg-[#21320e] text-white rounded-md text-center">
                        Турнир успешно создан! Переходим к управлению...
                    </div>
                    
                    {/* Уведомление об ошибке */}
                    <div id="error-notification" className="hidden mb-6 p-3 bg-[#fede29] text-gray-500 rounded-md text-center">
                    </div>

                    <form className="text-white space-y-6" onSubmit={handleTournamentSubmit}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 font-semibold" htmlFor="name">
                                    Название турнира
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={tournament.name}
                                    onChange={handleTournamentChange}
                                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
                                    placeholder="Чемпионат по CS2"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block mb-2 font-semibold" htmlFor="discipline">
                                    Дисциплина
                                </label>
                                <select
                                    id="discipline"
                                    name="discipline"
                                    value={tournament.discipline}
                                    onChange={handleTournamentChange}
                                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
                                    required
                                >
                                    <option value="">Выберите дисциплину</option>
                                    {disciplines.map((item, index) => (
                                        <option key={index} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="description">
                                Описание турнира
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={tournament.description || ""}
                                onChange={handleTournamentChange}
                                rows="3"
                                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
                                placeholder="Краткое описание формата и правил турнира..."
                            ></textarea>
                        </div>

                        <div className="grid md:grid-cols-1 gap-6">
                            <div>
                                <label className="block mb-2 font-semibold" htmlFor="startDate">
                                    Дата начала
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={tournament.startDate}
                                    onChange={handleTournamentChange}
                                    className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
                                    required
                                />
                            </div>
                            
                        </div>

                        <div className="pt-4 flex justify-center">
                            <motion.button 
                                type="submit"
                                className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Создать турнир
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </main>
            
            <Footer />
        </div>
    );
}