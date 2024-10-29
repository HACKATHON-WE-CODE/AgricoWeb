// src/app/page.tsx

import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Bienvenue</h1>
      
      <div className="flex flex-col gap-4">
        <Link href="/signup" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Inscription
        </Link>
        
        <Link href="/login" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Connexion
        </Link>
        
        <Link href="/dashboard" className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
          Tableau de Bord
        </Link>
      </div>
    </div>
  );
};

export default Home;
