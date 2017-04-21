import { Shorts } from '/imports/api/shorts/shorts.js'
import { Meteor } from 'meteor/meteor'
import { ReactiveDict } from 'meteor/reactive-dict';

import './home.html';

function generateUrl() {
    /*let url;
    do {
        url = '';
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (let i = 0; i < 8; i++) { // todo: put 6 into config
            url += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    } while ()
    return url;*/

    // fetch most recent insert
    //let recent = Shorts.findOne({}, { sort: { $natural: -1 } });
    //let recent = Shorts.find({}).sort({ $natural: -1 }).limit(1);
    //let lastNumber = recent.length ? atob(recent[0].short) : 0;
    let recent = Shorts.findOne({}, { sort: { createdAt: -1 } });
    console.log(recent);
    let lastNumber = recent === undefined ? 0 : parseInt(atob(recent.short), 36);
    return btoa((lastNumber + 1).toString(36)).replace(/=/g, '');
}

Template.App_home.onCreated(function() {
    Meteor.subscribe('shorts.all');

    this.state = new ReactiveDict();

    // generate 6-character short URL
    //this.state.set('shortBit', generateUrl());
    this.state.set('isSubmitted', false);
});

Template.App_home.helpers({
    root: Meteor.absoluteUrl(),
    shortBit() {
        //return Template.instance().state.get('shortBit');
        return generateUrl();
    },
    oldShortBit() {
        return Template.instance().state.get('oldShortBit');
    },
    isSubmitted() {
        return Template.instance().state.get('isSubmitted');
    }
});

Template.App_home.events({
    'submit .shortener-form'(event) {
        event.preventDefault();

        const target = event.target;
        //const long = target.long.value;
        //const short = target.short.value || Template.instance().state.get('shortBit');
        const long = target.long;
        const short = target.short;

        const instance = Template.instance();
        const shortUrl = short ? short.value : generateUrl();

        Meteor.call('shorts.insert', long.value, shortUrl, error => {
            if (error) alert(error.error);
            else {
                long.value = '';
                //instance.state.set('shortBit', generateUrl());
                instance.state.set('oldShortBit', shortUrl);
                instance.state.set('isSubmitted', true);
            }
        });
    },
    'click #again-btn'(event) {
        Template.instance().state.set('isSubmitted', false);
    }
});