import { getRules, addSite, removeId, removeWorkers } from "../chrome.js";

let addSiteInput = document.getElementById("addSite") as HTMLInputElement;

addSiteInput.addEventListener("keyup", event => {
    if(event.key === "Enter" && addSiteInput.value !== "") {
        console.log("Adding site: " + addSiteInput.value);
        event.preventDefault();

        let site = addSiteInput.value;
        site = site.trim();
        if(site) {
            addSite(site);
            removeWorkers(site);
        }

        addSiteInput.value = "";
    }
})


let debug = document.getElementById("debug") as HTMLButtonElement;

debug.onclick = async () => {
    let rules = await getRules();
    for(let rule of rules) {
        console.log(rule);
    }
}

let reset = document.getElementById("reset") as HTMLButtonElement;

reset.onclick = async () => {
    let rules = await getRules();
    for(let rule of rules) await removeId(rule.id);
}

let removeWorkersInput = document.getElementById("removeWorkers") as HTMLInputElement;

removeWorkersInput.addEventListener("keyup", event => {
    if(event.key === "Enter" && removeWorkersInput.value !== "") {
        event.preventDefault();
        
        let site = removeWorkersInput.value;
        site = site.trim();
        if(site) removeWorkers(site);
        
        removeWorkersInput.value = "";
    }
})