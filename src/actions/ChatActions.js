var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var ChatWebApiUtils = require('../utils/ChatWebApiUtils');
var ActionTypes = ChatConstants.ActionTypes;

module.exports = {

  openBox: function(friend) {
    ChatAppDispatcher.dispatch({
      type: ActionTypes.OPEN_BOX,
      friend: friend
    })
    ChatWebApiUtils.loadMessages(friend.id);
  },

  closeBox: function(friend) {
    ChatAppDispatcher.dispatch({
      type: ActionTypes.CLOSE_BOX,
      friend: friend
    });
  },

  sendMessage: function(text, friendId) {
    ChatWebApiUtils.sendMessage(text, friendId);
  }

};
