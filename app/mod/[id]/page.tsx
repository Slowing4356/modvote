"use client";

import { useEffect, useState } from "react";
import { getMod } from "@/lib/modrinth";
import Navbar from "@/components/Navbar";

export default function ModDetail({ params }) {
  const [mod, setMod] = useState(null);

  useEffect(() => {
    getMod(params.id).then(setMod);
  }, []);

  if (!mod) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div>
      <Navbar />

      <div className="p-6 text-white max-w-2xl mx-auto">
        <img src={mod.icon_url} className="w-20 h-20" />
        <h1 className="text-2xl mt-3">{mod.title}</h1>

        <p className="text-gray-400 mt-2">{mod.description}</p>
      </div>
    </div>
  );
}