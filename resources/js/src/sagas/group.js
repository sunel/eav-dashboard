import { all, fork, call, put, takeEvery } from 'redux-saga/effects'
import { listGroups, listGroupsAttributes } from '../actions';
import { fetchGroups, fetchGroupsAttributes } from '../utils/WebAPI';

function* listGroupWatcher(data) {
  try {
    // trigger request action
    yield put(listGroups.request());
    const response = yield call(fetchGroups, data.payload.params||{}, data.payload.query||{});
    // if request successfully finished
    yield put(listGroups.success(response));
  } catch (error) {
    // if request failed
    yield put(listGroups.failure(error));
  } finally {
    // trigger fulfill action
    yield put(listGroups.fulfill());
  }
}

function* listGroupsW() {
  yield takeEvery(listGroups.TRIGGER, listGroupWatcher)
}

function* listGroupAttrWatcher(data) {
  try {
    // trigger request action
    yield put(listGroupsAttributes.request());
    const response = yield call(fetchGroupsAttributes, data.payload.params||{}, data.payload.query||{});
    // if request successfully finished
    yield put(listGroupsAttributes.success(response));
  } catch (error) {
    // if request failed
    yield put(listGroupsAttributes.failure(error));
  } finally {
    // trigger fulfill action
    yield put(listGroupsAttributes.fulfill({ params: data.payload.params }));
  }
}

function* listGroupAttr() {
  yield takeEvery(listGroupsAttributes.TRIGGER, listGroupAttrWatcher)
}

export default function* groupWatcherSaga() {
    yield all([
      fork(listGroupsW),
      fork(listGroupAttr)
    ]);    
}