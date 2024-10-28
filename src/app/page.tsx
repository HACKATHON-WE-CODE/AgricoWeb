
import Link from "next/link";

const Home = () => {
  return (
    <div>
      <h1>Bienvenue</h1>
      <Link href="/signup">Inscription</Link>
      <br />
      <Link href="/login">Connexion</Link>
    </div>
  );
};

export default Home;
