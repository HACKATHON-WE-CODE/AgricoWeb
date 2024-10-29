
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Product } from "./types";
import { updateProduct, getProducts } from "./productService";

const EditProduct = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();
  const { id } = router.query;

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
      await updateProduct(id as string, product);
      router.push("/Product/ProductList");
    }
  };

  return product ? (
    <form onSubmit={handleSubmit}>
      <h2>Modifier le Produit</h2>
      <input
        type="text"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />
      <input
        type="number"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
      />
      <button type="submit">Mettre à jour</button>
    </form>
  ) : (
    <p>Chargement du produit...</p>
  );
};

export default EditProduct;
