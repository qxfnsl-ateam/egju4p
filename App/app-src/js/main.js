'use strict';

import React/*, {Component}*/ from 'react';
import ReactDOM from 'react-dom';
import * as Redux from 'redux';
import /* * as ReactRedux*/ {Provider, connect as reactReduxConnect} from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import {call as sagaCall, put as sagaPut, takeEvery as sagaTakeEvery, takeLatest as sagaTakeLatest} from 'redux-saga/effects';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import '../css/main.css';
import '../index.html';



const config = {
	// Урлы внешних данных
	urls: {
		list: {
			departments: '/departments?_sort=name&_order=ASC',
			employees: '/employees?departmentId=${departmentId}&_sort=lastName,firstName&_order=ASC'
		},
		create: {
			departments: '/departments',
			employees: '/employees'
		},
		update: {
			departments: '/departments/${id}',
			employees: '/employees/${id}'
		},
		delete: {
			departments: '/departments/${id}',
			employees: '/employees/${id}'
		}
	}
};



/*
* Основной компонент - контейнер приложения
*/
class StaffAppCls extends React.Component {
	componentDidMount () {
		this.props.loadStaff('departments');
	}

	render () {
////////////////////////////////////////////////// ###
		console.log('DBG: StaffAppCls.render: this.props=', this.props, ';');
//////////////////////////////////////////////////
		let {departments, employees, selectedKind, selectedInf} = this.props;
		let depList = departments && departments.length ? departments.map(item => {
			return {value:item.id, title:item.name};
		}) : [];
		let empList = employees && employees.length ? employees.map(item => {
			return {value:item.id, title:`${item.lastName} ${item.firstName}`};
		}) : [];
		return (
			<Provider store={this.props.store}>
				<div className="staff-app container">
					<aside className="staff-app-lf col-sm-4">
						<div className="panel panel-primary">
							<div className="panel panel-heading">
								<h4 className="panel-title">Отделы и сотрудники</h4>
							</div>
							<Menu list={depList} expanded={this.props.expanded} current={selectedKind == 'departments' && selectedInf ? selectedInf.id : null} prefix={'staff-dep-'} onExpand={this.props.expand} onAction={this.props.selectStaff.bind(null, 'departments')}>
								{empList.length ? <Menu list={empList} current={selectedKind == 'employees' && selectedInf ? selectedInf.id : null} prefix={'staff-emp-'} onAction={this.props.selectStaff.bind(null, 'employees')} /> : null}
							</Menu>
						</div>
					</aside>
					<div className="staff-app-rt col-sm-8">
						<h2 className="staff-app-title text-primary">Персонал</h2>
						<button className="staff-app-new-dep btn btn-default" onClick={this.props.newStaff.bind(null, 'departments')}>Новый отдел</button>
						<button className="staff-app-new-emp btn btn-default" onClick={this.props.newStaff.bind(null, 'employees')}>Новый сотрудник</button>
						<div className="panel panel-default">
							<div className="panel panel-body">
								{selectedKind == 'employees'
									? <EmployeeForm entry={selectedInf ? employees.find(item => item.id == selectedInf.id) || selectedInf : null} parents={depList} onUpdate={this.props.saveStaff.bind(null, 'employees')} onDelete={this.props.deleteStaff.bind(null, 'employees')} key={selectedInf ? selectedInf.id : null} />
									: (selectedKind == 'departments'
										? <DepartmentForm entry={selectedInf ? departments.find(item => item.id == selectedInf.id) || selectedInf : null} onUpdate={this.props.saveStaff.bind(null, 'departments')} onDelete={this.props.deleteStaff.bind(null, 'departments')} key={selectedInf ? selectedInf.id : null} />
										: (<p>Ничего не выбрано...<br />Для выбора кликните по пунту меню слева</p>)
									)}
							</div>
						</div>
					</div>
				</div>
			</Provider>
		);
	}
}

StaffAppCls.propTypes = {
	loadStaff: React.PropTypes.func.isRequired,
	expand: React.PropTypes.func.isRequired,
	selectStaff: React.PropTypes.func.isRequired,
	newStaff: React.PropTypes.func.isRequired,
	saveStaff: React.PropTypes.func.isRequired,
	deleteStaff: React.PropTypes.func.isRequired,
	departments: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
	employees: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
	expanded: React.PropTypes.number,
	selectedKind: React.PropTypes.string,
	selectedInf: React.PropTypes.object
}

