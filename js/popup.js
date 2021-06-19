let checkbox = document.getElementById("enable");
chrome.storage.sync.get("enabled", (result) => {
    if(result.enabled) checkbox.checked = true;
    else checkbox.checked = false;
})
checkbox.addEventListener("click", (event) => {
    if(checkbox.checked) chrome.storage.sync.set( {"enabled": true } );
    else chrome.storage.sync.set( {"enabled": false } );
    chrome.runtime.sendMessage("updateVariables");
})