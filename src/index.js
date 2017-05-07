import React from 'react'
import ReactDOM from 'react-dom'
import {useStrict} from 'mobx'
import {Provider} from 'mobx-react'
import {BrowserRouter as Router} from 'react-router-dom'
// import 'moment/locale/zh-cn'
// moment.locale('zh-cn')

import App from './components/App'

import appStore from './stores/appStore'
import  umbrellaStore from './stores/umbrellaStore'
import userStore from './stores/userStore'

const stores = {
    appStore,
    umbrellaStore,
    userStore

}
console.log(stores);
useStrict(true)


ReactDOM.render(
    <Provider {...stores }>
        <Router basename="/">
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
)