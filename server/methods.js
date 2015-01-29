/**
 * Created by Dennis.Mayer on 11.11.2014.
 */

//Reset Status on server restart
Status.remove({});
Status.insert({
    status: 'green',
    timestamp: new Date()
});

function getStatus() {
    return Status.findOne({}, {sort: {timestamp: -1}});
}

function insertStatus(status, user) {
    Status.insert({
        status: status,
        timestamp: new Date(),
        userId: user._id,
        username: user.username
    });
}

var timeout;
var TIMEOUT_SECONDS = 20;

Meteor.methods({
    changeStatus: function() {
        if(Meteor.user()) {
            var status = getStatus();
            var nextStatus = '';

            if(status.status === Status.GREEN) {
                nextStatus = Status.YELLOW;
            } else if(status.userId !== this.userId){
                console.log('Current status not from current user!');
                return;
            } else {
                nextStatus = Status.GREEN;
            }

            if(status.status === Status.YELLOW && timeout) {
                Meteor.clearTimeout(timeout);
            }

            var user = Meteor.user();
            insertStatus(nextStatus, user);

            if(nextStatus === Status.YELLOW) {
                timeout = Meteor.setTimeout(function() {
                    insertStatus(Status.RED, user);
                }, 1000 * TIMEOUT_SECONDS);
            }
        } else {
            console.log('Not logged in!');
        }
    },
    forceGreen: function() {
        console.log("force green");
        if(Meteor.user()) {
            var status = getStatus();
            var nextStatus = '';

            if(status.status === Status.RED) {
                nextStatus = Status.GREEN;
            } 

            var user = Meteor.user();
            insertStatus(nextStatus, user);
        }   
    }
});