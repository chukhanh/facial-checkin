import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import createRootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const history = createBrowserHistory();

const rootReducer = createRootReducer(history);

const store = createStore(
  persistCombineReducers({ key: 'root', storage }, { root: rootReducer }),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), sagaMiddleware))
);

export type RootState = ReturnType<typeof rootReducer>;

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export default store;
