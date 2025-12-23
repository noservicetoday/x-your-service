'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ProfilePage() {
  const [userName, setUserName] = useState('');
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('user_name') || '';
    setUserName(name);
    if (name) fetchMyPosts(name);
    else setIsLoaded(true);
  }, []);

  const fetchMyPosts = async (name: string) => {
    const { data } = await supabase.from('posts').select('*, comments(*)').eq('author', name).order('created_at', { ascending: false });
    if (data) setMyPosts(data);
    setIsLoaded(true);
  };

  const saveAndSync = async () => {
    const newName = userName.trim();
    if (!newName) return;
    const oldName = localStorage.getItem('user_name') || '';
    await supabase.from('posts').update({ author: newName }).eq('author', oldName);
    await supabase.from('comments').update({ author: newName }).eq('author', oldName);
    localStorage.setItem('user_name', newName);
    fetchMyPosts(newName);
    alert('✅ 身分代號已完成雲端同步更新');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans p-8">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl bg-zinc-900/60 backdrop-blur-3xl border border-white/5 rounded-full px-10 h-16 flex items-center justify-between shadow-2xl">
        <Link href="/vent" className="text-zinc-500 hover:text-white transition-all text-xs font-black uppercase">← 返回牆面</Link>
        <span className="font-black italic text-zinc-200">X. CLOUD RECORD</span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
      </nav>

      <main className="max-w-7xl mx-auto pt-36 pb-20">
        <h1 className="text-[18vw] font-black tracking-tightest uppercase leading-none italic opacity-5 select-none absolute top-20 left-0 pointer-events-none">RECORD.</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20 relative z-10">
          <div className="md:col-span-3 bg-zinc-900/30 border border-zinc-800/50 rounded-[4rem] p-12 h-[600px] overflow-y-auto custom-scrollbar">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-10">個人發洩歷史存檔 ({myPosts.length})</span>
            <div className="space-y-16">
              {myPosts.map(p => (
                <div key={p.id} className="border-b border-zinc-900 pb-12 hover:border-red-900/40 transition-all">
                  <p className="text-5xl font-black tracking-tighter italic text-zinc-300">"{p.content}"</p>
                  <div className="flex justify-between items-center mt-8">
                    <div className="text-[10px] font-mono text-zinc-800 uppercase italic">{new Date(p.created_at).toLocaleString('zh-TW')}</div>
                    <div className="text-[10px] font-black text-red-600 tracking-[0.3em]">🔥 獲得 {p.likes || 0} 能量</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-red-600 p-12 rounded-[4rem] shadow-2xl flex flex-col justify-between h-[300px]">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">累積燃燒能量</span>
            <div className="text-8xl font-black italic tracking-tighter text-white">{myPosts.reduce((acc, p) => acc + (p.likes || 0), 0)}</div>
          </div>
        </div>
        <div className="bg-zinc-900/20 border border-zinc-800/50 p-12 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1 w-full text-center md:text-left">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em] block mb-6 italic">修改身分代號 (全台同步)</span>
            <input type="text" className="w-full bg-transparent text-6xl font-black outline-none border-b border-zinc-800 focus:border-red-600 pb-6 transition-all tracking-tightest italic text-zinc-200" value={userName} onChange={e => setUserName(e.target.value)} />
          </div>
          <button onClick={saveAndSync} className="w-full md:w-auto px-20 py-8 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all hover:bg-red-600 hover:text-white">更新資訊</button>
        </div>
      </main>
    </div>
  );
}