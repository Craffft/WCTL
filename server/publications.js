/**
 * Created by dennis.mayer on 06.11.2014.
 */
Meteor.publish('status', function() {
    return Status.find({}, {sort: {timestamp: -1}, limit: 1});
});
