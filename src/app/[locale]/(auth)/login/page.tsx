"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ROLE_HOME } from "@/lib/permissions";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message || "Invalid credentials");
      return;
    }

    const role = (data?.user).role || "WAITER";
    router.push(ROLE_HOME[role] || "/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full border p-2 rounded"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Sign In
      </button>
    </form>
  );
}
