"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/app/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddFarmerPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [cropType, setCropType] = useState('');
  const router = useRouter();

  const handleAddFarmer = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const newFarmer = {
        name,
        email,
        phone,
        address,
        farmSize,
        cropType,
        registrationDate: new Date(),
      };

      console.log("Données à envoyer :", newFarmer);

      await addDoc(collection(db, 'farmers'), newFarmer);
      console.log("Agriculteur ajouté avec succès");
      router.push('/dashboard');
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'agriculteur :", error.message);
     
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl mb-4">Ajouter un Agriculteur</h1>
      <form onSubmit={handleAddFarmer} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Téléphone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Adresse</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-gray-300 rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Taille de la ferme</label>
          <input
            type="text"
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
            className="border border-gray-300 rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Type de culture</label>
          <input
            type="text"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            className="border border-gray-300 rounded w-full py-2 px-3"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Ajouter Agriculteur
        </button>
      </form>
    </div>
  );
};

export default AddFarmerPage;
