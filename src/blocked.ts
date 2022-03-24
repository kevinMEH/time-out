import { tempUnblock } from "../chrome.js";


let unblockButton = document.getElementById("unblockButton") as HTMLButtonElement;
unblockButton.onclick = async () => {
    let [ tab ] = await chrome.tabs.query({ active: true, currentWindow: true });
    tempUnblock(tab.id);
}