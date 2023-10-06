/**
 * Author: Isamu Isozaki
 * Combine reducers
 */
import {combineReducers} from 'redux';
import commandReducer from './command';



export default combineReducers({
  command: commandReducer,
});
