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

  $('#send').click(function() {
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

            console.log(val.text, val.username, val.roomname);


            var $user = $('<a href="#" class="username"></a>');
            var $message = $('<div class="chat"></div>');

            $user.text('@' + val.username);
            $user.attr('data-user', val.username);
            $user.prependTo($message);

            $message.append(': ' + val.text);
            $message.attr('data-room', val.roomname);

            // update dropdown menu with chatrooms
            if (chatRoomList.indexOf(val.roomname) === -1) {
              chatRoomList.push(val.roomname);
              $('#roomSelect').append('<option value=' + val.roomname + '>' + val.roomname + '</option>');
            }
            
            


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


  app.addMessage = function(message) {


    var $user = $('<a href="#" class="username"></a>');
    var $message = $('<div class="chat"></div>');

    $user.text('@' + val.username);
    $user.attr('data-user', val.username);
    $user.prependTo($message);

    $message.append(': ' + val.text);
    $message.attr('data-room', val.roomname);
 
    $('#chats').append($message);

    // $('#chats').append('<div class="chat">' + '<a href="#" class="username">' + message.username + '</a>' + ':\n' + message.text + '</div>' );
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
    console.log(clickedFriend);
    if (friendlist.indexOf(clickedFriend) === -1) {
      $('[data-user="' + clickedFriend + '"]').addClass('friend');
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

$(document).ready(function() {

  $('.dropdown').change(function() {
    var roomOptions = [];
    alert($(this).val());
    app.fetch();
    //find a way to push the room names into roomoption then use the below code to 
    //apend to select dropdown
    //http://stackoverflow.com/questions/317095/how-do-i-add-options-to-a-dropdownlist-using-jquery
    // var mySelect = $('#roomSelect');
    // $.each(roomOptions, function(val, text) {
    //   mySelect.append($('<option></option>').val(val).html(text));
    // });
    // app.clearMessages();
    //when a room is selected, it will be :selected
    //use that attr to get the message
    //

    var chatroomSelected = $(this).val();
    var msg = document.querySelectorAll('[data-room="' + chatroomSelected + '"]');
    console.log(msg);
    app.clearMessages();
  // for each chatNode this function searches the data attribute "data-room"
    $.each(msg, function(index, chatNode) {
      var user = chatNode.children[0].innerText.slice(1);
      var text = chatNode.innerText.slice(user.length + 3);
      var obj = {username: user, text: text, roomname: chatroomSelected};
      // console.log(obj);
      app.addMessage(obj);
      // console.log(chatroomSelected);
      // if (chatNode.attributes[1].value === chatroomSelected) {
      //   console.log(chatNode.attributes[1].value);
        //This line of code goes with the above commented out
        // roomOptions.push(chatNode.attributes[1].value);
    });
  });



});
// var myOptions = {
//   val1: 'text1',
//   val2: 'text2'
// };
// var mySelect = $('#roomSelect');
// $.each(myOptions, function(val, text) {
//   mySelect.append($('<option></option>').val(val).html(text));
// });

//https://css-tricks.com/dynamic-dropdowns/
//http://stackoverflow.com/questions/20868180/how-to-populate-dropdown-dynamically
