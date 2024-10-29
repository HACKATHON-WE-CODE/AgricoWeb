"use client"
import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const EditFarmer = () => {
  const [farmer, setFarmer] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchFarmer = async () => {
      if (id) {
        const farmerDoc = await getDoc(doc(db, 'farmers', id));
        setFarmer({ id: farmerDoc.id, ...farmerDoc.data() });
      }
    };

    fetchFarmer();
  }, [id]);

  const handleUpdateFarmer = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'farmers', id), { name, email, phone, address });
    router.push('/dashboard');
  };

  if (!farmer) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Modifier un Agriculteur</h1>
      <form onSubmit={handleUpdateFarmer}>
        <input 
          type="text" 
          placeholder="Nom" 
          value={name || farmer.name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email || farmer.email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Téléphone" 
          value={phone || farmer.phone} 
          onChange={(e) => setPhone(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Adresse" 
          value={address || farmer.address} 
          onChange={(e) => setAddress(e.target.value)} 
        />
        <button type="submit">Mettre à Jour</button>
      </form>
    </div>
  );
};

export default EditFarmer;
