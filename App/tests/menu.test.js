import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import Menu from '../app-src/js/menu';



describe('<Menu />', () => {
	it('Render empty Menu', () => {
		const list = [{value:1, title:'Ityem 1'}, {value:2, title:'Ityem 2'}, {value:3, title:'Ityem 3'}];
		const expanded = 2;
		const prefix = 'prefix-';
		const cmp = shallow(
			<Menu list={list} expanded={expanded}  prefix={prefix} onExpand={jest.fn()} onAction={jest.fn()} />
		);

		const eItems = cmp.find('li[value][onClick]');
		expect(eItems.length).toBe(list.length);
		eItems.forEach((eItem, i) => {
			expect(eItem.prop('value')).toBe(list[i].value);
			expect(eItem.key()).toMatch(prefix + list[i].value);
			expect(eItem.text()).toMatch(list[i].title);
			expect(eItem.hasClass('on')).toBe(false);
			expect(eItem.find('.staff-menu-empty').length).toBe(list[i].value == expanded ? 1 : 0);
		});

		const eButs = cmp.find('button[onClick].staff-menu-exp');
		expect(eButs.length).toBe(list.length);
		eButs.forEach((eBut, i) => {
			expect(eBut.hasClass('on')).toBe(list[i].value == expanded);
		});

		const eChilds = cmp.find('.staff-menu-empty');
		expect(eChilds.length).toBe(1);
	})


	it('Render Menu', () => {
		const list = [{value:1, title:'Ityem 1'}, {value:2, title:'Ityem 2'}, {value:3, title:'Ityem 3'}];
		const current = 1;
		const expanded = 2;
		const prefix = 'prefix-';
		const cmp = shallow(
			<Menu list={list} current={current} expanded={expanded} prefix={prefix} onExpand={jest.fn()} onAction={jest.fn()}>
				<embed />
			</Menu>
		);

		const eItems = cmp.find('li[value][onClick]');
		expect(eItems.length).toBe(list.length);
		eItems.forEach((eItem, i) => {
			expect(eItem.prop('value')).toBe(list[i].value);
			expect(eItem.key()).toMatch(prefix + list[i].value);
			expect(eItem.text()).toMatch(list[i].title);
			expect(eItem.hasClass('on')).toBe(list[i].value == current);
			expect(eItem.find('embed').length).toBe(list[i].value == expanded ? 1 : 0);
			//expect(eItem.contains(<embed />)).toBe(list[i].value == expanded);
		});

		const eButs = cmp.find('button[onClick].staff-menu-exp');
		expect(eButs.length).toBe(list.length);
		eButs.forEach((eBut, i) => {
			expect(eBut.hasClass('on')).toBe(list[i].value == expanded);
		});

		const eChilds = cmp.find('embed');
		expect(eChilds.length).toBe(1);
		//expect(cmp.contains(<embed />)).toBe(true);
	})


	it('Clickability', () => {
		const list = [{value:1, title:'Ityem 1'}, {value:2, title:'Ityem 2'}, {value:3, title:'Ityem 3'}];
		const current = 1;
		const expanded = 2;
		const prefix = 'prefix-';
		const onExpand = jest.fn();
		const onAction = jest.fn();
		const cmp = shallow(
			<Menu list={list} current={current} expanded={expanded} prefix={prefix} onExpand={onExpand} onAction={onAction}>
				<embed />
			</Menu>
		);

		const eItems = cmp.find('li[value][onClick]');
		expect(eItems.length).toBe(list.length);
		eItems.forEach((eItem, i) => {
			expect(eItem.prop('onClick')).toBeDefined();
			const evt = {target:{}};
			eItem.simulate('click', evt);
			expect(onAction).toBeCalledWith(evt);
		});

		const eButs = cmp.find('button[onClick].staff-menu-exp');
		expect(eButs.length).toBe(list.length);
		eButs.forEach((eBut, i) => {
			expect(eBut.prop('onClick')).toBeDefined();
			const evt = {target:{}};
			eBut.simulate('click', list[i].value == expanded, evt);
			expect(onExpand).toBeCalled();
		});
	})


	it('DOM tree', () => {
		const list = [{value:1, title:'Ityem 1'}, {value:2, title:'Ityem 2'}, {value:3, title:'Ityem 3'}];
		const current = 1;
		const expanded = 2;
		const prefix = 'prefix-';
		const cmp = renderer.create(
			<Menu list={list} current={current} expanded={expanded} prefix={prefix} onExpand={jest.fn()} onAction={jest.fn()}>
				<embed />
			</Menu>
		);

		expect(cmp.toJSON()).toMatchSnapshot();
	});
});
