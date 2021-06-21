// On page load
updateSiteList();
updateTasksList();

// Preview blocked screen
let previewButton = document.getElementById("previewButton");
previewButton.addEventListener("click", () => {
    location.href = "../html/blocked.html";
})

// Custom title
let customTitle = document.getElementById("customTitle");
let submitCustomTitle = document.getElementById("submitCustomTitle");
submitCustomTitle.addEventListener("click", () => {
    chrome.storage.sync.set( {"title": customTitle.value} );
    customTitle.value = "";
})

// Custom image
let customImage = document.getElementById("customBackgroundImage");
let submitBackgroundImage = document.getElementById("submitBackgroundImage");
submitBackgroundImage.addEventListener("click", () => {
    chrome.storage.sync.set( {"backgroundImageUrl": customImage.value})
    customImage.value = "";
})
customImage.addEventListener("keyup", (event) => {
    if(event.code == "Enter") {
        event.preventDefault();
        chrome.storage.sync.set( {"backgroundImageUrl": customImage.value});
        customImage.value = "";
    }
})

// Add Tasks and Task List
let addTaskUrl = document.getElementById("addTaskUrl");
let addTaskDescription = document.getElementById("addTaskDescription");
let submitTask = document.getElementById("submitTask");

addTaskUrl.addEventListener("keyup", (event) => {
    enterEventChecker(event);
})

addTaskDescription.addEventListener("keyup", (event) => {
    enterEventChecker(event);
})

function enterEventChecker(event) {
    if(event.code === "Enter" && addTaskDescription.value != "" && addTaskDescription.value != "") {
        event.preventDefault();
        addLink(addTaskUrl.value.trim(), addTaskDescription.value.trim());
        addTaskUrl.value = "";
        addTaskDescription.value = "";
    }
}

submitTask.addEventListener("click", () => {
    addLink(addTaskUrl.value, addTaskDescription.value);
    addTaskUrl.value = "";
    addTaskDescription.value = "";
})

let tasksList = document.getElementById("tasksList")

function updateTasksList() {
    chrome.storage.sync.get("tasksList", (result) => {
        let list = result.tasksList;
        // Removes all childs
        while(document.getElementById("task") != null) {
            tasksList.removeChild(document.getElementById("task"));
        }
        // Creates new lists
        for(let task of list) {
            let link = document.createElement("a");
            link.id = "task";
            link.href = task.url;
            link.innerHTML = task.description;
            // Remove button
            let button = document.createElement("button");
            button.id = "task";
            button.textContent = "Remove";
            button.addEventListener("click", (event) => {
                removeLink(task);
                event.preventDefault();
                event.stopPropagation();
            });
            
            link.appendChild(button);
            link.appendChild(document.createElement("br"));
            tasksList.appendChild(link);
        }
        console.log("Updated Link List");
    });
}

function addLink(url, description) {
    chrome.storage.sync.get("tasksList", (result) => {
        let list = result.tasksList;
        list.push({url: url, description: description});
        chrome.storage.sync.set( {"tasksList": list}, () => {
            updateTasksList();
            console.log("Added task.");
        });
    });
}

function removeLink(link) {
    chrome.storage.sync.get("tasksList", (result) => {
        let list = result.tasksList;
        list.splice(list.indexOf(link), 1);
        chrome.storage.sync.set( {"tasksList": list}, () => {
            updateTasksList();
            console.log("Removed task.");
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