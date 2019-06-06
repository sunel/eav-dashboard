import { List } from "immutable";

export const selectEntities = state => state.app.get('entity');

export const selectGroups = (state, id) => state.app.getIn(['sets', 'groups', id]) || new List();

export const selectGroupsArray = (state, id) => state.app.getIn(['sets', 'groups', id]).toJs() || [];

export const selectGroupAttributes = (state, id) => state.app.getIn(['groups', 'attributes', id, 'data']) || new List();

export const selectAttributes = (state, code) => state.app.getIn(['attributes', 'data', code]) || new List();
