import React, { useReducer, createContext } from 'react';

export default (reducer, actions, defaultValue) => {
	const Context = createContext();
	
	const Provider = ({ children, value }) => {
		if (value != undefined) {
			for (let key in value) {
				if (value.hasOwnProperty(key)) {
					defaultValue[key] = value[key];
				}
			}
		}
		const [state, dispatch] = useReducer(reducer, defaultValue);

		const boundActions = {};
		for (let key in actions) {
			boundActions[key] = actions[key](dispatch);
		}
		return (
			<Context.Provider value={{ state, ...boundActions }}>
				{children}
			</Context.Provider>
		)
	};

	return { Context, Provider };
};
