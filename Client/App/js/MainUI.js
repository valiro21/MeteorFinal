if (Meteor.isClient) {
    Session.setDefault('is_creating_new_team', false);
    Template.MainUI.helpers ({
        isCreatingNewTeam: function () {
            console.log ('is_creating_new_team: ',Session.get ("is_creating_new_team"));
            return Session.get ("is_creating_new_team") && Session.get('menu_selected') == 1 && Session.get('team_selected') == '__Create';
        },
        get_margin: function () {
            if (Session.get('menu_selected') == 0) {
                return '30';
            }
            return '300';
        },
        'isCreatingNewTask': function () {
            return Session.get('menu_selected') == 0 && Session.get('is_creating_new_task');
        }
    });
}