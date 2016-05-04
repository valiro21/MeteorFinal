if (Meteor.isClient) {
    usersAssigned = new Mongo.Collection();
    Session.set('user_assigned_search', '');
    Session.set('team_selected_dropdown', '');

    Template.TaskCreator.rendered= function () {
        Session.set('team_selected_dropdown', '');
    }

    Template.TaskCreator.events ({
        'submit #SubmitForm': function (event) {
            event.preventDefault();

            var title = document.getElementById('Title').value, description = title = document.getElementById('Description').value;
            var time = new Date(document.getElementById('Date').value);
            var usersList = usersAssigned.find().fetch(), users = [];
            var team = Session.get('team_selected_dropdown');

            Meteor.call('add_task', {teamName: team, title: title, description: description, usersAssignedToTask: usersList, deadline: time});
        },
        'click #Cancel': function () {
            event.preventDefault();
            Session.set('team_selected_dropwdown', '');
            Session.set('is_creating_new_task', false);
        },
        'click .dropdown-team-item': function (event) {
            event.preventDefault();
            var id = event.currentTarget.id;
            Session.set('team_selected_dropdown',id);
        }
    });

    Template.TaskCreator.helpers ({
        'get_teams': function () {
            var teams = Teams.find().fetch();
            return Teams.find();
        },
        'get_selected_team': function () {
            var team = Session.get('team_selected_dropdown');
            if (team == '')
                return 'Teams';
            return team;
        }
    })

    Session.set("user_assigned_filter", "");
    Template.UserAssigner.helpers ({
        get_users: function () {
            var filter = Session.get("user_assigned_filter");
            var team = Session.get('team_selected_dropdown');
            if (team == '')
                return [];

            console.log ("Team: ", team);
            var usersList = [];
            var id = 0;
            Teams.find({name: team}).forEach(function (element) {
                console.log ('Element: ', element);
                var filter = Session.get('user_assigned_filter');

                for (var i = 0; i < element.Users.length; i++) {
                    var email = element.Users[i].address;
                    console.log (email);
                    var username = Meteor.users.findOne({emails:{$elemMatch: {address: email}}}).username;
                    console.log (username);

                    console.log (filter);
                    if (username != undefined && username != null && (filter == '' || username.indexOf(filter) != -1)) {
                        usersList[id] = {username: username};
                        id++;
                        console.log (id);
                    }
                }

                console.log ('Users', usersList);
            });

            return usersList;
        },
        is_selected: function (username) {
            console.log (username);
            return usersAssigned.find({username:username}).count();
        }
    });

    Template.UserAssigner.events ({
        'keyup #user_assigner_search': function (event) {
            var value = String(event.currentTarget.value);

            console.log ('filter: ', value);
            Session.set("user_assigner_filter", value);
        },
        'click .user': function (event) {
            event.preventDefault();
            var username = event.currentTarget.id;
            console.log ('User selected: ', username);

            if (usersAssigned.find({username:username}).count()) {
                usersAssigned.remove({username: username});
            }
            else
                usersAssigned.insert({username: username});
        },
        'click .dropdown-team-item': function (event) {
            var team = event.currentTarget.value;
            Session.set('team_selected_dropwdown', team);
        }
    });
}