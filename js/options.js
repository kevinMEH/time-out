// On page load
updateSiteList();

// Preview blocked screen
let previewButton = document.getElementById("previewButton");
previewButton.addEventListener("click", () => {
    location.href = "../html/blocked.html";
})

// Custom image
let customImage = document.getElementById("customBackgroundImage");
let submitBackgroundImage = document.getElementById("submitBackgroundImage");
submitBackgroundImage.addEventListener("click", () => {
    chrome.storage.sync.set( {"backgroundImageUrl": customImage.value})
})

customImage.addEventListener("keyup", (event) => {
    if(event.code == "Enter") {
        event.preventDefault();
        chrome.storage.sync.set( {"backgroundImageUrl": customImage.value});
        customImage.value = "";
    }
})

// Add new site
let addNewSite = document.getElementById("addNewSite");
let submitButton = document.getElementById("submitButton");

addNewSite.addEventListener("keyup", (event) => {
    if(event.code === "Enter") {
        event.preventDefault();
        addSite(addNewSite.value);
        addNewSite.value = "";
    }
})

submitButton.addEventListener("click", () => {
    addSite(addNewSite.value);
    addNewSite.value = "";
})

let blockedSiteList = document.getElementById("blockedSiteList");

function updateSiteList() {
    chrome.storage.sync.get("blockedList", function(result) {
        let blockedList = result.blockedList;
        // Removes all childs
        while(document.getElementById("blockedSite") != null) {
            blockedSiteList.removeChild(document.getElementById("blockedSite"));
        }
        // Create new lists
        for(let site of blockedList) {
            let paragraph = document.createElement("p");
            paragraph.id = "blockedSite";
            paragraph.appendChild(document.createTextNode(site));
            blockedSiteList.appendChild(paragraph);
        }
    });
    console.log("Updated Site List");
}

async function addSite(site) {
    site = site.trim();
    if(site != "" && site.includes(".")) {
        
        await chrome.storage.sync.get("blockedList", (blockedListResult) => {
            let blockedList = blockedListResult.blockedList;
            blockedList.push(site);
            
            chrome.storage.sync.set( { "blockedList": blockedList }, () => {
                console.log("Added " + site + " to blockedList.");
                updateSiteList(); 
                chrome.runtime.sendMessage("updateVariables");
            });
        });
        
    }
}

function removeSite(site) {
    chrome.storage.sync.get("blockedList", function(result) {
        let blockedList = result.blockedList;
        blockedList.splice(blockedList.indexOf(site), 1);
        chrome.storage.sync.set( { "blockedList": blockedList } );
        console.log("Removed " + site + " from blockedList.");
        chrome.runtime.sendMessage("updateVariables");
    })
}