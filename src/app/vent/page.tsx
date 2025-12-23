'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Flame, User, Bell, Trash2 } from 'lucide-react'; 
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function VentPage() {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [wall, setWall] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [colorMode, setColorMode] = useState<'burn' | 'cold'>('burn');
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const APP_VERSION = "v1.2.0"; // 最終功能版

  useEffect(() => {
    const savedName = localStorage.getItem('user_name') || '';
    setUserName(savedName);
    const savedLikes = JSON.parse(localStorage.getItem('my_likes') || '[]');
    setLikedPosts(savedLikes);
    fetchPosts();

    const channel = supabase.channel('realtime_prod')
      .on('postgres_changes' as any, { event: '*', table: 'posts' }, () => fetchPosts())
      .on('postgres_changes' as any, { event: '*', table: 'comments' }, () => fetchPosts())
      .on('broadcast' as any, { event: 'like_event' }, (payload: any) => {
        if (!payload.payload.isUnlike) {
          const newNotif = { id: Math.random(), message: `🔥 有人能量了貼文`, time: new Date() };
          setNotifications(prev => [newNotif, ...prev].slice(0, 5));
        }
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*, comments(*)').order('created_at', { ascending: false });
    if (data) setWall(data);
    setIsLoaded(true);
  };

  const handleSend = async () => {
    // 強制檢查：發文一定要有名字
    if (!userName.trim()) {
      alert("請先到『個人主頁』設定你的名字才能發文！");
      return;
    }
    if (!message.trim()) return;

    await supabase.from('posts').insert([{ content: message, author: userName, likes: 0 }]);
    setMessage('');
    fetchPosts();
  };

  const handleDelete = async (postId: number, author: string) => {
    // 收回功能：檢查是否為本人
    if (userName !== author) {
      alert("你只能收回自己的不爽！");
      return;
    }
    if (confirm("確定要收回這則不爽嗎？")) {
      await supabase.from('posts').delete().eq('id', postId);
      fetchPosts();
    }
  };

  const theme = colorMode === 'burn' ? { primary: 'text-red-600', btn: 'bg-red-600' } : { primary: 'text-blue-400', btn: 'bg-blue-400 text-black' };

  return (
    <div className={`min-h-screen transition-all ${colorMode === 'burn' ? 'bg-black text-white' : 'bg-zinc-950 text-white'}`}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md h-20 flex items-center px-8 justify-between border-b border-white/5">
        <Link href="/" className={`font-black text-3xl italic ${theme.primary}`}>X.</Link>
        <div className="flex items-center gap-4 relative">
          <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 bg-zinc-900 rounded-full border border-zinc-800">
            <Bell size={20} />
            {notifications.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>}
          </button>
          <button onClick={() => setColorMode(colorMode === 'burn' ? 'cold' : 'burn')} className="p-2 bg-zinc-900 rounded-full border border-zinc-800 text-xl">{colorMode === 'burn' ? '🔥' : '🧊'}</button>
          <Link href="/profile" className={`text-[10px] font-black uppercase px-6 py-2 rounded-full ${theme.btn}`}>個人主頁</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto pt-32 px-6 pb-24">
        <div className="p-8 bg-zinc-900/30 rounded-[2.5rem] border border-white/5 mb-10">
          <textarea className="w-full h-24 bg-transparent text-3xl font-black outline-none placeholder:text-zinc-800 resize-none italic" placeholder="碎裂不爽" value={message} onChange={e => setMessage(e.target.value)} />
          <div className="flex justify-end mt-4">
            <button onClick={handleSend} className={`px-10 py-3 rounded-full font-black text-[10px] uppercase ${theme.btn}`}>發文</button>
          </div>
        </div>

        <div className="space-y-8">
          {isLoaded ? wall.map(post => (
            <div key={post.id} className="bg-zinc-900/10 border border-white/5 p-8 rounded-[2.5rem] relative group">
              <div className="flex justify-between items-center mb-6">
                <span onClick={() => setCommentInputs({...commentInputs, [post.id]: `@${post.author} `})} className={`text-[10px] font-black uppercase italic cursor-pointer ${theme.primary}`}>@{post.author}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-zinc-700 font-mono">#{post.id}</span>
                  {/* 收回按鈕：僅限本人 */}
                  {userName === post.author && (
                    <button onClick={() => handleDelete(post.id, post.author)} className="text-zinc-600 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-3xl font-black italic mb-8">"{post.content}"</p>
              <button className={`flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-800 text-zinc-500`}>
                <Flame size={14} /> <span className="text-[10px] font-black">{post.likes || 0} 能量</span>
              </button>

              <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                {post.comments?.map((c: any, i: number) => (
                  <div key={c.id} className="text-xs flex gap-3">
                    <span className="text-red-600/40 font-mono">B{i+1}</span>
                    <span className="font-black text-zinc-500 italic">@{c.author}:</span>
                    <span className="text-zinc-300">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )) : <div className="text-center py-20 text-zinc-800 font-black italic">系統同步中...</div>}
        </div>

        <footer className="mt-32 flex flex-col items-center opacity-20">
          <span className="text-[10px] font-mono tracking-[0.4em] font-bold text-zinc-400 uppercase">{APP_VERSION}</span>
        </footer>
      </main>
    </div>
  );
}