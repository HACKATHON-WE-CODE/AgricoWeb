"use client"
import React, { useState } from 'react';
import { auth } from '@/app/lib/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Connexion réussie:", userCredential.user);
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>
        <input 
          type="email"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-200"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
