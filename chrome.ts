import request = chrome.declarativeNetRequest;


async function updateRules(method: "remove", item: number): Promise<void>
async function updateRules(method: "add", item: request.Rule): Promise<void>
async function updateRules(method: "remove" | "add", item ) {
    if(method === "remove") {
        await request.updateDynamicRules({ removeRuleIds: [ item ]});
    } else if(method === "add") {
        await request.updateDynamicRules({ addRules: [ item ]})
    } else throw new Error("Unknown update method.");
}


async function getRules(): Promise<request.Rule[]> {
    return await request.getDynamicRules();
}


async function getNextId(): Promise<number> {
    let rules = await getRules();
    if(rules.length > 0) return rules[rules.length - 1].id + 1;
    else return 1;
}


async function addSite(site: string) {
    let nextId = await getNextId();
    let rule: request.Rule = {
        action: {
            type: request.RuleActionType.REDIRECT,
            redirect: { extensionPath: "/src/blocked.html" }
        },
        condition: {
            urlFilter: site,
            isUrlFilterCaseSensitive: false,
            resourceTypes: [ request.ResourceType.MAIN_FRAME ]
        },
        id: nextId,
        priority: 1,
    }
    await updateRules("add", rule);
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



export { getRules, addSite, removeId, removeWorkers };