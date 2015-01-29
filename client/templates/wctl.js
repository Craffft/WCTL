Meteor.subscribe('status');

Template.wctl.rendered = function () {
    jQuery('.currentUser').fitText(1.2);
};

function getStatus() {
    return Status.findOne({}, {sort: {timestamp: -1}});
}


function notify(currentUser,currentStatus) {

    var notification = Session.get("notifications");
    if (notification === true) {
        if (!Notification) {
            alert('Notifications are supported in modern versions of Chrome, Firefox, Opera and Firefox.'); 
            return;
        }

        if (Notification.permission !== "granted")
            Notification.requestPermission();

        if(currentStatus === "green"){
            var notification = new Notification(currentUser +' hat reserviert!', {
                icon: 'icon-orange.png',
                body: currentUser + " ist auf dem weg zur Toilette.",
            });
        }else{
            var notification = new Notification(currentUser +' ist zurück!', {
                icon: 'icon-green.png',
                body: currentUser + " hat es geschafft! Die Toilette ist wieder frei.",
            });
        }
    }
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
    'click #ampel': function() {
        Meteor.call('changeStatus');

        var currentStatus = getStatus().status,
        currentUser = getStatus().username;

        // Notifications
        // notify(currentUser,currentStatus);  
    },
    'click .forceGreen': function(){

        var currentStatus = getStatus().status

        if(currentStatus === "red") {
            Meteor.call('forceGreen');
        }
        
    }

    /* Mute Notifications 
    /*,
    'change .topbar input': function(e){
        if(e.target.checked){
            Session.set("notifications", true);
        }else{
            Session.set("notifications", false);
        }
    }
    */
});



Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});
