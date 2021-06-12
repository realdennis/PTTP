import actionType from '../constants/actionType.js';

const initialState = {
  selfUser: {
    peerID: '',
    nickname: '',
    pubKey: '',
  },
  connectedUser: {
    peerID: '',
    nickname: '',
    pubKey: '',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.SET_SELF_USER_INFO:
      return Object.assign({}, state, {
        selfUser: {
          ...action.payload,
        },
      });
    case actionType.SET_CONNECTED_USER_INFO:
      return Object.assign({}, state, {
        connectedUser: {
          ...action.payload,
        },
      });
    default:
      return state;
  }
};
