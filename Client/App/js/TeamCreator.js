if (Meteor.isClient) {
    Template.TeamCreator.events ({
        'submit #SubmitForm': function (event) {
            event.preventDefault();

            var team = document.getElementById('Name').value;
            console.log ('Team: ', team);
            Meteor.call('create_team', {name: team});
            var usersList = Session.get('users_selected');
            for (var i = 0; i < usersList.length; i++) {
                if (usersList[i] == null)
                    return;
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

            Session.set('is_creating_new_team', false);
            Session.set('team_selected', '');
        },
        'click #Cancel': function () {
            event.preventDefault();
            Session.set('is_creating_new_team', false);
            Session.set('team_selected', '');
        }
    });


}