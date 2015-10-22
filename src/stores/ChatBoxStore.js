var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = ChatConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _chatBoxes = {};

function _addBox(friend) {
  var boxId = 'msg_' + friend.id;
  if(_chatBoxes[boxId]) {
    return false;
  } else {
    _chatBoxes[boxId] = {
      id: boxId,
      friend: friend
    };
    return true;
  }
}

function _removeBox(friend) {
    var boxId = 'msg_' + friend.id;
    if(_chatBoxes[boxId]) {
      delete _chatBoxes[boxId];
    }
}

var ChatBoxStore = assign({}, EventEmitter.prototype, {

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
    return _chatBoxes[id];
  },

  getAll: function() {
    return _chatBoxes;
  },

  count: function() {
    return _chatBoxes.length;
  },

  getAllBoxes: function() {
    var boxes = [];
    for (var id in _chatBoxes) {
        boxes.push(_chatBoxes[id]);
    }

    return boxes;
  }

});

ChatBoxStore.dispatchToken = ChatAppDispatcher.register(function(action) {

  switch (action.type) {
    case ActionTypes.OPEN_BOX:
      if(_addBox(action.friend)) {
        ChatBoxStore.emitChange();
      }
      break;
    case ActionTypes.CLOSE_BOX:
      _removeBox(action.friend);
      ChatBoxStore.emitChange();
      break;
    default:

  }

});

module.exports = ChatBoxStore;
