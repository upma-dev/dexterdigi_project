// sagas/index.js
import { all } from 'redux-saga/effects';
import { watchAuthActions } from './authSaga';
import { watchSidebarMenusSaga } from './sidebarMenusSaga'

export default function* rootSaga() {
    yield all([
        watchSidebarMenusSaga(),
        watchAuthActions()
    ]);
}
