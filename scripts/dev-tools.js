// dev-tools.js - 開発者用BGM動作確認ツール

(() => {
  // ?dev=1 パラメータをチェック
  const urlParams = new URLSearchParams(window.location.search);
  const isDevMode = urlParams.has('dev') || urlParams.get('dev') === '1';
  
  console.log('[DEV-TOOLS] Checking dev mode:', isDevMode);
  console.log('[DEV-TOOLS] URL params:', window.location.search);
  
  if (!isDevMode) {
    console.log('[DEV-TOOLS] Dev mode not enabled. Add ?dev=1 to URL');
    return;
  }

  console.log('[DEV-TOOLS] Developer tools enabled');
  
  // 確実にユーザーに通知
  setTimeout(() => {
    alert('🔧 DEV MODE ACTIVE\n\nBGM Developer Tools are loading...\nCheck console for details.');
  }, 1000);

  // DOMが完全に読み込まれるまで待つ
  function initDevTools() {
    const bgm = document.getElementById('bgm');
    if (!bgm) {
      console.warn('[DEV-TOOLS] BGM element not found, retrying...');
      setTimeout(initDevTools, 100);
      return;
    }

    console.log('[DEV-TOOLS] BGM element found:', bgm);

    // CSSの強制上書き用スタイルシートを追加
    const devToolsStyle = document.createElement('style');
    devToolsStyle.textContent = `
      #dev-tools-panel {
        position: fixed !important;
        bottom: 20px !important;
        left: 20px !important;
        top: auto !important;
        right: auto !important;
        transform: none !important;
        z-index: 999999 !important;
        background: rgba(0,0,0,0.95) !important;
        color: #00ff00 !important;
        font: 18px/1.4 monospace !important;
        padding: 30px 40px !important;
        border-radius: 15px !important;
        border: 2px solid #00ff00 !important;
        min-width: 500px !important;
        max-width: 600px !important;
        user-select: none !important;
        box-shadow: 0 0 30px rgba(0,255,0,0.3), 0 8px 32px rgba(0,0,0,0.8) !important;
        text-align: center !important;
        backdrop-filter: blur(5px) !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(devToolsStyle);

    // 開発者パネルの作成（画面左下に表示）
    const devPanel = document.createElement('div');
    devPanel.id = 'dev-tools-panel';
    devPanel.innerHTML = `
      <div style="font-weight:bold; color:#00ff00; margin-bottom:20px; font-size:24px; text-shadow: 0 0 10px #00ff00;">
        🔧 BGM DEVELOPMENT CONSOLE
      </div>
      
      <div style="display: flex; justify-content: space-around; margin-bottom:20px; font-size:20px;">
        <div id="devTime" style="color:#66ff66;">Time: 0:00 / 0:00</div>
        <div id="devPhase" style="color:#ffff66;">Phase: I</div>
      </div>
      
      <div style="display: flex; justify-content: space-around; margin-bottom:25px; font-size:20px;">
        <div id="devSpeed" style="color:#ff6666;">Speed: 2.0x</div>
        <div id="devStatus" style="color:#66ffff;">Status: Ready</div>
      </div>
      
      <hr style="border:none; border-top:2px solid #333; margin:25px 0;">
      
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; font-size:14px; text-align:left;">
        <div>
          <div style="color:#ffff00; font-weight:bold; margin-bottom:8px;">🎵 TIME CONTROL</div>
          <div>← → : Skip ±10s</div>
          <div>1-4 : Jump to Phase</div>
          <div>Home : Go to Start</div>
        </div>
        <div>
          <div style="color:#ffff00; font-weight:bold; margin-bottom:8px;">🎛️ PLAYBACK</div>
          <div>[ ] : Speed ±</div>
          <div>P / Space : Play/Pause</div>
          <div>Range: 0.25x - 16x</div>
        </div>
        <div>
          <div style="color:#ffff00; font-weight:bold; margin-bottom:8px;">🎯 QUICK JUMP</div>
          <div>Q : 5:50 (Phase II)</div>
          <div>W : 10:43 (Phase III)</div>
          <div>E : 15:55 (Final)</div>
        </div>
      </div>
    `;
    document.body.appendChild(devPanel);
    
    // 継続的に位置を監視して強制修正
    const forcePosition = () => {
      if (devPanel && devPanel.parentNode) {
        const computedStyle = window.getComputedStyle(devPanel);
        const needsFix = computedStyle.transform !== 'none' || 
                        computedStyle.top !== 'auto' || 
                        computedStyle.left !== '20px' ||
                        computedStyle.bottom !== '20px';
        
        if (needsFix) {
          console.log('[DEV-TOOLS] Correcting position...');
          devPanel.style.setProperty('position', 'fixed', 'important');
          devPanel.style.setProperty('bottom', '20px', 'important');
          devPanel.style.setProperty('left', '20px', 'important');
          devPanel.style.setProperty('top', 'auto', 'important');
          devPanel.style.setProperty('right', 'auto', 'important');
          devPanel.style.setProperty('transform', 'none', 'important');
          
          // より強力な方法でstyle属性を直接書き換え
          devPanel.setAttribute('style', 
            'position: fixed !important; bottom: 20px !important; left: 20px !important; ' +
            'top: auto !important; right: auto !important; transform: none !important; ' +
            'z-index: 999999 !important; background: rgba(0,0,0,0.95) !important; ' +
            'color: #00ff00 !important; font: 18px/1.4 monospace !important; ' +
            'padding: 30px 40px !important; border-radius: 15px !important; ' +
            'border: 2px solid #00ff00 !important; min-width: 500px !important; ' +
            'max-width: 600px !important; user-select: none !important; ' +
            'box-shadow: 0 0 30px rgba(0,255,0,0.3), 0 8px 32px rgba(0,0,0,0.8) !important; ' +
            'text-align: center !important; backdrop-filter: blur(5px) !important; ' +
            'display: block !important; visibility: visible !important; opacity: 1 !important;'
          );
        }
      }
      requestAnimationFrame(forcePosition);
    };
    
    // 位置監視開始
    requestAnimationFrame(forcePosition);
    
    console.log('[DEV-TOOLS] Panel created and added to body');
    console.log('[DEV-TOOLS] Panel element:', devPanel);
    console.log('[DEV-TOOLS] Panel innerHTML length:', devPanel.innerHTML.length);
    console.log('[DEV-TOOLS] Panel parent:', devPanel.parentNode);
    
    // パネルが実際に見えるかテスト用の大きな境界線を追加
    devPanel.style.setProperty('border', '10px solid red', 'important');
    devPanel.style.setProperty('background', 'yellow', 'important');
    
    console.log('[DEV-TOOLS] Added test styling - should be very visible now');
    
    // 1秒後に再確認
    setTimeout(() => {
      const rect = devPanel.getBoundingClientRect();
      console.log('[DEV-TOOLS] Panel position after 1s:', {
        left: rect.left,
        bottom: window.innerHeight - rect.bottom,
        width: rect.width,
        height: rect.height,
        transform: devPanel.style.transform
      });
    }, 1000);

    // 要素取得（即座に取得）
    const devTime = document.getElementById('devTime');
    const devPhase = document.getElementById('devPhase');
    const devSpeed = document.getElementById('devSpeed');
    const devStatus = document.getElementById('devStatus');
    
    console.log('[DEV-TOOLS] Element check (immediate):', {
      devTime: !!devTime,
      devPhase: !!devPhase,
      devSpeed: !!devSpeed,
      devStatus: !!devStatus
    });
    
    if (!devTime || !devPhase || !devSpeed || !devStatus) {
      console.error('[DEV-TOOLS] Failed to get panel elements!');
      console.log('[DEV-TOOLS] Available elements:', {
        devTimeEl: document.querySelector('#devTime'),
        devPhaseEl: document.querySelector('#devPhase'),
        devSpeedEl: document.querySelector('#devSpeed'),
        devStatusEl: document.querySelector('#devStatus')
      });
    }

    // 再生速度管理
    let playbackRate = 2.0; // 開始時は2倍速
    const speedLevels = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0, 4.0, 6.0, 8.0, 12.0, 16.0];
    let speedIndex = speedLevels.indexOf(2.0);

    // 重要なタイムポイント
    const timePoints = {
      phase2: 350,   // 5:50
      phase3: 643,   // 10:43  
      final: 955     // 15:55
    };

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function setPlaybackRate(rate) {
      playbackRate = rate;
      bgm.playbackRate = rate;
      
      if (devSpeed) {
        devSpeed.textContent = `Speed: ${rate}x`;
        // 速度変更の視覚的フィードバック
        devSpeed.style.color = rate === 1 ? '#ff6666' : '#ffaa00';
      }
      
      console.log(`[DEV-TOOLS] Playback rate: ${rate}x`);
    }

    function jumpToTime(seconds) {
      bgm.currentTime = Math.max(0, Math.min(seconds, bgm.duration || seconds));
      console.log(`[DEV-TOOLS] Jumped to ${formatTime(seconds)} (${seconds}s)`);
    }

    function skipTime(deltaSeconds) {
      const oldTime = bgm.currentTime || 0;
      const newTime = oldTime + deltaSeconds;
      jumpToTime(newTime);
      console.log(`[DEV-TOOLS] Skipped ${deltaSeconds > 0 ? '+' : ''}${deltaSeconds}s: ${formatTime(oldTime)} → ${formatTime(newTime)}`);
      
      // 視覚的フィードバック
      if (devStatus) {
        const originalText = devStatus.textContent;
        devStatus.textContent = `Skipped ${deltaSeconds > 0 ? '+' : ''}${deltaSeconds}s`;
        devStatus.style.color = '#ffff00';
        setTimeout(() => {
          devStatus.textContent = originalText;
        }, 1000);
      }
    }

    function jumpToPhase(phaseNum) {
      if (!window.PHASES || !window.PHASES[phaseNum - 1]) {
        console.warn(`[DEV-TOOLS] Phase ${phaseNum} not found`);
        return;
      }
      
      const targetTime = window.PHASES[phaseNum - 1].start;
      jumpToTime(targetTime);
      console.log(`[DEV-TOOLS] Jumped to Phase ${phaseNum}`);
    }

    function togglePlayPause() {
      if (bgm.paused) {
        bgm.play().catch(() => {});
        console.log('[DEV-TOOLS] BGM resumed');
      } else {
        bgm.pause();
        console.log('[DEV-TOOLS] BGM paused');
      }
    }

    // キーボードイベント
    document.addEventListener('keydown', (e) => {
      // フォーカスが入力要素にある場合はスキップ
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        // Time Control
        case 'ArrowLeft':
          console.log('[DEV-TOOLS] Left arrow pressed - skipping backward');
          skipTime(-10);
          e.preventDefault();
          break;
        case 'ArrowRight':
          console.log('[DEV-TOOLS] Right arrow pressed - skipping forward');
          skipTime(10);
          e.preventDefault();
          break;
          
        // Phase Jump (1-4)
        case '1':
          jumpToPhase(1);
          e.preventDefault();
          break;
        case '2':
          jumpToPhase(2);
          e.preventDefault();
          break;
        case '3':
          jumpToPhase(3);
          e.preventDefault();
          break;
        case '4':
          jumpToPhase(4);
          e.preventDefault();
          break;
          
        // Speed Control
        case '[':
          if (speedIndex > 0) {
            speedIndex--;
            setPlaybackRate(speedLevels[speedIndex]);
          }
          e.preventDefault();
          break;
        case ']':
          if (speedIndex < speedLevels.length - 1) {
            speedIndex++;
            setPlaybackRate(speedLevels[speedIndex]);
          }
          e.preventDefault();
          break;
          
        // Play/Pause
        case 'p':
        case 'P':
          togglePlayPause();
          e.preventDefault();
          break;
          
        // Quick Jump to specific times
        case 'q':
        case 'Q':
          jumpToTime(timePoints.phase2);
          e.preventDefault();
          break;
        case 'w':
        case 'W':
          jumpToTime(timePoints.phase3);
          e.preventDefault();
          break;
        case 'e':
        case 'E':
          jumpToTime(timePoints.final);
          e.preventDefault();
          break;
          
        // Additional shortcuts
        case ' ': // Space bar for play/pause
          togglePlayPause();
          e.preventDefault();
          break;
        case 'Home':
          jumpToTime(0);
          e.preventDefault();
          break;
      }
    });

    // 初期設定
    bgm.addEventListener('loadedmetadata', () => {
      setPlaybackRate(playbackRate);
    });

    // パネル更新
    function updateDevPanel() {
      // 要素が存在することを確認してから更新
      const timeEl = devTime || document.getElementById('devTime');
      const phaseEl = devPhase || document.getElementById('devPhase');
      const speedEl = devSpeed || document.getElementById('devSpeed');
      const statusEl = devStatus || document.getElementById('devStatus');
      
      if (!timeEl || !phaseEl || !speedEl || !statusEl) {
        console.warn('[DEV-TOOLS] Panel elements not found, retrying...');
        setTimeout(() => requestAnimationFrame(updateDevPanel), 100);
        return;
      }
      
      const time = bgm.currentTime || 0;
      const duration = bgm.duration || 0;
      
      // 時間表示
      const timeText = `Time: ${formatTime(time)} / ${formatTime(duration)}`;
      timeEl.textContent = timeText;
      
      // フェーズ表示
      if (window.resolvePhase) {
        const phase = window.resolvePhase(time);
        const phaseNames = { phase1: 'I', phase2: 'II', phase3: 'III', final: 'FINAL' };
        const phaseText = `Phase: ${phaseNames[phase] || 'I'}`;
        phaseEl.textContent = phaseText;
      }
      
      // ステータス表示
      let statusText = 'Status: Ready';
      let statusColor = '#00ff00';
      
      if (bgm.paused) {
        statusText = 'Status: Paused';
        statusColor = '#ffaa00';
      } else if (bgm.ended) {
        statusText = 'Status: Ended';
        statusColor = '#ff6666';
      } else if (bgm.currentTime > 0) {
        statusText = 'Status: Playing';
        statusColor = '#66ff66';
      }
      
      statusEl.textContent = statusText;
      statusEl.style.color = statusColor;
      
      // デバッグ情報（一定間隔で出力）
      if (Math.floor(time * 10) % 50 === 0 && time > 0) {
        console.log(`[DEV-TOOLS] Update: ${timeText}, Phase: ${window.resolvePhase ? window.resolvePhase(time) : 'unknown'}, ${statusText}`);
      }
      
      requestAnimationFrame(updateDevPanel);
    }

    // パネル更新開始（少し遅延してから開始）
    setTimeout(() => {
      console.log('[DEV-TOOLS] Starting panel updates...');
      updateDevPanel();
    }, 100);

    // ゲーム開始時に自動的に2倍速設定
    const originalStart = window.start;
    if (originalStart) {
      window.start = function() {
        originalStart.call(this);
        // 少し遅延してから設定（BGMの読み込みを待つ）
        setTimeout(() => {
          setPlaybackRate(playbackRate);
        }, 100);
      };
    }

    // BGMイベントリスナー
    bgm.addEventListener('play', () => {
      console.log('[DEV-TOOLS] BGM started playing');
    });
    
    bgm.addEventListener('pause', () => {
      console.log('[DEV-TOOLS] BGM paused');
    });
    
    bgm.addEventListener('ended', () => {
      console.log('[DEV-TOOLS] BGM ended');
    });

    console.log('[DEV-TOOLS] BGM Dev Tools Ready!');
    console.log('Shortcuts: ←→ (±10s), 1-4 (phases), QWE (key times), [] (speed), P/Space (play/pause)');
  }

  // より確実な初期化
  function ensureInit() {
    if (document.body) {
      initDevTools();
    } else {
      setTimeout(ensureInit, 50);
    }
  }

  // 複数のタイミングで初期化を試行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureInit);
  } else {
    ensureInit();
  }
  
  // さらに保険として、ページロード後にも実行
  window.addEventListener('load', () => {
    setTimeout(ensureInit, 100);
  });
})();