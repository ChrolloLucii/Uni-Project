import Image from "next/image"

export default function Header(){
    
    
    return(
    <header>
    <nav className="bg-black shadow-sm  grid grid-cols-12 gap-6 px-[18%] h-[7vh] sticky top-0 place-items-center">
        <Image
        aria-hidden
        src="./logo.svg"
        alt="Window icon"
        width={49}
        height={49}
        />
        <h2 className="text-4xl text-white col-start-4 col-span-2 mx-auto">Турнирны</h2>
        <h2 className="text-4xl text-white col-start-8 col-span-2 mx-auto">Девлог</h2>
        <Image className="col-start-12"
        aria-hidden
        src="./logo.svg"
        alt="Window icon"
        width={49}
        height={49}
        />
    </nav>
    </header>
)}