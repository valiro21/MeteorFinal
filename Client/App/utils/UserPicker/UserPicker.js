if (Meteor.isClient) {
    usersSelected = new Mongo.Collection();
    outsideEmails = new Mongo.Collection();

    Template.UserPicker.rendered = function () {
        usersSelected.remove({});
        outsideEmails.remove({});
        Session.set('add_disabled', true);
        Session.set("user_picker_filter", "");
    }

    Template.UserPicker.helpers ({
        get_users: function (email_enabled) {
            var filter = Session.get("user_picker_filter");
            var search = new RegExp(filter, 'i');
            var usersList = [];
            console.log (search);

            if (email_enabled) {
                var users = Meteor.users.find({username: search}).fetch();
                console.log(users);
                for (var i = 0; i < users.length; i++) {
                    if (Teams.find({Users: {$elemMatch: {address: users[i].emails[0].address}}}).count () == 0) {
                        usersList[i] = {
                            username: users[i].username,
                            profile_picture: "",
                            selected: usersSelected.find({username: users[i]}).count() != 0
                        };
                    }
                }


                console.log(outsideEmails);
                var emails = outsideEmails.find({address: search}).fetch();
                for (var i = 0; i < emails.length; i++) {
                    if (Teams.find({Users: {$elemMatch: {address: emails[i].address}}}).count() == 0) {
                        usersList[usersList.length] = {
                            username: emails[i].address,
                            profile_picture: "",
                            selected: true
                        }
                    }
                }
            }
            else {
                var team = Session.get('team_selected_dropdown');
                if (team == '')
                    return;
                console.log (team);
                var users = Teams.find({name: team}).fetch();
                console.log (users);
                if (users == undefined)
                    return;
                users = users[0].Users;
                for (var i = 0; i < users.length; i++) {
                    var email = users[i].address;
                    if (Meteor.users.find({emails: {$elemMatch: {address:email}}}).count()) {
                        usersList[i] = {
                            username: Meteor.users.findOne({emails: {$elemMatch: {address:email}}}).username,
                            profile_picture: "",
                            selected: usersSelected.find({username: users[i]}).count() != 0
                        };
                    }
                }
            }

            Session.set('users_selected', usersList);
            return usersList;
        },
        is_selected: function (username) {
            console.log (username);
            return usersSelected.find({username:username}).count() || outsideEmails.find({address: username}).count();
        },
        is_disabled: function () {
            return Session.get('add_disabled') ? "disabled" : '';
        }
    });

    Template.UserPicker.events ({
        'keyup #user_picker_search': function (event) {
            var value = String(event.currentTarget.value);

            var at = 0, has_address = false;
            for (var i = 0; i < value.length; i++) {
                if (value[i] == '@') {
                    at++;
                    if (i < value.length - 1) {
                        has_address = has_address | true;
                    }
                }
            }

            if (at == 1 && has_address) {
                Session.set('add_disabled', false);
            }
            else
                Session.set('add_disabled', true);

            console.log ('filter: ', value);
            Session.set("user_picker_filter", value);
        },
        'click .user': function (event) {
            event.preventDefault();
            var username = event.currentTarget.id;
            console.log ('User selected: ', username);

            if (usersSelected.find({username:username}).count()) {
                usersSelected.remove({username: username});
            }
            else if (Meteor.users.find({username: username}).count()) {
                usersSelected.insert({username: username});
            }

            if (outsideEmails.find({address: username}).count()) {
                outsideEmails.remove({address: username});
            }
        },
        'click #Add': function (event) {
            event.preventDefault();
            console.log("Event: ", event);
            if (Session.get('add_disabled') == false) {
                var email = Session.get('user_picker_filter');
                if (outsideEmails.find({address: email}).count() == 0)
                    outsideEmails.insert ({address: email});
            }
        }
    });
}