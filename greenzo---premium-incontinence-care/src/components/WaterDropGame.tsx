import { useEffect, useRef, useState } from 'react';
import { Droplets, Play, Pause } from 'lucide-react';
import { useLanguageStore } from '../translations';
import product from '../photo/Adult/diaper/5/meta.json';
import './WaterDropGame.css';

const labels = {
  zh: ['接住每一滴，认识多一点', '移动尿片接住水滴，解锁莞众的护理优点。', '开始游戏', '继续接水滴', '暂停', '继续游戏', '再玩一次', '本轮完成', '已接住', '秒', '鼠标移动 · 手指拖动 · 方向键操作', '接住了！认识一个护理优点', '已解锁', '以莞众 Q唛金装成人纸尿片为例。游戏为趣味互动，不代表实际吸收量。', '查看产品'],
  hk: ['接住每一滴，認識多一點', '移動尿片接住水滴，解鎖莞眾的護理優點。', '開始遊戲', '繼續接水滴', '暫停', '繼續遊戲', '再玩一次', '本輪完成', '已接住', '秒', '滑鼠移動 · 手指拖動 · 方向鍵操作', '接住了！認識一個護理優點', '已解鎖', '以莞眾 Q嘜金裝成人紙尿片為例。遊戲為趣味互動，不代表實際吸收量。', '查看產品'],
  en: ['Catch a drop. Discover more.', 'Move the diaper to catch drops and discover Guanzhong care features.', 'Start game', 'Catch the next drop', 'Pause', 'Resume', 'Play again', 'Round complete', 'Caught', 'sec', 'Move your mouse · Drag your finger · Use arrow keys', 'Caught! Discover a care feature', 'Discovered', 'Features refer to the Guanzhong Q-Mark Gold Adult Diaper. This game does not represent actual absorption capacity.', 'View products'],
  ja: ['一滴キャッチ、ケアをもっと知る', 'おむつで水滴を受け止め、莞衆の特長を見つけましょう。', 'ゲーム開始', '次の水滴へ', '一時停止', '再開', 'もう一度', 'ラウンド終了', 'キャッチ', '秒', 'マウス移動・指でドラッグ・矢印キー', 'キャッチ！ケアの特長をご紹介', '発見', '莞衆 Qマーク ゴールド成人用紙おむつの特長を紹介するゲームです。実際の吸収量を示すものではありません。', '製品を見る'],
};
type Mode = 'ready' | 'playing' | 'feature' | 'paused' | 'done';
type Point = { x: number; y: number };

function Diaper() {
  return <svg viewBox="0 0 120 90" aria-hidden="true"><path d="M10 12 Q60 1 110 12 L102 42 Q87 43 83 72 Q60 89 37 72 Q33 43 18 42Z" fill="white" stroke="#6e9a8b" strokeWidth="2.5"/><path d="M28 17 Q60 10 92 17 L83 61 Q60 78 37 61Z" fill="#e4f3ed" stroke="#b0d1c3"/><path d="M41 24 Q32 45 47 65 M79 24 Q88 45 73 65" fill="none" stroke="#9ec6b5" strokeWidth="2" strokeDasharray="3 3"/><path d="M8 14 L28 17 L25 29 L10 26 M112 14 L92 17 L95 29 L110 26" fill="#91b9a8"/><text x="60" y="43" textAnchor="middle" fontSize="10" fill="#426c5a">莞众</text></svg>;
}

