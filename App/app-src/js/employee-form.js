'use strict';

import React/*, {Component}*/ from 'react';



/*
* Компонент редактирования свойств сотрудника
*/
const EmployeeForm = function (props) {
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


			<button className="staff-form-update btn btn-default" onClick={evt => {
				let f = evt.target.parentNode;
				if (f.reportValidity()) {
					props.onUpdate(evt);
				}
				else {
					[].slice.call(f.elements).forEach(e => {
						if (e.name && e.type != 'hidden') {
							let isOk = e.checkValidity();
							let cls = e.parentNode.classList;
							cls.remove(isOk ? 'has-error' : 'has-success');
							cls.add(isOk ? 'has-success' : 'has-error');
						}
					});
				}				
			}}>Сохранить</button>
			<button className="staff-form-delete btn btn-danger" onClick={props.onDelete}>Удалить</button>
			<button className="staff-form-reset btn btn-default" type="reset">Сбросить</button>
		</form>
	);
}



export default EmployeeForm;
