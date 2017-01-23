import axios from 'axios';
import _ from 'underscore';

// box actions
export const GET_BOXES = 'GET_BOXES';
export const OPEN_BOX = 'OPEN_BOX';
export const CLOSE_BOX = 'CLOSE_BOX';

// friend actions
export const GET_FRIENDS = 'GET_FRIENDS';
export const GET_FRIENDS_SUCCESS = 'GET_FRIENDS_SUCCESS';
export const GET_FRIENDS_FAILURE = 'GET_FRIENDS_FAILURE';

// messages actions
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';

export const LOAD_MESSAGES = 'LOAD_MESSAGES';
export const LOAD_MESSAGES_SUCCESS = 'LOAD_MESSAGES_SUCCESS';
export const LOAD_MESSAGES_FAILURE = 'LOAD_MESSAGES_FAILURE';

export const LOAD_NEW_MESSAGES = 'LOAD_NEW_MESSAGES'
export const LOAD_NEW_MESSAGES_SUCCESS = 'LOAD_NEW_MESSAGES_SUCCESS';
export const LOAD_NEW_MESSAGES_FAILURE = 'LOAD_NEW_MESSAGES_FAILURE';

export const RESET_MESSAGES = 'RESET_MESSAGES';


const ROOT_URL = '/app.php/messenger';

// friends requests
export function getFriends() {
    const request = axios({
        method: 'get',
        url: `${ROOT_URL}/get_friends`,
        headers: []
    });

    return {
        type: GET_FRIENDS,
        payload: request
    };
}
export function getFriendsSuccess(friends) {
    return {
        type: GET_FRIENDS_SUCCESS,
        payload: friends
    };
}
export function getFriendsFailure(error) {
    return {
        type: GET_FRIENDS_FAILURE,
        payload: error
    };
}


export function loadMessages(friendId) {
    const request = axios({
        method: 'get',
        url: `${ROOT_URL}/load`,
        params: {
            friend_id: friendId
        },
        headers: []
    });

    return {
        type: LOAD_MESSAGES,
        payload: request
    };
}
export function loadMessagesSuccess(friendId, messages) {
    return {
        type: LOAD_MESSAGES_SUCCESS,
        payload: {
            friendId: friendId,
            messages: messages
        }
    };
}
export function loadMessagesFailure(friendId, error) {
    return {
        type: LOAD_MESSAGES_FAILURE,
        payload: {
            friendId: friendId,
            error: error
        }
    }
}

export function sendMessage(receiverId, text) {
    const request = axios({
        method: 'post',
        url: `${ROOT_URL}/publish`,
        data: {
            text: text,
            receiver_id: receiverId
        },
        headers: []
    });

    return {
        type: SEND_MESSAGE,
        payload: request
    };
}
export function sendMessageSuccess(message) {
    return {
        type: SEND_MESSAGE_SUCCESS,
        payload: message
    };
}
export function sendMessageFailure(error) {
    return {
        type: SEND_MESSAGE_FAILURE,
        payload: error
    };
}



export function getBoxes() {
    let jsonBoxes = window.localStorage.getItem('boxes');
    let boxes = [];
    if(jsonBoxes) {
        boxes = JSON.parse(jsonBoxes);
    }

    return {
        type: GET_BOXES,
        payload: boxes
    };
}
export function openBox(friend) {
    let jsonBoxes = window.localStorage.getItem('boxes');
    let boxes = [];
    if(jsonBoxes) {
        boxes = JSON.parse(jsonBoxes);
    }

    let boxId = `msg_${friend.user_id}`;
    let box = _.findWhere(boxes, {id: boxId});

    if(box === undefined) {
        boxes.push({
            id: boxId,
            friend: friend
        });
        window.localStorage.setItem('boxes', JSON.stringify(boxes));
    }

    return {
        type: OPEN_BOX,
        payload: boxes
    };
}
export function closeBox(friend) {
    let jsonBoxes = window.localStorage.getItem('boxes');
    let boxes = [];
    if(jsonBoxes) {
        boxes = JSON.parse(jsonBoxes);
    }

    let boxId = `msg_${friend.user_id}`;
    let box = _.findWhere(boxes, {id: boxId});

    if(box !== undefined) {
        boxes = _.without(boxes, box);
        window.localStorage.setItem('boxes', JSON.stringify(boxes));
    }

    return {
        type: CLOSE_BOX,
        payload: boxes
    };
}
