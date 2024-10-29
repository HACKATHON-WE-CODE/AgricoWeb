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
}

const DashboardPage = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
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
        ...doc.data()
      }));
      setFarmers(farmersList);
    } catch (error) {
      console.error("Erreur lors de la récupération des agriculteurs :", error);
    }
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
    } catch (error) {
      console.error("Erreur lors de la suppression de l'agriculteur :", error);
      setToastMessage('Erreur lors de la suppression de l\'agriculteur.');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-600 text-white p-4 flex justify-between">
        <h1 className="text-2xl">Tableau de Bord</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
        >
          Se déconnecter
        </button>
      </header>
      <main className="p-4">
        <h2 className="text-xl mb-4">Gestion des Agriculteurs</h2>
        
       
        <Link href="/dashboard/map">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Voir la Carte
          </button>
        </Link>

        <Link href="/dashboard/add">
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Ajouter un Agriculteur
          </button>
        </Link>

        {toastMessage && (
          <div className="toast bg-green-500 text-white p-2 rounded mb-4">{toastMessage}</div>
        )}

        <div className="mt-4">
          <h3 className="text-lg">Liste des Agriculteurs</h3>
          <table className="min-w-full bg-white border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">Nom</th>
                <th className="py-2 px-4 border-b">Téléphone</th>
                <th className="py-2 px-4 border-b">Adresse</th>
                <th className="py-2 px-4 border-b">Taille de la Ferme</th>
                <th className="py-2 px-4 border-b">Type de Culture</th>
                <th className="py-2 px-4 border-b">Date d&apos;Enregistrement</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {farmers.length > 0 ? (
                farmers.map(farmer => (
                  <tr key={farmer.id}>
                    <td className="py-2 px-4 border-b">{farmer.name}</td>
                    <td className="py-2 px-4 border-b">{farmer.phone}</td>
                    <td className="py-2 px-4 border-b">{farmer.address}</td>
                    <td className="py-2 px-4 border-b">{farmer.farmSize}</td>
                    <td className="py-2 px-4 border-b">{farmer.cropType}</td>
                    <td className="py-2 px-4 border-b">{farmer.registrationDate}</td>
                    <td className="py-2 px-4 border-b">
                      <Link href={`/dashboard/edit/${farmer.id}`}>
                        <button className="bg-gray-500 text-white px-2 py-1 rounded">Modifier</button>
                      </Link>
                      <button 
                        className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                        onClick={() => handleDeleteFarmer(farmer.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-2 px-4 border-b text-center">Aucun agriculteur trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
