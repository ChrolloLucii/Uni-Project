import Image from "next/image"
export default function Footer(){ return(
    
    <div className="bg-black shadow-sm text-white  h-[20vh] place-items-center  text-center py-6">
        <div className="flex justify-center items-center text-white">
            <div className="text-4xl font-bold mr-4">
                CI
            </div>
            <div className="text-2xl text-gray-400">
            <Image
                        aria-hidden                       
                        src="./kartinka.svg"
                        alt="Window icon"
                        width={49}
                        height={49}
                        />
            LET&apos;S PLAY TOGETHER
            </div>
        </div>
        <div className="w-full border-t-2 border-gray-600 my-4"></div>
        <div className="flex justify-center items-center space-x-8 text-xl text-gray-500">
            <a href="#">НОВОСТИ</a>
            <a href="#">ПОЛИТИКА ПОЛЬЗОВАНИЯ</a>
            <a href="#">ПРИВАТНОСТЬ</a>
            <a href="#">КОНТАКТЫ И АВТОРЫ</a>
        </div>
        <div className="mt-4 text-xs text-gray-500">
            <p>&copy; 2023 Киберспортивный центр RTU MIREA. Все права защищены.</p>
        </div>
    </div>
)}