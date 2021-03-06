import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';
import {ReactiveVar} from 'meteor/reactive-var'
import './newgame.html';

var bggGames = new ReactiveVar(0);
var fGame = new ReactiveVar(0);
var rGames = new ReactiveVar([]);
var nameGame = new ReactiveVar([]);

Template.newgame.rendered = function () {
    $("#divFormGame").hide();
    $('#divFocusGame').hide();
    $('#search').val(document.search);
};

Template.newgame.events({
    // Search games
    'click #btnSearchGame': function () {
        $("#mainRow").attr('class', 'whirl');
        Meteor.call('bgg.search', $("#search").val(), function (e, result) {
            $("#mainRow").attr('class', '');

            bggGames.set(result);
            if (result == undefined) {
                Bert.alert(TAPi18n.__('generic.ALERT_NO_RESULT'));
            }
            $('#tableListGames').show();
            $('#divFocusGame').hide();
        });
    },
    // View more informations for the game
    'click .moreInformation': function (event) {
        var gameId = $(event.target).attr("game-id");
        nameGame.set($(event.target).attr("game-name"));
        Meteor.call('bgg.game', gameId, function (e, result) {
            result.description = $('<div/>').html(result.description).text();
            fGame.set(result);
            $('#tableListGames').hide();
            $('#divFocusGame').show();
        });
    },
    // Abre informações detalhadas do jogo
    'click #useGame': function () {
        var dataGame = fGame.get();
        $('#name').val(nameGame.get());
        $('#description').val($.parseHTML(dataGame.description)[0].textContent);
        $('#tableListGames').hide();
        $('#divFocusGame').hide();
        $('#divSearchGame').hide();
        $("#divFormGame").show();
    },
    // Cancela a ação e volta para o inicio
    'click #btnCancelar': function () {
        $('#divSearchGame').show();
        $("#divFormGame").hide();
    },
    // Salva o jogo na base de dados
    'click #btnSalvar': function () {
        let game = $('form[name="formGame"]').serializeJSON();
        if (game.name == "") {
            Bert.alert(TAPi18n.__('match.ALERT_NAME'), 'danger');
        } else {
            bggGame = fGame.get();
            console.log(bggGame);
            game.bggid = bggGame.generic.objectid;
            game.minplayers = bggGame.minplayers;
            game.maxplayers = bggGame.maxplayers;
            game.playingtime = bggGame.playingtime;
            game.age = bggGame.age;
            game.yearpublished = bggGame.yearpublished;
            game.thumbnail = bggGame.thumbnail;
            game.image = bggGame.image;

            // extra bgg data of game
            game.artist = bggGame.boardgameartist;
            game.bggcategory = bggGame.boardgamecategory;
            game.designer = bggGame.boardgamedesign;
            game.expansion = bggGame.boardgameexpansion;
            game.family = bggGame.boardgamefamily;
            game.honor = bggGame.boardgamehonor;
            game.implementation = bggGame.boardgameimplementation;
            game.mechanic = bggGame.boardagmemechanic;
            game.publisher = bggGame.boardgamepublisher;
            game.versions = bggGame.boardgameversion;

            Meteor.call('game.insert', game, function (e, result) {
                if (result) {
                    Bert.alert(TAPi18n.__('generic.SAVE_SUCCESS'), 'success');
                    $('#divSearchGame').show();
                    $("#divFormGame").hide();
                } else {
                    Bert.alert(TAPi18n.__('generic.SAVE_ERROR'), 'danger');
                }
            });

        }

    }
});

Template.newgame.helpers({
    localizedGames() {
        return bggGames.get();
    },
    focusGame() {
        return fGame.get();
    },
    formGame() {
        return fGame.get();
    },
    games() {
        Meteor.call('game.find', {}, function (e, result) {
            rGames.set(result);
        });
        return rGames.get();
    }
});