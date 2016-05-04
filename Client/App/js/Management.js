if (Meteor.isClient) {
    Session.set('sort', 0);
    Template.Management.helpers({
        get_tasks: function () {
            var sort = Session.get('sort');
            var taskCursor;
            var team = Session.get('team_selected');
            if (team == '') {
                if (sort == 0) {
                    taskCursor = Tasks.find({}, {sort: {deadline: 1}});
                }
                else if (sort == 1) {
                    taskCursor = Tasks.find({finished: false, deadline: {$lt: new Date()}});
                }
                else if (sort == 2) {
                    taskCursor = Tasks.find({finished: true, closed: false});
                }
                else if (sort == 3) {
                    taskCursor = Tasks.find({closed: true});
                }
                else if (sort == 4) {
                    taskCursor = Tasks.find({deadline: {$gt: new Date()}, finished: false});
                }
            }
            else {
                if (sort == 0) {
                    taskCursor = Tasks.find({teamName: team}, {sort: {deadline: 1}});
                }
                else if (sort == 1) {
                    taskCursor = Tasks.find({teamName: team, finished: false, deadline: {$lt: new Date()}});
                }
                else if (sort == 2) {
                    taskCursor = Tasks.find({teamName: team, finished: true, closed: false});
                }
                else if (sort == 3) {
                    taskCursor = Tasks.find({teamName: team, closed: true});
                }
                else if (sort == 4) {
                    taskCursor = Tasks.find({teamName: team, deadline: {$gt: new Date()}, finished: false});
                }
            }

            var tasks = taskCursor.fetch();
            console.log ("Tasks: ", tasks);
            return tasks;
        },
        not_management_selected: function () {
            return !(Session.get('menu_selected') == 1 && Session.get('team_selected') === '');
        }
    });

    Template.TaskSorter.helpers ({
        get_margin: function () {
            if (Session.get('menu_selected') == 1) {
                return '0';
            }
            return '270';
        }
    });

    Template.Management.events ({
        'click #All': function () {
            Session.set('sort', 0);
        },
        'click #Started': function () {
            Session.set('sort', 1);
        },
        'click #Finished': function () {
            Session.set('sort', 2);
        },
        'click #Closed': function () {
            Session.set('sort', 3);
        },
        'click #Failed': function () {
            Session.set('sort', 4);
        }
    });

    Template.TeamManagement.helpers ({
        team_selected: function () {
            return Session.get('team_selected_dropdown') != '';
        }
    });

    Template.TeamManagement.events ({
        'click #Add': function (event) {
            event.preventDefault();

            var team = Session.get('team_selected_dropdown');
            console.log ('Team: ', team);
            var usersList = Session.get('users_selected');
            for (var i = 0; i < usersList.length; i++) {
                if (usersList[i] == null)
                    continue;
                var email = Meteor.users.findOne({username: usersList[i].username});

                if (!(email == null || email == undefined)) {
                    email = email.emails[0].address;
                    Meteor.call('add_user_by_email_to_team', {team: team, email: email});
                }
                else {
                    if (outsideEmails.find({address: usersList[i].username}).count()) {
                        Meteor.call('add_user_by_email_to_team', {team: team, email: usersList[i].username});
                    }
                }
            }

        }
    })
}