'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600/50 overflow-x-hidden">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl bg-zinc-900/60 backdrop-blur-2xl border border-white/5 rounded-full px-8 h-16 flex items-center justify-between shadow-2xl">
        <Link href="/" className="font-black text-2xl tracking-tighter italic text-red-600">X.</Link>
        <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
          <Link href="/about" className="text-zinc-500 hover:text-white transition-all">CONCEPT</Link>
          <Link href="/vent" className="bg-white text-black px-6 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all">進入系統</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-48 pb-20">
        <section className="mb-32">
          <h1 className="text-[15vw] md:text-[10vw] font-black tracking-tightest uppercase leading-[0.8] italic mb-8">
            X你的！<br/><span className="text-red-600">服務.</span>
          </h1>
          <p className="max-w-2xl text-zinc-500 text-lg md:text-2xl font-light leading-relaxed border-l-2 border-red-600 pl-6">
            專為台灣在地生活打造的情緒粉碎空間。在此卸下武裝，讓憤怒與 AI 技術共鳴。
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/vent" className="md:col-span-2 group bg-zinc-900/30 border border-zinc-800/50 p-12 rounded-[3.5rem] hover:border-red-600/50 transition-all relative overflow-hidden flex flex-col justify-end min-h-[400px]">
            <h2 className="text-5xl font-black italic tracking-tighter group-hover:text-red-600 transition-colors relative z-10">即時發洩牆 →</h2>
            <div className="absolute top-0 right-0 p-12 text-9xl font-black italic opacity-[0.03] select-none group-hover:opacity-10 transition-all uppercase">Vent</div>
          </Link>
          <Link href="/profile" className="bg-zinc-900/30 border border-zinc-800/50 p-12 rounded-[3.5rem] hover:border-zinc-500 transition-all flex flex-col justify-between italic font-black text-2xl">
            <span>👤 個人主頁</span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Cloud Dashboard</span>
          </Link>
        </div>
      </main>
    </div>
  );
}