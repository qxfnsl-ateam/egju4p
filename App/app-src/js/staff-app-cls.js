'use strict';

import React/*, {Component}*/ from 'react';
import /* * as ReactRedux*/ {Provider} from 'react-redux';
import Menu from './menu';
import DepartmentForm from './department-form';
import EmployeeForm from './employee-form';



/*
* Основной компонент - контейнер приложения
*/
class StaffAppCls extends React.Component {
	componentDidMount () {
		this.props.loadStaff('departments');
	}

	render () {
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
						<button className="staff-app-new staff-app-new-dep btn btn-default" onClick={this.props.newStaff.bind(null, 'departments')}>Новый отдел</button>
						<button className="staff-app-new staff-app-new-emp btn btn-default" onClick={this.props.newStaff.bind(null, 'employees')}>Новый сотрудник</button>
						<div className="panel panel-default">
							<div className="panel panel-body">
								{selectedKind == 'employees'
									? <EmployeeForm entry={selectedInf ? employees.find(item => item.id == selectedInf.id) || selectedInf : null} parents={depList} onUpdate={this.props.saveStaff.bind(null, 'employees')} onDelete={this.props.deleteStaff.bind(null, 'employees')} key={selectedInf ? selectedInf.id : null} />
									: (selectedKind == 'departments'
										? <DepartmentForm entry={selectedInf ? departments.find(item => item.id == selectedInf.id) || selectedInf : null} onUpdate={this.props.saveStaff.bind(null, 'departments')} onDelete={this.props.deleteStaff.bind(null, 'departments')} key={selectedInf ? selectedInf.id : null} />
										: (<p className="staff-no-form">Ничего не выбрано...<br />Для выбора кликните по пунту меню слева</p>)
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



export default StaffAppCls;
