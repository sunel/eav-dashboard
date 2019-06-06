import { all, fork, put, takeLatest, select, call } from 'redux-saga/effects';
import { push, LOCATION_CHANGE } from 'connected-react-router';
import { parse, stringify } from 'query-string';
import { dataChanged, reorderSet, saveGroupAttributes, updateListPageNo, expandTable, selectedEntity } from '../actions';
import { getLocation } from '../selectors/cockpit';

function* groupUpdateWatcher(data) {
    yield put(dataChanged({ type: 'entityViewer', changed: true}));
}

function* groupUpdate() {
  yield takeLatest([reorderSet, saveGroupAttributes], groupUpdateWatcher)
}

function* routerChangesWatcher(data) {

  if(data.payload.routerIgnore) return;

  let { pathname, search }  = yield select(getLocation);

  const parsed = yield call(parse, search, {arrayFormat: 'bracket'});

  if(data.type === expandTable.toString()) {

    search = yield call(stringify, Object.assign(parsed, { expand: data.payload.keys }), { arrayFormat: 'bracket' });
    
    yield put(push(`${pathname}?${search}`));
  }

  if(data.type === updateListPageNo.toString()) {

    search = yield call(stringify, Object.assign(parsed, { page: data.payload.number }), { arrayFormat: 'bracket' });
    
    yield put(push(`${pathname}?${search}`));
  }
}

function* watchRouterChanges() {
  yield takeLatest([expandTable, updateListPageNo], routerChangesWatcher)
}

function* locationChangesWatcher(data) {

  let { pathname, search }  = yield select(getLocation);
  const parsed = yield call(parse, search, {arrayFormat: 'bracket'});

  if(pathname === '/entity') {
    yield put(expandTable({ type: 'entity', keys: parsed.expand || [], routerIgnore: true }));
    yield put(updateListPageNo({ type: 'entity', number: parseInt(parsed.page) || 1, routerIgnore: true }));
  }

  if(pathname === '/attributes') {
    yield put(selectedEntity(parsed.entity));
    yield put(updateListPageNo({ type: 'attributes', number: parseInt(parsed.page) || 1, routerIgnore: true }));
  }
}

function* watchLocationChanges() {
  yield takeLatest(LOCATION_CHANGE, locationChangesWatcher)
}

export default function* cockpitWatcherSaga() {
    yield all([
      fork(groupUpdate),
      fork(watchLocationChanges),
      fork(watchRouterChanges),
    ]);    
}