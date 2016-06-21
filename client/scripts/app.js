// YOUR CODE HERE:


var app = {};
var friendlist = [];
var message = {
  username: 'hi',
  text: 'trololo',
  roomname: '4chan'
};

$(document).ready(function() {

  app.init = function() {
    // $(document).ready(function() {
    app.fetch();
      // message.username = prompt(('What is your name?') || 'anonymous');

    // });
  };

  app.send = function(message) {
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
        $('#chats').append('<div class="chat">' + '<a href="#" class="username">' + message.username + '</a>' + ':\n' + message.text + '</div>');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
    return;
  };

  $('.submit').click(function() {
    // console.log('pressed submit');
    message.username = $('.userInput').val() || 'anonymous';
    message.text = $('.input').val();
    message.roomname = $('#roomSelect :selected').text();

    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {
        alert('Message sent');
        $('#chats').append('<div class="chat">' + '<a href="#" class="username">' + message.username + '</a>' + ':\n' + message.text + '</div>');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });

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
            var $user = $('<a href="#" class="username"></a>');
            $user.text(val.username);
            $user.attr('data-user', val.username);
            // app.addMessage(val);
            // console.log(val);
            $('#chats').append('<div class="chat">').append($user).append(':\n' + val.text + '</div>');
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


  app.addMessage = function(message) {
    $('#chats').append('<div class="chat">' + '<a href="#" class="username">' + message.username + '</a>' + ':\n' + message.text + '</div>' );
  };

  app.server = 'https://api.parse.com/1/classes/messages';

  app.clearMessages = function() {
    $('#chats').empty();
  };

  app.addRoom = function(room) {
    $('#roomSelect').append('<option value="value2">' + room + '</option>');
  };

  app.addFriend = function(message) {
    $('.friendsList').append(message.username);
  };
  //click on username to add user as friend
  $('#chats').on('click', 'a', function() {
    // $('.friendsList').append($(this).attr('data-user'));
    var clickedFriend = $(this).attr('data-user');
    if (friendlist.indexOf(clickedFriend) === -1) {
      friendlist.push(clickedFriend);
      $('.friendsList').append('<p class="friend">' + clickedFriend + '</p>');
    }
  });

  //refresh to see new messages
  $('.refresh').click(function() {
    app.clearMessages();
    app.fetch();
  });

  app.filterRooms = function(tarRoom) {
    app.clearMessages();
    var rooms = app.fetch();
    console.log(rooms);
    for (var key in rooms) {
      // console.log(key);
      if (key === 'roomname' && key === tarRoom) {
        app.addMessage(key);
      }
    }
  };
  // setInterval(function() { app.fetch(); }, 1000);
});
