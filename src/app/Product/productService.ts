
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Product } from "./types";

// [POST: PRODUCT]
export const addProduct = async (product: Product): Promise<string | void> => {
  try {
    const docRef = await addDoc(collection(db, "products"), product);
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
  }
};

// [GET: PRODUCTS]
export const getProducts = async (): Promise<Product[]> => {
  const products: Product[] = [];
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() } as Product);
  });
  return products;
};

// [PUT: PRODUCT]
export const updateProduct = async (id: string, updatedProduct: Partial<Product>): Promise<void> => {
  const productRef = doc(db, "products", id);
  await updateDoc(productRef, updatedProduct);
};

// [DELETE: PRODUCT]
export const deleteProduct = async (id: string): Promise<void> => {
  const productRef = doc(db, "products", id);
  await deleteDoc(productRef);
};
