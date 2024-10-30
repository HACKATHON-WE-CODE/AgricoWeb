"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProduct } from "../../lib/productService";
import { Product } from "../../lib/types";

const AddProduct = () => {
  const [product, setProduct] = useState<{
    name: string;
    price: number | "";
    description: string;
    metaDescription: string;
    photo: File | null;
  }>({
    name: "",
    price: "",
    description: "",
    metaDescription: "",
    photo: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  const uploadImage = async (file: File): Promise<string> => {
    const fakeUrl = `https://example.com/${file.name}`;
    return fakeUrl;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setProduct({ ...product, photo: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let photoUrl = "";
    if (product.photo) {
      photoUrl = await uploadImage(product.photo);
    }

    const finalProduct: Product = {
      name: product.name,
      price: product.price !== "" ? product.price : 0,
      description: product.description,
      meta_description: product.metaDescription,
      photoUrl,
    };

    await addProduct(finalProduct);
    router.push("/Product");
  };

  return (
    <div className="max-w-lg mx-auto my-12 p-8 bg-white shadow-lg rounded-xl transform transition duration-300 hover:scale-105">
      <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
        Ajouter un Produit
      </h2>

      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="text-gray-700">Nom du produit</span>
          <input
            type="text"
            placeholder="Nom du produit"
            value={product.name}
            onChange={(e) =>
              setProduct({ ...product, name: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-green-300 rounded-lg shadow-sm focus:border-green-600 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Prix</span>
          <input
            type="number"
            placeholder="Prix"
            value={product.price !== "" ? product.price : ""}
            onChange={(e) =>
              setProduct({
                ...product,
                price: e.target.value ? parseFloat(e.target.value) : "",
              })
            }
            className="mt-1 block w-full p-2 border border-green-300 rounded-lg shadow-sm focus:border-green-600 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Description</span>
          <textarea
            placeholder="Description"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-green-300 rounded-lg shadow-sm focus:border-green-600 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            rows={4}
          ></textarea>
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Meta-Description</span>
          <textarea
            placeholder="Meta-Description"
            value={product.metaDescription}
            onChange={(e) =>
              setProduct({ ...product, metaDescription: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-green-300 rounded-lg shadow-sm focus:border-green-600 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            rows={3}
          ></textarea>
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Photo du produit</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-gray-500 border border-green-300 rounded-lg shadow-sm focus:border-green-600 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          />
        </label>

        {previewUrl && (
          <div className="text-center mb-4">
            <h3 className="text-lg text-green-700 mb-2">Aperçu de l'image :</h3>
            <img
              src={previewUrl}
              alt="Prévisualisation"
              className="inline-block max-w-xs rounded-lg shadow-md transform transition duration-300 hover:scale-110"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
