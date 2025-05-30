console.log('Tempo Panel Manager: Background script loaded');

browser.runtime.onInstalled.addListener((details) => {
  console.log('Tempo Panel Manager: Extension installed or updated', details.reason);
});

let tabIds = new Set();

browser.runtime.onMessage.addListener((message, sender) => {
  console.log('Tempo Panel Manager: Background received message', message);
  
  if (message.action === 'createNewTab') {
    const panelData = message.panelData;
    const width = panelData.panelType === 'chat-panel' ? 300 : 600;
    
    return browser.storage.local.set({ 'tempoPanelManagerPanelData': panelData })
      .then(() => {
        return browser.windows.create({
          url: panelData.sourceUrl,
          type: 'popup',
          width: width,
          height: 800
        });
      })
      .then(newWindow => {
        if (newWindow && newWindow.tabs && newWindow.tabs.length > 0) {
          tabIds.add(newWindow.tabs[0].id);
          console.log('Created new window with tab:', newWindow.tabs[0].id);
        }
        
        return { success: true, windowId: newWindow.id };
      })
      .catch(error => {
        console.error('Failed to create new window:', error);
        return { success: false, error: error.message };
      });
  }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabIds.has(tabId) && changeInfo.status === 'complete') {
    console.log('Panel tab loaded, waiting before applying styles');
    
    setTimeout(() => {
      console.log('Applying panel styles after delay');
      
      browser.storage.local.get('tempoPanelManagerPanelData')
        .then(result => {
          if (result.tempoPanelManagerPanelData) {
            const panelData = result.tempoPanelManagerPanelData;
            
            function applyPanelStyling(panelType) {
              const style = document.createElement('style');
              
              if (panelType === "chat-panel") {
                style.textContent = `
                  div#canvas-panel { display: none !important; }
                  div#left-panel-extension { display: none !important; }
                  div#right-panel { display: none !important; }
                  aside { display: none !important; }
                  div.h-11 { display: none !important; }
                `;
              } else if (panelType === "canvas-panel") {
                style.textContent = `
                  div#left-panel { display: none !important; }
                  div#left-panel-extension { display: none !important; }
                  aside { display: none !important; }
                  div.h-11 { display: none !important; }
                `;
              }
              
              document.head.appendChild(style);
              console.log('Tempo Panel Manager: Applied panel styling for ' + panelType);
              
              const statusOverlay = document.createElement('div');
              let panelTypeFormatter = panelType.replace('-panel', '');
              panelTypeFormatter = panelTypeFormatter.charAt(0).toUpperCase() + panelTypeFormatter.slice(1);
              statusOverlay.textContent = panelTypeFormatter + " Panel Active";
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
              document.body.appendChild(statusOverlay);
              
              setTimeout(() => {
                statusOverlay.style.opacity = '0';
                setTimeout(() => statusOverlay.remove(), 500);
              }, 3000);
              
              return true;
            }
            
            return browser.tabs.executeScript(tabId, {
              code: `(${applyPanelStyling.toString()})(${JSON.stringify(panelData.panelType)});`
            });
          }
        })
        .then(() => {
          console.log('Injected panel styling into tab:', tabId);
        })
        .catch(error => {
          console.error('Failed to inject panel styling:', error);
        });
    }, 2000);
  }
});

console.log('Tempo Panel Manager: Background script initialized and ready');
