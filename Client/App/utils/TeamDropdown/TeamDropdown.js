if (Meteor.isClient) {
    Template.TeamDropdown.rendered = function () {
        Session.set('team_selected_dropdown', '');
    }

    Template.TeamDropdown.events ({
        'click .dropdown-team-item': function (event) {
            event.preventDefault();
            var id = event.currentTarget.id;
            Session.set('team_selected_dropdown', id);
        }
    });

    Template.TeamDropdown.helpers ({
        'get_teams': function () {
            var teams = Teams.find().fetch();
            console.log (teams);
            return Teams.find();
        },
        'get_selected_team': function () {
            var team = Session.get('team_selected_dropdown');
            console.log (team);
            if (team == '')
                return 'Teams';
            return team;
        }
    })
}