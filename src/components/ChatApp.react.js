var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var classNames = require('classnames');

var FriendsSection = require('./FriendsSection.react');
var ChatBox = require('./ChatBox.react');
var ChatBoxStore = require('../stores/ChatBoxStore');
var ReactPropTypes = React.PropTypes;

var assign = require('object-assign');

function getStateFromStores() {
  return {
    boxes: ChatBoxStore.getAllBoxes()
  };
}

var CloseBtn = React.createClass({
  propTypes: {
    onClick: ReactPropTypes.func
  },

  render: function () {
    return (
      <div className="close__button" onClick={this._onClick}></div>
    );
  },

  _onClick: function (e) {
    if(this.props.onClick) {
      this.props.onClick(e);
    }
  }
});

var OpenChatBtn = React.createClass({

  propTypes: {
    onClick: ReactPropTypes.func,
    onlineUsers: ReactPropTypes.number,
    chatState: ReactPropTypes.bool
  },

  render: function() {
    var onlineUsers = this.props.onlineUsers ? this.props.onlineUsers : 0;
    return (<button type="button" className={classNames({
      'chat__button': true,
      'hidden': this.props.chatState
    })} onClick={this._onClick}>Open</button>);
  },

  _onClick: function(e) {
    if(this.props.onClick) {
      this.props.onClick(e)
    }
  }

});

var ChatApp = React.createClass({

  getInitialState: function() {
    return assign(getStateFromStores(), {show: false});
  },

  componentDidMount: function() {
    ChatBoxStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function() {
    ChatBoxStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var count = 0;
    var initialPos = 50;
    if(this.state.show) {
      initialPos = 330;
    } else {
      initialPos = 150;
    }
    var chatBoxes = this.state.boxes.map(function(box) {
      count = count + 1;
      return (
        <ChatBox
          key={box.id}
          friend={box.friend}
          count={count}
          initialPos={initialPos}
        />
      );
    }, this);

    var friendsSection = <FriendsSection />
    return (
      <div className="chat__container">
        <OpenChatBtn onClick={this._changeStatus} ref="openChatMsg" chatState={this.state.show} />
        <nav className={classNames({
          "chat": true,
          "show-me": this.state.show
        })}>
          <div className="chat__header">
            Chat
            <CloseBtn onClick={this._changeStatus} />
          </div>
          {friendsSection}
          {chatBoxes}
        </nav>
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange: function() {
    var show = this.state.show;
    this.setState(assign(getStateFromStores(), {show: show}));
  },

  _changeStatus: function(e) {
    var show = this.state.show ? false : true;
    console.log('btn clicked', e.target);
    this.setState(assign(getStateFromStores(), {show: show}));
  }

});

module.exports = ChatApp;