const mapperStoreStateToProps = function (store) {
	return {
		departments: store.staffApp.departments,
		employees: store.staffApp.employees,
		expanded: store.staffApp.expanded,
		selectedKind: store.staffApp.selectedKind,
		selectedInf: store.staffApp.selectedInf
	};
}

const actionCreators = function (dispatch, props) {
	let stop = (evt) => {
		evt.stopPropagation();
		evt.preventDefault();
	};
	return {
		expand: function (isExpanded, evt) {
			evt.stopPropagation();
			dispatch(isExpanded
				? {type:'COLLAPSE'}
				/*###: {types:['LOAD_REQUEST', 'LOAD_OK', 'LOAD_ERR'], promise:() => loadStaff('employees', evt.target.parentNode.value)}*/
				: {type:'LOAD_REQUEST', kind:'employees', param:evt.target.parentNode.value}
			);
		},
		selectStaff: (kind, evt) => {
			stop(evt);
			dispatch({type:'SELECT', kind:kind, value:evt.target.value});
		},
		newStaff: (kind, evt) => {
			stop(evt);
			dispatch({type:'SELECT', kind:kind});
		},
		loadStaff: (kind, param) => {
			/*###dispatch({types:['LOAD_REQUEST', 'LOAD_OK', 'LOAD_ERR'], promise:() => loadStaff(kind, param)});*/
			dispatch({type:'LOAD_REQUEST', kind:kind, param:param});
		},
		saveStaff: (kind, evt) => {
			stop(evt);
			let form = evt.target.parentNode;
			if (!checkValidity(form)) {
				return;
			}
			let data = [].slice.call(form.elements)
						.filter(e => !!e.name)
						.reduce((acc, e) => { acc[e.name] = e.value; return acc; }, {});
			/*###dispatch({types:['SAVE_REQUEST', 'SAVE_OK', 'SAVE_ERR'], promise:() => saveStaff(kind, data)});*/
			dispatch({type:'SAVE_REQUEST', kind:kind, data:data});
		},
		deleteStaff: (kind, evt) => {
			stop(evt);
			/*###dispatch({types:['DEL_REQUEST', 'DEL_OK', 'DEL_ERR'], promise:() => deleteStaff(kind, evt.target.parentNode.elements.id.value)});*/
			dispatch({type:'DEL_REQUEST', kind:kind, id:evt.target.parentNode.elements.id.value});
		}
	}
}

const loadStaff = function (kind, param) {
	let url = config.urls.list[kind];
	if (kind == 'employees') {
		url = url.replace('${departmentId}', param);
	}
	return fetch(url, {})
		.then(response => {
			if (response.ok) {
				return response.json();//promise
			}
			else {
				throw 'NetworkError: ' + response.status + ' ' + response.statusText + ' ' + response.url;
			}
		})
		.then(answer => {
			if (answer && Array.isArray(answer)) {
				let result = {kind:kind};
				if (kind == 'employees') {
					result.param = param;
				}
				result[kind] = answer;
				return result;
			}
			else {
				throw 'ServerError: No valid data';
			}
		});
}

