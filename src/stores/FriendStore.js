import { EventEmitter } from 'events';
import assign from 'object-assign';

import Dispatcher from '../dispatcher/Dispatcher';
import {
    GET_FRIENDS,
    GET_FRIENDS_SUCCESS,
    GET_FRIENDS_FAILURE,
    getFriendsSuccess,
    getFriendsFailure
} from '../actions/chat';

const CHANGE_EVENT = 'change';
const ERROR_EVENT = 'error';

let _currentID = null;
let _friends = {};
let _friendsOnline = 0;

let FriendStore = assign({}, EventEmitter.prototype, {

    addData: function(friends, friendsOnline) {
        friends.forEach((friend) => {
            _friends[friend.user_id] = {
                id: friend.user_id,
                username: friend.username,
                userColor: friend.user_colour,
                userStatus: friend.user_status,
                userAvatar: friend.user_avatar
            };
        }, this);
        _friendsOnline = friendsOnline
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    emitError: function(error) {
        this.emit(ERROR_EVENT, error);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    addErrorListener: function(callback) {
        this.on(ERROR_EVENT, callback);
    },

    removeErrorListener: function(callback) {
        this.removeListener(ERROR_EVENT, callback);
    },

    get: function (id) {
        return _friends[id];
    },

    getAll: function () {
        return _friends;
    },

    getAllChrono: function () {
        let response = [];
        for (let id in _friends) {
            let friend = _friends[id];
            response.push(friend);
        }

        return response;
    },

    getCurrentID: function () {
        return _currentID;
    },

    getCurrent: function () {
        return this.get(this.getCurrentID());
    }

});

FriendStore.dispatchToken = Dispatcher.register(function (action) {

    switch (action.type) {
        case GET_FRIENDS:
            action.request.then((response) => {
                getFriendsSuccess(response.data.friends_list, response.data.friends_online);
            }).catch((error) => {
                getFriendsFailure(error);
            });
        break;

        case GET_FRIENDS_SUCCESS:
            FriendStore.addData(action.friends, action.friends_online);
            FriendStore.emitChange();
        break;

        case GET_FRIENDS_FAILURE:
            FriendStore.emitError(action.error);
        break;

        default:

    }

});

export default FriendStore;
