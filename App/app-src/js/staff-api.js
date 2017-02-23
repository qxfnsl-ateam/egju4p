'use strict';



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



export {loadStaff, saveStaff, deleteStaff};
