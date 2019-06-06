// eslint-disable-next-line no-unused-vars
import { createSelector } from 'reselect';

export const sideBarState = state => state.app.getIn(['cockpit', 'sidebar', 'open' ]);

export const drawerState = state => state.app.getIn(['cockpit', 'globalDrawer', 'open' ]);

export const drawerData = state => state.app.getIn(['cockpit', 'globalDrawer', 'current' ]);

export const selectListPageNo = (type, state) => state.app.getIn([ 'cockpit', 'list', type, 'current' ]);

export const selectListSize = (type, state) => state.app.getIn([ 'cockpit', 'list', type, 'size' ]);

export const selectCurrentEntity = state => state.app.getIn([ 'cockpit', 'list', 'attributes', 'entity' ]);

export const selectExpandedRow = (type, state) => state.app.getIn([ type, 'expandedRowKeys' ]);

export const hasChanges = (state, type) => state.app.getIn([ 'cockpit', 'hasChanges', type]);

export const getLocation = (state) => state.router.location;

