"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

export default function Admin() {
  const [version, setVersion] = useState("");
  const [loader, setLoader] = useState("");

  async function save() {
    await addDoc(collection(db, "config"), {
      version,
      loader
    });

    alert("Saved!");
  }

  function generateCode() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    alert("Code: " + code);
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl mb-4">Admin Panel</h1>

      <input
        placeholder="Minecraft Version (1.20.1)"
        className="bg-zinc-800 p-2 rounded w-full"
        onChange={(e) => setVersion(e.target.value)}
      />

      <input
        placeholder="Loader (fabric / forge / neoforge)"
        className="bg-zinc-800 p-2 rounded w-full mt-2"
        onChange={(e) => setLoader(e.target.value)}
      />

      <button onClick={save} className="mt-3 bg-white text-black p-2 rounded">
        Save Filters
      </button>

      <button onClick={generateCode} className="mt-3 bg-green-500 p-2 rounded w-full">
        Generate Code
      </button>
    </div>
  );
}