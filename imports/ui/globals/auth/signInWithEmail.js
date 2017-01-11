import { Template } from 'meteor/templating';
import './signInWithEmail.html';

Template.signInWithEmail.events({
    "submit #signup-form": function(event, template) {
        event.preventDefault();

        Accounts.createUser({
            username: template.find("#signup-email").value,
            password: template.find("#signup-password").value,
            profile: {
                name: template.find("#signup-name").value
                // Other required field values can go here
            }
        }, function(error) {
            if (error) {
                swal('Oops...', error.message, 'error');
            }else{
                swal('Registro efetuado com sucesso', '', 'success');
                Router.go('login');
            }
        });
    }
});