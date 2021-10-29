const DATA_PLAYER = "[data-uia=player]";
const DATA_RECAP = "[data-uia=player-skip-recap]";

let ntflx_player, ntflx_player_obs;

// Click a button if exists
let ntflx_item_click = function(ntflx_item, data) {
    ntflx_item = $(data);
    if (ntflx_item) {
        console.log(ntflx_item.dataset.uia, "exists and trigger click");
        ntflx_item.click();
    } 
}

let ntflx_skip = () => {
    let recap, intro, next;

    ntflx_player_obs = new MutationObserver(function (mutationRecord) {
        // With my options, mutationRecord.length should always be = to 1
        mutationRecord.forEach(() => {
            ntflx_item_click(recap, DATA_RECAP);
        });
    });

    let ntflx_player_obs_options = {
        childList: true,
        attributes: false
    };

    ntflx_player_obs.observe(ntflx_player, ntflx_player_obs_options);
};

// The player usually takes some times to load, like 2 seconds
let loadplayer = setInterval(() => {
    ntflx_player = $(DATA_PLAYER);
    if (ntflx_player) {
        console.log("player exists");
        clearInterval(loadplayer);
        ntflx_skip();
    }
}, 1000);
 
// TODO : ntflx_player_obs.disconnect(); 
// Might never disconnect as one can watch several episodes without having the page to reload, and there are buttons in the beginning as well at the end of each episodes.