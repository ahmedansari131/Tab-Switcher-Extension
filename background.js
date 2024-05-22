chrome.commands.onCommand.addListener(function (command) {
  if (command === "open-search-container") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length === 0) {
        console.error("No active tab found");
        return;
      }
      const tabId = tabs[0].id;
      // Inject content script
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          files: ["content.js"],
        },
        function () {
          if (chrome.runtime.lastError) {
            console.error(
              "Error injecting content script:",
              chrome.runtime.lastError
            );
          } else {
            console.log("Content script injected");
            chrome.windows.getCurrent({ populate: true }, function (window) {
              if (chrome.runtime.lastError) {
                console.error(
                  "Error getting current window:",
                  chrome.runtime.lastError
                );
                return;
              }
              console.log("Current window ID:", window.id);

              chrome.tabs.query({ windowId: window.id }, (window) => {
                console.log("Got window id -> ", window);
                chrome.tabs.sendMessage(
                  tabId,
                  { action: "openPopup", window },
                  function (response) {
                    if (chrome.runtime.lastError) {
                      console.error(
                        "Error sending message:",
                        chrome.runtime.lastError
                      );
                    } else {
                      console.log("Message sent successfully");
                    }
                  }
                );
              });
            });
          }
        }
      );
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "navigateToTab") {
    const tabId = request.tabId;
    chrome.tabs.update(parseInt(tabId), { active: true }, (updatedTab) => {
      sendResponse({ status: "Tab navigation complete" });
    });
    return true;
  }
});

// document.addEventListener('keydown', (e) => {
//   chrome.tabs.sendMessage()

// })
