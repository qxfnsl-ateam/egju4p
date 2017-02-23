import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import EmployeeForm from '../app-src/js/employee-form';



describe('<EmployeeForm />', () => {
	it('Render new unit creation', () => {
		const cmp = shallow(
			<EmployeeForm onUpdate={jest.fn()} onDelete={jest.fn()} />
		);

		const eId = cmp.find('input[type="hidden"][name="id"]');
		expect(eId.length).toBe(0);

		const eFirstName = cmp.find('input[type="text"][name="firstName"]');
		expect(eFirstName.length).toBe(1);
		expect(eFirstName.prop('defaultValue')).toBeFalsy();

		const eLastName = cmp.find('input[type="text"][name="lastName"]');
		expect(eLastName.length).toBe(1);
		expect(eLastName.prop('defaultValue')).toBeFalsy();

		const eDepartmentId = cmp.find('select[name="departmentId"]');
		expect(eDepartmentId.length).toBe(1);
		expect(eDepartmentId.prop('defaultValue')).toBeFalsy();
	});


	it('Render unit editing', () => {
		const entry = {id:7, firstName:'First_Name', lastName:'Last_Name', departmentId:3};
		const cmp = shallow(
			<EmployeeForm entry={entry} onUpdate={jest.fn()} onDelete={jest.fn()} />
		);

		const eId = cmp.find('input[type="hidden"][name="id"]');
		expect(eId.length).toBe(1);
		expect(eId.prop('value')).toBe(entry.id);

		const eFirstName = cmp.find('input[type="text"][name="firstName"]');
		expect(eFirstName.length).toBe(1);
		expect(eFirstName.prop('defaultValue')).toMatch(entry.firstName);

		const eLastName = cmp.find('input[type="text"][name="lastName"]');
		expect(eLastName.length).toBe(1);
		expect(eLastName.prop('defaultValue')).toMatch(entry.lastName);

		const eDepartmentId = cmp.find('select[name="departmentId"]');
		expect(eDepartmentId.length).toBe(1);
		expect(eDepartmentId.props()).toMatchObject({defaultValue:entry.departmentId});
		expect(eDepartmentId.prop('defaultValue')).toBe(entry.departmentId);
	});


	it('Clickability', () => {
		const entry = {id:7, firstName:'First_Name', lastName:'Last_Name', departmentId:3};
		const onUpdate = jest.fn();
		const onDelete = jest.fn();
		const cmp = mount(
			<EmployeeForm entry={entry} onUpdate={onUpdate} onDelete={onDelete} />
		);

		const eUpdate = cmp.find('button.staff-form-update');
		expect(eUpdate.length).toBe(1);
		expect(eUpdate.prop('onClick')).toBeDefined();

		const eDelete = cmp.find('button.staff-form-delete');
		expect(eDelete.length).toBe(1);
		expect(eDelete.prop('onClick')).toBe(onDelete);

		const evt = {target:{parentNode:{reportValidity:() => true}}};
		eUpdate.simulate('click', evt);
		expect(onUpdate).toBeCalled();
		eDelete.simulate('click', evt);
		expect(onDelete).toBeCalled();
	});


	it('DOM tree', () => {
		const entry = {id:7, firstName:'First_Name', lastName:'Last_Name', departmentId:3};
		const cmp = renderer.create(
			<EmployeeForm entry={entry} onUpdate={jest.fn()} onDelete={jest.fn()} />
		);

		expect(cmp.toJSON()).toMatchSnapshot();
	});
});
