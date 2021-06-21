// On page load
updateSiteList();
updateLinkList();

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

// Add alternative links
let addAlternativeLinkUrl = document.getElementById("addAlternativeLinkUrl");
let addAlternativeLinkDescription = document.getElementById("addAlternativeLinkDescription");
let submitAlternativeLink = document.getElementById("submitAlternativeLink");

addAlternativeLinkUrl.addEventListener("keyup", (event) => {
    if(event.code === "Enter" && addAlternativeLinkDescription.value != "" && addAlternativeLinkDescription.value != "") {
        event.preventDefault();
        addLink(addAlternativeLinkUrl.value.trim(), addAlternativeLinkDescription.value.trim());
        addAlternativeLinkUrl.value = "";
        addAlternativeLinkDescription.value = "";
    }
})

addAlternativeLinkDescription.addEventListener("keyup", (event) => {
    if(event.code === "Enter" && addAlternativeLinkDescription.value != "" && addAlternativeLinkDescription.value != "") {
        event.preventDefault();
        addLink(addAlternativeLinkUrl.value.trim(), addAlternativeLinkDescription.value.trim());
        addAlternativeLinkUrl.value = "";
        addAlternativeLinkDescription.value = "";
    }
})

submitAlternativeLink.addEventListener("click", () => {
    addLink(addAlternativeLinkUrl.value, addAlternativeLinkDescription.value);
    addAlternativeLinkUrl.value = "";
    addAlternativeLinkDescription.value = "";
})

let alternativeLinksList = document.getElementById("alternativeLinksList")

function updateLinkList() {
    chrome.storage.sync.get("alternativeLinks", (result) => {
        let alternativeLinks = result.alternativeLinks;
        // Removes all childs
        while(document.getElementById("alternativeLink") != null) {
            alternativeLinksList.removeChild(document.getElementById("alternativeLink"));
        }
        // Creates new lists
        for(let alternativeLink of alternativeLinks) {
            let link = document.createElement("a");
            link.id = "alternativeLink";
            link.href = alternativeLink.url;
            link.innerHTML = alternativeLink.description;
            // Remove button
            let button = document.createElement("button");
            button.id = "alternativeLink";
            button.textContent = "Remove";
            button.addEventListener("click", (event) => {
                removeLink(alternativeLink);
                event.preventDefault();
                event.stopPropagation();
            });
            
            link.appendChild(button);
            link.appendChild(document.createElement("br"));
            alternativeLinksList.appendChild(link);
        }
        console.log("Updated Link List");
    });
}

function addLink(url, description) {
    chrome.storage.sync.get("alternativeLinks", (result) => {
        let alternativeLinks = result.alternativeLinks;
        alternativeLinks.push({url: url, description: description});
        chrome.storage.sync.set( {"alternativeLinks": alternativeLinks}, () => {
            updateLinkList();
            console.log("Added alternate link.");
        });
    });
}

function removeLink(link) {
    chrome.storage.sync.get("alternativeLinks", (result) => {
        let alternativeLinks = result.alternativeLinks;
        alternativeLinks.splice(alternativeLinks.indexOf(link), 1);
        chrome.storage.sync.set( {"alternativeLinks": alternativeLinks}, () => {
            updateLinkList();
            console.log("Removed alternate link.");
        });
    });
}


// Add new site
let addNewSite = document.getElementById("addNewSite");
let submitNewSite = document.getElementById("submitNewSite");

addNewSite.addEventListener("keyup", (event) => {
    if(event.code === "Enter") {
        event.preventDefault();
        addSite(addNewSite.value);
        addNewSite.value = "";
    }
})

submitNewSite.addEventListener("click", () => {
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
            // Remove button
            let button = document.createElement("button");
            button.id = "blockedSite";
            button.textContent = "Remove";
            button.addEventListener("click", () => removeSite(site))
            
            paragraph.appendChild(button);
            blockedSiteList.appendChild(paragraph);
        }
        console.log("Updated Site List");
    });
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
        chrome.storage.sync.set( { "blockedList": blockedList }, () => {
            console.log("Removed " + site + " from blockedList.");
            updateSiteList();
            chrome.runtime.sendMessage("updateVariables");
        });
    })
}