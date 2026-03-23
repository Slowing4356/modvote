"use client";

import { useState } from "react";

export default function CodePage() {
  const [code, setCode] = useState("");

  function enter() {
    localStorage.setItem("userCode", code);
    window.location.href = "/";
  }

  return (
    <div className="h-screen flex items-center justify-center text-white">
      <div className="bg-zinc-900 p-6 rounded-2xl">
        <input
          placeholder="Enter Code"
          className="bg-zinc-800 p-2 rounded w-full"
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={enter} className="mt-4 w-full bg-white text-black p-2 rounded">
          Enter
        </button>
      </div>
    </div>
  );
}