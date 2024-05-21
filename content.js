const container = document.createElement("div");
const tabsListContainer = document.createElement("ul");
const searchInput = document.createElement("input");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "openPopup") {
    const tabsOpen = request.window;
    const body = document.querySelector("body");

    tabsListContainer.style.width = "100%";
    tabsListContainer.style.height = "100%"
    tabsListContainer.style.background = "pink"

    container.style.width = "50%";
    container.style.height = "fit-content"
    container.style.padding = "1em"
    container.style.borderRadius = "10px"
    container.style.position = "absolute"
    container.style.top = "20%"
    container.style.left = "50%"
    container.style.transform = "translate(-50%, -50%)"
    container.style.zIndex = "1000000000"
    container.style.overflow = "hidden"
    container.style.backgroundColor = "#36454F"
    container.style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px"

    searchInput.type = "search"
    searchInput.placeholder = "Find tabs"
    searchInput.style.border = "1px solid #E4D00A"
    searchInput.style.width = "100%"
    searchInput.style.backgroundColor = "black"
    searchInput.style.borderRadius = "6px"
    searchInput.style.padding = ".5em 1em"
    searchInput.style.color = "white"
    searchInput.style.outline = "none"


    container.append(searchInput);
    container.append(tabsListContainer);
    body.appendChild(container);

    listTab(tabsOpen)

    searchInput.addEventListener('input', (e) => {
      tabsOpen.forEach((tab) => {
        if (tab.title.toLowerCase().includes(e.target.value.toLowerCase())) {
          tabsListContainer.innerHTML = "";
          const tabList = document.createElement("li");
          tabList.style.color = "white"
          tabsListContainer.appendChild(tabList);
          tabList.innerText = tab.title;

        }
        else if (e.target.value == "") {
          listTab(tabsOpen)
        }
        else {
          tabsListContainer.innerHTML = "Tab not found"
          // tabsListContainer.style.textAlign = "center"
          tabsListContainer.style.color = "white"
        }
      })

    })
    sendResponse({ status: "Feature toggled" });
  }
  return true;
});


function listTab(tabs) {
  tabs.forEach((tab) => {
    const tabList = document.createElement("li");
    tabList.style.color = "white"
    tabsListContainer.append(tabList);
    tabList.innerText = tab.title;
  })

}
