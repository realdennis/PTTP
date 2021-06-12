import actionType from '../constants/actionType.js';

const initialState = { sessionKey: '', iv: '' };
export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.SET_SESSION_KEY:
      return { ...state, sessionKey: action.payload.sessionKey };
    case actionType.SET_INITIALIZATION_VECTOR:
      return { ...state, iv: action.payload.iv };
    default:
      return state;
  }
};
