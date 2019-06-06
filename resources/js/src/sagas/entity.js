import { all, fork, call, put, takeLatest } from 'redux-saga/effects'
import { listEntities } from '../actions';
import { fetchEnities } from '../utils/WebAPI';

function* fetchAllEntities(data) {
  try {
    // trigger request action
    yield put(listEntities.request());
    const response = yield call(fetchEnities, data.payload.query||{});
    // if request successfully finished
    yield put(listEntities.success(response));
  } catch (error) {
    // if request failed
    yield put(listEntities.failure(error));
  } finally {
    // trigger fulfill action
    yield put(listEntities.fulfill());
  }
}

function* listEntitiesWatcher() {
  yield takeLatest(listEntities.TRIGGER, fetchAllEntities)
}

export default function* entityWatcherSaga() {
    yield all([
      fork(listEntitiesWatcher)
    ]);    
}