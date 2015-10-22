var React = require('react');
var ReactDOM = require('react-dom');
var MessageStore = require('../stores/MessageStore');
var ReactPropTypes = React.PropTypes;
var MessageItem = require('./MessageItem.react');

var ChatWebApiUtils = require('../utils/ChatWebApiUtils');

var $ = require('jquery');

function getStateFromStores(friendId) {
  return {
    messages: MessageStore.getFriendMessages(friendId)
  };
}

var MessagesBody = React.createClass({

  propTypes: {
    friend: ReactPropTypes.object
  },

  getInitialState: function() {
    var friend = this.props.friend;
    return getStateFromStores(friend.id);
  },

  componentDidMount: function() {
    MessageStore.addChangeListener(this._onChange);
    this._scrollToBottom();
    this._setInterval();
  },

  componentWillUnmount: function() {
    MessageStore.removeChangeListener(this._onChange);
    this._clearInterval();
  },

  render: function() {
    var messages = this.state.messages.map(function(message) {
      return(
        <MessageItem
          key={message.id}
          message={message}
        />
      );
    });
    return(
      <div className="msg_wrap">
        <div className="msg_body" ref="messagesList">
          {messages}
          <div className="msg_push"></div>
        </div>
      </div>
    );
  },

  componentDidUpdate: function() {
    this._scrollToBottom();
  },

  componentWillUpdate: function() {
    this._scrollToBottom();
  },

  _setInterval: function() {
    var self = this;
    this.receiveMessagesInterval = setInterval(function() {
      var friend = self.props.friend;
      ChatWebApiUtils.loadMessages(friend.id);
    }, 2200);
  },

  _clearInterval: function() {
    clearInterval(this.receiveMessagesInterval);
  },

  _scrollToBottom: function() {
    var msgBody = this.refs.messagesList.getDOMNode();
    msgBody.scrollTop = msgBody.scrollHeight;
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange: function() {
    var friend = this.props.friend;
    this.setState(getStateFromStores(friend.id));
  },

  _onDrag: function() {
    console.log('start drag');
  }

});

module.exports = MessagesBody;
