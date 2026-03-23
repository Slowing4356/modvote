"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc
} from "firebase/firestore";
import Navbar from "@/components/Navbar";
import ModCard from "@/components/ModCard";

export default function Home() {
  const [mods, setMods] = useState([]);

  useEffect(() => {
    const code = localStorage.getItem("userCode");
    if (!code) window.location.href = "/code";

    return onSnapshot(collection(db, "mods"), (snap) => {
      setMods(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  async function vote(modId, type) {
    const code = localStorage.getItem("userCode");

    const q = query(
      collection(db, "votes"),
      where("modId", "==", modId),
      where("code", "==", code)
    );

    const exists = await getDocs(q);
    if (!exists.empty) return alert("Already voted");

    await addDoc(collection(db, "votes"), { modId, code });

    await updateDoc(doc(db, "mods", modId), {
      [type === "up" ? "votes" : "downvotes"]: increment(1)
    });
  }

  async function deleteMod(id) {
    await deleteDoc(doc(db, "mods", id));
  }

  const isAdmin = localStorage.getItem("role") === "admin";

  return (
    <div>
      <Navbar />

      <div className="p-6 grid gap-4">
        {mods.map(mod => (
          <ModCard
            key={mod.id}
            mod={mod}
            isAdmin={isAdmin}
            onVote={(t) => vote(mod.id, t)}
            onDelete={() => deleteMod(mod.id)}
          />
        ))}
      </div>
    </div>
  );
}