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
}