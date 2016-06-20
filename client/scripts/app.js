// YOUR CODE HERE:


var app = {

};

app.init = function() {};

app.send = function(message) {
  var name = window.location.search.slice(10);
  var text = $('.input').val();
  var room = room; //TODO
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      return data;
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
  return;
};

app.fetch = function() {
  $(document).ready(function() {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      data: 'json',
      contentType: 'application/json',
      success: function(data) {
        $.each(data, function(index, val) {
          this.addMessage(val);
        });
      },
      error: function(data) {
        console.log('error');
      }
    });
    return;
  });
};

app.addMessage = function(message) {
  $('#chats').append('<div class="chat">' + message.username + ':\n' + message.text + '</div>' );
};

app.server = 'https://api.parse.com/1/classes/messages';

app.clearMessages = function() {
  $('#chats').empty();
};

app.addRoom = function(room) {
  $('#roomSelect').append('<option value="value2">' + room + '</option>');
};
