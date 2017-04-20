import { Meteor } from 'meteor/meteor';
import { Shorts } from '../shorts.js'

Meteor.publish('shorts.all', function() {
    return Shorts.find();
});