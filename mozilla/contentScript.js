browser.runtime.onMessage.addListener((msg, sender) => {
  return new Promise(resolve => {
    if (!window.location.href.includes('https://app.tempo.new/canvases/')) {
      browser.runtime.sendMessage({
        error: true,
        message: 'Please navigate to a Tempo canvas page and try again.'
      });
      resolve({ success: false });
      return;
    }
    
    let selector;
    let popupWidth;
    
    if (msg.action === 'chat-panel') {
      selector = 'chat-panel';
      popupWidth = 300;
    } else if (msg.action === 'canvas-panel') {
      selector = 'canvas-panel';
      popupWidth = 600;
    } else {
      resolve({ success: false });
      return;
    }
    
    const panelData = {
      panelType: selector,
      sourceUrl: window.location.href,
      timestamp: Date.now()
    };
    
    browser.runtime.sendMessage({
      action: 'createNewTab',
      panelData: panelData
    }).then(response => {
      if (response && response.success) {
        resolve({ success: true });
      } else {
        tryWindowOpen();
      }
    }).catch(error => {
      console.error('Error sending message to background script:', error);
      tryWindowOpen();
    });
    
    function tryWindowOpen() {
      const windowName = `tempo_${selector}_${Date.now()}`;
      const windowFeatures = `width=${popupWidth},height=800,left=50,top=50,popup=yes,toolbar=no`;
      
      console.log('Attempting direct window.open for Firefox');
      const popup = window.open(window.location.href, windowName, windowFeatures);
      
      if (!popup) {
        browser.runtime.sendMessage({
          error: true,
          message: 'Popup was blocked. To enable this feature, please allow popups for app.tempo.new in your Firefox settings.'
        });
        resolve({ success: false });
        return;
      }
      
      console.log('Firefox direct window.open successful');
      resolve({ success: true });
      
      setupPopupContent(popup, selector);
    }
    
    function setupPopupContent(popup, selector) {
      let attempts = 0;
      const maxAttempts = 150;
      
      setTimeout(() => {
        console.log('Starting panel detection after initial delay');
        
        const interval = setInterval(() => {
          try {
            attempts++;
            const doc = popup.document;
            
            if (!doc || !doc.body) {
              if (attempts >= maxAttempts) {
                console.error('Timed out waiting for popup document');
                clearInterval(interval);
              }
              return;
            }
            
            const mainAppContainer = doc.querySelector('div[class*="overflow-hidden h-screen"]');
            const leftPanel = doc.getElementById('left-panel');
            const canvasPanel = doc.getElementById('canvas-panel');
            
            const tempoUILoaded = (mainAppContainer || (leftPanel && canvasPanel));
            
            if (!tempoUILoaded) {
              if (attempts >= maxAttempts) {
                console.error('Timed out waiting for Tempo UI to load');
                clearInterval(interval);
              }
              return;
            }
            
            clearInterval(interval);
            console.log('Tempo UI detected, applying panel styles');
            
            const style = doc.createElement('style');
            
            if (selector === 'chat-panel') {
              style.textContent = `
              div#canvas-panel { display: none !important; }
              div#left-panel-extension { display: none !important; }
              div#right-panel { display: none !important; }
              aside { display: none !important; }
              div.h-11 { display: none !important; }
              `;
            } else if (selector === 'canvas-panel') {
              style.textContent = `
              div#left-panel { display: none !important; }
              div#left-panel-extension { display: none !important; }
              aside { display: none !important; }
              div.h-11 { display: none !important; }
              `;
            }
            
            doc.head.appendChild(style);
            
            const statusOverlay = doc.createElement('div');
            let panelTypeFormatter = selector.replace('-panel', '');
            panelTypeFormatter = panelTypeFormatter.charAt(0).toUpperCase() + panelTypeFormatter.slice(1);
            statusOverlay.textContent = `${panelTypeFormatter} Panel Active`;
            statusOverlay.style.cssText = `
              position: fixed;
              top: 10px;
              right: 10px;
              background: rgba(124, 58, 237, 0.9);
              color: white;
              padding: 8px 12px;
              border-radius: 4px;
              font-size: 12px;
              z-index: 9999;
              pointer-events: none;
              opacity: 1;
              transition: opacity 0.5s ease;
            `;
            doc.body.appendChild(statusOverlay);
            
            setTimeout(() => {
              statusOverlay.style.opacity = '0';
              setTimeout(() => statusOverlay.remove(), 500);
            }, 3000);
            
          } catch (e) {
            console.error('Error manipulating popup DOM:', e);
            if (attempts >= maxAttempts) {
              clearInterval(interval);
            }
          }
        }, 100);
      }, 2000);
    }
  });
});
