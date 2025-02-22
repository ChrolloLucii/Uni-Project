import Header from "@/components/header";
import Body from "@/components/body";
import Footer from "@/components/footer";
import CreateTournamentButton from "@/components/CreateTournamentButton";
export default function Home() {
    return (
      <div className="min-h-screen bg-[url('/circle-scatter-haikei.svg')] bg-cover bg-center z-0">
      <Header/>
      <Body/>
      <Footer/>
      <CreateTournamentButton/>
      </div>
    );
  }