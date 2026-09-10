import { useCallback, useRef, useState } from 'react';
import { Award, Check, Droplets, Puzzle, Luggage, Eye, RotateCcw } from 'lucide-react';
import { useLanguageStore } from '../translations';
import WaterDropGame from './WaterDropGame';
import './WaterDropGame.css';

const words = {
  zh: {
    title: '莞众护理互动乐园', intro: '四个小挑战，发现护理中的小细节。', tabs: ['接水滴挑战', '贴合小挑战', '安心出行准备', '护理观察员'], badges: ['吸收导流', '灵活贴合', '出行有备', '细心观察'], collection: '我的护理徽章', all: '四枚徽章已集齐，谢谢你的细心照护！', water: '接住两滴水，点亮吸收导流徽章。', check: '检查一下', retry: '再玩一次', won: '挑战完成 · 徽章已点亮', view: '认识莞众产品',
    fit: '帮角色调整腰贴', fitIntro: '拖动左右腰贴到虚线框内，让两侧对齐。也可点击轨道，或用方向键调整。', left: '左侧腰贴', right: '右侧腰贴', fitTry: '还差一点，把两侧腰贴都移到虚线框内试试。', fitWin: '弹力腰围搭配魔术扣，便于调整贴合位置。', fitNote: '位置仅作游戏示意，实际穿戴请按包装说明选择尺码与调整。',
    trip: '为长途出行准备护理包', tripIntro: '这次已有衣物和饮水。请再选三件用品，分别用于替换、清洁和收纳用后用品。', items: ['合适尺码的备用尿片', '清洁湿巾', '用后用品收纳袋', '香水', '旅行相机', '颈枕'], packed: '已放入', tripTry: '看看是否准备齐了：备用尿片、清洁用品、用后用品收纳袋。点击已选物品可以取出。', tripWin: '准备好替换用品，让外出护理更从容。莞众成人尿片可作为出行护理用品之一。',
    observe: '发现尿湿提示的变化', observeIntro: '点击“观察变化”查看三次示意状态，在提示明显变化时选择检查。', advance: '观察变化', inspect: '检查并准备更换', stages: ['初始状态', '提示开始变化', '提示明显变化'], observeTry: '目前还没有明显变化，继续观察下一张示意。', observeWin: '你注意到了变化！清楚的尿湿指示，方便护理时观察与检查。', observeNote: '颜色与变化过程仅为游戏示意，请以实际产品说明为准；有不适或排便时应及时检查，不必等待指示变化。',
  },
  hk: {
    title: '莞眾護理互動樂園', intro: '四個小挑戰，發現護理中的小細節。', tabs: ['接水滴挑戰', '貼合小挑戰', '安心出行準備', '護理觀察員'], badges: ['吸收導流', '靈活貼合', '出行有備', '細心觀察'], collection: '我的護理徽章', all: '四枚徽章已集齊，謝謝你的細心照護！', water: '接住兩滴水，點亮吸收導流徽章。', check: '檢查一下', retry: '再玩一次', won: '挑戰完成 · 徽章已點亮', view: '認識莞眾產品',
    fit: '幫角色調整腰貼', fitIntro: '拖動左右腰貼到虛線框內，讓兩側對齊。也可點擊軌道，或用方向鍵調整。', left: '左側腰貼', right: '右側腰貼', fitTry: '還差一點，把兩側腰貼都移到虛線框內試試。', fitWin: '彈力腰圍搭配魔術扣，便於調整貼合位置。', fitNote: '位置僅作遊戲示意，實際穿戴請按包裝說明選擇尺碼與調整。',
    trip: '為長途出行準備護理包', tripIntro: '這次已有衣物和飲水。請再選三件用品，分別用於替換、清潔和收納用後用品。', items: ['合適尺碼的備用尿片', '清潔濕巾', '用後用品收納袋', '香水', '旅行相機', '頸枕'], packed: '已放入', tripTry: '看看是否準備齊了：備用尿片、清潔用品、用後用品收納袋。點擊已選物品可以取出。', tripWin: '準備好替換用品，讓外出護理更從容。莞眾成人尿片可作為出行護理用品之一。',
    observe: '發現尿濕提示的變化', observeIntro: '點擊「觀察變化」查看三次示意狀態，在提示明顯變化時選擇檢查。', advance: '觀察變化', inspect: '檢查並準備更換', stages: ['初始狀態', '提示開始變化', '提示明顯變化'], observeTry: '目前還沒有明顯變化，繼續觀察下一張示意。', observeWin: '你注意到了變化！清楚的尿濕指示，方便護理時觀察與檢查。', observeNote: '顏色與變化過程僅為遊戲示意，請以實際產品說明為準；有不適或排便時應及時檢查，不必等待指示變化。',
  },
  en: {
    title: 'Guanzhong Care Playground', intro: 'Four little challenges. Discover the details of care.', tabs: ['Catch a drop', 'Find the fit', 'Pack for a trip', 'Care observer'], badges: ['Absorption', 'Adjustable fit', 'Travel ready', 'Careful observer'], collection: 'My care badges', all: 'All four badges collected. Thank you for caring!', water: 'Catch two drops to earn the absorption badge.', check: 'Check my work', retry: 'Play again', won: 'Challenge complete · Badge earned', view: 'Explore Guanzhong products',
    fit: 'Adjust the waist tabs', fitIntro: 'Drag both tabs into the dashed targets. You can also click the tracks or use arrow keys.', left: 'Left waist tab', right: 'Right waist tab', fitTry: 'Almost there. Move both tabs into their dashed targets.', fitWin: 'An elastic waist and hook-and-loop tabs make the fit adjustable.', fitNote: 'Game positions are illustrative. Follow the packaging for sizing and fitting.',
    trip: 'Pack a care bag for a long trip', tripIntro: 'Clothes and water are ready. Choose three items for changing, cleaning and containing used supplies.', items: ['Spare diapers in the right size', 'Cleansing wipes', 'Bag for used supplies', 'Perfume', 'Travel camera', 'Neck pillow'], packed: 'Packed', tripTry: 'Check for spare diapers, cleansing supplies and a bag for used items. Select an item again to remove it.', tripWin: 'Having supplies ready makes care away from home easier. Guanzhong adult diapers can be part of your travel care kit.',
    observe: 'Spot a wetness indicator change', observeIntro: 'Select “Observe a change” to view three sample states. Choose to check when the change is clear.', advance: 'Observe a change', inspect: 'Check and prepare to change', stages: ['Initial state', 'Change beginning', 'Clear change'], observeTry: 'No clear change yet. Observe the next sample.', observeWin: 'You noticed the change! A clear wetness indicator helps with care checks.', observeNote: 'Colors and changes are illustrative; follow the actual product instructions. Check promptly for discomfort or bowel movements without waiting for a color change.',
  },
  ja: {
    title: '莞衆 ケアのプレイランド', intro: '四つのゲームで、ケアの工夫を発見。', tabs: ['水滴キャッチ', 'フィット調整', 'お出かけ準備', 'ケア観察'], badges: ['吸収・拡散', 'フィット', '準備万全', '細かな観察'], collection: 'ケアバッジ', all: '四つのバッジを獲得しました！', water: '水滴を二つ受け止めてバッジを獲得。', check: '確認する', retry: 'もう一度', won: 'クリア・バッジ獲得', view: '莞衆の製品を見る',
    fit: 'ウエストテープを調整', fitIntro: '左右のテープを点線の枠へドラッグ。レールのクリックや矢印キーでも調整できます。', left: '左のテープ', right: '右のテープ', fitTry: '両側のテープを点線の枠に合わせてみましょう。', fitWin: '伸縮ウエストと面ファスナーで、フィット感を調整できます。', fitNote: '位置はゲーム用の例です。実際のサイズと装着は製品の説明に従ってください。',
    trip: '長旅のケアバッグを準備', tripIntro: '服と水は準備済み。交換用、清潔用、使用済み用品の収納用に三つ選びましょう。', items: ['適切なサイズの予備おむつ', '清拭用ウェットティッシュ', '使用済み用品の袋', '香水', '旅行カメラ', 'ネックピロー'], packed: '準備済み', tripTry: '予備おむつ、清潔用品、使用済み用品の袋を確認しましょう。再度押すと取り出せます。', tripWin: '交換用品を準備して、外出時のケアをよりスムーズに。莞衆のおむつもケアバッグに。',
    observe: '尿濡れサインの変化を発見', observeIntro: '「変化を観察」で三つの例を見て、明確に変化したら確認を選びましょう。', advance: '変化を観察', inspect: '確認して交換の準備', stages: ['初期の状態', '変化の始まり', '明確な変化'], observeTry: 'まだ明確な変化はありません。次の例を観察しましょう。', observeWin: '変化に気付きました！分かりやすい尿濡れ表示が確認を助けます。', observeNote: '色と変化はゲーム用の例です。製品の説明に従ってください。不快感や排便時は色の変化を待たず確認してください。',
  },
};
type Copy = typeof words.zh;
const icons = [Droplets, Puzzle, Luggage, Eye];

