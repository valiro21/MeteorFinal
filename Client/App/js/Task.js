if (Meteor.isClient) {
    Template.Task.helpers({
        'get_task_panel_type': function (task) {
            console.log ("Task: ", task);
            if (task.closed) {
                return 'panel-info';
            }
            if (task.finished) {
                return 'panel-success';
            }
            if (task.deadline > new Date()) {
                return 'panel-danger';
            }
            return 'panel-primary';
        }
    });

    Template.Task.events ({
        'click #Finish': function (event) {
            event.preventDefault();

            var description = Template.instance().find('.description').value;
            var title = Template.instance().find('.title').innerHTML;
            var team = Template.instance().find('.team').innerHTML;

            if (description == undefined)
                description = '';
            console.log (description, title, team);

            Meteor.call('finish_task', {title: title, team: team, description: description});
        },
        'click #Close': function (event) {
            event.preventDefault();

            var title = Template.instance().find('.title').innerHTML;
            var team = Template.instance().find('.team').innerHTML;

            console.log (title, team);

            Meteor.call('close_task', {title: title, team: team});
        }
    })
}