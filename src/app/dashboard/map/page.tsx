"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import L from "leaflet";

// Définir une interface pour un agriculteur
interface Farmer {
  id: string;
  name: string;
  phone: string;
  address: string;
  latitude: number; // Assurez-vous que ce champ existe dans vos données Firestore
  longitude: number; // Assurez-vous que ce champ existe dans vos données Firestore
}

// Icon par défaut pour les marqueurs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapPage = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]); // Utilisation de l'interface Farmer

  // Fonction pour récupérer les données des agriculteurs
  const fetchFarmers = async () => {
    try {
      const farmersCollection = collection(db, "farmers");
      const farmersSnapshot = await getDocs(farmersCollection);
      const farmersList = farmersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Farmer[]; // Spécifier le type ici également
      setFarmers(farmersList);
    } catch (error) {
      console.error("Erreur lors de la récupération des agriculteurs :", error);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-600 text-white p-4">
        <h1 className="text-2xl">Carte des Agriculteurs</h1>
      </header>

      <MapContainer center={[7.539989, -5.54708]} zoom={7} className="h-screen w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {farmers.map(farmer => (
          <Marker key={farmer.id} position={[farmer.latitude, farmer.longitude]}>
            <Popup>
              <strong>Nom :</strong> {farmer.name}<br />
              <strong>Téléphone :</strong> {farmer.phone}<br />
              <strong>Adresse :</strong> {farmer.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;
