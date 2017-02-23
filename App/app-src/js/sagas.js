'use strict';

import {call as sagaCall, put as sagaPut, takeEvery as sagaTakeEvery, takeLatest as sagaTakeLatest} from 'redux-saga/effects';
import {loadStaff, saveStaff, deleteStaff} from './staff-api';



function* gLoadStaff (action) {
	try {
		const result = yield sagaCall(loadStaff, action.kind, action.param);
		yield sagaPut({type:'LOAD_OK', ...result});
	}
	catch (err) {
		yield sagaPut({type:'LOAD_ERR', error:'' + err});
	}
}

export function* loadStaffSaga () {
	yield sagaTakeLatest('LOAD_REQUEST', gLoadStaff);
}

function* gSaveStaff (action) {
	try {
		const result = yield sagaCall(saveStaff, action.kind, action.data);
		yield sagaPut({type:'SAVE_OK', ...result});
	}
	catch (err) {
		yield sagaPut({type:'SAVE_ERR', error:'' + err});
	}
}

export function* saveStaffSaga () {
	yield sagaTakeLatest('SAVE_REQUEST', gSaveStaff);
}

function* gDeleteStaff (action) {
	try {
		const result = yield sagaCall(deleteStaff, action.kind, action.id);
		yield sagaPut({type:'DEL_OK', ...result});
	}
	catch (err) {
		yield sagaPut({type:'DEL_ERR', error:'' + err});
	}
}

export function* deleteStaffSaga () {
	yield sagaTakeLatest('DEL_REQUEST', gDeleteStaff);
}
