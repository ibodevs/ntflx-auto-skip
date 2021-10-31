const DATA_VIDEO = "[data-uia=watch-video]";
const DATA_PLAYER = "[data-uia=player]";
const DATA_RECAP = "[data-uia=player-skip-recap]";
const DATA_INTRO = "[data-uia=player-skip-intro]";
const DATA_NEXT = "[data-uia=next-episode-seamless-button]";
const DATA_NEXT_DRAINING = "[data-uia=next-episode-seamless-button-draining]";
const DATA_STILL = "[data-uia=interrupt-autoplay-continue]";

let ntflx_player, ntflx_player_obs, ntflx_video, ntflx_video_obs;
let ntflx_obs_options = { childList: true };

// Check if user chose to skip 
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

// Click a button if exists and user chose to skip 
async function ntflx_item_click(data) {
    let ntflx_item = document.querySelector(data);
    if (ntflx_item) {
        let res = await optionChecked(data);
        if (res) {
            ntflx_item.click();
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
    ntflx_player_obs = new MutationObserver(() => { try_click(); });

    // in case a button loaded with the player (so no mutation is observed in this case)
    try_click();
    ntflx_player_obs.observe(ntflx_player, ntflx_obs_options);
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