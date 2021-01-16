import 'core-js/features/map';
import 'core-js/features/set';

import React from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';

import App from './containers/App';
import { schemeChanger } from './utils/schemeChanger';

bridge.subscribe(schemeChanger);

ReactDOM.render(<App />, document.getElementById('root'));