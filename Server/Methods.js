if (Meteor.isServer) {
    function CheckContext () {
        if (Meteor.userId() == undefined) {
            console.log ("Function TasksInsert not called from Meteor methods!");
            return false;
        }
        return true;
    }

    function TeamInsert(teamName) {
        if (!CheckContext ())
           return;
        if (!Meteor.userId())
            throw new Meteor.Error("User must be logged in!");

        var teamsCursor = Teams.find({name:teamName});
        if (teamsCursor.count()) {
            throw new Meteor.Error("Team name is already taken!");
        }

        console.log("Create team Insert: ", true);
        var user = Meteor.users.find({_id: String(Meteor.userId())});
        console.log("Team creator id: ", Meteor.userId());
        var email = user.fetch()[0].emails[0].address;
        console.log("Team creator emails: ", email);

        Teams.insert({name: teamName, createdBy: Meteor.userId, Users: [{address: email}]});
    }

    function TasksInsert (teamName, title, description, deadline, assignedTo) {
        if (!CheckContext ())
            return;

        var createdAt = new Date();

        if (Tasks.find ({title: title, teamName: teamName}).count()) {
            console.log ("Task title already taken!");
            throw new Meteor.Error("Task title already taken!");
        }

        console.log ("Created task at: ", createdAt);
        console.log ("Team name:", teamName);
        console.log ("Task title: ", title);
        console.log ("Task description: ", description);
        console.log ("Task deadline", deadline);
        console.log ("Created by: ", Meteor.userId());

        Tasks.insert({
            title: title,
            description: description,
            teamName: teamName,
            createdAt: createdAt,
            createdBy: Meteor.userId(),
            deadline: deadline,
            finished: false,
            closed: false,
            assignedTo: assignedTo
        });
    }
}

Meteor.methods({
   'create_team': function (o) {
       TeamInsert(o.name);
   },
    'add_user_by_email_to_team': function (o) {
        var teamName = o.team;
        var email = o.email;

        console.log ("Email to find: ", email);
        var usersWithEmailCursor = Meteor.users.find({emails: {$elemMatch: {address:email}}});
        console.log ("Users count: ", usersWithEmailCursor.count());
        if (usersWithEmailCursor.count() == 0) {
            //user does not exist - sending email
            console.log ("User does not exist!");

            /*Send email block to sign-up block*/

            return;
        }
        var usersWithEmail = usersWithEmailCursor.fetch();
        console.log ("Possible users: ", usersWithEmail);
        var userId = String(usersWithEmail[0]._id);

        var teamsCursor = Teams.find ({name: teamName, Users: {$elemMatch: {address: email}}});
        if (teamsCursor.count ()) {
            console.log ("User already in the team!");
            throw new Meteor.Error("User is already in the team!");
        }

        //add user to team
        console.log ("Added user: ", userId);
        Teams.update ({name:teamName}, {$push: {Users: {address: email}}});
    },
    'add_task': function (o) {
        var teams = Teams.find({name: o.team});
        if (teams.count() == 0)
            throw new Meteor.Error("Team does not exits!");
        var usersAssignedToTask = o.usersAssignedToTask;
        for (var i = 0; i < usersAssignedToTask; i++) {
            var user = usersAssignedToTask[i].username;
            console.log ("User to assign: ", user);
            if (Meteor.users.find ({username: user}).count()) {
                if (Tasks.find({
                        title: o.title,
                        teamName: o.team,
                        assignedTo: {$elemMatch: {username: user}}
                    }).count() == 0) {
                    console.log ("Assigned task to: ", user);
                    Tasks.update({title: o.title, teamName: o.team}, {$push: {assignedTo: {username: user}}});
                }
                else {
                    console.log ("Task already assigned to user!");
                }
            }
            else {
                console.log ("User does not exist!");
            }
        }

        TasksInsert (o.team, o.title, o.description, o.deadline, o.usersAssignedToTask);
    },
    'finish_task': function (o) {
        var taskCursor = Tasks.find ({title: o.title, teamName: o.team});
        if (taskCursor.count () == 0) {
            throw new Meteor.Error ("Task not found!");
        }

        var taskFinished = taskCursor.fetch()[0].finished;
        if (taskFinished) {
            throw new Meteor.Error("Task already finished!");
        }

        Tasks.update ({title: o.title, teamName: o.team}, {$set: {finished: true, CompletedDescription: o.description}});
    },
    'close_task': function (o) {
        var taskCursor = Tasks.find ({title: o.title, teamName: o.team});
        if (taskCursor.count () == 0) {
            throw new Meteor.Error ("Task not found!");
        }

        var taskClosed = taskCursor.fetch()[0].closed;
        if (taskClosed) {
            throw new Meteor.Error("Task already closed!");
        }

        Tasks.update ({title: o.title, teamName: o.team}, {$set: {closed: true}});
    }
});