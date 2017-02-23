'use strict';

import * as Redux from 'redux';



/*
* Хранилище состояний Redux
*/
const createStore = function (middleware, initData) {
	let initStates = {staffApp:{departments:[], employees:[], expanded:null, selectedKind:null, selectedInf:null}};
	let reducers = {
		staffApp: function (state = initStates.staffApp, action) {
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
	let store = Redux.applyMiddleware(middleware)(Redux.createStore)(r, initData);
	return store;
}



export default createStore;
