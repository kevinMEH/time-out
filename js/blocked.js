// Background
let backgroundImage = document.getElementById("backgroundImage");
chrome.storage.sync.get("backgroundImageUrl", (result) => {
    let style = document.createElement("style");
    style.textContent =`
        html {
            background: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.0)), url(${result.backgroundImageUrl}) no-repeat center center fixed; 
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
        }
    `
    document.head.append(style);
});

// Custom title
let customTitle = document.getElementById("title");
chrome.storage.sync.get("title", (result) => {
    customTitle.textContent = result.title;
});

// Unblock button redirect
let unblockButton = document.getElementById("unblockButton");
updateOriginalUrl();
function updateOriginalUrl() {
    chrome.storage.sync.get("originalUrl", (result) => {
        console.log("Unblock button URL set to: " + result.originalUrl);
        unblockButton.addEventListener("click", () => {
            location.href = result.originalUrl;
            chrome.runtime.sendMessage("exclude")
        })
    });
}