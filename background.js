// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "muteWord",
      title: "Mute word \"%s\" on X.com",
      contexts: ["selection"],
      documentUrlPatterns: ["*://x.com/*", "*://twitter.com/*"]
    });
  });
  
  // Handle context menu click
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "muteWord" && info.selectionText) {
      const word = info.selectionText.trim();
      
      // Store the word in chrome.storage
      await chrome.storage.local.set({ wordToMute: word });
      
      // Open muted keyword page in a new tab and store the tab id
      const newTab = await chrome.tabs.create({
        url: 'https://x.com/settings/add_muted_keyword',
        active: true
      });
      
      // Store the tab id for later use
      await chrome.storage.local.set({ muteWordTabId: newTab.id });
    }
  });

  // Handle messages from content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'muteWordComplete') {
      // Show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'X.com Word Muter',
        message: message.message
      });
      
      // Close the tab if requested
      if (message.closeTab && sender.tab) {
        chrome.tabs.remove(sender.tab.id);
      }
    }
  });

  // Listen for tab updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && 
        tab.url && 
        tab.url.includes('/settings/add_muted_keyword')) {
      // Check if we have a word to mute
      chrome.storage.local.get(['wordToMute'], async (result) => {
        if (result.wordToMute) {
          // Try to send the message to the content script
          try {
            await chrome.tabs.sendMessage(tabId, {
              action: "muteWord",
              word: result.wordToMute
            });
            // Clear the stored word after sending
            chrome.storage.local.remove('wordToMute');
          } catch (error) {
            console.error('Failed to send message to content script:', error);
          }
        }
      });
    }
  });