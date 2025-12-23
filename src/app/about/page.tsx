'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [colorMode, setColorMode] = useState<'burn' | 'cold'>('burn');

  useEffect(() => {
    const savedMode = localStorage.getItem('vent_color_mode');
    if (savedMode) setColorMode(savedMode as 'burn' | 'cold');
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-700 font-sans selection:bg-red-600/50 pb-24 md:pb-0 ${colorMode === 'burn' ? 'bg-black text-zinc-100' : 'bg-zinc-950 text-zinc-100'}`}>
      
      {/* 懸浮導覽列 */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-3xl bg-zinc-900/60 backdrop-blur-3xl border border-white/5 rounded-full px-8 h-14 flex items-center justify-between shadow-2xl">
        <Link href="/vent" className="text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">← 返回牆面</Link>
        <span className="font-black text-sm tracking-tighter italic">X. Concept</span>
        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* 雜誌感大標題 */}
        <div className="flex justify-between items-baseline mb-16">
          <h1 className="text-8xl md:text-9xl font-black tracking-tightest uppercase leading-none italic opacity-10 select-none">Origin.</h1>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Version 1.0.4</p>
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">Est. 2025</p>
          </div>
        </div>

        {/* Bento Grid 內容區塊 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          
          {/* 核心理念：大格子 */}
          <div className="md:col-span-2 bg-zinc-900/30 border border-zinc-800/50 rounded-[3.5rem] p-12 relative overflow-hidden flex flex-col justify-center min-h-[400px]">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-[0.4em] mb-6">核心理念</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic leading-tight mb-8">
              「X你的！服務」不僅是一個社群，更是一場情緒的革命。
            </h2>
            <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-xl">
              在台灣這座快節奏的島嶼上，我們需要一個純粹、高效、且具美感的空間來釋放那些無法對外言說的不爽。
            </p>
            <div className="absolute -bottom-10 -right-10 text-[10rem] font-black italic opacity-[0.02] select-none pointer-events-none">SOUL</div>
          </div>

          {/* 台灣文化：中格子 */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[3rem] flex flex-col justify-between group overflow-hidden">
            <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-700">🏮</div>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-4">在地共鳴</span>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              靈感源自台灣巷弄、菜市場與廟會的喧囂。我們將在地文化轉化為數位符號，建立專屬於台灣人的發洩語言。
            </p>
          </div>

          {/* 技術願景：中格子 */}
          <div className="bg-red-600 p-10 rounded-[3rem] shadow-2xl shadow-red-950/20 flex flex-col justify-between">
            <div className="text-4xl text-white mb-6 animate-pulse">⚡</div>
            <div>
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-4">技術賦能</span>
              <p className="text-sm text-white font-medium leading-relaxed">
                結合 AI 圖像生成與現代網頁工程，我們旨在打造一個具備極致 UI 體驗的情緒處理系統。
              </p>
            </div>
          </div>

          {/* 社群規則：長格子 */}
          <div className="md:col-span-2 bg-zinc-900/20 border border-zinc-800/30 p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] block mb-6">使用規章</span>
              <ul className="space-y-4">
                <li className="flex gap-4 text-zinc-400 font-light">
                  <span className="text-red-600 font-black italic">01.</span>
                  <span>尊重每一份碎裂的情緒，這裡不歡迎說教。</span>
                </li>
                <li className="flex gap-4 text-zinc-400 font-light">
                  <span className="text-red-600 font-black italic">02.</span>
                  <span>代號是你的面具，請以此隱匿或重生。</span>
                </li>
                <li className="flex gap-4 text-zinc-400 font-light">
                  <span className="text-red-600 font-black italic">03.</span>
                  <span>點燃能量，是為了共鳴而非批判。</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 底部行動呼籲 */}
        <section className="text-center py-20 border-t border-zinc-900">
          <p className="text-zinc-600 font-black text-xs uppercase tracking-[0.5em] mb-12">準備好加入這場情緒粉碎了嗎？</p>
          <Link href="/vent" className="inline-block px-16 py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-95">
            進入發洩牆
          </Link>
        </section>
      </main>

      {/* 手機底部導覽 */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900/80 backdrop-blur-3xl border border-white/5 h-16 rounded-full flex justify-around items-center px-6 shadow-2xl z-50">
        <Link href="/vent" className="text-zinc-500 text-xl font-black">X.</Link>
        <Link href="/notifications" className="text-zinc-500 text-xl">🔔</Link>
        <Link href="/profile" className="text-zinc-500 text-xl">👤</Link>
      </nav>
    </div>
  );
}