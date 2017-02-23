'use strict';

import React/*, {Component}*/ from 'react';



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



export default Menu;
