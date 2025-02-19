import Header from "../components/Header";
import SearchForm from "../components/SearchForm";

export default function HomeView() {
  return (
    <>
        <Header />

        <main className="bg-gray-100 py-10 min-h-screen bg-no-repeat bg-right-top  lg:bg-home lg:bg-home-xl">
            <div className="max-w-5xl mx-auto mt-10">
                <div className="lg:w-1/2 lg:p-0 space-y-6">
                    <h1 className="text-6xl font-black">
                        All yours <span className="text-cyan-400">Social Networks</span> in one link
                    </h1>

                    <p className="text-slate-800 text-xl">
                    Join over 200k developers sharing their social media profiles—connect your TikTok, Facebook, Instagram, YouTube, GitHub, and more, all in one place!
                    </p>

                    <SearchForm />
                </div> 
            </div>
        </main>
    </>

  )
}