function MiniChallenge({ kind, t, onComplete }: { kind: number; t: Copy; onComplete: () => void }) {
  const [tabs, setTabs] = useState([12, 88]);
  const [packed, setPacked] = useState<number[]>([]);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<'idle' | 'retry' | 'won'>('idle');
  const feedback = useRef<HTMLDivElement>(null);
  const done = result === 'won';
  const title = kind === 1 ? t.fit : kind === 2 ? t.trip : t.observe;
  const intro = kind === 1 ? t.fitIntro : kind === 2 ? t.tripIntro : t.observeIntro;
  const check = () => {
    const success = kind === 1 ? tabs.every(v => v >= 43 && v <= 57) : kind === 2 ? packed.length === 3 && [0, 1, 2].every(i => packed.includes(i)) : stage === 2;
    setResult(success ? 'won' : 'retry');
    if (success) onComplete();
    requestAnimationFrame(() => feedback.current?.focus({ preventScroll: true }));
  };
  return <div className="care-challenge game-shell"><h3>{title}</h3><p className="care-intro">{intro}</p>
    {kind === 1 && <div className="fit-model">
      <svg className="fit-diagram" viewBox="0 0 380 160" aria-hidden="true"><path d="M40 15Q190 0 340 15L305 75Q273 78 255 140Q190 162 125 140Q107 78 75 75Z" fill="white" stroke="#94b9a6" strokeWidth="3"/><path d="M125 30Q190 17 255 30L240 121Q190 142 140 121Z" fill="#dceee5"/><path d={`M${40+tabs[0]} 30h65 M${340-tabs[1]} 30h-65`} stroke="#426c5a" strokeWidth="18" strokeLinecap="round"/><text x="190" y="83" textAnchor="middle" fill="#426c5a" fontSize="16">GREENZO</text></svg>
      <div className="fit-controls">{[t.left,t.right].map((label,i) => <label key={label}>{label}<div className="fit-track"><span className="fit-target" aria-hidden="true"/><input type="range" min="0" max="100" value={tabs[i]} aria-label={label} disabled={done} onChange={e => { setTabs(prev => prev.map((v,n) => n === i ? Number(e.target.value) : v)); setResult('idle'); }}/></div></label>)}</div>
    </div>}
    {kind === 2 && <><div className="packing-count"><Luggage aria-hidden="true"/>{t.packed} {packed.length} / 3</div><div className="packing-grid">{t.items.map((item,i) => <button key={item} aria-pressed={packed.includes(i)} disabled={done} onClick={() => { setPacked(p => p.includes(i) ? p.filter(n => n !== i) : p.length < 3 ? [...p,i] : p); setResult('idle'); }}><span aria-hidden="true">{['🩲','🧻','🛍️','🧴','📷','🛏️'][i]}</span>{item}{packed.includes(i) && <Check size={20} aria-hidden="true"/>}</button>)}</div></>}
    {kind === 3 && <div className="observer-demo"><div className="indicator-pad" aria-hidden="true"><span style={{ background: ['#e7cd78', 'linear-gradient(#7cb8cf 45%,#e7cd78 45%)', '#619fbb'][stage] }}/></div><ol className="indicator-stages">{t.stages.map((s,i) => <li key={s} aria-current={i === stage ? 'step' : undefined}><span>{i+1}</span>{s}</li>)}</ol><button className="care-secondary" disabled={done || stage === 2} onClick={() => { setStage(s => Math.min(2,s+1)); setResult('idle'); }}>{t.advance}</button></div>}
    <div className="care-actions">{!done && <button className="game-primary" onClick={check}>{kind === 3 ? t.inspect : t.check}</button>}{done && <button className="care-secondary" onClick={() => { setTabs([12,88]); setPacked([]); setStage(0); setResult('idle'); }}><RotateCcw size={16}/>{t.retry}</button>}</div>
    <div ref={feedback} tabIndex={-1} className={`care-feedback ${result}`} role="status">{result === 'won' ? <><strong><Award size={20}/>{t.won}</strong><p>{kind === 1 ? t.fitWin : kind === 2 ? t.tripWin : t.observeWin}</p></> : result === 'retry' ? <p>{kind === 1 ? t.fitTry : kind === 2 ? t.tripTry : t.observeTry}</p> : null}</div>
    {(kind === 1 || kind === 3) && <p className="game-note">{kind === 1 ? t.fitNote : t.observeNote}</p>}
  </div>;
}

