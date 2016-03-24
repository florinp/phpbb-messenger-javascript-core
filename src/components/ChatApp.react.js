var React = require('react');
var FriendsSection = require('./FriendsSection.react');
var ChatBox = require('./ChatBox.react');
var ChatBoxStore = require('../stores/ChatBoxStore');

var assign = require('object-assign');

function getStateFromStores() {
  return {
    boxes: ChatBoxStore.getAllBoxes()
  };
}

var ChatApp = React.createClass({

  getInitialState: function() {
    return assign(getStateFromStores(), {show: true});
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

    var friendsSection = '';
    if(this.state.show == true) {
      friendsSection = <FriendsSection />
    }

    return (
      <div className="chat_box">
        <div className="chat_head" onClick={this._changeStatus}>
          <div className="title">Chat Box</div>
          <div className="options"></div>
        </div>
        {friendsSection}
        {chatBoxes}
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

  _changeStatus: function() {
      var show;
      if(this.state.show == true) {
        show = false;
      } else {
        show = true;
      }
      this.setState(assign(getStateFromStores(), {show: show}));
  }

});

module.exports = ChatApp;
