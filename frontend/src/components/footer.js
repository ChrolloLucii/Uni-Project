import Image from "next/image"

export default function Footer(){ 
  return (
    <footer className="bg-black shadow-sm place-items-center text-center py-6 mt-auto">
      <div className="flex justify-center items-center">
        <div className="text-4xl font-bold mr-4">
          C-L & L-F
        </div>
        <div className="text-2xl text-[#E5D4B6]">
          <Image
            className="fill-current"
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