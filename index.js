/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
// import App from './AppScan';
// import App from './AppFirebase';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);