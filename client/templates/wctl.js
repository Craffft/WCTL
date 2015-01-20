/**
 * Created by Dennis.Mayer on 11.11.2014.
 */


(function() {
    Meteor.subscribe('status');

    function getStatus() {
        return Status.findOne({}, {sort: {timestamp: -1}});
    }

    Template.wctl.helpers({
        currentUser: function() {
            return getStatus().username;
        },
        isGreen: function() {
            return getStatus().status === Status.GREEN;
        },
        statusCount: function() {
            return Status.find().count() > 0;
        },
        getClass: function(status) {
            if(status === getStatus().status) {
                if(status === Status.YELLOW) {
                    return 'blink';
                } else {
                    return 'active';
                }
            }
        }
    });

    Template.wctl.events({
        'click #wrapper': function() {
            Meteor.call('changeStatus');
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
})();
