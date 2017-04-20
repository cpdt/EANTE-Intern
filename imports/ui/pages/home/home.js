import { Shorts } from '/imports/api/shorts/shorts.js'
import { Meteor } from 'meteor/meteor'
import './home.html';

Template.App_body.onCreated(() => {
    Meteor.subscribe('shorts.mine');
});

Template.App_body.helpers({

});

Template.App_body.events({
    'submit .shortener-form'(event) {
        event.preventDefault();

        const target = event.target;

    }
});