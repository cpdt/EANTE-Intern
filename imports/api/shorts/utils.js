import { Shorts } from './shorts.js';

function btoa(str) {
    return new Buffer(str).toString('base64');
}

function atob(b64encoded) {
    return new Buffer(b64encoded, 'base64').toString();
}

export function generateUrl() {
    let recent = Shorts.findOne({ creator: 0 }, { sort: { createdAt: -1 } });
    let lastNumber = recent === undefined ? 0 : parseInt(atob(recent.short), 36);
    let currentUrl;
    do {
        lastNumber++;
        currentUrl = btoa((lastNumber).toString(36)).replace(/=/g, '');
    } while (Shorts.findOne({ short: currentUrl }));
    return currentUrl;
}