var React = require('react');
var FriendStore = require('../stores/FriendStore');
var FriendItem = require('./FriendItem.react')

function getStateFromStores() {
  return {
    friends: FriendStore.getAllChrono()
  };
}

var FriendsSection = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    FriendStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function() {
    FriendStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var friendsListItems = this.state.friends.map(function(friend) {
      return (
        <FriendItem
          key={friend.id}
          friend={friend}
        />
      );
    }, this);
    return (
      <div className="chat_body">
        {friendsListItems}
        <div className="search">
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/elastic-srch.png" alt="" className="search-img"></img>
          <input type="text" className="search-input" placeholder="Search" />
        </div>
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = FriendsSection;
