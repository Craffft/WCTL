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
var timeout;

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

            var userId = this.userId;
            Status.insert({
                status: nextStatus,
                timestamp: new Date(),
                userId: userId
            });

            if(nextStatus === Status.YELLOW) {
                timeout = Meteor.setTimeout(function() {
                    Status.insert({
                        status: Status.RED,
                        timestamp: new Date(),
                        userId: userId
                    });
                }, 20000);
            }
        } else {
            console.log('Not logged in!');
        }
    }
});