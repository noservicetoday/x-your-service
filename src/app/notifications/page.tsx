'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AppNotification {
  id: number;
  type: 'like' | 'comment';
  fromUser: string;
  content: string;
  postId: number;
  isRead: boolean;
}

export default function NotificationsPage() {
  const [list, setList] = useState<AppNotification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vent_notifications');
    if (saved) setList(JSON.parse(saved));
  }, []);

  const clear = () => {
    const updated = list.map(n => ({ ...n, isRead: true }));
    setList(updated);
    localStorage.setItem('vent_notifications', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-red-500/30">
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md h-16 flex items-center px-6 sticky top-0 z-50">
        <Link href="/vent" className="text-zinc-500 hover:text-white transition-colors font-bold tracking-tighter">← 返回發洩牆</Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-20">
        <header className="mb-12 flex justify-between items-end">
          <h1 className="text-6xl font-black tracking-tighter uppercase bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent">Alerts.</h1>
          <button onClick={clear} className="text-[10px] text-zinc-600 hover:text-zinc-300 font-bold tracking-widest">全部標記已讀</button>
        </header>

        <div className="space-y-4">
          {list.length > 0 ? list.map((n) => (
            <div key={n.id} className={`relative bg-zinc-900/40 border p-6 rounded-[2rem] transition-all group ${n.isRead ? 'border-zinc-800/50 opacity-60' : 'border-red-600/30 shadow-[0_0_20px_rgba(220,38,38,0.05)]'}`}>
              <Link href={`/vent#post-${n.postId}`} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-800">{n.type === 'like' ? '🔥' : '💬'}</div>
                <div className="flex-1">
                  <div className="text-[10px] text-zinc-700 mb-1">{new Date(n.id).toLocaleString()}</div>
                  <p className="text-sm"><span className="font-bold text-red-500">{n.fromUser}</span> {n.type === 'like' ? '點燃了你的能量' : `留言：${n.content}`}</p>
                </div>
                {!n.isRead && <div className="w-2 h-2 bg-red-600 rounded-full"></div>}
              </Link>
            </div>
          )) : (
            <div className="py-24 border-2 border-dashed border-zinc-900 rounded-[2rem] text-center text-zinc-800 font-mono text-sm tracking-widest uppercase font-bold">目前沒有通知</div>
          )}
        </div>
      </main>
    </div>
  );
}