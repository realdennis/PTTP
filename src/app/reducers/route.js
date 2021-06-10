import actionType from '../constants/actionType.js';

export default (state = 'initial', action) => {
  switch (action.type) {
    case actionType.ROUTE_CHANGE:
      return action.payload.route;
    default:
      return state;
  }
};
