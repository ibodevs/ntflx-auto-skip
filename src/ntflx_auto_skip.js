const DATA_VIDEO = "[data-uia=watch-video]";
const DATA_PLAYER = "[data-uia=player]";
const DATA_RECAP = "[data-uia=player-skip-recap]";
const DATA_INTRO = "[data-uia=player-skip-intro]";
const DATA_NEXT = "[data-uia=next-episode-seamless-button]";
const DATA_NEXT_DRAINING = "[data-uia=next-episode-seamless-button-draining]";
const DATA_STILL = "[data-uia=interrupt-autoplay-continue]";

const SELECTOR_CONFIG = {
    [DATA_RECAP]: { key: "recap", msg: "the recap" },
    [DATA_INTRO]: { key: "the intro".replace("the ", "intro") && "intro", msg: "the intro" }, 
    [DATA_NEXT]: { key: "next", msg: "to the next episode" },
    [DATA_NEXT_DRAINING]: { key: "next", msg: "to the next episode" },
    [DATA_STILL]: { key: "still", msg: "the \"Are you still watching?\" message" }
};

let ntflx_player, ntflx_player_obs, ntflx_video, ntflx_video_obs;
const ntflx_obs_options = { childList: true };
let msg_container;
let notifyTimeoutId = null; 

// Unified storage getter (Firefox WebExtension API or Chrome fallback) returning a Promise
function storageGet(keys) {
    return new Promise(resolve => {
        if (typeof browser !== "undefined" && browser.storage && browser.storage.sync) {
            browser.storage.sync.get(keys).then(resolve).catch(() => resolve({}));
        } else if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
            try {
                chrome.storage.sync.get(keys, resolve);
            } catch (_) {
                resolve({});
            }
        } else {
            resolve({});
        }
    });
}

function init_msg_container() {
    msg_container = document.createElement("p");
    msg_container.style.cssText = "position: absolute; bottom: 14vh; right: 2vw; color: #e50914; font-size: 2rem; z-index: 1; visibility: hidden;";
    ntflx_video.appendChild(msg_container);
}

// Notifies the user when the app skips something
function notify(msg) {
    msg_container.textContent = "Skipped " + msg;
    msg_container.style.visibility = "visible";
    if (notifyTimeoutId) {
        clearTimeout(notifyTimeoutId);
    }
    notifyTimeoutId = setTimeout(() => {
        msg_container.style.visibility = "hidden";
        notifyTimeoutId = null;
    }, 2000);
}

// Checks if user chose to skip 
async function optionChecked(data) {
    const cfg = SELECTOR_CONFIG[data];
    if (!cfg) return false;
    const res = await storageGet(cfg.key);
    return Boolean(res[cfg.key]);
}

// Clicks a button if present and user enabled that option
// Notifies the user when a skip occurs
async function ntflx_item_click(data) {
    let res = await optionChecked(data);
    if (res) {
        /* Could use ntflx_player.childNodes[1], but in case they change the structure,
           we query inside the whole player subtree. */
        let ntflx_item = ntflx_player.querySelector(data);
        if (ntflx_item) {
            ntflx_item.click();
            const cfg = SELECTOR_CONFIG[data];
            if (cfg) notify(cfg.msg);
        }
    }
}

// Tries to click any button
function try_click() {
    ntflx_item_click(DATA_RECAP);
    ntflx_item_click(DATA_INTRO);
    ntflx_item_click(DATA_NEXT);
    ntflx_item_click(DATA_NEXT_DRAINING);
    ntflx_item_click(DATA_STILL);
}

function ntflx_skip() {
    // Try to click when nodes are added or class attribute changes (passive <-> active <-> inactive)
    ntflx_player_obs = new MutationObserver(() => {
        if (ntflx_player.childElementCount > 1) {
            try_click();
        }
    });
    ntflx_player_obs.observe(ntflx_player, { childList: true, attributeFilter: ["class"] });
}

// The player usually takes some time to load, like ±2 seconds in tests
function loadplayer() {
    ntflx_player = document.querySelector(DATA_PLAYER);
    if (ntflx_player) {
        ntflx_skip();
    } else {
        setTimeout(loadplayer, 1000);
    }
}

let firstload = true;

function loadvideo() {
    ntflx_video = document.querySelector(DATA_VIDEO);
    if (ntflx_video) {
        init_msg_container();
        ntflx_video_obs = new MutationObserver(() => {
            ntflx_player = document.querySelector(DATA_PLAYER);
            if (!ntflx_player) {
                if (ntflx_player_obs) {
                    ntflx_player_obs.disconnect();
                    ntflx_player_obs = null;
                }
                loadplayer();
            } else if (ntflx_player && firstload) {
                // In case player already instantiated before setting the observer on it
                loadplayer();
                firstload = false;
            }
        });

        ntflx_video_obs.observe(ntflx_video, ntflx_obs_options);
    } else {
        setTimeout(loadvideo, 100);
    }
}

function loadwatch() {
    if (window.location.href.indexOf("netflix.com/watch/") > -1) {
        loadvideo();
    } else {
        setTimeout(loadwatch, 500);
    }
}

loadwatch();
