"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import L, { Icon } from "leaflet";

interface Farmer {
  id: string;
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  cropTypes: string;
  gender: string;
  photo: string;
}

// icônes pour chaque type de culture
const cultureIcons: { [key: string]: Icon } = {
  "Maïs": L.icon({
    iconUrl: "https://img.icons8.com/color/48/000000/corn.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  "Riz": L.icon({
    iconUrl: "https://img.icons8.com/color/48/000000/rice-bowl.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  "Sorgho": L.icon({
    iconUrl: "https://img.icons8.com/color/48/000000/wheat.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
};

// Icône par défaut personnalisée
const defaultIcon = L.icon({
  iconUrl: "https://img.icons8.com/color/48/000000/marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Configuration de la carte
const MapPage = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Fonction pour récupérer les données des agriculteurs
  const fetchFarmers = async () => {
    try {
      const farmersCollection = collection(db, "farmers");
      const farmersSnapshot = await getDocs(farmersCollection);
      const farmersList = farmersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Farmer[];

      console.log("Farmers List:", farmersList);
      setFarmers(farmersList);
    } catch (error) {
      console.error("Erreur lors de la récupération des agriculteurs :", error);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFarmer(null);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkerClick = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setIsOpen(true);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && ref.current) {
      ref.current.style.left = `${e.clientX - offset.x}px`;
      ref.current.style.top = `${e.clientY - offset.y}px`;
      ref.current.style.transform = "none";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {isOpen && selectedFarmer && (
        <div
          ref={ref}
          className="fixed bg-white rounded-lg shadow-lg p-6 z-50 cursor-move transition-all"
          style={{ left: "50%", top: "50%", pointerEvents: "auto" }}
          onMouseDown={handleMouseDown}
        >
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4 text-center">Informations sur l&apos;Agriculteur</h2>
          <p><strong>Nom :</strong> {selectedFarmer.name}</p>
          <p><strong>Téléphone :</strong> {selectedFarmer.phone}</p>
          <p><strong>Adresse :</strong> {selectedFarmer.address}</p>
          <p><strong>Sexe :</strong> {selectedFarmer.gender}</p>
          <p><strong>Culture :</strong> {selectedFarmer.cropTypes || "Non spécifié"}</p>
          {selectedFarmer.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selectedFarmer.photo} alt="Photo de l'agriculteur" className="mt-4 w-32 h-32 rounded-full" />
          )}
        </div>
      )}

      <div className="w-full" style={{ pointerEvents: isOpen ? "none" : "auto" }}>
        <MapContainer center={[7.539989, -5.54708]} zoom={5} className="h-screen w-full z-0">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {farmers.map((farmer) => (
            <Marker
              key={farmer.id}
              position={[farmer.latitude, farmer.longitude]}
              icon={cultureIcons[farmer.cropTypes] || defaultIcon}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick(farmer);
                },
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
