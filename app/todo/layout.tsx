"use client";
import { ApolloProvider } from "@apollo/client/react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import client from "../apollo";
//import { log } from "console";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user,logout } = useAuth();
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
        <span> Welcome, {user?.username} ({user?.email}) 
        <button
          onClick={async () => {
            // Implement logout functionality
            // You might want to call a logout function from the auth context
            //router.push("/login");
            await logout();
            router.push("/login");
          }}
          className="mx-2 mt-2 bg-sky-400 hover:bg-sky-500 text-white font-bold py-1 px-2 rounded-lg"
        >
          Logout
        </button>
        </span>
      </header>
      <main className="flex-1 p-4">
        <ApolloProvider client={client}>
          
      
          {children}
        </ApolloProvider>
      
      
      </main>
      <footer className="bg-gray-800 text-white p-4">
        <p className="text-center">Copyright © 2025</p>
      </footer>
    </div>
  );
}
