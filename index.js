// 수정된 index.js
import { AppRegistry } from 'react-native';
import App from './src/App'; // src 폴더의 App.js를 가리킴
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
