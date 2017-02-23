import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import StaffAppCls from '../app-src/js/staff-app-cls';
import Menu from '../app-src/js/staff-app-cls';
import DepartmentForm from '../app-src/js/department-form';
import EmployeeForm from '../app-src/js/employee-form';



describe('<StaffAppCls />', () => {
	it('Render StaffAppCls', () => {
		const departments = [{id:1, name:'Department 1'}, {id:2, name:'Department 2'}, {id:3, name:'Department 3'}];
		const employees = [{id:1, firstName:'First 1', lastName:'Last 1', departmentId:2}, {id:2, firstName:'First 2', lastName:'Last 2', departmentId:2}];
		const selectedKind = 'departments';//'employees'
		const selectedInf = {id:1};
		const expanded = 2;
		const expand = jest.fn();
		const loadStaff = jest.fn();
		const selectStaff = jest.fn();
		const newStaff = jest.fn();
		const saveStaff = jest.fn();
		const deleteStaff = jest.fn();
		const store = {subscribe:jest.fn(), dispatch:jest.fn(), getState:jest.fn()}
		const cmp = shallow(
			<StaffAppCls departments={departments} employees={employees} selectedKind={selectedKind} selectedInf={selectedInf} expanded={expanded} expand={expand} loadStaff={loadStaff} selectStaff={selectStaff} newStaff={newStaff} saveStaff={saveStaff} deleteStaff={deleteStaff} store={store} />
		);

		const eApp = cmp.find('.staff-app');
		expect(eApp.length).toBe(1);

		const eLeft = eApp.find('.staff-app-lf');
		expect(eLeft.length).toBe(1);
		const eMenu = eLeft.find('Menu');
		expect(eMenu.length).toBe(expanded ? 2 : 1);

		expect(eMenu.at(0).prop('list')).toMatchObject(departments.map(item => {
			return {value:item.id, title:item.name};
		}));
		expect(eMenu.at(0).prop('current')).toBe(selectedKind == 'departments' && selectedInf ? selectedInf.id : null);
		expect(eMenu.at(0).prop('expanded')).toBe(expanded);
		expect(eMenu.at(0).prop('prefix')).toMatch('staff-dep-');
		expect(eMenu.at(0).prop('onExpand')).toBe(expand);
		expect(eMenu.at(0).prop('onAction')).toBeDefined();
		if (expanded) {
			expect(eMenu.at(1).prop('list')).toMatchObject(employees.map(item => {
				return {value:item.id, title:`${item.lastName} ${item.firstName}`};
			}));
			expect(eMenu.at(1).prop('current')).toBe(selectedKind == 'employees' && selectedInf ? selectedInf.id : null);
			expect(eMenu.at(1).prop('expanded')).toBeFalsy();
			expect(eMenu.at(1).prop('prefix')).toMatch('staff-emp-');
			expect(eMenu.at(1).prop('onExpand')).toBeFalsy();
			expect(eMenu.at(0).prop('onAction')).toBeDefined();
		}

		const eRight = eApp.find('.staff-app-rt');
		expect(eRight.length).toBe(1);

		const eButs = eRight.find('button.staff-app-new');
		expect(eButs.length).toBe(2);
		eButs.forEach((eBut, i) => {
			expect(eBut.prop('onClick')).toBeDefined();
			eBut.simulate('click');
			expect(newStaff).toBeCalled();
		});

		const eDepForm = eRight.find('DepartmentForm');
		expect(eDepForm.length).toBe(selectedKind == 'departments' ? 1 : 0);
		if (selectedKind == 'departments') {
			expect(eDepForm.prop('entry')).toBe(selectedInf ? departments.find(item => item.id == selectedInf.id) || selectedInf : null);
			expect(eDepForm.prop('onUpdate')).toBeDefined();
			expect(eDepForm.prop('onDelete')).toBeDefined();
			expect(eDepForm.key()).toMatch(selectedInf ? '' + selectedInf.id : null);
		}

		const eEmpForm = eRight.find('EmployeeForm');
		expect(eEmpForm.length).toBe(selectedKind == 'employees' ? 1 : 0);
		if (selectedKind == 'employees') {
			expect(eEmpForm.prop('entry')).toBe(selectedInf ? employees.find(item => item.id == selectedInf.id) || selectedInf : null);
			expect(eEmpForm.prop('onUpdate')).toBeDefined();
			expect(eEmpForm.prop('onDelete')).toBeDefined();
			expect(eEmpForm.key()).toMatch(selectedInf ? '' + selectedInf.id : null);
		}

		const eNoForm = eRight.find('.staff-no-form');
		expect(eNoForm.length).toBe(!selectedKind ? 1 : 0);
	})


	it('Render StaffAppCls', () => {
		const departments = [{id:1, name:'Department 1'}, {id:2, name:'Department 2'}, {id:3, name:'Department 3'}];
		const employees = [{id:1, firstName:'First 1', lastName:'Last 1', departmentId:2}, {id:2, firstName:'First 2', lastName:'Last 2', departmentId:2}];
		const selectedKind = 'departments';//'employees'
		const selectedInf = {id:1};
		const expanded = 2;
		const expand = jest.fn();
		const loadStaff = jest.fn();
		const selectStaff = jest.fn();
		const newStaff = jest.fn();
		const saveStaff = jest.fn();
		const deleteStaff = jest.fn();
		const store = {subscribe:jest.fn(), dispatch:jest.fn(), getState:jest.fn()}
		const cmp = mount(
			<StaffAppCls departments={departments} employees={employees} selectedKind={selectedKind} selectedInf={selectedInf} expanded={expanded} expand={expand} loadStaff={loadStaff} selectStaff={selectStaff} newStaff={newStaff} saveStaff={saveStaff} deleteStaff={deleteStaff} store={store} />
		);

		expect(loadStaff).toBeCalled();
	})


	it('DOM tree', () => {
		const departments = [{id:1, name:'Department 1'}, {id:2, name:'Department 2'}, {id:3, name:'Department 3'}];
		const employees = [{id:1, firstName:'First 1', lastName:'Last 1', departmentId:2}, {id:2, firstName:'First 2', lastName:'Last 2', departmentId:2}];
		const selectedKind = 'departments';//'employees'
		const selectedInf = {id:1};
		const expanded = 2;
		const expand = jest.fn();
		const loadStaff = jest.fn();
		const selectStaff = jest.fn();
		const newStaff = jest.fn();
		const saveStaff = jest.fn();
		const deleteStaff = jest.fn();
		const store = {subscribe:jest.fn(), dispatch:jest.fn(), getState:jest.fn()}
		const cmp = renderer.create(
			<StaffAppCls departments={departments} employees={employees} selectedKind={selectedKind} selectedInf={selectedInf} expanded={expanded} expand={expand} loadStaff={loadStaff} selectStaff={selectStaff} newStaff={newStaff} saveStaff={saveStaff} deleteStaff={deleteStaff} store={store} />
		);

		expect(cmp.toJSON()).toMatchSnapshot();
	});
});
