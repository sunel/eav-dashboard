import { all, fork, call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { getAttributes } from '../actions';
import { fetchAttributes } from '../utils/WebAPI';

function* attributeWatcher(data) {
  
  yield delay(500);

  try {
    // trigger request action
    yield put(getAttributes.request());
    const response = yield call(fetchAttributes, data.payload.params||{}, data.payload.query||{});
    // if request successfully finished
    yield put(getAttributes.success(response));
  } catch (error) {
    // if request failed
    yield put(getAttributes.failure(error));
  } finally {
    // trigger fulfill action
    yield put(getAttributes.fulfill());
  }
}

function* listSets() {
  yield takeLatest(getAttributes.TRIGGER, attributeWatcher)
}

export default function* attributeWatcherSaga() {
    yield all([
      fork(listSets)
    ]);    
}