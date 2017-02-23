import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import DepartmentForm from '../app-src/js/department-form';



describe('<DepartmentForm />', () => {
	it('Render new unit creation', () => {
		const cmp = shallow(
			<DepartmentForm onUpdate={jest.fn()} onDelete={jest.fn()} />
		);

		const eId = cmp.find('input[type="hidden"][name="id"]');
		expect(eId.length).toBe(0);

		const eName = cmp.find('input[type="text"][name="name"]');
		expect(eName.length).toBe(1);
		expect(eName.prop('defaultValue')).toBeFalsy();
	});


	it('Render unit editing', () => {
		const entry = {id:7, name:'Department 7'};
		const cmp = shallow(
			<DepartmentForm entry={entry} onUpdate={jest.fn()} onDelete={jest.fn()} />
		);

		const eId = cmp.find('input[type="hidden"][name="id"]');
		expect(eId.length).toBe(1);
		expect(eId.prop('value')).toBe(entry.id);

		const eName = cmp.find('input[type="text"][name="name"]');
		expect(eName.length).toBe(1);
		expect(eName.prop('defaultValue')).toMatch(entry.name);
	});


	it('Clickability', () => {
		const entry = {id:7, name:'Department 7'};
		const onUpdate = jest.fn();
		const onDelete = jest.fn();
		const cmp = mount(
			<DepartmentForm entry={entry} onUpdate={onUpdate} onDelete={onDelete} />
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
		const entry = {id:7, name:'Department 7'};
		const cmp = renderer.create(
			<DepartmentForm entry={entry} onUpdate={jest.fn()} onDelete={jest.fn()} />
		);

		expect(cmp.toJSON()).toMatchSnapshot();
	});
});