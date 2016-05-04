Router.route('/', function () {
    console.log ("User id:", Meteor.userId());
    if (Meteor.userId()) {
        Meteor.subscribe('teams');
        Meteor.subscribe('tasks');
        Session.setDefault("is_creating_new_team", false);
        this.render('MainUI');
    }
    else {
        this.render('Guest');
    }
})

Router.route('/Create', function () {
    if (!Meteor.userId()) {
        throw new Meteor.Error(403, "Not allowed!");
    }
})

AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
});

AccountsTemplates.addField({
    _id: 'username',
    type: 'text',
    required: true,
    func: function(value){
        if (Meteor.isClient) {
            console.log("Validating username...");
            var self = this;
            Meteor.call("userExists", value, function(err, userExists){
                if (!userExists)
                    self.setSuccess();
                else
                    self.setError(userExists);
                self.setValidating(false);
            });
            return;
        }
        // Server
        return Meteor.call("userExists", value);
    },
});
