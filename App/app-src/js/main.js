'use strict';

import ReactDOM from 'react-dom';
import /* * as ReactRedux*/ {connect as reactReduxConnect} from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import StaffAppCls from './staff-app-cls';
import actionCreators from './actions';
import createStore from './store-reducers';
//import {loadStaff, saveStaff, deleteStaff} from './staff-api';
import {loadStaffSaga, saveStaffSaga, deleteStaffSaga} from './sagas';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import '../css/main.css';
import '../index.html';



const mapperStoreStateToProps = function (store) {
	return {
		departments: store.staffApp.departments,
		employees: store.staffApp.employees,
		expanded: store.staffApp.expanded,
		selectedKind: store.staffApp.selectedKind,
		selectedInf: store.staffApp.selectedInf
	};
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(sagaMiddleware);
sagaMiddleware.run(loadStaffSaga);
sagaMiddleware.run(saveStaffSaga);
sagaMiddleware.run(deleteStaffSaga);

const StaffApp = reactReduxConnect(mapperStoreStateToProps, actionCreators)(StaffAppCls);



/*
* Внедрение в страницу
*/
ReactDOM.render(
	<StaffApp store={store} />,
	document.getElementById('staff-app-root')
);
