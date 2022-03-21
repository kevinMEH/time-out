import { getRules, addSite, removeId, removeWorkers } from "../chrome.js";

let input = document.getElementById("addSite") as HTMLInputElement;

input.addEventListener("keyup", event => {
    if(event.key === "Enter" && input.value !== "") {
        console.log("Adding site: " + input.value);
        event.preventDefault();

        let site = input.value;
        site = site.trim();
        if(site) addSite(site);

        input.value = "";
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