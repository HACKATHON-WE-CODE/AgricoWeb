"use client"
import { useState, FormEvent } from "react";
import { auth } from "../lib/firebase";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      console.log("Inscription réussie");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Inscription</h1>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">S&apos;inscrire</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Signup;
