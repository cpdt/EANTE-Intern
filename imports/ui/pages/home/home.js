import { Shorts } from '/imports/api/shorts/shorts.js'
import { Meteor } from 'meteor/meteor'
import { ReactiveDict } from 'meteor/reactive-dict';

import './home.html';

function generateUrl() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let url = '';
    for (let i = 0; i < 8; i++) { // todo: put 6 into config
        url += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return url;
}

Template.App_home.onCreated(function() {
    Meteor.subscribe('shorts.mine');

    this.state = new ReactiveDict();

    // generate 6-character short URL
    this.state.set('shortBit', generateUrl());
    this.state.set('isSubmitted', false);
});

Template.App_home.helpers({
    root: Meteor.absoluteUrl(),
    shortBit() {
        return Template.instance().state.get('shortBit');
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
        const shortUrl = short ? short.value : instance.state.get('shortBit');

        Meteor.call('shorts.insert', long.value, shortUrl, error => {
            if (error) alert(error.error);
            else {
                long.value = '';
                instance.state.set('shortBit', generateUrl());
                instance.state.set('isSubmitted', true);
            }
        });
    }
});