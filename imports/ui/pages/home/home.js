import { Shorts } from '/imports/api/shorts/shorts.js'
import { Meteor } from 'meteor/meteor'
import { ReactiveDict } from 'meteor/reactive-dict';
import { generateUrl } from '/imports/api/shorts/utils.js'

import './home.html';

Template.App_home.onCreated(function() {
    Meteor.subscribe('shorts.all');

    this.state = new ReactiveDict();

    // generate 6-character short URL
    //this.state.set('shortBit', generateUrl());
    this.state.set('error', "");
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
    },
    error() {
        return Template.instance().state.get('error');
    },
    myLinks() {
        return Shorts.find({ creator: Meteor.userId() });
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
            if (error) {
                instance.state.set('error', error.message);
            } else {
                long.value = '';
                instance.state.set('error', "");
                instance.state.set('oldShortBit', shortUrl);
                instance.state.set('isSubmitted', true);
            }
        });
    },
    'click #again-btn'(event) {
        Template.instance().state.set('isSubmitted', false);
    },
    'click #clipboard-copy'(event) {
        const copyElement = document.querySelector('#clipboard-source');
        copyElement.select();

        try {
            if (!document.execCommand('copy')) alert("Couldn't copy to clipboard");
        } catch (err) {
            alert("Couldn't copy to clipboard");
        }
    }
});