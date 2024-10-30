"use client";

import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';
import { db } from '../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  farmSize: string;
  cropType: string;
  registrationDate: string;
  imageUrl: string; 
  latitude: number;
  longitude: number;
}

const DashboardPage = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newFarmerId, setNewFarmerId] = useState<string | null>(null); // Nouvel état pour le nouvel agriculteur
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchFarmers();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchFarmers = async () => {
    try {
      const farmersCollection = collection(db, 'farmers');
      const farmersSnapshot = await getDocs(farmersCollection);
      const farmersList = farmersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        cropType: doc.data().cropType || 'Non spécifié',
        registrationDate: formatDate(doc.data().registrationDate),
        latitude: doc.data().latitude,
        longitude: doc.data().longitude
      }));
      setFarmers(farmersList);
    } catch (error) {
      console.error("Erreur lors de la récupération des agriculteurs :", error);
    }
  };

  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  const handleDeleteFarmer = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'farmers', id));
      setFarmers(farmers.filter(farmer => farmer.id !== id));
      setToastMessage('Agriculteur supprimé avec succès!');

    
      setTimeout(() => {
        setToastMessage('');
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'agriculteur :", error);
      setToastMessage('Erreur lors de la suppression de l\'agriculteur.');

      
      setTimeout(() => {
        setToastMessage('');
      }, 3000);
    }
  };

  const handleAddFarmer = async (newFarmer: Farmer) => {
    setFarmers(prev => [...prev, newFarmer]);
    setNewFarmerId(newFarmer.id);
    setToastMessage('Agriculteur enregistré avec succès!');
    setTimeout(() => {
      setNewFarmerId(null);
    }, 3000);
  };

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.phone.includes(searchTerm) ||
    farmer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.farmSize.includes(searchTerm) ||
    farmer.cropType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowDoubleClick = (farmer: Farmer) => {
  
    router.push(`/dashboard/map?farmerId=${farmer.id}`);
  };

  const handleEditFarmer = (id: string) => {
    
    router.push(`/dashboard/edit/${id}`);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex justify-between shadow-lg">
        <h1 className="text-2xl font-bold">Tableau de Bord</h1>
      </header>

      <nav className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex space-x-4">
          <Link href="/dashboard/map">
            <button className="bg-transparent text-white border border-transparent hover:bg-blue-600 px-4 py-2 rounded shadow transition duration-300">
              Voir la Carte
            </button>
          </Link>
          <Link href="/dashboard/add">
            <button className="bg-transparent text-white border border-transparent hover:bg-pink-600 px-4 py-2 rounded shadow transition duration-300">
              Ajouter un Agriculteur
            </button>
          </Link>
        </div>
        <input
          type="text"
          placeholder="Rechercher..."
          className="mx-4 px-3 py-2 rounded bg-gray-700 text-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={handleLogout} 
          className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 transition duration-300"
        >
          Se déconnecter
        </button>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        {toastMessage && (
          <div className="bg-green-500 text-white p-3 rounded mb-4 shadow-md">
            {toastMessage}
          </div>
        )}

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Derniers Agriculteurs Enregistrés</h2>
          <div className="flex space-x-4 overflow-x-auto">
            {farmers.slice(0, 5).map(farmer => (
              <div key={farmer.id} className="flex flex-col items-center">
                <img
                  src={farmer.imageUrl}
                  alt={farmer.name}
                  className="w-16 h-16 rounded-full border-2 border-gray-400"
                />
                <span className="text-center text-white">{farmer.name}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-4 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-medium mb-4">Liste des Agriculteurs</h3>
          <div className="max-h-60 overflow-y-auto"> {/* Conteneur défilable */}
            <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-600 text-gray-200">
                  {['Nom', 'Téléphone', 'Adresse', 'Taille de la Ferme', 'Type de Culture', "Date d'Enregistrement", 'Actions'].map((header) => (
                    <th key={header} className="py-3 px-4 border-b font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.length > 0 ? (
                  filteredFarmers.map(farmer => (
                    <tr 
                      key={farmer.id} 
                      className={`hover:bg-gray-600 ${newFarmerId === farmer.id ? 'bg-yellow-300' : ''}`} 
                      onDoubleClick={() => handleRowDoubleClick(farmer)}
                    >
                      <td className="py-3 px-4 border-b text-gray-200">{farmer.name}</td>
                      <td className="py-3 px-4 border-b text-gray-200">{farmer.phone}</td>
                      <td className="py-3 px-4 border-b text-gray-200">{farmer.address}</td>
                      <td className="py-3 px-4 border-b text-gray-200">{farmer.farmSize}</td>
                      <td className="py-3 px-4 border-b text-gray-200">{farmer.cropType}</td>
                      <td className="py-3 px-4 border-b text-gray-200">{farmer.registrationDate}</td>
                      <td className="py-3 px-4 border-b text-gray-200">
                        <button 
                          onClick={() => handleEditFarmer(farmer.id)} 
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 mr-2 transition duration-300"
                        >
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteFarmer(farmer.id)} 
                          className="bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 transition duration-300"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-3 text-gray-200">Aucun agriculteur trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
