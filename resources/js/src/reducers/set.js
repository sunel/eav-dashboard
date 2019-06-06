import { fromJS } from 'immutable';
import { updateSet, reorderSet, listGroups } from '../actions';

export const initialSetState = {
    sets: {
        groups: {},
        loading: false,
        errors: null,
        links: null,
        meta: null,
    }
};

export const setReducers  = {

  [listGroups.TRIGGER]: (state, action) => state.updateIn([ 'sets', 'loading' ], value => true),
  [listGroups.SUCCESS]: (state, action) => { 
      return state.updateIn([ 'sets', 'groups' ], value => value.set(action.payload.params.set, fromJS(action.payload.data)))
        .updateIn([ 'sets', 'links' ], value => action.payload.links)
        .updateIn([ 'sets', 'meta' ], value => action.payload.meta);
  },
  [listGroups.FAILURE]: (state, action) => state.updateIn([ 'sets', 'errors' ], value => action.payload),
  [listGroups.FULFILL]: (state, action) => state.updateIn([ 'sets', 'loading' ], value => false),

  [reorderSet]: (state, action) => { 
    return state.updateIn([ 'sets', 'groups', action.payload.set], value => fromJS(action.payload.groups))
  },
  
  [updateSet]: (state, action) => {
    return state.updateIn([ 'sets', 'groups', action.payload.params.set ], value => value.push(fromJS(action.payload.data)));
  },
};
