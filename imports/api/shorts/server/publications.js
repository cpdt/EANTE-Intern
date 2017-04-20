import { Meteor } from 'meteor/meteor';
import { Shorts } from '../shorts.js'

Meteor.publish('shorts.mine', function() {
    return Shorts.find();
});