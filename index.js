// index.js
import 'react-native-gesture-handler'; // 최상단에 추가
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
