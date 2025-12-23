'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Flame, User } from 'lucide-react'; 
import Link from 'next/link';

// 直接定義連線資訊，確保不因外部路徑導致報錯
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function VentPage() {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [wall, setWall] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [colorMode, setColorMode] = useState<'burn' | 'cold'>('burn');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  // 你的版本號標記
  const APP_VERSION = "v1.0.1"; 

  useEffect(() => {
    const savedName = localStorage.getItem('user_name') || '匿名大師';
    setUserName(savedName);
    const savedLikes = JSON.parse(localStorage.getItem('my_likes') || '[]');
    setLikedPosts(savedLikes);
    fetchPosts();

    // 這裡加上了 as any，解決你截圖中的紅字報錯
    const channel = supabase.channel('realtime_posts')
      .on(
        'postgres_changes' as any, 
        { event: '*', table: 'posts' }, 
        () => fetchPosts()
      )
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*, comments(*)').order('created_at', { ascending: false });
    if (data) setWall(data);
    setIsLoaded(true);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    await supabase.from('posts').insert([{ content: message, author: userName, likes: 0 }]);
    setMessage('');
    fetchPosts();
  };

  const theme = colorMode === 'burn' ? { primary: 'text-red-600', btn: 'bg-red-600' } : { primary: 'text-blue-400', btn: 'bg-blue-400 text-black' };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${colorMode === 'burn' ? 'bg-black' : 'bg-zinc-950'} text-white font-sans`}>
      {/* 導覽列 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md h-20 flex items-center px-8 justify-between border-b border-white/5">
        <Link href="/" className={`font-black text-3xl italic tracking-tighter ${theme.primary}`}>X.</Link>
        <div className="flex items-center gap-4">
          <button onClick={() => setColorMode(colorMode === 'burn' ? 'cold' : 'burn')} className="p-2 bg-zinc-900 rounded-full border border-zinc-800 text-xl">
            {colorMode === 'burn' ? '🔥' : '🧊'}
          </button>
          <Link href="/profile" className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full transition-all ${theme.btn}`}>
            <User size={12} /> 個人主頁
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto pt-32 px-6 pb-24">
        {/* 發布區 */}
        <div className="p-8 bg-zinc-900/30 rounded-[2.5rem] border border-white/5 mb-12 shadow-2xl">
          <textarea 
            className="w-full h-24 bg-transparent text-3xl font-black outline-none placeholder:text-zinc-800 resize-none italic" 
            placeholder="碎裂不爽" 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
          />
          <div className="flex justify-end mt-4">
            <button onClick={handleSend} className={`px-10 py-3 rounded-full font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform ${theme.btn}`}>
              發文
            </button>
          </div>
        </div>

        {/* 串文列表 */}
        <div className="space-y-6">
          {isLoaded ? wall.map(post => (
            <div key={post.id} className="bg-zinc-900/10 border border-white/5 p-8 rounded-[2rem] hover:border-zinc-800 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[10px] font-black uppercase italic ${theme.primary}`}>{post.author}</span>
                <span className="text-[9px] text-zinc-700 font-mono italic">B{post.comments?.length || 0}F</span>
              </div>
              <p className="text-3xl font-black italic mb-6 leading-tight text-zinc-100">"{post.content}"</p>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-5 py-2 bg-zinc-900 rounded-full border border-zinc-800 text-[10px] font-bold text-zinc-500 hover:text-red-600 transition-colors">
                  <Flame size={12} /> 能量注入
                </button>
              </div>
            </div>
          )) : <div className="text-center py-20 animate-pulse text-zinc-800 font-black italic">系統同步中...</div>}
        </div>

        {/* 底部版本號標記 */}
        <footer className="mt-32 flex flex-col items-center opacity-20 hover:opacity-100 transition-opacity duration-500">
          <div className="w-8 h-px bg-zinc-800 mb-6"></div>
          <span className="text-[10px] font-mono tracking-[0.4em] font-bold text-zinc-400">{APP_VERSION}</span>
          <span className="text-[8px] mt-2 font-mono text-zinc-600 uppercase tracking-widest">System Active</span>
        </footer>
      </main>
    </div>
  );
}