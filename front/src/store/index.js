import { configureStore } from './configureStore';
import sagas from './../sagas';
import { persistStore } from 'redux-persist'

const initialState = {};
const store = configureStore(initialState);
const persistor = persistStore(store);
//export default {persistor};
export { store, persistor };