const saveStaff = function (kind, data) {
	let isNew = !data.id;
	let url = isNew ? config.urls.create[kind] : config.urls.update[kind].replace('${id}', data.id);
	if (isNew) {
		delete data.id;
	}
	return fetch(url, {method:isNew ? 'POST' : 'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)})
		.then(response => {
			if (response.ok) {
				return response.json();//promise
			}
			else {
				throw 'NetworkError: ' + response.status + ' ' + response.statusText + ' ' + response.url;
			}
		})
		.then(answer => {
			let result = {kind:kind, data:answer};
			if (isNew) {
				result.isNew = isNew;
			}
			return result;
		})
}

const deleteStaff = function (kind, id) {
	let url = config.urls.delete[kind].replace('${id}', id);
	return fetch(url, {method:'DELETE'})
		.then(response => {
			if (response.ok) {
				return response.json();//promise
			}
			else {
				throw 'NetworkError: ' + response.status + ' ' + response.statusText + ' ' + response.url;
			}
		})
		.then(answer => {
			return {kind:kind, id:id};
		})
}

const checkValidity = function (form) {
	let isOk = form.reportValidity();
	if (!isOk) {
		[].slice.call(form.elements).forEach(e => {
			if (e.name && e.type != 'hidden') {
				e.parentNode.classList.add(e.checkValidity() ? 'has-success' : 'has-error');
			}
		});
	}
	return isOk;
}

const StaffApp = reactReduxConnect(mapperStoreStateToProps, actionCreators)(StaffAppCls);



/*
* Компонент левого меню (универсальный)
*/
const Menu = function (props) {
	let {list, prefix, onExpand} = props;
	prefix = prefix || '';
	return (
		<ul className="staff-menu list-group">
			{list.length ? list.map(item => {
				let isExp = props.expanded == item.value;
				return <li className={'staff-menu-item' + (props.current == item.value ? ' on' : '') + ' list-group-item'} key={prefix + item.value} value={item.value} onClick={props.onAction}>
					{item.title}
					{onExpand ? <button className={'staff-menu-exp' + (isExp ? ' on' : '')} onClick={onExpand.bind(null, isExp)} /> : null}
					{isExp ? props.children || <div className={'staff-menu-empty'}>Нет сотрудников</div> : null}
				</li>
			}) : null}
		</ul>
	);
}



/*
* Компонент редактирования свойств отдела
*/
const DepartmentForm = function (props) {
////////////////////////////////////////////////// ###
	console.log('DBG: DepartmentForm: props=', props, ';');
//////////////////////////////////////////////////
	let entry = props.entry || {};
	return (
		<form className="staff-form staff-form-dep">
			<h4 className="staff-form-title text-primary">Изменить информацию об отделе</h4>
			{entry.id ? <input type="hidden" name="id" value={entry.id} /> : null}
			<div className="form-group">
				<label className="staff-dep-name" htmlFor="staff-dep-name">Название</label>
				<input type="text" className="form-control" id="staff-dep-name" name="name" defaultValue={entry.name} required pattern="[^\\s]{3,}" />
			</div>
			<button className="staff-form-update btn btn-default" onClick={props.onUpdate}>Сохранить</button>
			<button className="staff-form-delete btn btn-danger" onClick={props.onDelete}>Удалить</button>
			<button className="staff-form-reset btn btn-default" type="reset">Сбросить</button>
		</form>
	);
}



/*
* Компонент редактирования свойств сотрудника
*/
const EmployeeForm = function (props) {
////////////////////////////////////////////////// ###
	console.log('DBG: EmployeeForm: props=', props, ';');
//////////////////////////////////////////////////
	let entry = props.entry || {};
	let parents = props.parents;
	return (
		<form className="staff-form staff-form-emp" onReset={evt => {
				let s = evt.target.querySelector('select');
				setTimeout(() => {
					s.selectedIndex = [].slice.call(s.options).findIndex(o => o.value == entry.departmentId);
				}, 50);
			}}>
			<h4 className="staff-form-title text-primary">Изменить информацию о сотруднике</h4>
			{entry.id ? <input type="hidden" name="id" value={entry.id} /> : null}
			<div className="form-group">
				<label className="staff-emp-firstName" htmlFor="staff-emp-firstName">Имя</label>
				<input type="text" className="form-control" id="staff-emp-firstName" name="firstName" defaultValue={entry.firstName} required pattern="[^\\s]{3,}" />
			</div>
			<div className="form-group">
				<label className="staff-emp-lastName" htmlFor="staff-emp-lastName">Фамилия</label>
				<input type="text" className="form-control" id="staff-emp-lastName" name="lastName" defaultValue={entry.lastName} required pattern="[^\\s]{3,}" />
			</div>
			<div className="form-group">
				<label className="staff-emp-parent3" htmlFor="staff-emp-parent3">Отдел</label>
				<select className="form-control" id="staff-emp-parent3" name="departmentId" defaultValue={entry.departmentId} required>
					<option value="">Выберите отдел</option>
					{parents && parents.length ? parents.map(item => <option value={item.value}>{item.title}</option>) : null}
				</select>
			</div>


			<button className="staff-form-update btn btn-default" onClick={props.onUpdate}>Сохранить</button>
			<button className="staff-form-delete btn btn-danger" onClick={props.onDelete}>Удалить</button>
			<button className="staff-form-reset btn btn-default" type="reset">Сбросить</button>
		</form>
	);
}



/*
* Хранилище состояний Redux
*/
const createStore = function (initData) {
	let initStates = {staffApp:{departments:[], employees:[], expanded:null, selectedKind:null, selectedInf:null}};
	let reducers = {
		staffApp: function (state = initStates.staffApp, action) {
////////////////////////////////////////////////// ###
			console.log('DBG: reducers.staffApp: action=', action, ';');
//////////////////////////////////////////////////
			let sorters = {
				departments: (a, b) => a.name < b.name ? -1 : (a.name == b.name ? 0 : 1),
				employees: (a, b) => a.lastName < b.lastName ? -1 : (a.lastName == b.lastName ? (a.firstName < b.firstName ? -1 : (a.firstName == b.firstName ? 0 : 1)) : 1)
			};
			let stNew, acKind;
			switch(action.type) {
				case 'COLLAPSE':
					return {...state, expanded:null};
				case 'SELECT':
					return {...state, selectedKind:action.kind, selectedInf:action.value ? {id:action.value} : null};

				case 'LOAD_REQUEST':
					return state;
				case 'LOAD_OK':
					acKind = action.kind;
					stNew = {...state, expanded:acKind == 'employees' ? action.param : null};
					stNew[acKind] = action[acKind];
					// Отсортировать, если нет строгой уверенности, что они пришли уже отсортироваными...
					stNew[acKind].sort(sorters[acKind]);
					return stNew;

				case 'SAVE_REQUEST':
					return state;
				case 'SAVE_OK':
					acKind = action.kind;
					let acData = action.data;
					let lst = state[acKind];
					let acIsNew = action.isNew;
					let i = acIsNew ? -1 : lst.findIndex(item => item.id == acData.id);
					if (acKind == 'employees') {
						if (i != -1) {
							stNew = {...state};
							if (lst[i].departmentId == acData.departmentId) {
								stNew[acKind] = [...lst];
								stNew[acKind][i] = acData;
								stNew[acKind].sort(sorters[acKind]);
							}
							else {
								stNew[acKind] = lst.filter((item, j) => j != i);
							}
						}
						else {
							if (state.expanded == acData.departmentId) {
								stNew = {...state};
								stNew[acKind] = [...lst];
								stNew[acKind].push(acData);
								stNew[acKind].sort(sorters[acKind]);
								if (acIsNew) {
									stNew.selectedInf = acData;
								}
							}
							else {
								if (acIsNew) {
									stNew = {...state, selectedInf:acData};
								}
								else {
									return state;
								}
							}
						}
					}
					else {
						stNew = {...state};
						stNew[acKind] = [...state[acKind]];
						if (i != -1) {
							stNew[acKind][i] = acData;
						}
						else {
							stNew[acKind].push(acData);
						}
						stNew[acKind].sort(sorters[acKind]);
						if (acIsNew) {
							stNew.selectedInf = acData;
						}
					}
					return stNew;

				case 'DEL_REQUEST':
					return state;
				case 'DEL_OK':
					acKind = action.kind;
					let acId = action.id;
					stNew = {...state, selectedKind:null, selectedInf:null};
					if (acKind == 'departments' && state.expanded == acId) {
						stNew.expanded = null;
					}
					stNew[acKind] = stNew[acKind].filter(e => e.id != acId);
					return stNew;

				case 'LOAD_ERR':
				case 'SAVE_ERR':
				case 'DEL_ERR':
					console.log(action.error);
				default:
					return state;
			}
		}
	};

	let r = Redux.combineReducers(reducers);
	let store = Redux.applyMiddleware(/*###cmiddleware*/sagaMiddleware)(Redux.createStore)(r, initData);
	return store;
}

/*###const middleware = function () {
	return (next) => (action) => {
		const {promise, types, ...rest} = action;
		if( !promise ) {
			return next(action);
		}
		const [REQUEST, SUCCESS, FAILURE] = types;
		next({type:REQUEST, ...rest});
		return promise().then(
			(result) => {
				next({type:SUCCESS, ...result, ...rest});
			},
			(err) => {
				next({type:FAILURE, error:'' + err, ...rest});
			}
		);
	}
}*/

function* gLoadStaff (action) {
	try {
		const result = yield sagaCall(loadStaff, action.kind, action.param);
		yield sagaPut({type:'LOAD_OK', ...result});
	}
	catch (err) {
		yield sagaPut({type:'LOAD_ERR', error:'' + err});
	}
}

function* loadStaffSaga () {
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

function* saveStaffSaga () {
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

function* deleteStaffSaga () {
	yield sagaTakeLatest('DEL_REQUEST', gDeleteStaff);
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore();
sagaMiddleware.run(loadStaffSaga);
sagaMiddleware.run(saveStaffSaga);
sagaMiddleware.run(deleteStaffSaga);


/*
* Внедрение в страницу
*/
ReactDOM.render(
	<StaffApp store={store} />,
	document.getElementById('staff-app-root')
);
