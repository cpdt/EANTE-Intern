import { Shorts } from '/imports/api/shorts/shorts.js'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router';

import './redirect.js'
import './short.html'

Template.App_short.onCreated(function() {
    Meteor.subscribe('shorts.all');

    /*setTimeout(() => {
        FlowRouter.go('/');
    }, 2000);*/
});

Template.App_short.helpers({
    init(path) {
        /*const found = Shorts.findOne({
            short: path
        });
        if (found === null) return;

        console.log('Calling');
        Meteor.call('shorts.track', found._id);*/

        /*setTimeout(() => {
            window.location = found.long;
        }, 1000);*/
    }
});

Template.short_redirect.onRendered(function() {
    let tries = 0;

    // a horrible solution to a silly problem, but it works
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