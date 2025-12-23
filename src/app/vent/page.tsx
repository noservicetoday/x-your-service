'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// 💡 定義通知物件型別
interface VentNotification {
  id: string;
  message: string;
  postId: number;
  time: Date;
}

export default function VentPage() {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [wall, setWall] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [colorMode, setColorMode] = useState<'burn' | 'cold'>('burn');
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<VentNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const postRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const savedName = localStorage.getItem('user_name') || '匿名大師';
    setUserName(savedName);
    const savedLikes = JSON.parse(localStorage.getItem('my_likes') || '[]');
    setLikedPosts(savedLikes);
    const savedMode = (localStorage.getItem('vent_color_mode') as 'burn' | 'cold') || 'burn';
    setColorMode(savedMode);
    
    fetchPosts();

    // 💡 即時互動頻道：加入 any 型別避免紅字報錯
    const channel = supabase.channel('realtime_stable_v6')
      .on('postgres_changes' as any, { event: '*', table: 'posts' }, () => fetchPosts())
      .on('postgres_changes' as any, { event: '*', table: 'comments' }, () => fetchPosts())
      .on('broadcast' as any, { event: 'like_event' }, (payload: any) => {
        const { liker, postId, postContent, isUnlike } = payload.payload;
        if (!isUnlike) {
          const newNotif = { 
            id: Math.random().toString(), 
            message: `🔥 ${liker} 能量了你的貼文：「${postContent.slice(0, 8)}...」`, 
            postId, 
            time: new Date() 
          };
          setNotifications(prev => [newNotif, ...prev].slice(0, 10));
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

  // 💡 Tag 顯示邏輯：隱藏 @ 但保留高亮
  const renderContent = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(@\S+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return <span key={i} className="text-red-600 font-black px-1">{part.substring(1)}</span>;
      }
      return part;
    });
  };

  // 💡 能量注入與收回邏輯
  const handleLike = async (post: any) => {
    const isAlreadyLiked = likedPosts.includes(post.id);
    const newLikesCount = isAlreadyLiked ? Math.max(0, (post.likes || 0) - 1) : (post.likes || 0) + 1;

    const { error } = await supabase.from('posts').update({ likes: newLikesCount }).eq('id', post.id);
    
    if (!error) {
      supabase.channel('realtime_stable_v6').send({
        type: 'broadcast',
        event: 'like_event',
        payload: { liker: userName, postId: post.id, postContent: post.content, isUnlike: isAlreadyLiked }
      });

      const updatedLikes = isAlreadyLiked ? likedPosts.filter(id => id !== post.id) : [...likedPosts, post.id];
      setLikedPosts(updatedLikes);
      localStorage.setItem('my_likes', JSON.stringify(updatedLikes));
      fetchPosts();
    }
  };

  const theme = colorMode === 'burn' ? { primary: 'text-red-600', btn: 'bg-red-600' } : { primary: 'text-zinc-100', btn: 'bg-zinc-100 text-black' };

  return (
    <div className={`min-h-screen transition-all duration-700 font-sans ${colorMode === 'burn' ? 'bg-black text-white' : 'bg-zinc-950 text-white'}`}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5 h-20 flex items-center px-8 justify-between">
        <Link href="/" className={`font-black text-3xl italic tracking-tighter ${theme.primary}`}>X.</Link>
        <div className="flex items-center gap-6 relative">
          {/* 鈴鐺通知中心 */}
          <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
            <span className="text-xl">🔔</span>
            {notifications.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">{notifications.length}</span>}
          </button>
          {isNotifOpen && (
            <div className="absolute top-16 right-0 w-80 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
              <div className="p-5 border-b border-zinc-800 font-black text-xs uppercase tracking-widest text-zinc-500">互動通知</div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? notifications.map(n => (
                  <button key={n.id} onClick={() => { setIsNotifOpen(false); postRefs.current[n.postId]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className="w-full text-left p-5 hover:bg-white/5 border-b border-zinc-800/50 transition-all">
                    <p className="text-sm font-bold leading-tight mb-2">{n.message}</p>
                    <span className="text-[9px] text-zinc-600 uppercase font-mono">{n.time.toLocaleTimeString()}</span>
                  </button>
                )) : <div className="p-10 text-center text-zinc-700 italic text-sm">尚無新動態</div>}
              </div>
            </div>
          )}
          <button onClick={() => { const m = colorMode === 'burn' ? 'cold' : 'burn'; setColorMode(m); localStorage.setItem('vent_color_mode', m); }} className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 text-xl">{colorMode === 'burn' ? '🧊' : '🔥'}</button>
          <Link href="/profile" className={`text-xs font-black uppercase tracking-widest px-8 py-3 rounded-full shadow-lg transition-all ${theme.btn}`}>個人主頁</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto pt-32 px-6 pb-24">
        {/* 發布區：文字為碎裂不爽與發文 */}
        <div className={`p-10 rounded-[3.5rem] border mb-16 transition-all duration-700 ${colorMode === 'burn' ? 'bg-zinc-900/40 border-red-900/20 shadow-[0_0_50px_rgba(220,38,38,0.1)]' : 'bg-zinc-900/20 border-zinc-800'}`}>
          <textarea className="w-full h-32 bg-transparent text-4xl font-black outline-none placeholder:text-zinc-800 resize-none italic tracking-tighter" placeholder="碎裂不爽" value={message} onChange={e => setMessage(e.target.value)} />
          <div className="flex justify-end pt-8 border-t border-zinc-800/30">
            <button onClick={async () => { if (!message.trim() || !userName) return; await supabase.from('posts').insert([{ content: message, author: userName, likes: 0 }]); setMessage(''); fetchPosts(); }} className={`px-12 py-3 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl ${theme.btn}`}>發文</button>
          </div>
        </div>

        <div className="space-y-12">
          {isLoaded ? wall.map(post => (
            <div key={post.id} ref={el => { postRefs.current[post.id] = el; }} className="bg-zinc-900/10 border border-zinc-900/50 p-12 rounded-[4rem] group hover:border-zinc-700 transition-all shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <span onClick={() => setCommentInputs({ ...commentInputs, [post.id]: (commentInputs[post.id] || '') + `@${post.author} ` })} className="text-xs font-black text-red-600 uppercase tracking-widest italic cursor-pointer hover:underline">{post.author}</span>
                <span className="text-[10px] font-mono text-zinc-800">{new Date(post.created_at).toLocaleString('zh-TW')}</span>
              </div>
              <p className="text-5xl font-black tracking-tightest leading-[1.1] mb-12 italic text-zinc-200">"{renderContent(post.content)}"</p>
              
              <button onClick={() => handleLike(post)} className={`flex items-center gap-3 px-10 py-4 rounded-full border transition-all active:scale-90 ${likedPosts.includes(post.id) ? 'border-red-600 bg-red-600 text-white' : 'border-zinc-800 text-zinc-500 hover:border-red-600'}`}>
                <span className="text-sm font-black">🔥 {post.likes || 0} {likedPosts.includes(post.id) ? '已加火 (收回)' : '能量注入'}</span>
              </button>
              
              <div className="mt-12 pt-10 border-t border-zinc-900/50 space-y-6">
                {post.comments?.sort((a:any, b:any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((c: any, index: number) => (
                  <div key={c.id} className="flex gap-4 items-start text-sm group/cmt">
                    <span className="font-black text-red-600/40 min-w-[30px]">B{index + 1}</span> 
                    <span onClick={() => setCommentInputs({ ...commentInputs, [post.id]: (commentInputs[post.id] || '') + `@${c.author} ` })} className="font-black text-zinc-600 uppercase cursor-pointer hover:text-red-500 transition-colors">{c.author}:</span>
                    <p className="text-zinc-400 font-light">{renderContent(c.text)}</p>
                  </div>
                ))}
                <div className="flex gap-4 mt-8">
                  <input type="text" className="flex-1 bg-zinc-900/30 rounded-full px-8 py-4 border border-zinc-800 text-sm outline-none focus:border-zinc-500" placeholder="點擊姓名標記他人..." value={commentInputs[post.id] || ''} onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })} onKeyDown={async (e) => { if (e.key === 'Enter') { const text = commentInputs[post.id]; if (!text?.trim()) return; await supabase.from('comments').insert([{ post_id: post.id, text, author: userName }]); setCommentInputs({ ...commentInputs, [post.id]: '' }); fetchPosts(); } }} />
                  <button onClick={async () => { const text = commentInputs[post.id]; if (!text?.trim()) return; await supabase.from('comments').insert([{ post_id: post.id, text, author: userName }]); setCommentInputs({ ...commentInputs, [post.id]: '' }); fetchPosts(); }} className="bg-zinc-800 px-8 py-4 rounded-full text-[10px] font-black uppercase">回覆</button>
                </div>
              </div>
            </div>
          )) : <div className="text-center py-20 animate-pulse font-black italic tracking-widest text-zinc-800">載入中...</div>}
        </div>
      </main>
    </div>
  );
}