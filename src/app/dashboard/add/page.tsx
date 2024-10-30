"use client";
import React, { useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const cropOptions = [
  "Maïs",
  "Riz",
  "Sorgho",
  "Mil",
  "Coton",
  "Café",
  "Cacao",
  "Fruits",
  "Légumes",
  "Autre"
];

const AddFarmerPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [cropTypes, setCropTypes] = useState<string[]>([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [gender, setGender] = useState(''); 
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); 
  const router = useRouter();

  const handleAddCrop = () => {
    if (selectedCrop && !cropTypes.includes(selectedCrop)) {
      setCropTypes([...cropTypes, selectedCrop]);
      setSelectedCrop('');
    }
  };

  const handleRemoveCrop = (crop: string) => {
    setCropTypes(cropTypes.filter(c => c !== crop));
  };

  const checkIfFarmerExists = async () => {
    const farmersCollection = collection(db, 'farmers');
    const emailQuery = query(farmersCollection, where("email", "==", email));
    const phoneQuery = query(farmersCollection, where("phone", "==", phone));

    const [emailSnapshot, phoneSnapshot] = await Promise.all([
      getDocs(emailQuery),
      getDocs(phoneQuery)
    ]);

    return !emailSnapshot.empty || !phoneSnapshot.empty;
  };

  const handleAddFarmer = async () => {
    if (!name || !email || !phone || !address || !farmSize || cropTypes.length === 0 || !latitude || !longitude || !gender || !photo) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setError('');
    setLoading(true); 

    try {
      const exists = await checkIfFarmerExists();
      if (exists) {
        setError('Un agriculteur avec ce téléphone ou email existe déjà.');
        return;
      }

      const farmersCollection = collection(db, 'farmers');
      const reader = new FileReader();
      reader.readAsDataURL(photo);
      reader.onloadend = async () => {
        const base64String = reader.result;

        await addDoc(farmersCollection, {
          name,
          email,
          phone,
          address,
          farmSize,
          cropTypes,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          gender,
          photo: base64String,
          registrationDate: new Date().toISOString()
        });
        
        setToastMessage('Agriculteur ajouté avec succès !'); 
        setTimeout(() => {
          setToastMessage('');
          router.push('/dashboard');
        }, 2000); 
      };
      
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'agriculteur :", error);
      setError("Erreur lors de l'ajout de l'agriculteur, veuillez réessayer.");
      setToastMessage('Échec de l\'ajout de l\'agriculteur.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Ajouter un Agriculteur</h2>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {toastMessage && <div className="text-green-500 mb-4">{toastMessage}</div>}
        
        <input 
          type="text"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="email"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="text"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="Téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input 
          type="text"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="Adresse"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input 
          type="text"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="Taille de la ferme (en hectares)"
          value={farmSize}
          onChange={(e) => setFarmSize(e.target.value)}
        />
        
  
        <div className="mb-4">
          <label className="block mb-2">Sexe :</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Sélectionner le sexe</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
        </div>

       
        <div className="mb-4">
          <input 
            type="file"
            accept="image/*"
            className="w-full p-3 border border-gray-300 rounded"
            onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        <div className="mb-4">
          <select 
            className="w-full p-3 border border-gray-300 rounded"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            <option value="">Sélectionner une culture</option>
            {cropOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button 
            onClick={handleAddCrop}
            className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-200"
          >
            Ajouter Culture
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Cultures Sélectionnées :</h3>
          <ul className="list-disc pl-5">
            {cropTypes.map(crop => (
              <li key={crop} className="flex justify-between items-center">
                {crop}
                <button 
                  onClick={() => handleRemoveCrop(crop)}
                  className="text-red-500 ml-2"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>

        <input 
          type="text"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <input 
          type="text"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        
        {loading ? ( 
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
        ) : (
          <button 
            onClick={handleAddFarmer}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-200"
          >
            Ajouter
          </button>
        )}
      </div>

      <style jsx>{`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top: 4px solid rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AddFarmerPage;
