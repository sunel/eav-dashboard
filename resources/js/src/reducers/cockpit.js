import { toogleSideBar, openDrawer, closeDrawer, updateListPageNo, dataChanged, selectedEntity } from '../actions';

export const initialCockpitState = {
    cockpit: {
        sidebar: {
            open: false,
        },
        globalDrawer: {
            open: false,
            current: null
        },
        list: {
            entity: {
                current: 1,
                size: 10
            },
            attributes: {
                current: 1,
                size: 10,
                entity: null,
            }
        },
        hasChanges: {
            entityViewer : false
        }
    }
};

export const cockpitReducers  = {
    [toogleSideBar]: (state, action) => state.updateIn([ 'cockpit', 'sidebar', 'open' ], value => !value),
    [openDrawer]: (state, action) => {
        return state.updateIn([ 'cockpit', 'globalDrawer', 'open' ], value => true)
            .updateIn([ 'cockpit', 'globalDrawer', 'current' ], value => action.payload);
    },
    [closeDrawer]: (state, action) => {
        return state.updateIn([ 'cockpit', 'globalDrawer', 'open' ], value => false)
        .updateIn([ 'cockpit', 'globalDrawer', 'current' ], value => null);
    },
    [updateListPageNo]: (state, action) => {
        return state.updateIn([ 'cockpit', 'list', action.payload.type, 'current' ], value => action.payload.number)
    },
    [dataChanged]: (state, action) => {
        return state.updateIn([ 'cockpit', 'hasChanges', action.payload.type ], value => action.payload.changed)
    },
    [selectedEntity]: (state, action) => {
        return state.updateIn([ 'cockpit', 'list', 'attributes', 'entity' ], value => action.payload)
    }
};
  