var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = ChatConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _currentID = null;
var _friends = {};

var FriendStore = assign({}, EventEmitter.prototype, {

  init: function(rawFriends) {
    rawFriends.forEach(function(friend) {
      var friendID = friend.user_id;
      _friends[friendID] = {
        id: friendID,
        username: friend.username,
        userColor: friend.user_colour,
        userStatus: friend.user_status,
		userAvatar: friend.user_avatar
      };
    }, this);
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  /**
   * @param {string} id
   */
  get: function(id) {
    return _friends[id];
  },

  getAll: function() {
    return _friends;
  },

  getAllChrono: function() {
    var response = [];
    for(var id in _friends) {
      var friend = _friends[id];
      response.push(friend);
    }

    return response;
  },

  getCurrentID: function() {
    return _currentID;
  },

  getCurrent: function() {
    return this.get(this.getCurrentID());
  }

});

FriendStore.dispatchToken = ChatAppDispatcher.register(function(action) {

  switch (action.type) {
    case ActionTypes.GET_FRIENDS:
      FriendStore.init(action.friends);
      FriendStore.emitChange();
      break;
    default:

  }

});

module.exports = FriendStore;
