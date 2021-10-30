const DATA_VIDEO = "[data-uia=watch-video]";
const DATA_PLAYER = "[data-uia=player]";
const DATA_RECAP = "[data-uia=player-skip-recap]";
const DATA_INTRO = "[data-uia=player-skip-intro]";
const DATA_NEXT = "[data-uia=next-episode-seamless-button]";
const DATA_NEXT_DRAINING = "[data-uia=next-episode-seamless-button-draining]";
const DATA_STILL = "[data-uia=interrupt-autoplay-continue]";

console.log("Start ext NTFLX_AUTO_SKIP");

let ntflx_player, ntflx_player_obs, ntflx_video, ntflx_video_obs;
let ntflx_obs_options = { childList: true };

// Click a button if exists | TODO make it a boolean?
let ntflx_item_click = function(data) {
    let ntflx_item = document.querySelector(data);
    if (ntflx_item) {
        console.log(ntflx_item.dataset.uia, "exists and trigger click");
        ntflx_item.click();
    } 
}

// Tries to click any button
let try_click = function() {
    ntflx_item_click(DATA_RECAP);
    ntflx_item_click(DATA_INTRO);
    ntflx_item_click(DATA_NEXT);
    ntflx_item_click(DATA_NEXT_DRAINING);
    ntflx_item_click(DATA_STILL);
}

let ntflx_skip = () => {
    // Try to click a button if exists when a node is added to the player  
    ntflx_player_obs = new MutationObserver(() => { try_click(); });

    // in case a button loaded with the player (so no mutation is observed in this case)
    try_click();
    ntflx_player_obs.observe(ntflx_player, ntflx_obs_options);
};

// The player usually takes some times to load, like 2 seconds on my end
let loadplayer = () => { 
    ntflx_player = document.querySelector(DATA_PLAYER);
    if (ntflx_player) {
        console.log("player exists");
        ntflx_skip();
    } else {
        setTimeout(loadplayer, 1000);
    }
};

let firstload = true;

let loadvideo = () => {
    console.log("START LOADVIDEO INTERVAL");
    ntflx_video = document.querySelector(DATA_VIDEO);
    if (ntflx_video) {
        console.log("watch-video ready");
        ntflx_video_obs = new MutationObserver(() => {
            console.log("WATCH-VIDEO MUTATION");
            ntflx_player = document.querySelector(DATA_PLAYER);
            if (!ntflx_player) {
                if (ntflx_player_obs) {
                    console.log("disconnect");
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
};

loadvideo();