export default function CarePlayground() {
  const { language } = useLanguageStore();
  const t = words[language];
  const [active, setActive] = useState(0);
  const [earned, setEarned] = useState<number[]>([]);
  const complete = useCallback(() => setEarned(prev => prev.includes(active) ? prev : [...prev,active]), [active]);
  return <section id="water-game" className="water-game hk-jp-band"><div className="max-w-6xl mx-auto px-5 sm:px-8">
    <div className="game-heading"><div><p className="game-eyebrow">GREENZO PLAY</p><h2>{t.title}</h2><p>{t.intro}</p></div><Award size={40} aria-hidden="true"/></div>
    <div className="care-tabs" role="tablist" aria-label={t.title}>{t.tabs.map((label,i) => { const Icon = icons[i]; return <button key={label} type="button" role="tab" id={`care-tab-${i}`} aria-controls={`care-panel-${i}`} aria-selected={active === i} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => { const next = e.key === 'ArrowRight' ? (i+1)%4 : e.key === 'ArrowLeft' ? (i+3)%4 : e.key === 'Home' ? 0 : e.key === 'End' ? 3 : -1; if (next >= 0) { e.preventDefault(); setActive(next); document.getElementById(`care-tab-${next}`)?.focus(); } }}><Icon size={22}/>{label}{earned.includes(i) && <Check size={16} aria-label={t.won}/>}</button>; })}</div>
    <div role="tabpanel" id={`care-panel-${active}`} aria-labelledby={`care-tab-${active}`} key={active}>{active === 0 ? <><p className="care-water-goal">{t.water}</p><WaterDropGame onComplete={complete}/></> : <MiniChallenge kind={active} t={t} onComplete={complete}/>}</div>
    <div className="care-badges"><p>{t.collection} <strong>{earned.length} / 4</strong></p><div>{t.badges.map((b,i) => <span key={b} className={earned.includes(i) ? 'earned' : ''}><Award size={20} aria-hidden="true"/>{b}{earned.includes(i) && <Check size={16} aria-label={t.won}/>}</span>)}</div>{earned.length === 4 && <p role="status">{t.all}</p>}<a href="#products">{t.view} →</a></div>
  </div></section>;
}
