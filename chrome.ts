import request = chrome.declarativeNetRequest;


async function updateRules(method: "remove", item: number): Promise<void>
async function updateRules(method: "add", item: request.Rule): Promise<void>
async function updateRules(method: "unblock", item: request.Rule): Promise<void>
async function updateRules(method: "remove" | "add" | "unblock", item ) {
    if(method === "remove") {
        await request.updateDynamicRules({ removeRuleIds: [ item ]});
    } else if(method === "add") {
        await request.updateDynamicRules({ addRules: [ item ]});
    } else if(method === "unblock") {
        await request.updateSessionRules({ addRules: [ item ]});
    } else throw new Error("Unknown update method.");
}


async function getRules(type: "dynamic" | "session" = "dynamic" ): Promise<request.Rule[]> {
    if(type === "dynamic") {
        return await request.getDynamicRules();
    } else if(type === "session") {
        return await request.getSessionRules();
    } else throw new Error("Unknown getRules rule type.");
}


async function getNextDynamicId(): Promise<number> {
    let rules = await getRules("dynamic");
    if(rules.length > 0) return rules[rules.length - 1].id + 1;
    return 1;
}

async function getNextSessionId(): Promise<number> {
    let rules = await getRules("session");
    if(rules.length > 0) return rules[rules.length - 1].id + 1;
    return 1;
}


async function addSite(site: string) {
    let nextId = await getNextDynamicId();
    let rule: request.Rule = {
        id: nextId,
        priority: 1,
        action: {
            type: request.RuleActionType.REDIRECT,
            redirect: { extensionPath: "/src/blocked.html" }
        },
        condition: {
            urlFilter: site,
            isUrlFilterCaseSensitive: false,
            resourceTypes: [ request.ResourceType.MAIN_FRAME ]
        },
    }
    await updateRules("add", rule);
}


async function tempUnblock(tabId: number) {
    let nextId = await getNextSessionId();
    let rule: request.Rule = {
        id: nextId,
        priority: 2,
        action: { type: request.RuleActionType.ALLOW_ALL_REQUESTS },
        condition: {
            tabIds: [ tabId ],
            urlFilter: "*://*/*",
            resourceTypes: [ request.ResourceType.MAIN_FRAME ]
        }
    }
    await updateRules("unblock", rule);
}


async function removeId(id: number) {
    let rules = await getRules();
    for(let rule of rules) {
        if(rule.id === id) {
            await updateRules("remove", id);
            return;
        }
    }
    console.log("Rule id not found: " + id);
}


// TODO: Debug purposes only. Remove during final build.
async function resetSessionRules() {
    let rules = await getRules("session");
    let ids = [];
    for(let rule of rules) {
        ids.push(rule.id);
    }
    await request.updateSessionRules({ removeRuleIds: ids });
}


// It is necessary to remove service workers for certain
// websites such as YouTube or Twitter to actually block the
// website, otherwise it will load up the website along with
// the service workers instead. Weird quirk with the
// declarativeNetRequest API.
async function removeWorkers(site: string) {
    // Making site just the stub
    site = site.replace("https://", "");
    site = site.replace("www.", "");

    // Removing the www. version as well because some sites
    // like www.youtube.com are not cleared correctly by just
    // clearing youtube.com. Just for user convenience.
    let wwwsite = "https://www." + site;
    site = "https://" + site;

    // According to the docs, the following should return a Promise.
    await chrome.browsingData.removeServiceWorkers({
        origins: [ site, wwwsite ]
    });
}



export { getRules, addSite, tempUnblock, removeId, resetSessionRules, removeWorkers };