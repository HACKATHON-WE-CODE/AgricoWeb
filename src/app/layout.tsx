import './globals.css';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Application de Gestion des Produits',
  description: 'Bienvenue sur l\'application de gestion des produits',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        {/* Barre de navigation */}
        <header className="bg-green-700 text-white p-4 shadow-lg">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-semibold hover:text-green-200 transition duration-300">
              Accueil
            </Link>
            <Link href="/Product" className="text-2xl font-semibold hover:text-green-200 transition duration-300">
              Produits
            </Link>
          </nav>
        </header>

        {/* Contenu principal */}
        <main className="container mx-auto p-6 flex-grow">
          {children}
        </main>

        {/* Pied de page */}
        <footer className="bg-green-700 text-white text-center py-4">
          <p className="text-sm">
            © 2024 Application de Gestion des Produits. Tous droits réservés.
          </p>
        </footer>
      </body>
    </html>
  );
}
