
import { useState } from "react";
import { useRouter } from "next/router";
import { addProduct } from "../../lib/productService";
import { Product } from "../../lib/types";

const AddProduct = () => {
  const [product, setProduct] = useState<Product>({ name: "", price: 0 });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct(product);
    router.push("/Product/ProductList");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter un Produit</h2>
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
        onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
      />
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default AddProduct;
