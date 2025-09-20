// シンプルな開発者ツール（テスト用）
console.log('=== DEV TOOLS SIMPLE VERSION ===');

(() => {
  // URLパラメータチェック
  const urlParams = new URLSearchParams(window.location.search);
  const isDevMode = urlParams.has('dev');
  
  console.log('Dev mode check:', isDevMode);
  
  if (!isDevMode) {
    console.log('Dev mode not enabled. Add ?dev=1 to URL');
    return;
  }

  // 確実にDOMが読み込まれてから実行
  function initSimpleTools() {
    console.log('Initializing simple dev tools...');
    
    // テスト用のシンプルなパネルを作成
    const testPanel = document.createElement('div');
    testPanel.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      padding: 20px;
      background: red;
      color: white;
      font: 16px monospace;
      border: 2px solid white;
      z-index: 99999;
    `;
    testPanel.textContent = 'DEV TOOLS TEST - If you see this, JS is working!';
    
    document.body.appendChild(testPanel);
    console.log('Test panel added to DOM');
    
    // BGM要素をチェック
    const bgm = document.getElementById('bgm');
    console.log('BGM element:', bgm);
    
    if (bgm) {
      // シンプルなカウンター
      let counter = 0;
      setInterval(() => {
        counter++;
        testPanel.textContent = `DEV TOOLS - Counter: ${counter} - BGM Time: ${bgm.currentTime.toFixed(1)}s`;
      }, 1000);
      
      console.log('Counter started');
    } else {
      testPanel.textContent = 'DEV TOOLS - BGM element not found!';
    }
  }

  // 複数の方法で初期化を試行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimpleTools);
  } else {
    initSimpleTools();
  }

  setTimeout(initSimpleTools, 1000); // 保険
  
  console.log('Simple dev tools script loaded');
})();