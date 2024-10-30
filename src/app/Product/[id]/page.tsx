"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Product } from "../../lib/types";
import { updateProduct, getProducts } from "../../lib/productService";

const EditProduct = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchProduct = async () => {
      const products = await getProducts();
      const productToEdit = products.find((p) => p.id === id);
      setProduct(productToEdit || null);
    };
    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (product && id) {
      await updateProduct(id, product);
      router.push("/Product");
    }
  };

  return product ? (
    <form onSubmit={handleSubmit}>
      <h2>Modifier le Produit</h2>

      <input
        type="text"
        placeholder="Nom du produit"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />

      <input
        type="number"
        placeholder="Prix"
        value={product.price}
        onChange={(e) =>
          setProduct({ ...product, price: parseFloat(e.target.value) })
        }
      />

      <textarea
        placeholder="Description"
        value={product.description}
        onChange={(e) =>
          setProduct({ ...product, description: e.target.value })
        }
      />

      <textarea
        placeholder="Meta-Description"
        value={product.meta_description}
        onChange={(e) =>
          setProduct({ ...product, meta_description: e.target.value })
        }
      />

      <button type="submit">Mettre à jour</button>
    </form>
  ) : (
    <p>Chargement du produit...</p>
  );
};

export default EditProduct;
