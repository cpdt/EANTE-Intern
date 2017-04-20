import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Shorts } from './shorts.js'

Meteor.methods({
    'shorts.insert'(long, short) {
        check(long, String);
        check(short, String);

        // todo
    }
});