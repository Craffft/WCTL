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

    function timeoutChange(template, seconds, targetStatus, callback) {
        template.timeout = setTimeout(function() {
            insert(targetStatus);
            if(callback) {
                callback();
            }
        }, 1000 * seconds);
    }

    function clearChangeTimeout(template) {
        if(template.timeout) {
            clearTimeout(template.timeout);
        }
    }

    function updateStatus(template) {
        var status = getStatus();

        if(status === Status.GREEN) {
            insert(Status.YELLOW);
            timeoutChange(template, 10, Status.RED, function() {
                timeoutChange(template, 10, Status.GREEN);
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
            updateStatus(Template.instance());
        }
    });
})();
