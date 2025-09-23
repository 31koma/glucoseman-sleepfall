// dev-tools.js - 開発モード用の軽量ツール（?dev=1/2）
(function () {
  try {
    if (window.__DEV_TOOLS_ACTIVE) return; // 二重読込ガード
    window.__DEV_TOOLS_ACTIVE = true;
  } catch(_) {}
  const sp = new URLSearchParams(location.search);
  const devParam = (sp.get('dev') || '').trim();
  const DEV_ON = devParam === '1' || devParam === '2';
  if (!DEV_ON) return; // 通常起動では一切動作しない

  // window.DEV フラグを補強（index側で定義済みでも上書きしない）
  try { if (!window.DEV) window.DEV = { enabled: true, dev: true, phase: null }; } catch(_) {}

  // DOM ready 後に初期化
  const ready = (fn) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  };

  ready(() => {
    try { window.__DEV_TOOLS_LOADED = true; } catch(_) {}
    const bgm = document.getElementById('bgm');
    // パネル作成（左下）。スマホ/幅<600 では自動で隠す
    const panel = document.createElement('div');
    panel.id = 'dev-panel';
    panel.style.cssText = [
      'position:fixed','left:12px','bottom:12px','z-index:99999',
      'background:rgba(20,24,40,0.92)','color:#e7f0ff','border:1px solid rgba(255,255,255,0.12)',
      'border-radius:10px','padding:8px 10px','font:12px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Noto Sans JP, sans-serif',
      'box-shadow:0 6px 18px rgba(0,0,0,0.35)','pointer-events:auto'
    ].join(';');
    panel.innerHTML = '<div style="font-weight:700">DEV</div><div id="dev-info" style="opacity:.9">—</div><div style="opacity:.7;margin-top:4px">G/H/J/K: Phase, ,/.//: Seek, P: Toggle</div>';
    // パネル内はコピー可能に（グローバルの user-select: none を上書き）
    const selStyle = document.createElement('style');
    selStyle.textContent = '#dev-panel, #dev-panel * { user-select: text !important; -webkit-user-select: text !important; -webkit-touch-callout: default !important; }';
    document.head.appendChild(selStyle);

    const shouldHidePanel = () => {
      const isMobileUA = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      return isMobileUA || window.innerWidth < 600;
    };
    let panelMounted = false;
    const ensurePanel = () => {
      const hide = shouldHidePanel();
      if (!hide && !panelMounted) { document.body.appendChild(panel); panelMounted = true; }
      if (hide && panelMounted) { panel.remove(); panelMounted = false; }
    };
    ensurePanel();
    window.addEventListener('resize', ensurePanel);

    // ホットキー（devモード時のみ有効化）
    const onKey = (e) => {
      // 入力系は除外
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const k = (e.key || '').toLowerCase();
      let handled = false;
      const seek = (sec) => {
        if (!bgm) return;
        try { bgm.currentTime = Math.max(0, Math.min((bgm.currentTime || 0) + sec, (bgm.duration || 99999))); } catch(_){}
      };
      // フェーズジャンプ（G/H/J/K）: 念のためこちらでも処理
      if (k === 'g') { if (window.jumpToPhase) { console.log('[DEV-TOOLS] hotkey:G -> phase2'); window.jumpToPhase(2);} handled = true; }
      else if (k === 'h') { if (window.jumpToPhase) { console.log('[DEV-TOOLS] hotkey:H -> phase3'); window.jumpToPhase(3);} handled = true; }
      else if (k === 'j') { if (window.jumpToPhase) { console.log('[DEV-TOOLS] hotkey:J -> phase4'); window.jumpToPhase(4);} handled = true; }
      else if (k === 'k') { if (window.jumpToPhase) { console.log('[DEV-TOOLS] hotkey:K -> phase1'); window.jumpToPhase(1);} handled = true; }
      if (k === ',') { seek(-10); handled = true; }
      else if (k === '.') { seek(+10); handled = true; }
      else if (k === '/') { seek(+60); handled = true; }
      else if (k === 'p') { // パネルの表示/非表示トグル
        if (panelMounted) { panel.remove(); panelMounted = false; } else { ensurePanel(); }
        handled = true;
      }
      if (handled) {
        try { e.preventDefault(); } catch(_){}
        // 伝播は許可して、ゲーム側の audio.resume() なども動かす
      }
    };
    window.addEventListener('keydown', onKey);

    // パネルの小さな情報更新（時間/フェーズ）
    const info = panel.querySelector('#dev-info');
    const format = (t) => {
      const s = Math.floor(t % 60).toString().padStart(2,'0');
      return `${Math.floor(t/60)}:${s}`;
    };
    const tick = () => {
      if (info && bgm) {
        const t = bgm.currentTime || 0;
        const phase = (window.resolvePhase ? window.resolvePhase(t) : 'phase1');
        info.textContent = `time ${format(t)} | ${phase}`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // 初期化ログ
    console.log('[DEV-TOOLS] dev=true, panel mounted, hotkeys bound');
  });
})();
