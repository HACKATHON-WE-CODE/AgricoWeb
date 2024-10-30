"use client";

import { useEffect, useState } from "react";
import { Product } from "../lib/types";
import { deleteProduct, getProducts } from "../lib/productService";
import Link from "next/link";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = await getProducts();
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 py-10 px-5 md:px-20">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
        Liste des Produits
      </h1>
      <div className="flex justify-end mb-6">
        <Link href="/Product/add" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-300">
          Ajouter un Produit
        </Link>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <li
            key={product.id}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
          >
            <div className="flex items-center mb-4">
              <img
                src={product.photoUrl || "/placeholder.png"}
                alt={`${product.name} image`}
                className="w-16 h-16 rounded-full object-cover border-2 border-green-500 mr-4"
              />
              <div>
                <h2 className="text-2xl font-semibold text-green-800">
                  {product.name}
                </h2>
                <p className="text-lg text-gray-600">{product.price}€</p>
              </div>
            </div>

            <div className="text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </div>

            <div className="flex justify-between items-center">
              <Link href={`/Product/${product.id}`} className="text-green-600 hover:text-green-800 transition-all duration-300">
                Modifier
              </Link>
              <button
                onClick={() => deleteProduct(product.id || "")}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all duration-300"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
