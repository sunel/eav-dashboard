import { fromJS } from 'immutable';
import { saveAttributes, getAttributes, addAttributes, updateAttribute } from '../actions';

export const initialAttributeState = {
    attributes: {
        data: {},
        links: null,
        meta: null,
        loading: false,
        errors: null,
    }
};

export const attributeReducers  = {
  [getAttributes.TRIGGER]: (state, action) => state.updateIn([ 'attributes', 'loading' ], value => true),
  [getAttributes.SUCCESS]: (state, action) => {
    return state.updateIn([ 'attributes', 'data' ], value => value.set(action.payload.params.entity, fromJS(action.payload.data)))
                .updateIn([ 'attributes', 'links' ], value => action.payload.links)
                .updateIn([ 'attributes', 'meta' ], value => action.payload.meta);
  },
  [getAttributes.FAILURE]: (state, action) => state.updateIn([ 'attributes', 'errors' ], value => action.payload),
  [getAttributes.FULFILL]: (state, action) => state.updateIn([ 'attributes', 'loading' ], value => false),
  [saveAttributes]: (state, action) => { 
    return state.updateIn([ 'attributes', 'data', action.payload.entity ], value => fromJS(action.payload.attributes));
  },
  [addAttributes]: (state, action) => {

    if(state.getIn([ 'attributes', 'data', action.payload.entity ])) {
      return state.updateIn([ 'attributes', 'data', action.payload.entity ], value => value.push(fromJS(action.payload.data.data)));
    }

    return state.updateIn([ 'attributes', 'data' ], value => value.set(action.payload.entity, fromJS([action.payload.data.data])))
                .updateIn([ 'attributes', 'links' ], value => action.payload.data.links);
  },

  [updateAttribute]: (state, action) => {
    return state.updateIn([ 'attributes', 'data', action.payload.entity ], value => value.set(action.payload.attribute, fromJS(action.payload.data.data)));
  },
};
