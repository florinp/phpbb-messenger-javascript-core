var React = require('react');
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
    var chatBoxes = this.state.boxes.map(function(box) {
      count = count + 1;
      return (
        <ChatBox
          key={box.id}
          friend={box.friend}
          count={count}
        />
      );
    }, this);

    var friendsSection = <FriendsSection />
    return (
      <div className="chat__container">
        <button type="button" className="chat__button" onClick={this._changeStatus}>Chat (10)</button>
        <nav className={classNames({
          "chat": true,
          "show-me": this.state.show
        })}>
          <div className="chat__header">Users online: 10</div>
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
    var btn = $(e.target);
    if(show) {
      btn.css('right', '320px');
    } else {
      btn.css('right', '20px');
    }
    this.setState(assign(getStateFromStores(), {show: show}));
  }

});

module.exports = ChatApp;
