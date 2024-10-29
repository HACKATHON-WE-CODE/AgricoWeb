"use client";
import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { db } from '../lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchFarmers();
      } else {
        window.location.href = '/login'; // Rediriger vers la page de connexion
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  if (loading) {
    return <div>Chargement...</div>; 
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-600 text-white p-4">
        <h1 className="text-2xl">Tableau de Bord</h1>
      </header>
      <main className="p-4">
        <h2 className="text-xl mb-4">Gestion des Agriculteurs</h2>
        <Link href="/dashboard/add">
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Ajouter un Agriculteur
          </button>
        </Link>

        <div className="mt-4">
          <h3 className="text-lg">Liste des Agriculteurs</h3>
          <table className="min-w-full bg-white border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">Nom</th>
                <th className="py-2 px-4 border-b">Téléphone</th>
                <th className="py-2 px-4 border-b">Adresse</th>
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
                    <td className="py-2 px-4 border-b">
                      <Link href={`/dashboard/edit/${farmer.id}`}>
                        <button className="bg-gray-500 text-white px-2 py-1 rounded">Modifier</button>
                      </Link>
                      <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">Supprimer</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-2 px-4 border-b text-center">Aucun agriculteur trouvé</td>
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
