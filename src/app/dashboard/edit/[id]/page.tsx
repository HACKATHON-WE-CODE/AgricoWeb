// "use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db } from '@/app/lib/firebase';

// interface Farmer {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   farmSize: string;
//   latitude: string;
//   longitude: string;
//   gender: string;
// }

// const EditFarmer = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [farmer, setFarmer] = useState<Farmer | null>(null);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [farmSize, setFarmSize] = useState('');
//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');
//   const [gender, setGender] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');

//   useEffect(() => {
//     const fetchFarmer = async () => {
//       if (typeof id === 'string') {
//         const farmerDoc = await getDoc(doc(db, 'farmers', id));
//         if (farmerDoc.exists()) {
//           setFarmer({
//             id: farmerDoc.id,
//             ...farmerDoc.data(),
//           } as Farmer);
//           setName(farmerDoc.data().name);
//           setEmail(farmerDoc.data().email);
//           setPhone(farmerDoc.data().phone);
//           setAddress(farmerDoc.data().address);
//           setFarmSize(farmerDoc.data().farmSize);
//           setLatitude(farmerDoc.data().latitude);
//           setLongitude(farmerDoc.data().longitude);
//           setGender(farmerDoc.data().gender);
//         } else {
//           console.error("Aucun agriculteur trouvé avec cet ID.");
//         }
//       }
//     };

//     if (id) {
//       fetchFarmer();
//     }
//   }, [id]);

//   const handleUpdateFarmer = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (!name || !email || !phone || !address || !farmSize || !latitude || !longitude || !gender) {
//       setError('Veuillez remplir tous les champs obligatoires.');
//       setLoading(false);
//       return;
//     }

//     try {
//       await updateDoc(doc(db, 'farmers', id), {
//         name,
//         email,
//         phone,
//         address,
//         farmSize,
//         latitude: parseFloat(latitude),
//         longitude: parseFloat(longitude),
//         gender,
//       });

//       setToastMessage('Agriculteur mis à jour avec succès !');
//       setTimeout(() => {
//         setToastMessage('');
//         router.push('/dashboard');
//       }, 2000);
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour de l'agriculteur :", error);
//       setError("Erreur lors de la mise à jour de l'agriculteur, veuillez réessayer.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!farmer) return <div>Chargement...</div>;

//   return (
//     <div>
     
//     </div>
//   );
// };

// export default EditFarmer;
