if (Meteor.isServer) {
    Meteor.publish('teams', function() {
        if (!this.userId)
            return new Mongo.Collection();
        var email = Meteor.users.find ({_id: this.userId}).fetch()[0].emails[0].address;
        console.log ("Email", email);

        return Teams.find({Users: {$elemMatch: {address: email}}});
    });

    Meteor.publish('tasks', function (teamName) {
        if (!this.userId)
            return null;
        var email = Meteor.users.find ({_id: this.userId}).fetch()[0].emails[0].address;

        console.log ("Team name subscribe: ", teamName);
        if (teamName == undefined) {
            var teams = Teams.find({Users: {$elemMatch: {address: email}}}).fetch();
            var teamNames = [];
            for (var i = 0; i < teams.length; i++)
                teamNames[i] = teams[i].name;
            console.log ("Team names: ", teamNames);
            return Tasks.find ({teamName: {$in: teamNames}});
        }

        if (Teams.find({name: teamName, Users: {$elemMatch: {address: email}}}).count()) {
            console.log("Team name click:", teamName);
            console.log (Tasks.find({teamName: teamName}).fetch());
            return Tasks.find({teamName: teamName});
        }
        return null;
    })

    Meteor.publish('no_tasks', function () {
        return null;
    })

    Meteor.publish('users', function(teamName) {
        return Meteor.users.find({},{fields: {username: true, emails: true}});
    });
}