var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = ChatConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _friendId = null;
var _messages = {};
var _friend = {};

function _addMessages(friendId, rawMessages) {
  _messages[friendId] = [];
  if(rawMessages.length > 0) {
    rawMessages.forEach(function(message) {
      _messages[friendId].push(message);
    });
  }
}

var MessageStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function(id) {
    return _messages[id];
  },

  getAll: function() {
    return _messages;
  },

  getAllMessages: function() {
    var msgs = [];
    for (var id in _messages) {
        var messages = _messages[id];
        for(var i = 0; i < messages.length; i++) {
            var message = messages[i];
            msgs.push(message);
        }
    }
    msgs.sort(function(a, b) {
      if(a.sentAt < b.sentAt) {
        return -1;
      } else if(a.sentAt > b.sentAt) {
        return 1;
      }
      return 0;
    });

    return msgs;
  },

  getFriendMessages: function(friendId) {
    var messages = _messages[friendId];
    var msgs = [];
    if(messages) {
      for(var i = 0; i < messages.length; i++) {
        var message = messages[i];
        msgs.push(message);
      }
    }

    msgs.sort(function(a, b) {
      if(a.sentAt < b.sentAt) {
        return -1;
      } else if(a.sentAt > b.sentAt) {
        return 1;
      }
      return 0;
    });

    return msgs;
  }
});

MessageStore.dispatchToken = ChatAppDispatcher.register(function(action) {

  switch (action.type) {
    case ActionTypes.RECEIVE_RAW_MESSAGES:
      _addMessages(action.friendId, action.rawMessages);
      MessageStore.emitChange();
      break;
    case ActionTypes.CREATE_MESSAGE:
      var message = action.rawMessage;
      var friendId = message.receiver_id;
      message.type = 'sent';
      _messages[friendId].push(message);
      MessageStore.emitChange();
      break;
    default:

  }

});

module.exports = MessageStore;
