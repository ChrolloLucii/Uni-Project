import Image from "next/image"

export default function Footer(){ 
  return (
    <footer className="bg-black shadow-sm text-white place-items-center text-center py-6 mt-auto">
        <div className="flex justify-center items-center text-white">
            <div className="text-4xl font-bold mr-4">
                C-L & L-F
            </div>
            <div className="text-2xl text-gray-400">
            <Image
                aria-hidden                       
                src="/kartinka.svg"
                alt="Window icon"
                width={49}
                height={49}
                />
            </div>
        </div>
    </footer>
  )
}