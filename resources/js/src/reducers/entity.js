import { fromJS } from 'immutable';
import { listEntities, saveEntity, expandTable, saveSet } from '../actions';

export const initialEntityState = {
    entity: {
        data: [],
        loading: false,
        errors: null,
        links: null,
        meta: null,
        expandedRowKeys: [],
    }
};

export const entityReducers  = {
  [listEntities.TRIGGER]: (state, action) => state.updateIn([ 'entity', 'loading' ], value => true),
  [listEntities.SUCCESS]: (state, action) => { 
      return state.updateIn([ 'entity', 'data' ], value => fromJS(action.payload.data))
        .updateIn([ 'entity', 'links' ], value => action.payload.links)
        .updateIn([ 'entity', 'meta' ], value => action.payload.meta);
  },
  [listEntities.FAILURE]: (state, action) => state.updateIn([ 'entity', 'errors' ], value => action.payload),
  [listEntities.FULFILL]: (state, action) => state.updateIn([ 'entity', 'loading' ], value => false),
  [saveEntity]: (state, action) => { 
      return state;
  },
  [expandTable]: (state, action) => {
    if(action.payload.type !== 'entity') return state; 
    return state.updateIn([ 'entity', 'expandedRowKeys' ], value => fromJS(action.payload.keys));
  },

  [saveSet]: (state, action) => {
    return state.updateIn([ 'entity', 'data', action.payload.entity, 'sets' ], value => value.push(fromJS(action.payload.response.data)));
  }
};
