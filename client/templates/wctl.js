/**
 * Created by Dennis.Mayer on 11.11.2014.
 */


(function() {
    Meteor.subscribe('status', function() {
        if(!Status.find().count()) {
            insert(Status.GREEN);
        }
    });

    function getStatus() {
        return Status.findOne({}, {sort: {timestamp: -1}}).status;
    }

    function insert(status) {
        Meteor.call('insert', status);
    }

    function timeoutChange(seconds, targetStatus, callback) {
        Session.set('timeout', setTimeout(function() {
            insert(targetStatus);
            if(callback) {
                callback();
            }
        }, 1000 * seconds));
    }

    function clearChangeTimeout(template) {
        var timeout = Session.get('timeout');
        if(timeout) {
            clearTimeout(timeout);
        }
    }

    function updateStatus() {
        var status = getStatus();

        if(status === Status.GREEN) {
            insert(Status.YELLOW);
            timeoutChange(10, Status.RED, function() {
                timeoutChange(10, Status.GREEN);
            });
        }
    }

    Template.wctl.helpers({
        statusCount: function() {
            return Status.find().count() > 0;
        },
        getClass: function(status) {
            if(status === getStatus()) {
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
            updateStatus();
        }
    });
})();
