#!/usr/bin/env node
// fall-bg-cli.mjs
// 使い方例：
//   node fall-bg-cli.mjs --mode=low --format=json
//   node fall-bg-cli.mjs --mode=deep --count=20 --format=text
//   node fall-bg-cli.mjs --mode=low --format=text
//
// オプション： --mode=low|deep  --count=<数>  --format=json|text

const args = Object.fromEntries(process.argv.slice(2).map(s=>{
  const [k,v] = s.replace(/^--/,'').split('=');
  return [k, v ?? true];
}));

const rand = (arr)=>arr[Math.floor(Math.random()*arr.length)];
const shuffle = (a)=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);

// 低層：ニュース帯に使う「それっぽいが意味なし」の断片
const NEWS_TICKER = [
  "速報：XJ99%増加", "株価###急落", "TRND/NEW::不可解", "NEWS ERR-404",
  "警戒: ΔΔΔΔΔ", "更新//STREAM", "流行中::???", "¥¥¥情報漏洩¥¥¥",
  "BREAK!!＞＞0xFF", "指標: N/A%*rev", "AI推定>>>未確定", "臨時: proto-v1.9",
  "市場: ███ 調整", "規制案: draft-α", "データ: 2025-??-??", "緊急: ???/!!!",
  "LIVE: feed失", "解析: ghost値", "トレンド: #NULL", "速報：XXX-2049",
  "注目: alt▲▼", "速報: ping…lost", "更新: meta//partial", "偏差: σ=?",
  "指数: –––", "推移: ////", "改訂: rev-b", "予報: ???→???", "注意: noise高",
  "採点: NaN/100", "breaking: mock", "confirm: pending", "影響度: * * *",
  "scan: 0xDE?D", "phase: β-unstable", "memo: redacted", "注記: 404語",
  "速報: ghost-press", "新指針: TBD", "規格: draft-Ω", "集計: 欠損",
  "trend: fog", "feed: 再接続", "解析: 断片一致", "検証: 再試行",
  "速報: mirror反転", "試算: 近似のみ", "geo: 欠測域", "note: blind spot",
  "auth: 期限不明", "sync: あとで"
];

// 低層：空間に漂うポップアップ短語
const POPUP_WORDS = [
  "速報", "緊急", "拡散>>>", "データ更新", "注目", "警戒", "LIVE",
  "解析中", "未確認", "推定", "流行中!?", "影響度* * *", "仮説", "誤報?",
  "訂正", "続報", "meta", "draft", "β版", "partial", "ghost", "noise",
  "blind", "欠損", "再接続", "mirror", "rev", "NULL", "TBD", "fog"
];

// 深層：抽象テキスト（50個）
const ABSTRACT_DEEP = [
  "光は影を生む","境界は揺らぐ","声は誰のものか","足場は記憶でできている","他人はもうひとりの自分",
  "影と影が重なる","涙は還ってくる","笑顔は巡りあう","落ちるのは一つの心","世界は呼吸で続いている",
  "静けさの奥に響きがある","境界線は幻","他人の痛みは借り物か","鏡は自分を映さない","道は下ではなく内にある",
  "離れても繋がっている","ひとつは無限で、無限はひとつ","言葉は沈む","思考は漂う","自分は消えずに溶ける",
  "存在は波","答えは形を持たない","繰り返しは始まり","他人の声で眠る","境界を超えたら何もない",
  "静寂は叫んでいる","輪郭はほどける","落ちても昇っている","心は他人の器","影は背中に寄り添う",
  "内と外は同じ場所","終わりは入口","他人は自分を試す","記憶は足場ではない","孤独はみんなのかたち",
  "世界は一人称でできている","答えを選ばなくてもよい","正しさは沈む","間違いは光る","どれも同じ声",
  "他人は未来の自分","静けさは遠ざかり近づく","質問は答えより深い","境界は遊びでしかない","涙は他人を潤す",
  "すべては夢の断片","わたしはあなたである","あなたはわたしである","世界は錯覚の中にある","それでも世界は呼吸している"
];

const mode = (args.mode ?? 'low').toLowerCase();
const count = Number(args.count ?? (mode==='low' ? 20 : 50));
const format = (args.format ?? 'json').toLowerCase();

function genLow(){
  // ニュース帯は適度にランダム装飾
  const deco = (s)=> {
    const tags = ["[速報]","<急報>","【更新】","(警戒)","{LIVE}","<ERR>","〈解析〉","※注意"];
    const add = Math.random()<0.4 ? ` ${rand(tags)}` : "";
    const tail = Math.random()<0.35 ? ` ${["///","…"," >>"," ###"," %%"][Math.floor(Math.random()*5)]}` : "";
    return s + add + tail;
  };
  const ticker = shuffle(NEWS_TICKER).slice(0, Math.min(count, NEWS_TICKER.length)).map(deco);
  const popups = shuffle(POPUP_WORDS).slice(0, Math.min(16, POPUP_WORDS.length));
  return { ticker, popups };
}

function genDeep(){
  return shuffle(ABSTRACT_DEEP).slice(0, Math.min(count, ABSTRACT_DEEP.length));
}

let out;
if(mode==='low'){
  out = genLow();
} else if(mode==='deep'){
  out = genDeep();
} else {
  console.error("modeは low か deep を指定してください");
  process.exit(1);
}

if(format==='json'){
  console.log(JSON.stringify(out, null, 2));
} else {
  if(mode==='low'){
    console.log("#ticker");
    console.log(out.ticker.join(" | "));
    console.log("\n#popups");
    console.log(out.popups.join(", "));
  } else {
    console.log(out.join(" / "));
  }
}

