if (Meteor.isClient) {
    Session.set('is_creating_new_task', false);
    Meteor.subscribe('tasks');
    Template.UserTabs.helpers({
        get_tabs: function () {
            var teams = Teams.find().fetch();
            console.log ("Teams", teams);
            var tabs = [];
            for (var i = 0; i < teams.length; i++) {
                tabs[i] = {tab_name:teams[i].name, tab_title:teams[i].name};
            }
            tabs[teams.length] = {tab_name:"__TeamCreator", tab_title:"New Team", is_active:""};
            tabs[0].is_active="active";

            return tabs;
        },
        'is_active': function (id) {
            var real_id;
            if (id == 'Tasks')
                id = 0;
            else if (id == 'Teams')
                id = 1;

            if (Session.get('menu_selected') == id) {
                return 'active';
            }
            return '';
        },
        'is_team_tab': function () {
            return Session.get('menu_selected') == 1;
        }
    });

    Template.UserTabs.events({
        'click .user_tabs_tab': function (event) {
            event.preventDefault();
            var selected = event.target.innerHTML;

            if (selected == 'Tasks') {
                Meteor.subscribe('tasks');
                Session.set('menu_selected', 0);
            }
            else if (selected == 'Teams') {
                if (Session.get('team_selected') == '') {
                    console.log (Session.get('team_selected'));
                    Meteor.subscribe('no_tasks');
                }
                else {
                    Meteor.subscribe('tasks', Session.get('team_selected'));
                }

                Session.set('menu_selected', 1);
            }
        },
        'click #Create': function () {
            if (Session.get('menu_selected') == 1) {
                Session.set("is_creating_new_team", true);
                Session.set('team_selected', '__Create');
            }
            else {
                Session.set('is_creating_new_task', true);
            }
        }
    });
}