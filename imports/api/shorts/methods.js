import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Shorts } from './shorts.js'

Meteor.methods({
    'shorts.insert'(long, short) {
        check(long, String);
        check(short, String);

        Shorts.insert({
            long,
            short,
            clicks: 0,
            creator: Meteor.userId() || 0,
            createdAt: new Date()
        });
    },

    'shorts.track'(id) {
        check(id, String);

        Shorts.update(id, {
            $inc: { clicks: 1 }
        });
    }
});