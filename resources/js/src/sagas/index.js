import { all, fork } from 'redux-saga/effects';
import entitySaga from './entity';
import attributeWatcherSaga from './attribute';
import groupWatcherSaga from './group';
import cockpitWatcherSaga from './cockpit';

// use them in parallel
export default function* rootSaga() {
    yield all([
        fork(entitySaga),
        fork(attributeWatcherSaga),
        fork(groupWatcherSaga),
        fork(cockpitWatcherSaga),
    ]);
};