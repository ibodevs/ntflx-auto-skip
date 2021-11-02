// Document Objects
let recap, intro, next, still, all;

/** 
 * Check if all options are checked or not and change 'all' checkbox value accordingly
 */
function checkAll() {
    if (recap.checked && intro.checked && next.checked && still.checked) {
        all.checked = true;
    } else {
        all.checked = false;
    }
}

/**
 * Save a checkbox value in storage
 * @param {string} id checkbox's id, which is the same as their name 
 * @param {boolean} checkbox checkbox.checked value
 */
function save(id, value) {
    switch(id) {
        case "recap":
            chrome.storage.sync.set({recap: value});
            break;
        case "intro":
            chrome.storage.sync.set({intro: value});
            break;
        case "next":
            chrome.storage.sync.set({next: value});
            break;
        case "still":
            chrome.storage.sync.set({still: value});
            break;
        default:
    }
    checkAll();
}

/**
 * Save all options
 */
function saveAll() {
    chrome.storage.sync.set({
        recap: recap.checked,
        intro: intro.checked,
        next: next.checked,
        still: still.checked
    });
}

/**
 * Change all checkboxes values when All checkbox is clicked then save
 */
function setAll() {
    if (all.checked) {
        recap.checked = true;
        intro.checked = true;
        next.checked = true;
        still.checked = true;
    } else {
        recap.checked = false;
        intro.checked = false;
        next.checked = false;
        still.checked = false;
    }
    saveAll();
}


/**
 * Restore options from storage
 * @param {string} id checkbox's id
 * @param {object} item checkbox object
 */
function restore(id, item) {
    chrome.storage.sync.get(id)
    .then((res) => {
        switch(id) {
            case "recap":
                item.checked = res.recap || false;
                break;
            case "intro":
                item.checked = res.intro || false;
                break;
            case "next":
                item.checked = res.next || false;
                break;
            case "still":
                item.checked = res.still || false;
                break;
            default:
        }
        // as it's a promise, should check each time if all checkboxes have the same value
        checkAll();
    })
}

// Restoring each option
function restoreAll() {
    restore("recap", recap);
    restore("intro", intro);
    restore("next", next);
    restore("still", still);
}

// Add click event listener to each checkbox to save new values 
function addEventListeners() {
    recap.addEventListener("click", () => { save(recap.id, recap.checked); });
    intro.addEventListener("click", () => { save(intro.id, intro.checked); });
    next.addEventListener("click", () => { save(next.id, next.checked); });
    still.addEventListener("click", () => { save(still.id, still.checked); });
    all.addEventListener("click", () => { setAll(); });
}

// Get all objects, restore all options then add all the click listeners
function load() {
    recap = document.getElementById("recap");
    intro = document.getElementById("intro");
    next = document.getElementById("next");
    still = document.getElementById("still");
    all = document.getElementById("all");

    restoreAll();
    addEventListeners();
}

document.addEventListener("DOMContentLoaded", load);