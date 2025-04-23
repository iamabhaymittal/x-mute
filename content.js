// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "muteWord" && message.word) {
      muteWord(message.word);
    }
  });
  
  // Helper function to wait for an element using MutationObserver
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout waiting for element: ${selector}`));
      }, timeout);
    });
  }
  
  // Function to simulate human typing
  async function simulateTyping(input, text) {
    input.focus();
    for (let i = 0; i < text.length; i++) {
      input.value += text[i];
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 50)); // Delay between characters
    }
  }
  
  // Function to fill out the muted word form and submit
  async function muteWord(word) {
    try {
      console.log('Starting mute word process for:', word);

      // Wait for the page to be fully loaded
      if (document.readyState !== 'complete') {
        console.log('Waiting for page load...');
        await new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
      }

      // Wait for the form to be present
      console.log('Waiting for form elements...');
      
      // Wait for input field with increased timeout
      console.log('Waiting for keyword input...');
      const input = await waitForElement('input[name="keyword"]', 15000);
      console.log('Found input field:', input);

      // Clear the input field and type the word
      console.log('Typing word:', word);
      input.value = '';
      await simulateTyping(input, word);

      // Wait a bit for the form to register the input
      await new Promise(resolve => setTimeout(resolve, 500));

      // Ensure notifications are enabled
      console.log('Setting up notifications...');
      const notificationsSwitch = await waitForElement('input[role="switch"]');
      if (notificationsSwitch && !notificationsSwitch.checked) {
        notificationsSwitch.click();
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Select "From people you don't follow"
      console.log('Setting notification options...');
      const peopleRadio = await waitForElement('input[name="mute_notifications_option"][aria-posinset="2"]');
      if (!peopleRadio.checked) {
        const peopleLabel = peopleRadio.closest('label');
        if (peopleLabel) peopleLabel.click();
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Select "Until you unmute the word"
      console.log('Setting duration...');
      const durationRadio = await waitForElement('input[name="time_duration"][aria-posinset="1"]');
      if (!durationRadio.checked) {
        const durationLabel = durationRadio.closest('label');
        if (durationLabel) durationLabel.click();
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Wait for the Save button and click it
      console.log('Looking for Save button...');
      const saveButton = await waitForElement('[data-testid="settingsDetailSave"]');
      console.log('Found Save button:', saveButton);

      // Check if button is disabled and wait for it to become enabled
      let attempts = 0;
      while (attempts < 10 && (saveButton.disabled || saveButton.getAttribute('aria-disabled') === 'true')) {
        console.log('Waiting for Save button to become enabled...');
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }

      if (!saveButton.disabled && saveButton.getAttribute('aria-disabled') !== 'true') {
        console.log('Clicking Save button...');
        saveButton.click();
        
        // Wait a bit for the save to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Notify the user and request tab close
        chrome.runtime.sendMessage({
          action: 'muteWordComplete',
          message: `"${word}" has been muted on X.com`,
          closeTab: true
        });
      } else {
        throw new Error('Save button remained disabled');
      }

    } catch (error) {
      console.error('Error in muteWord:', error);
      alert(`Failed to mute word: ${error.message}. Please try again or mute manually.`);
    }
  }
  
  // Check if we've just navigated to the muted words page and have a word to mute
  if (window.location.href.includes('/settings/muted_keywords')) {
    const wordToMute = localStorage.getItem('wordToMute');
    if (wordToMute) {
      // Wait for the page to fully load
      window.addEventListener('load', () => {
        muteWord(wordToMute);
      });
      
      // Backup in case the load event has already fired
      setTimeout(() => {
        muteWord(wordToMute);
      }, 2000);
    }
  }
