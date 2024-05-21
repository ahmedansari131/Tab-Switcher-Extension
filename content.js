chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "openPopup") {
    const containerStyles = {
      backgroundColor: "#36454F",
      color: "white",
      width: "50%",
      height: "fit-content",
      padding: "1em",
      borderRadius: "10px",
      position: "absolute",
      top: "20%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: "1000000000",
      overflow: "hidden",
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      display: "flex",
      flexDirection: "column",
      gap: "1em",
      margin: "0",
    };

    const tabsListContainerStyles = {
      width: "100%",
      height: "100%",
      margin: "0",
      display: "flex",
      gap: ".5em",
      flexDirection: "column",
    };

    const searchInputStyles = {
      width: "100%",
      border: "1px solid #E4D00A",
      backgroundColor: "black",
      borderRadius: "6px",
      padding: "1em",
      color: "white",
      outline: "none",
      fontSize: "1rem",
    };

    const searchInputAttributes = {
      type: "search",
      placeholder: "Find tab",
      id: "search-input-001",
    };

    const tabListContainerAttributes = {
      class: "tab-list-container",
    };

    const containerAttributes = {
      id: "search-container-001",
    };

    const tabsOpen = request.window;
    const body = document.querySelector("body");
    const container = createElement("div");
    const tabsListContainer = createElement("ul");
    const searchInput = createElement("input");

    addStyleToElement(container, containerStyles);
    addStyleToElement(tabsListContainer, tabsListContainerStyles);
    addStyleToElement(searchInput, searchInputStyles);

    addAttributeToElement(searchInput, searchInputAttributes);
    addAttributeToElement(tabsListContainer, tabListContainerAttributes);
    addAttributeToElement(container, containerAttributes);

    container.append(searchInput);
    container.append(tabsListContainer);

    if (!body.lastChild.id && body.lastChild.id !== "search-container-001") {
      body.appendChild(container);
      searchInput.focus();

      tabsOpen.forEach((tab) => {
        createTabList(tab.title);
      });
    }

    closeSearchInput(body, container);

    let filteredSearch = [];
    searchInput.addEventListener("input", (event) => {
      const query = event.target.value.toLowerCase();
      filteredSearch = [];

      tabsOpen.forEach((tab) => {
        if (tab.title.toLowerCase().includes(query)) {
          if (!filteredSearch.includes(tab.title)) {
            filteredSearch.push(tab.title);
          }
        }
      });

      createTabList(filteredSearch);
    });

    sendResponse({ status: "Feature toggled" });
  }
  return true;
});

function createTabList(text) {
  const tabListStyles = {
    listStyle: "none",
    padding: "0 1em",
    cursor: "pointer",
    color: "white",
  };
  const tabsListContainer = accessElement(".tab-list-container");

  if (typeof text === "object") {
    tabsListContainer.innerHTML = "";
    text.forEach((tab) => {
      const tabList = createElement("li");
      const tabsListContainer = accessElement(".tab-list-container");
      addStyleToElement(tabList, tabListStyles);
      tabList.innerText = tab;
      tabsListContainer.append(tabList);
    });
    return;
  }
  const tabList = createElement("li");
  addStyleToElement(tabList, tabListStyles);
  tabList.innerText = text;
  tabsListContainer.append(tabList);
}

function createElement(element) {
  return document.createElement(element);
}

function addStyleToElement(element, styles) {
  for (const key in styles) {
    element.style[key] = styles[key];
  }
}

function addAttributeToElement(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function closeSearchInput(parentElement, childElement) {
  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      parentElement.removeChild(childElement);
    }
  });
}

function accessElement(identifier) {
  return document.querySelector(identifier);
}
