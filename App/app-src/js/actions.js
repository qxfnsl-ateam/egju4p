'use strict';



const actionCreators = function (dispatch, props) {
	let stop = (evt) => {
		evt.stopPropagation();
		evt.preventDefault();
	};
	return {
		expand: function (isExpanded, evt) {
			evt.stopPropagation();
			dispatch(isExpanded
				? {type:'COLLAPSE'}
				/*: {types:['LOAD_REQUEST', 'LOAD_OK', 'LOAD_ERR'], promise:() => loadStaff('employees', evt.target.parentNode.value)}*/
				: {type:'LOAD_REQUEST', kind:'employees', param:evt.target.parentNode.value}
			);
		},
		selectStaff: (kind, evt) => {
			stop(evt);
			dispatch({type:'SELECT', kind:kind, value:evt.target.value});
		},
		newStaff: (kind, evt) => {
			stop(evt);
			dispatch({type:'SELECT', kind:kind});
		},
		loadStaff: (kind, param) => {
			/*dispatch({types:['LOAD_REQUEST', 'LOAD_OK', 'LOAD_ERR'], promise:() => loadStaff(kind, param)});*/
			dispatch({type:'LOAD_REQUEST', kind:kind, param:param});
		},
		saveStaff: (kind, evt) => {
			stop(evt);
			let data = [].slice.call(evt.target.parentNode.elements)
						.filter(e => !!e.name)
						.reduce((acc, e) => { acc[e.name] = e.value; return acc; }, {});
			/*dispatch({types:['SAVE_REQUEST', 'SAVE_OK', 'SAVE_ERR'], promise:() => saveStaff(kind, data)});*/
			dispatch({type:'SAVE_REQUEST', kind:kind, data:data});
		},
		deleteStaff: (kind, evt) => {
			stop(evt);
			/*dispatch({types:['DEL_REQUEST', 'DEL_OK', 'DEL_ERR'], promise:() => deleteStaff(kind, evt.target.parentNode.elements.id.value)});*/
			dispatch({type:'DEL_REQUEST', kind:kind, id:evt.target.parentNode.elements.id.value});
		}
	}
}

/*const middleware = function () {
	return (next) => (action) => {
		const {promise, types, ...rest} = action;
		if( !promise ) {
			return next(action);
		}
		const [REQUEST, SUCCESS, FAILURE] = types;
		next({type:REQUEST, ...rest});
		return promise().then(
			(result) => {
				next({type:SUCCESS, ...result, ...rest});
			},
			(err) => {
				next({type:FAILURE, error:'' + err, ...rest});
			}
		);
	}
}*/



export default actionCreators;
