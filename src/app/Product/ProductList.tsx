
import { useEffect, useState } from "react";
import { Product } from "./types";
import { deleteProduct, getProducts } from "./productService";
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
    <div>
      <h1>Liste des Produits</h1>
      <Link href="/Product/AddProduct">Ajouter un Produit</Link>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price}€
            <Link href={`/Product/EditProduct?id=${product.id}`}>Modifier</Link>
            <button onClick={() => deleteProduct(product.id || "")}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
