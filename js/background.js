const Manifest = chrome.runtime.getManifest()

// WHEN CLICKING ON EXTENSION ICON OPEN THE SETTINGS PAGE
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ active: true, url: chrome.runtime.getURL('settings.html') });
});

// REGISTER AN ALARM FOR DAILY UPDATE CHECK
chrome.alarms.create("PolyPlus-UpdateCheck", {
    periodInMinutes: 24 * 60,
    when: Date.now() + (12 - new Date().getHours()) * 60 * 60 * 1000,
});

// HANDLE ALARMS FIRING
chrome.alarms.onAlarm.addListener(function(alarm){
    if (alarm.name === 'PolyPlus-UpdateCheck') {
        fetch('https://polyplus.vercel.app/data/version.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network not ok')
                }
                return response.json()
            })
            .then(data => {
                if (data.version > Manifest.version) {
                    console.log('Update available')
                    chrome.notifications.create({
                        type: "basic",
                        iconUrl: chrome.runtime.getURL("icon.png"),
                        title: "New Update Available",
                        message: "A new update is available for Poly+!",
                    })
                }
            })
            .catch(error => {console.log(error)})
    }
});

// COPY ASSET ID CONTEXT MENU ITEM REGISTRATION
chrome.contextMenus.create({
    title: 'Copy Asset ID',
    id: 'PolyPlus-CopyID',
    contexts: ['link'],
    documentUrlPatterns: ['https://polytoria.com/*'],
    targetUrlPatterns: [
        "https://polytoria.com/places/**",
        "https://polytoria.com/users/**",
        "https://polytoria.com/store/**"
    ]
});

// COPY AVATAR HASH CONTEXT MENU ITEM REGISTRATION
chrome.contextMenus.create({
    title: 'Copy Avatar Hash',
    id: 'PolyPlus-CopyAvatarHash',
    contexts: ['image'],
    documentUrlPatterns: ['https://polytoria.com/*'],
    targetUrlPatterns: [
        "https://c0.ptacdn.com/thumbnails/avatars/**",
        "https://c0.ptacdn.com/thumbnails/avatars/**"
    ]
});

// HANDLE CONTEXT MENU ITEMS
chrome.contextMenus.onClicked.addListener(function (info, tab){
    chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon.png"),
        title: "New Update Available",
        message: "A new update is available for Poly+!",
    }, function(id) {
        console.log(id)
    })

    if (info.menuItemId === 'PolyPlus-CopyID') {
        let ID = parseInt(info.linkUrl.split('/')[4])
        chrome.scripting
            .executeScript({
                target: {tabId: tab.id},
                func: CopyAssetID,
                args: [ID]
            })
            .then(() => console.log("Copied ID!"));
    }

    if (info.menuItemId === 'PolyPlus-CopyAvatarHash') {
        let Hash = new URL(info.srcUrl).pathname.split('/')[3].replace('-icon', '').replace('.png', '')
        chrome.scripting
            .executeScript({
                target: {tabId: tab.id},
                func: CopyAvatarHash,
                args: [Hash]
            })
            .then(() => console.log("Copied ID!"));
    }
});

function CopyAssetID(id) {
    navigator.clipboard
        .writeText(id)
        .then(() => {
            alert('Successfully copied ID!')
        })
        .catch(() => {
            alert('Failure to copy ID.')
        });
}

function CopyAvatarHash(hash) {
    navigator.clipboard
        .writeText(hash)
        .then(() => {
            alert('Successfully copied avatar hash!')
        })
        .catch(() => {
            alert('Failure to copy avatar hash.')
        });
}