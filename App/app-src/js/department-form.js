'use strict';

import React/*, {Component}*/ from 'react';



/*
* Компонент редактирования свойств отдела
*/
const DepartmentForm = function (props) {
	let entry = props.entry || {};
	return (
		<form className="staff-form staff-form-dep">
			<h4 className="staff-form-title text-primary">Изменить информацию об отделе</h4>
			{entry.id ? <input type="hidden" name="id" value={entry.id} /> : null}
			<div className="form-group">
				<label className="staff-dep-name" htmlFor="staff-dep-name">Название</label>
				<input type="text" className="form-control" id="staff-dep-name" name="name" defaultValue={entry.name} required pattern="[^\\s]{3,}" />
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



export default DepartmentForm;
