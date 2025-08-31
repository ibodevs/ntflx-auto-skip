// Document elements (checkboxes)
let recap, intro, next, still, all;
const OPTION_KEYS = ["recap", "intro", "next", "still"]; 
// Unified browser API (Firefox 'browser', Chromium 'chrome')
const api = (typeof browser !== "undefined") ? browser : (typeof chrome !== "undefined" ? chrome : null);

function getStorageSync() {
    return api && api.storage && api.storage.sync ? api.storage.sync : null;
}

/** 
 * Check if all options are checked or not and change 'all' checkbox value accordingly
 */
function checkAll() {
    if (!all) return;
    all.checked = OPTION_KEYS.every(k => {
        switch(k) {
            case "recap": return recap?.checked;
            case "intro": return intro?.checked;
            case "next": return next?.checked;
            case "still": return still?.checked;
            default: return false;
        }
    });
}

/**
 * Persist a single checkbox value in sync storage
 * @param {string} key storage key (and checkbox id)
 * @param {boolean} value checkbox state
 */
function save(key, value) {
    const sync = getStorageSync();
    if (!sync || !OPTION_KEYS.includes(key)) return;
    try { sync.set({ [key]: value }); } catch (_) {}
    checkAll();
}

/**
 * Save all options
 */
function saveAll() {
    const sync = getStorageSync();
    if (!sync) return;
    try {
        sync.set({
            recap: recap?.checked || false,
            intro: intro?.checked || false,
            next: next?.checked || false,
            still: still?.checked || false
        });
    } catch (_) {}
}

/**
 * Change all checkboxes values when All checkbox is clicked then save
 */
function setAll() {
    const target = all.checked;
    recap.checked = target;
    intro.checked = target;
    next.checked = target;
    still.checked = target;
    saveAll();
    checkAll();
}


/**
 * Restore options from storage
 * @param {string} id checkbox's id
 * @param {object} item checkbox object
 */
function restoreAll() {
    const sync = getStorageSync();
    if (!sync) { checkAll(); return; }
    try {
        sync.get(OPTION_KEYS, res => {
            if (res && typeof res === 'object') {
                recap.checked = Boolean(res.recap);
                intro.checked = Boolean(res.intro);
                next.checked = Boolean(res.next);
                still.checked = Boolean(res.still);
                checkAll();
            }
        });
    } catch (e) {
        if (typeof sync.get === 'function') {
            const maybePromise = sync.get(OPTION_KEYS);
            if (maybePromise && typeof maybePromise.then === 'function') {
                maybePromise.then(res => {
                    recap.checked = Boolean(res.recap);
                    intro.checked = Boolean(res.intro);
                    next.checked = Boolean(res.next);
                    still.checked = Boolean(res.still);
                    checkAll();
                }).catch(() => {});
            }
        }
    }
}

// Add click event listener to each checkbox to save new values 
function addEventListeners() {
    recap.addEventListener("click", () => save(recap.id, recap.checked));
    intro.addEventListener("click", () => save(intro.id, intro.checked));
    next.addEventListener("click", () => save(next.id, next.checked));
    still.addEventListener("click", () => save(still.id, still.checked));
    all.addEventListener("click", setAll);
}

// Get all objects, restore all options then add all the click listeners
function load() {
    recap = document.getElementById("recap");
    intro = document.getElementById("intro");
    next = document.getElementById("next");
    still = document.getElementById("still");
    all = document.getElementById("all");

    if (!(recap && intro && next && still && all)) return; 
    restoreAll();
    addEventListeners();
}

document.addEventListener("DOMContentLoaded", load);