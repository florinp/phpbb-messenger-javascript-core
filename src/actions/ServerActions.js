var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var ActionTypes = ChatConstants.ActionTypes;

module.exports = {

  getFriends: function(rawFriends) {
    ChatAppDispatcher.dispatch({
      type: ActionTypes.GET_FRIENDS,
      friends: rawFriends
    });
  },

  loadMessages: function(friendId, rawMessages) {
    ChatAppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_RAW_MESSAGES,
      rawMessages: rawMessages,
      friendId: friendId
    });
  },

  receiveMessageSent: function(data) {
    ChatAppDispatcher.dispatch({
      type: ActionTypes.CREATE_MESSAGE,
      rawMessage: data.message
    });
  },

  loadEmoticons: function(data) {
    ChatAppDispatcher.dispatch({
      type: ActionTypes.LOAD_EMOTICONS,
      rawEmoticons: data
    });
  }

};
