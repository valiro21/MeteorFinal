if (Meteor.isClient) {
  /*Accounts.createUser({username: "valiro21", email:"valiro21@yahoo.com", password:"ceva"});
  Accounts.createUser({username: "ceva", email:"ceva@yahoo.com",password:"ceva"});
  Meteor.loginWithPassword("valiro21", "ceva");
  Meteor.call('create_team',{name: "FTW!"});
  Meteor.call('add_user_by_email_to_team',{team:"FTW!",email:"ceva@yahoo.com"});
  Meteor.call('add_task', {team:'FTW!', title:"Test!", description:"lol", deadline:new Date()});
  Meteor.call('assign_to_task',{team:"FTW!", title:"Test!", users: ["valiro21", "ceva"]});
  Meteor.call('assign_to_task',{team:"FTW!", title:"Test!", users: ["valiro21", "ceva"]});
  Meteor.call('start_task',{team:"FTW!", title:"Test!"});
  Meteor.call('start_task',{team:"FTW!", title:"Test!"});
  Meteor.call('finish_task',{team:"FTW!", title:"Test!"});
  Meteor.call('finish_task',{team:"FTW!", title:"Test!"});
  Meteor.call('close_task',{team:"FTW!", title:"Test!", description:"Lol it works!"});
  Meteor.call('close_task',{team:"FTW!", title:"Test!", description:"Lol it works!"});*/
  Meteor.subscribe('users');
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
