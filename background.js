chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set( {"enabled": true } )
    chrome.storage.sync.set( {"blockedList": [] } );
    chrome.storage.sync.set( {"title": "Time out!"} );
    chrome.storage.sync.set( {"originalUrl": "blocked.html"} );
    // Photo by Elizeu Dias on Unsplash
    chrome.storage.sync.set( {"backgroundImageUrl": "https://images.unsplash.com/photo-1519046904884-53103b34b206?&w=1920&q=100"} );
    console.log("Initialized.");
})

let enabled;
let blockedList;
let excludedTabs = []; // Tabs that are excluded from checking
updateVariables();
chrome.runtime.onMessage.addListener((message, sender) => {
    if(message == "updateVariables") updateVariables();
    if(message.includes("exclude")) excludedTabs.push(sender.tab.id);
})
function updateVariables() {
    chrome.storage.sync.get("enabled", (result) => {
        enabled = result.enabled;
        chrome.storage.sync.get("blockedList", (list) => {
            blockedList = list.blockedList;
        })
    })
}

// You can't do shit with Manifest v3 without using the overtly confusing declarativeNetRequest API
// which doesn't even have the same functions as webRequest
// If anyone wants to help, you can start a new branch and migrate to v3 becuase I'm not dealing
// with Chrome's fucking bullshit.
chrome.webRequest.onBeforeRequest.addListener((details) => {
    console.log("New request detected")
    console.log("Request URL: " + details.url);
    if(enabled && !excludedTabs.includes(details.tabId)) {
        for(let blockedUrl of blockedList) {
            if(details.url.includes(blockedUrl)) {
                console.log("Match detected, redirecting");
                chrome.storage.sync.set( {"originalUrl": details.url}, () => {
                    chrome.runtime.sendMessage("updateOriginalUrl");
                });
                return {
                    redirectUrl: chrome.runtime.getURL("blocked.html")
                };
            }
        }
    }
}, {
    urls: ["<all_urls>"],
    types: ["main_frame"]
}, ["blocking"]);
