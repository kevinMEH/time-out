import { getRules, addSite, removeId, resetSessionRules, removeWorkers } from "../chrome.js";



let addSiteInput = document.getElementById("addSite") as HTMLInputElement;
addSiteInput.addEventListener("keyup", async event => {
    if(event.key === "Enter" && addSiteInput.value !== "") {
        console.log("Adding site: " + addSiteInput.value);
        event.preventDefault();

        let site = addSiteInput.value;
        site = site.trim();
        if(site) {
            await addSite(site);
            await removeWorkers(site);
        }

        addSiteInput.value = "";
        updateList();
    }
})


let siteList = document.getElementById("siteList") as HTMLDivElement;
async function updateList() {
    siteList.innerHTML = "";
    let rules = await getRules();
    for(let rule of rules) {
        let span = document.createElement("span");
        span.innerHTML = rule.id + " " + rule.condition.urlFilter;
        let removeButton = document.createElement("button");
        removeButton.innerHTML = "Remove";
        removeButton.onclick = async () => {
            await removeId(rule.id);
            await updateList();
        }
        siteList.appendChild(span);
        siteList.appendChild(removeButton);
        siteList.appendChild( document.createElement("br") );
    }
}
updateList();


let removeWorkersInput = document.getElementById("removeWorkers") as HTMLInputElement;
removeWorkersInput.addEventListener("keyup", async event => {
    if(event.key === "Enter" && removeWorkersInput.value !== "") {
        event.preventDefault();
        
        let site = removeWorkersInput.value;
        site = site.trim();
        if(site) await removeWorkers(site);
        
        removeWorkersInput.value = "";
    }
})


// TODO: Debug purposes only. Remove during final build.
let debug = document.getElementById("debug") as HTMLButtonElement;
debug.onclick = async () => {
    console.log("Dynamic Rules");
    let rules = await getRules();
    for(let rule of rules) {
        console.log(rule);
    }
    console.log("Session Rules");
    let sessionRules = await getRules("session");
    for(let rule of sessionRules) {
        console.log(rule);
    }
}

let reset = document.getElementById("reset") as HTMLButtonElement;
reset.onclick = async () => {
    let rules = await getRules();
    for(let rule of rules) await removeId(rule.id);
    await updateList();
}

let resetSessionRulesButton = document.getElementById("resetSessionRules") as HTMLButtonElement;
resetSessionRulesButton.onclick = async () => {
    resetSessionRules();
}