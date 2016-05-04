if (Meteor.isClient) {
    Session.set('menu_selected', 0);
    Session.set('team_selected', '');

    Template.TeamNavList.events({
        'click .collapse-nav': function (event) {
            var id = event.currentTarget.id;

            Session.set('team_selected', id);

            //for some reason this is not working!!!!!!!!!!!
            Meteor.subscribe('tasks', id);
            console.log ("Task click: ", Tasks.find().fetch());
            event.preventDefault();
        },
        'click #__Manage': function (event) {
            event.preventDefault();
            Session.set('team_selected', "");
            Meteor.subscribe('no_tasks');
        },
        'click #__Create': function (event) {
            event.preventDefault();
            console.log ('Create');
            Session.set('team_selected', '__Create');
        }
    });

    Template.TeamNavList.helpers({
        'get_teams': function () {
            var teams = Teams.find().fetch();
            return teams;
        },
        'is_active_collapse': function (id) {
            if (id == undefined)
                if (Session.get('team_selected') == "")
                    return 'active';
                else
                    return '';

            if (id == Session.get('team_selected')) {
                return 'active';
            }
            return '';
        },
        isCreatingNewTeam: function () {
            console.log ('is_creating_new_team: ',Session.get ("is_creating_new_team"));
            return Session.get ("is_creating_new_team");
        }
    });

    Template.MainNav.helpers({
        'is_team_selected':function (id) {
            if (Session.get('menu_selected') == 1)
                return true;
            return false;
        }
    });
}