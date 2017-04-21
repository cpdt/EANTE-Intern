import { Shorts } from './shorts.js';

function btoa(str) {
    return new Buffer(str).toString('base64');
}

function atob(b64encoded) {
    return new Buffer(b64encoded, 'base64').toString();
}

export function generateUrl() {
    // default links are base64-encoded base-36 numbers to avoid obvious
    // incrementing but give short and normally-unique urls.
    // the number is simply incremented from the most recent entry

    // find most recent link made by a guest (so guaranteed to be generated
    // via this method)
    let recent = Shorts.findOne({ creator: 0 }, { sort: { createdAt: -1 } });
    let lastNumber = recent === undefined ? 0 : parseInt(atob(recent.short), 36);

    // keep incrementing until we have a unique url
    let currentUrl;
    do {
        lastNumber++;
        currentUrl = btoa((lastNumber).toString(36)).replace(/=/g, '');
    } while (Shorts.findOne({ short: currentUrl }));
    return currentUrl;
}