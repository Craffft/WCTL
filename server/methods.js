/**
 * Created by Dennis.Mayer on 11.11.2014.
 */

Meteor.methods({
    insert: function(status) {
        console.log('inserting', status);
        Status.insert({
            status: status,
            timestamp: new Date()
        });
    }
});