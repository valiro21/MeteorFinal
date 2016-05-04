if (Meteor.isClient) {
    Template.TaskCreator.events ({
        'submit #SubmitForm': function (event) {
            event.preventDefault();

            var title = document.getElementById('Title').value, description = document.getElementById('Description').value;
            var time = new Date(document.getElementById('Date').value);
            var usersList = Session.get('users_selected');
            var team = Session.get('team_selected_dropdown');

            console.log (team);

            Meteor.call('add_task', {team: team, title: title, description: description, usersAssignedToTask: usersList, deadline: time});
        },
        'click #Cancel': function () {
            event.preventDefault();
            Session.set('team_selected_dropwdown', '');
            Session.set('is_creating_new_task', false);
        }
    });
}