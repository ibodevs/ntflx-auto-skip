const DATA_VIDEO = "[data-uia=watch-video]";
const DATA_PLAYER = "[data-uia=player]";
const DATA_RECAP = "[data-uia=player-skip-recap]";
const DATA_INTRO = "[data-uia=player-skip-intro]";
const DATA_NEXT = "[data-uia=next-episode-seamless-button]";
const DATA_NEXT_DRAINING = "[data-uia=next-episode-seamless-button-draining]";
const DATA_STILL = "[data-uia=interrupt-autoplay-continue]";

let ntflx_player, ntflx_player_obs, ntflx_video, ntflx_video_obs;
let ntflx_obs_options = {
    childList: true
};
let msg_container;

function init_msg_container() {
    msg_container = document.createElement("p");
    msg_container.style.cssText = "position: absolute; bottom: 14vh; right: 2vw; color: #e50914; font-size: 2rem; z-index: 1; visibility: hidden;";
    ntflx_video.appendChild(msg_container);
}

// Notifies the user when the app skips something
function notify(msg) {
    msg_container.textContent = "Skipped " + msg;
    msg_container.style.visibility = "visible";
    setTimeout(() => {
        msg_container.style.visibility = "hidden";
    }, 2000);
}

// Checks if user chose to skip 
async function optionChecked(data) {
    let option;
    switch (data) {
        case DATA_RECAP:
            await browser.storage.sync.get("recap")
                .then(res => {
                    option = res.recap || false;
                });
            break;
        case DATA_INTRO:
            await browser.storage.sync.get("intro")
                .then(res => {
                    option = res.intro || false;
                });
            break;
        case DATA_NEXT:
        case DATA_NEXT_DRAINING:
            await browser.storage.sync.get("next")
                .then(res => {
                    option = res.next || false;
                });
            break;
        case DATA_STILL:
            await browser.storage.sync.get("still")
                .then(res => {
                    option = res.still || false;
                });
            break;
        default:
            option = false;
    }
    return option;
}

// Clicks a button if exists and user chose to skip 
// Notifies the user when a skip occures
async function ntflx_item_click(data) {
    let res = await optionChecked(data);
    if (res) {
        /* could ntflx_player.childNodes[1], 
        but in case they change the structure, 
        let's check everywhere inside player */
        let ntflx_item = ntflx_player.querySelector(data);
        if (ntflx_item) {
            ntflx_item.click();
            switch (data) {
                case DATA_RECAP:
                    notify("the recap");
                    break;
                case DATA_INTRO:
                    notify("the intro");
                    break;
                case DATA_NEXT:
                case DATA_NEXT_DRAINING:
                    notify("to the next episode");
                    break;
                case DATA_STILL:
                    notify("the \"Are you still watching?\" message");
                    break;
                default:
            }
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
    // Try to click a button if exists when a node is added to the player 
    // or class attr changes (usually passive, active or inactive)
    // No need to check each mutation if list. Try click once for all
    ntflx_player_obs = new MutationObserver(() => {
        if (ntflx_player.childElementCount > 1) {
            try_click();
        }
    });
    // with childList option, it works well only when user afk 
    // so observing class attr solves the issue of active users (because passive <-> in.active) 
    ntflx_player_obs.observe(ntflx_player, {
        childList: true,
        attributeFilter: ["class"]
    });
}

// The player usually takes some times to load, like 2 seconds on my end
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
                // in case player already instantiated before setting a mutationObs on it
                loadplayer();
                firstload = false;
            }
        });

        ntflx_video_obs.observe(ntflx_video, ntflx_obs_options);
    } else {
        setTimeout(loadvideo, 100);
    }
}

loadvideo();