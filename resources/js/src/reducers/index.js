import { fromJS } from 'immutable';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { handleActions  } from 'redux-actions';
import { initialEntityState, entityReducers } from './entity';
import { initialAttributeState, attributeReducers } from './attribute';
import { initialSetState, setReducers } from './set';
import { initialGroupState, groupReducers } from './group';
import { initialCockpitState, cockpitReducers } from './cockpit';

const app = handleActions({
    ...entityReducers,
    ...attributeReducers,
    ...setReducers,
    ...groupReducers,
    ...cockpitReducers
}, fromJS({
    ...initialEntityState,
    ...initialAttributeState,
    ...initialSetState,
    ...initialGroupState,
    ...initialCockpitState
}));

export default (history) => combineReducers({
    router: connectRouter(history),
    app,
});