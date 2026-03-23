"use client";

import { useState, useEffect } from "react";
import { searchMods } from "@/lib/modrinth";
import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

export default function Browse() {
  const [mods, setMods] = useState([]);
  const [query, setQuery] = useState("");
  const [config, setConfig] = useState({});
  const [desc, setDesc] = useState({});

  useEffect(() => {
    const code = localStorage.getItem("userCode");
    if (!code) window.location.href = "/code";

    loadConfig();
  }, []);

  async function loadConfig() {
    const snap = await getDocs(collection(db, "config"));
    const data = snap.docs[0]?.data();
    setConfig(data || {});
  }

  async function handleSearch() {
    const data = await searchMods(query, config.version, config.loader);
    setMods(data.hits);
  }

  async function addMod(mod) {
    await addDoc(collection(db, "mods"), {
      modrinthId: mod.project_id,
      votes: 0,
      downvotes: 0,
      customDesc: desc[mod.project_id] || "",
      createdAt: new Date()
    });
  }

  return (
    <div className="p-6 text-white">
      <input
        className="bg-zinc-900 p-2 rounded w-full"
        placeholder="Search mods..."
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch} className="mt-2 bg-white text-black px-4 py-2 rounded">
        Search
      </button>

      <div className="grid gap-4 mt-6">
        {mods.map(mod => (
          <div key={mod.project_id} className="bg-zinc-900 p-4 rounded-2xl">
            <img src={mod.icon_url} className="w-12 h-12" />
            <h2>{mod.title}</h2>

            <textarea
              placeholder="Why this mod?"
              className="w-full bg-zinc-800 mt-2 p-2 rounded"
              onChange={(e) =>
                setDesc({ ...desc, [mod.project_id]: e.target.value })
              }
            />

            <button
              onClick={() => addMod(mod)}
              className="mt-2 bg-green-500 px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}