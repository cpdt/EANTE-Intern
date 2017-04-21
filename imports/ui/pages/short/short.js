import { Shorts } from '/imports/api/shorts/shorts.js'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router';

import './redirect.js'
import './short.html'

Template.App_short.onCreated(function() {
    Meteor.subscribe('shorts.all');
});

Template.short_redirect.onRendered(function() {
    let tries = 0;

    // a horrible solution to a silly problem, but it works:
    // try 10 times (every 100ms) to get the link from the database.
    // if nothing found after 1 second, go back to home page.
    // else track the click and go to the page

    // this should be done server-side (then 403 redirect), but meteor seems
    // to make this difficult or impossible
    let interval = setInterval(() => {
        const found = Shorts.findOne({
            short: this.data.path
        });
        if (found === undefined) {
            tries++;
            if (tries > 10) {
                clearInterval(interval);
                FlowRouter.go('/');
            }
            return;
        }

        clearInterval(interval);

        Meteor.call('shorts.track', found._id);
        // seem to get duplicate clicks without this
        setTimeout(() => {
            window.location = found.long;
        }, 100);
    }, 100);
});