export default function WaterDropGame({ onComplete }: { onComplete: () => void }) {
  const { language } = useLanguageStore();
  const t = labels[language];
  const features = product.specs[language].slice(2, 8);
  const [mode, setMode] = useState<Mode>('ready');
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState(45);
  const [position, setPosition] = useState<Point>({ x: .5, y: .82 });
  const [drop, setDrop] = useState<Point>({ x: .5, y: -.08 });
  const board = useRef<HTMLDivElement>(null);
  const action = useRef<HTMLButtonElement>(null);
  const player = useRef(position);
  const falling = useRef(drop);
  const time = useRef(45);
  const keys = useRef(new Set<string>());
  useEffect(() => { if (score >= 2) onComplete(); }, [score, onComplete]);
  function move(x: number, y: number) {
    const r = board.current?.getBoundingClientRect();
    const mx = r ? 54 / r.width : .15, my = r ? 40 / r.height : .1;
    player.current = { x: Math.max(mx, Math.min(1-mx, x)), y: Math.max(my, Math.min(1-my, y)) };
    setPosition(player.current);
  }
  function resetDrop() {
    falling.current = { x: .16 + Math.random() * .68, y: -.08 };
    setDrop(falling.current);
  }
  function play(fresh = false) {
    if (fresh) { time.current = 45; setRemaining(45); setScore(0); move(.5, .82); }
    resetDrop(); setMode('playing');
  }
  useEffect(() => {
    keys.current.clear();
    if (mode === 'playing') board.current?.focus({ preventScroll: true });
    else if (mode !== 'ready') action.current?.focus({ preventScroll: true });
  }, [mode]);
  useEffect(() => {
    if (mode !== 'playing') return;
    let frame = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now-last)/1000, .05); last = now;
      time.current = Math.max(0, time.current-dt); setRemaining(Math.ceil(time.current));
      if (!time.current) { setMode('done'); return; }
      const k = keys.current;
      if (k.size) move(player.current.x + (+k.has('ArrowRight') - +k.has('ArrowLeft')) * dt * .65, player.current.y + (+k.has('ArrowDown') - +k.has('ArrowUp')) * dt * .65);
      const prevY = falling.current.y;
      falling.current = { ...falling.current, y: prevY + dt * .25 };
      const r = board.current?.getBoundingClientRect();
      if (r && Math.abs(falling.current.x-player.current.x) < 49/r.width && prevY <= player.current.y+30/r.height && falling.current.y >= player.current.y-30/r.height) {
        setScore(s => s+1); setMode('feature'); return;
      }
      if (falling.current.y > 1.08) resetDrop(); else setDrop(falling.current);
      frame = requestAnimationFrame(tick);
    };
    const pause = () => { keys.current.clear(); setMode('paused'); };
    const visibility = () => { if (document.hidden) pause(); };
    window.addEventListener('blur', pause); document.addEventListener('visibilitychange', visibility);
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('blur', pause); document.removeEventListener('visibilitychange', visibility); };
  }, [mode]);
  return <div>
    <div className="game-heading"><div><p className="game-eyebrow">GREENZO PLAY</p><h2>{t[0]}</h2><p>{t[1]}</p></div><Droplets size={38} aria-hidden="true" /></div>
    <div className="game-shell">
      <div className="game-toolbar"><span>{t[8]} <strong>{score}</strong></span><span><strong>{remaining}</strong> {t[9]}</span><button disabled={mode !== 'playing'} onClick={() => setMode('paused')}><Pause size={16}/>{t[4]}</button></div>
      <div ref={board} className={`game-board ${mode === 'playing' ? 'is-playing' : ''}`} tabIndex={0} role="group" aria-label={`${t[1]} ${t[10]}`} onBlur={() => keys.current.clear()}
        onPointerDown={e => { if (mode !== 'playing') return; e.currentTarget.setPointerCapture(e.pointerId); const r = e.currentTarget.getBoundingClientRect(); move((e.clientX-r.left)/r.width, (e.clientY-r.top)/r.height); }}
        onPointerMove={e => { if (mode !== 'playing') return; const r = e.currentTarget.getBoundingClientRect(); move((e.clientX-r.left)/r.width, (e.clientY-r.top)/r.height); }}
        onKeyDown={e => { if (mode !== 'playing') return; if (e.key.startsWith('Arrow')) { e.preventDefault(); keys.current.add(e.key); } if (e.key === 'Escape') setMode('paused'); }} onKeyUp={e => keys.current.delete(e.key)}>
        <div className="game-waterline" aria-hidden="true"/>
        {mode === 'playing' && <div className="game-drop" style={{ left: `${drop.x*100}%`, top: `${drop.y*100}%` }} aria-hidden="true"><svg viewBox="0 0 30 40"><path d="M15 1C12 8 2 19 2 26a13 13 0 0026 0C28 19 18 8 15 1Z" fill="#61b6db"/><path d="M8 25q0 7 6 8" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg></div>}
        <div className="game-diaper" style={{ left: `${position.x*100}%`, top: `${position.y*100}%` }}><Diaper/></div>
        {mode !== 'playing' && <div className="game-overlay"><div className="game-card" aria-live="polite"><Droplets className="game-card-icon" size={32} aria-hidden="true"/>
          <p>{mode === 'feature' ? t[11] : mode === 'done' ? t[7] : mode === 'paused' ? t[4] : t[1]}</p>
          {mode === 'feature' && <><h3>{features[(score-1)%features.length]}</h3><p className="game-product-name">{product.name[language]}</p></>}
          {mode === 'done' && <><h3>{score} <Droplets size={26}/></h3><p>{t[12]} {Math.min(score,features.length)} / {features.length}</p></>}
          <button ref={action} className="game-primary" onClick={() => mode === 'paused' ? setMode('playing') : play(mode === 'ready' || mode === 'done')}><Play size={18}/>{mode === 'ready' ? t[2] : mode === 'feature' ? t[3] : mode === 'paused' ? t[5] : t[6]}</button>
          {mode === 'done' && <a className="game-product-link" href="#products">{t[14]}</a>}
        </div></div>}
      </div><p className="game-hint">{t[10]}</p>
    </div>
    {score > 0 && <div className="game-discovered"><span>{t[12]}</span>{features.slice(0,Math.min(score,features.length)).map(f => <span className="game-feature-chip" key={f}>{f}</span>)}</div>}
    <p className="game-note">{t[13]}</p>
  </div>;
}
