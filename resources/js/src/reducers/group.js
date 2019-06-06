import { fromJS } from 'immutable';
import { listGroupsAttributes, saveGroupAttributes, getGroup, saveGroup } from '../actions';

export const initialGroupState = {
    groups: {
        form: {
          loading: false,
          errors: null,
          request: null,
        },
        data: {},
        attributes: {},
        loading: false,
        errors: null,
        links: null,
        meta: null,
    },
};

function getMockData() {
  return {
    data: [],
    loading: true,
    errors: null,
  };
}

export const groupReducers  = {
  [getGroup.TRIGGER]: (state, action) => state.updateIn([ 'groups', 'loading' ], value => true),
  [getGroup.SUCCESS]: (state, action) => state.updateIn([ 'groups', 'data' ], value => value.set(action.payload.data.id, fromJS(action.payload.data))),
  [getGroup.FAILURE]: (state, action) => state.updateIn([ 'groups', 'errors' ], value => action.payload),
  [getGroup.FULFILL]: (state, action) => state.updateIn([ 'groups', 'loading' ], value => false),

  [saveGroup]: (state, action) => {
    return state.updateIn([ 'groups', 'data', action.payload.id ], value => action.payload.group);
  },

  [listGroupsAttributes.TRIGGER]: (state, action) => state.updateIn([ 'groups', 'attributes' ], value => value.set(action.payload.params.group, fromJS(getMockData()))),
  [listGroupsAttributes.SUCCESS]: (state, action) => state.updateIn([ 'groups', 'attributes', action.payload.params.group ], value => value.set('data', fromJS(action.payload.data))),
  [listGroupsAttributes.FAILURE]: (state, action) => state.updateIn([ 'groups', 'attributes', action.payload.params.group ], value => value.set('errors', action.payload)),
  [listGroupsAttributes.FULFILL]: (state, action) => state.updateIn([ 'groups', 'attributes', action.payload.params.group ], value => value.set('loading', false)),

  [saveGroupAttributes]: (state, action) => state.updateIn([ 'groups', 'attributes', action.payload.id, 'data' ], value => fromJS(action.payload.attributes)),

};
