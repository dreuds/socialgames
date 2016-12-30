import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var'
import './place.html';
import './placeForm.html';
import './placeList.html';
import '../../components/map/map.js';

var lista = new ReactiveVar(0);

Template.places.events({

    'click #save' : function(event, template){

        let place = $('form[name="new-place"]').serializeJSON();

        //Só deve ter no json os valores para serem inseridos no BD, qualquer coisa diferente e deletada, uma questão de segurança
        var valoresParaInserir = ["_id", "autocomplete", "name", "formatted_address", "country_short", "lat", "lng"];
        $.each(place, function(indice, item) {
            if (!valoresParaInserir.indexOf(indice)) {
                delete place[indice];
            }
        });

        Meteor.call('places.insert', place, function (e, result) {
            if(result){
                Bert.alert('Local salvo com sucesso', 'success');
            } else {
                Bert.alert('Erro ao tentar salvar um local', 'danger');
            }
        });

        $('#place').val('');//Clear input
        Meteor.call('places.find', null, function (e, result) {
            lista.set(result);
        });
    }
});

Template.places.helpers({
  lista() {
    Meteor.call('places.find', null, function (e, result) {
        lista.set(result);
    });
    return lista.get();
  }
});