var keyMirror = require('keymirror');

module.exports = {

  ActionTypes: keyMirror({
    OPEN_BOX: null,
    CLOSE_BOX: null,
    GET_FRIENDS: null,
    CREATE_MESSAGE: null,
    RECEIVE_RAW_CREATED_MESSAGE: null,
    RECEIVE_RAW_MESSAGES: null,
    LOAD_EMOTICONS: null
  }),

  urls: {
    getFriendsUrl: '/app.php/messenger/get_friends',
    loadMessagesUrl: '/app.php/messenger/load',
    sendMessageUrl: '/app.php/messenger/publish',
    emoticonsUrl: '/app.php/messenger/emoticons'
  }

};
