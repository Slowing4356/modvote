"use client";

import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";

export default function Admin() {
  const [version, setVersion] = useState("");
  const [loader, setLoader] = useState("");

  const isAdmin = localStorage.getItem("role") === "admin";
  if (!isAdmin) return <div className="p-6 text-white">No access</div>;

  async function saveConfig() {
    await addDoc(collection(db, "config"), { version, loader });
  }

  async function createCode(role) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    await addDoc(collection(db, "codes"), { code, role });

    alert(code);
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl mb-4">Admin</h1>

      <input placeholder="Version" onChange={e => setVersion(e.target.value)} />
      <input placeholder="Loader" onChange={e => setLoader(e.target.value)} />

      <button onClick={saveConfig}>Save Filters</button>

      <button onClick={() => createCode("user")}>New User Code</button>
      <button onClick={() => createCode("admin")}>New Admin Code</button>
    </div>
  );
}