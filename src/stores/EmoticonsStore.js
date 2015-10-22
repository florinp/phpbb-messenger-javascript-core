var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = ChatConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _emoticons = {};

var EmoticonsStore = assign({}, EventEmitter.prototype, {

  init: function(rawEmoticons) {
    rawEmoticons.forEach(function(emoticon){
      var emoticonCode = emoticon.code;
      _emoticons[emoticonCode] = emoticon;
    });
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

  getAllEmoticons: function() {
    var response = [];
    for(var code in _emoticons) {
      var emoticon = _emoticons[code];
      response.push(emoticon);
    }

    return response;
  }

});

EmoticonsStore.dispatchToken = ChatAppDispatcher.register(function(action) {
  switch (action.type) {
    case ActionTypes.LOAD_EMOTICONS:
      EmoticonsStore.init(action.rawEmoticons);
      EmoticonsStore.emitChange();
      break;
    default:

  }
});

module.exports = EmoticonsStore;
