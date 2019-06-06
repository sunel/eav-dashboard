import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory as createHistory }  from 'history';
import App from './containers/App';
import configureStore from './configureStore';
import createRootReducer from './reducers';

const initialState = {};
const history = createHistory({
    basename: `${process.env.REACT_APP_URL}`,
});
const store = configureStore(initialState, history);

export default function Root() {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App />                
            </ConnectedRouter>
        </Provider>
    );
};

if (module.hot) {
    module.hot.accept('./reducers', () => {
        store.replaceReducer(createRootReducer(history))
    })
}