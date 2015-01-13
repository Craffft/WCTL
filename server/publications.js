/**
 * Created by dennis.mayer on 06.11.2014.
 */
Meteor.publish('status', function() {
    return Status.find();
});
