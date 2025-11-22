"use client";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  //const {}

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Todo App</h1>
      </header>
      <main className="flex-1 p-4">{children}</main>
      <footer className="bg-gray-800 text-white p-4">
        <p className="text-center">Copyright © 2025</p>
      </footer>
    </div>
  );
}
