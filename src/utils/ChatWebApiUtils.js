var ServerActions = require('../actions/ServerActions');
var ChatConstants = require('../constants/ChatConstants');
var $ = require('jquery');

var urls = ChatConstants.urls;

module.exports = {

  getFriends: function() {
    // http://phpbb.dev/app.php/messenger/get_friends
    $.getJSON(urls.getFriendsUrl, {}, function(data) {
      ServerActions.getFriends(data.friends_list);
    });
  },

  loadMessages: function(friendId) {
    $.getJSON(urls.loadMessagesUrl, {friend_id: friendId}, function(data) {
      ServerActions.loadMessages(friendId, data);
    });
  },

  sendMessage: function(text, friendId) {
    $.post(urls.sendMessageUrl, {
      text: text,
      receiver_id: friendId
    }, function(data) {
      ServerActions.receiveMessageSent(data);
    });
  },

  getEmoticons: function() {
    $.getJSON(urls.emoticonsUrl, function(data) {
      ServerActions.loadEmoticons(data);
    });
  }

};
