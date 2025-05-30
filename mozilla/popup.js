document.body.style.width = '320px';
document.body.style.height = '320px';

let isInErrorState = false;

const originalButtonContent = { 'chat-panel': '', 'canvas-panel': '' };

document.addEventListener('DOMContentLoaded', () => {
  const glowDiv = document.createElement('div');
  glowDiv.className = 'background-glow';
  glowDiv.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -10;
    height: 200px;
    width: 80%;
    max-width: 200px;
    border-radius: 9999px;
    background-color: rgba(124, 58, 237, 0.15);
    filter: blur(60px);
    pointer-events: none;
  `;
  document.body.appendChild(glowDiv);

  document.querySelectorAll('button').forEach(btn => {
    originalButtonContent[btn.id] = btn.innerHTML;
  });
});

function send(action) {
  if (isInErrorState) return;
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.id === action) {
      const btnIcon = btn.querySelector('svg');
      btn.innerHTML = `${btnIcon.outerHTML}<span style="opacity: 0.8">Opening</span> <span class="loading-dots"></span>`;
      animateDots(btn.querySelector('.loading-dots'));
    } else {
      btn.style.opacity = '0.5';
    }
  });

  proceedWithAction(action);
}

function proceedWithAction(action) {
  return browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => {
      const tab = tabs[0];
      if (!tab || !tab.id) {
        showError('Cannot access the current tab');
        return;
      }
      
      if (!tab.url || !tab.url.includes('https://app.tempo.new/canvases/')) {
        showError('Please navigate to a Tempo canvas page and try again.');
        return;
      }
      
      return browser.tabs.sendMessage(tab.id, { action })
        .then(response => {
          if (!response || !response.success) {
            restoreButtons();
            return;
          }
          
          window.close();
        })
        .catch(error => {
          showError('Cannot communicate with the page. Try refreshing the page.');
        });
    });
}

browser.runtime.onMessage.addListener((message) => {
  if (message.error) {
    showError(message.message);
  }
});

function showError(message) {
  isInErrorState = true;
  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-message';
  errorContainer.innerHTML = `<div style="color: #ff4757; background: rgba(255, 71, 87, 0.1); padding: 12px; border-radius: 8px; margin: 8px 0; text-align: center; font-size: 14px;">${message}</div>`;
  
  const contentDiv = document.querySelector('.content');
  contentDiv.insertBefore(errorContainer, contentDiv.firstChild);
  
  restoreButtons();
  
  setTimeout(() => {
    if (errorContainer.parentNode) {
      errorContainer.parentNode.removeChild(errorContainer);
      isInErrorState = false;
    }
  }, 2500);
}

function restoreButtons() {
  document.querySelectorAll('button').forEach(btn => {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.innerHTML = originalButtonContent[btn.id];
  });
}

function animateDots(element) {
  let dots = '.';
  element.textContent = dots;
  
  window.countdownInterval = setInterval(() => {
    dots = dots.length >= 3 ? '.' : dots + '.';
    element.textContent = dots;
  }, 300);
}

document.getElementById('chat-panel')
        .addEventListener('click', () => send('chat-panel'));
document.getElementById('canvas-panel')
        .addEventListener('click', () => send('canvas-panel'));

window.addEventListener('unload', () => {
  if (window.countdownInterval) {
    clearInterval(window.countdownInterval);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    button.style.opacity = '0';
    button.style.transform = 'translateY(10px)';
    setTimeout(() => {
      button.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      button.style.opacity = '1';
      button.style.transform = 'translateY(0)';
    }, 100 + (index * 100));
  });
  
  const helpIcon = document.getElementById('helpIcon');
  const helpTooltip = document.getElementById('helpTooltip');
  
  if (helpIcon && helpTooltip) {
    helpIcon.addEventListener('click', () => {
      if (helpTooltip.style.display === 'block') {
        helpTooltip.style.display = 'none';
      } else {
        helpTooltip.style.display = 'block';
      }
    });
    
    document.addEventListener('click', (event) => {
      if (event.target !== helpIcon && event.target.parentNode !== helpIcon && 
          event.target !== helpTooltip && !helpTooltip.contains(event.target)) {
        helpTooltip.style.display = 'none';
      }
    });
  }
});
