var chats = [];
var userID;
var users = {};
var currentChat;
var url_base ="http://uvkk3520fe7c.vicmagv.koding.io:8080/";

//API

function postUser(id){
  $.ajax({
    type: "POST",
    url: url_base + "onlineusers/",
    data: JSON.stringify({"name":id}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
  });
}

function postChat(chat){
  $.ajax({
    type: "POST",
    url: url_base + "conversations/",
    data: JSON.stringify(chat),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
  });
}

function deleteUser(id){
  $.ajax({
    type: "DELETE",
    url: url_base + "onlineusers/" + id + "/",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
  });
}

 var getData = function(){
  $.ajax({
    type: "GET",
    url: url_base + "onlineusers/",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data, status, jqXHR) {
      $.each(data, function(key, entry) {
        users[entry.name] = entry;
      });
    },
  });
  if(userID) $.ajax({
    type: "GET",
    url: url_base + "onlineusers/" + userID + "/chats/",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data, status, jqXHR) {
      $.each(data, function(key, entry) {
        if(!chats[entry.idc]) onNewChat(entry);
      });
      $.each(chats, function(key, entry) {
        if(!data[entry.id]) onDeleteChat(entry.id);
      });
    },
  });
};

function runApi(){
  setInterval( getData, 5000);
}

//User

function userConnect(id){
  if(id.length === 0) return false;
  if(!users[id]){
    userID = id;
    $('#myModal').modal('hide');
    postUser(id);
    return true;
  }
  return false;
}

function userDisconnect(id){
  deleteUser(id);
}

//Chat

function createChat(user){
  var id;
  if(user != userID) id = md5(user + userID);
  if(!chats[id]){
    chats[id] = new Chat(id, user, userID, user);
    chats[id].open();
    chats[id].apend();
    postChat(chats[id].toJSON());
  }
}

function onNewChat(chat){
  var user1 = '';
  var user2 = '';
  $.each(users, function(key, entry){
    if(chat.user1 == entry.id) user1 = entry.name;
    if(chat.user2 == entry.id) user2 = entry.name;
  });
  nombre = (user1==userID)?user2:user1;
  chats[chat.idc] = new Chat(chat.idc, nombre, user1, user2);
  chats[chat.idc].connect();
  chats[chat.idc].apend();
}

function onDeleteChat(chatId){
  chat = chats[chatId];
  chat.delete();
  delete chats[chatId];
}

var Chat = function(id, nombre, userId1, userId2){
  this.nombre = nombre;
  this.id = id;
  this.channel = new DataChannel();
  this.messages = [];
  this.userId1 = userId1;
  this.userId2 = userId2;

  this.send = function(){
    message = $('.input-text').val();
    $('.input-text').val('');
    this.channel.send(message);
    $('.messages').append('<div class="message message-yo">' + message + '</div>');
    this.messages.push({text: message, sender: userID});
    var d = $('.messages');
    d.scrollTop(d.prop("scrollHeight"));
  };

  this.onmessage = function(message){
    msg={};
    msg.text = message;
    msg.sender = (this.userId1==userID)?this.userId2:this.userId1;
    this.messages.push(msg);
    if(currentChat == this){
      $('.messages').append('<div class="message message-otro"><div class="message-nick">'+ msg.sender+'</div>' + message + '</div>');
      var d = $('.messages');
      d.scrollTop(d.prop("scrollHeight"));
    }else{
      var d = $('.messages');
      d.scrollTop(d.prop("scrollHeight"));
      $('#'+this.id).addClass('new-message');
    }
  };

  this.channel.onmessage = this.onmessage.bind(this);

  this.onclose = function(event) {
    onDeleteChat(this.id);
  };

  this.channel.onclose = this.onclose.bind(this);

  this.show = function(){
    currentChat = this;
    $('.messages').empty();
    $('#'+this.id).removeClass('new-message');
    $.each(this.messages, function(key, entry) {
      if(entry.sender == userID)$('.messages').append('<div class="message message-yo">' + entry.text + '</div>');
      else $('.messages').append('<div class="message message-otro"><div class="message-nick">'+ entry.sender+'</div>' + entry.text + '</div>');
    });
    var d = $('.messages');
    d.scrollTop(d.prop("scrollHeight"));
  };

  this.open = function(){
    this.channel.open(this.id);
  };

  this.connect = function(){
    this.channel.connect(this.id);
  };

  this.apend = function(){
    $('.user-list').append("<div class='user' id = '"+ this.id +"'>"+ ((this.userId1==userID)?this.userId2:this.userId1) +"</div>");
  };

  this.delete = function(){
    if(this == currentChat) $('.messages').empty();
    $('#' + this.id).remove();
  };

  this.toJSON = function(){
    chat = {};
    chat.idc = this.id;
    chat.user1 = users[this.userId1].id;
    chat.user2 = users[this.userId2].id;
    return chat;
  };

};

//Jquery and others

var animate = function(){
  $('.new-message').effect( "bounce", { times: 3 }, "slow" );
};

$('body').on('DOMNodeInserted',function(e){
  $('.user').click(function(){
    $('.user').removeClass('user-selected');
    $(this).addClass('user-selected');
    currentChat = chats[$(this).attr('id')];
    currentChat.show();
  });
});

$(document).ready(function(){

  $('.send-button').click(function(){
    if(currentChat) currentChat.send();
  });

  $('.addgamer').click(function(){
    user = $('.buscador :input').val();
    if(users[user]) createChat(user);
    $('.buscador :input').val("");
  });

  $('#myModal').modal({backdrop: 'static', keyboard: false});
  $('#myModal').modal('show');

});

function login(){
  user = $('#user-login').val();
  if(!userConnect(user)) alert('Nombre en uso o vacio');
}

function fin() {
  deleteUser(userID);
}

$(window).unload(function () {
  if(userID)$.ajax({
    type: "DELETE",
    url: url_base + "onlineusers/" + userID + "/",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    async: false
  });
});

runApi();
setInterval(animate, 2000);
