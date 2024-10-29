
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <nav>
          <Link href="/">Accueil</Link> | <Link href="/Product">Produits</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
