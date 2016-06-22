// YOUR CODE HERE:


var app = {};
var friendlist = [];
var message = {
  username: 'hi',
  text: 'trololo',
  roomname: '4chan'
};

var chatRoomList = [];

$(document).ready(function() {

  app.init = function() {
    // $(document).ready(function() {
    app.fetch();
      // message.username = prompt(('What is your name?') || 'anonymous');

    // });
  };

  app.send = function(val) {
    // var name = window.location.search.slice(10);
    // var text = $('.input').val();
    // var roomname = $('#roomSelect :selected').text(); //TODO

    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        //roomname not here

        var $user = $('<a href="#" class="username"></a>');
        var $message = $('<div class="chat"></div>');

        $user.text('@' + val.username);
        $user.attr('data-user', _.escape(val.username));

        $message.text(': ' + _.escape(val.text));

        $user.prependTo($message);

        $message.attr('data-room', _.escape(val.roomname));

        //var $message = `<div class="chat" data-room="${_.escape(val.roomname)}"><a href="#" class="username" data-user="${_.escape(val.username)}">@${val.username}</a>: ${val.text} </div>`;


        $('#chats').append($message);



      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
    return;
  };

  $('#send').click(function() {
    // console.log('pressed submit');
    message.username = $('.userInput').val() || 'anonymous';
    message.text = $('.input').val();
    message.roomname = $('#roomSelect :selected').text();

    app.send(message);
    app.clearMessages();  
    app.fetch();
  });


  app.fetch = function() {
    $(document).ready(function() {
      $.ajax({
        url: 'https://api.parse.com/1/classes/messages',
        type: 'GET',
        dataType: 'json',
        // contentType: 'application/json',
        success: function(data) {
          $.each(data.results, function(index, val) {

            // console.log(val.text, val.username, val.roomname);
            console.log(_.escape(val.roomname));

            var $user = $('<a href="#" class="username"></a>');
            var $message = $('<div class="chat"></div>');

            $user.text('@' + val.username);
            $user.attr('data-user', _.escape(val.username));
            $message.text(': ' + _.escape(val.text));

            $user.prependTo($message);

            $message.attr('data-room', _.escape(val.roomname));

            // // update dropdown menu with chatrooms
            app.addRoom(_.escape(val.roomname));

            //var $message = `<div class="chat" data-room="${_.escape(val.roomname)}"><a href="#" class="username" data-user="${_.escape(val.username)}">@${val.username}</a>: ${val.text} </div>`;

            $('#chats').append($message);
          });
        },
        error: function(data) {
          console.log('error');
        }
      });
      return;
    });
  }; 


  app.init();


  app.addMessage = function(val) {


    // var $user = $('<a href="#" class="username"></a>');
    // var $message = $('<div class="chat"></div>');

    // $user.text('@' + val.username);
    // $user.attr('data-user', val.username);
    // $user.prependTo($message);

    // $message.append(': ' + val.text);
    // $message.attr('data-room', val.roomname);

    var $message = `<div class="chat" data-room="${_.escape(val.roomname)}"><a href="#" class="username" data-user="${_.escape(val.username)}">@${val.username}</a>: ${_.escape(val.text)} </div>`;

 
    $('#chats').append($message);

    // $('#chats').append('<div class="chat">' + '<a href="#" class="username">' + message.username + '</a>' + ':\n' + message.text + '</div>' );
  };

  app.server = 'https://api.parse.com/1/classes/messages';

  app.clearMessages = function() {
    $('#chats').empty();
  };

  app.addRoom = function(val) {
    var val = val || $('.newroom').val();

    if (chatRoomList.indexOf(val) === -1) {
      chatRoomList.push(val);
      $('#roomSelect').append('<option value=' + val + '>' + val + '</option>');
    }
  };

  $('.addRoom').click(function() {
    console.log('clicked');
    app.addRoom();
  });



  app.addFriend = function(message) {
    $('.friendsList').append(message.username);
  };
  //click on username to add user as friend
  $('#chats').on('click', 'a', function() {
    // $('.friendsList').append($(this).attr('data-user'));
    var clickedFriend = $(this).attr('data-user');
    // console.log(clickedFriend);
    if (friendlist.indexOf(clickedFriend) === -1) {
      $('[data-user="' + _.escape(clickedFriend) + '"]').addClass('friend');
      friendlist.push(clickedFriend);
      $('.friendsList').append('<p class="friend">' + clickedFriend + '</p>');
    }
  });



  //refresh to see new messages
  $('.refresh').click( function() {
    app.clearMessages();
    app.fetch();
    $('#currentroom').text('all chat rooms');
  });


  $('.dropdown').click( function() {
    app.fetch();
  });

  // $('#tabs').tabs();
  // $("div#tabs ul").append("<li><a href='#' class='tab'>" + chatroomSelected + "</a></li>");


  $('.dropdown').change( function() {
    // app.fetch();

    var chatroomSelected = $(this).val();

   
    $('#tabs').append('<a href="#" class="tab">' + chatroomSelected + '</a> ');
    

    var msg = document.querySelectorAll('[data-room="' + chatroomSelected + '"]');
    $('#currentroom').text(_.unescape(chatroomSelected));

    // var $link = $('<a href="#" class="tab"></a>');
    // $link.text(chatroomSelected);
    // $('#main').append($link);
    app.clearMessages();
  // for each chatNode this function searches the data attribute "data-room"
    $.each(msg, function(index, chatNode) {
      var user = chatNode.children[0].innerText.slice(1);
      var text = chatNode.innerText.slice(user.length + 3);
      var obj = {username: user, text: text, roomname: chatroomSelected};
      // console.log(obj);

      app.addMessage(obj);
    });
  });


  // app.filterRooms = function () {
  //   var chatroomSelected = $(this).val();
  //   var msg = document.querySelectorAll('[data-room="' + chatroomSelected + '"]');
  //   $('#currentroom').text(_.unescape(chatroomSelected));
  //   app.clearMessages();

  //   $.each(msg, function(index, chatNode) {
  //     var user = chatNode.children[0].innerText.slice(1);
  //     var text = chatNode.innerText.slice(user.length + 3);
  //     var obj = {username: user, text: text, roomname: chatroomSelected};
  //     // console.log(obj);

  //     app.addMessage(obj);
  //   });

  // };

  $('#tabs').click(function() {

  });

  $('#tabs').on('click', 'a', function() {
    // app.fetch();

    var chatroomSelected = $(this).text();

    var msg = document.querySelectorAll('[data-room="' + chatroomSelected + '"]');
    $('#currentroom').text(_.unescape(chatroomSelected));

    // var $link = $('<a href="#" class="tab"></a>');
    // $link.text(chatroomSelected);
    // $('#main').append($link);
    app.clearMessages();
  // for each chatNode this function searches the data attribute "data-room"
    $.each(msg, function(index, chatNode) {
      
      var user = chatNode.children[0].innerText.slice(1);
      var text = chatNode.innerText.slice(user.length + 3);
      var obj = {username: user, text: text, roomname: chatroomSelected};
      // console.log(obj);

      app.addMessage(obj);

    });
  });



});