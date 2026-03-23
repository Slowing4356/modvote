"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  query,
  where,
  getDocs,
  addDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [mods, setMods] = useState([]);

  useEffect(() => {
    const code = localStorage.getItem("userCode");
    if (!code) window.location.href = "/code";

    const unsub = onSnapshot(collection(db, "mods"), (snap) => {
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a,b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setMods(data);
    });

    return () => unsub();
  }, []);

  async function vote(modId, type) {
    const code = localStorage.getItem("userCode");

    const q = query(
      collection(db, "votes"),
      where("modId", "==", modId),
      where("code", "==", code)
    );

    const existing = await getDocs(q);
    if (!existing.empty) return alert("Already voted");

    await addDoc(collection(db, "votes"), {
      modId,
      code,
      type
    });

    await updateDoc(doc(db, "mods", modId), {
      [type === "up" ? "votes" : "downvotes"]: increment(1)
    });
  }

  return (
    <div className="p-6 text-white">
      <div className="grid gap-4">
        {mods.map(mod => (
          <div key={mod.id} className="bg-zinc-900 p-5 rounded-2xl">
            <p className="text-gray-400 text-sm">{mod.customDesc}</p>

            <div className="flex gap-2 mt-2">
              <button onClick={() => vote(mod.id, "up")} className="bg-green-500 px-3 py-1 rounded">
                👍 {mod.votes || 0}
              </button>

              <button onClick={() => vote(mod.id, "down")} className="bg-red-500 px-3 py-1 rounded">
                👎 {mod.downvotes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}