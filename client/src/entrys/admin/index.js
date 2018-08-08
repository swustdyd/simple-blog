import React from 'react'
import ReactDom from 'react-dom'
import {HashRouter, Route, Redirect} from 'react-router-dom'
import baseConfig from '../../../../configs/base'
import HMFLayout from '../../layout/hmfLayout'
import lrLayout from '../../layout/lrLayout'
import Footer from '../../layout/footer'
import Nav from '../../layout/nav'
import asyncComponent from '../../components/asyncComponent'

const IndexPage = asyncComponent(() => import('../../pages/adminIndex'));
const ManagePage = asyncComponent(() => import('../../pages/manage'));

import './index.scss'

const navConfig = [
    {
        key:'index',
        path: '/index',
        text: '主页'
    },
    {
        key: 'manage',
        path: '/manage',
        text: '管理'
    }
]

class App extends React.Component{

    constructor(){
        super();
    }

    render(){
        return(
            <HashRouter>
                <HMFLayout
                    header={() => {
                        return <Nav withRouter={true} config={navConfig}/>
                    }}
                    content={
                        <div>
                            <Route exact path="/" render={() => <Redirect to="/index"/>}/>
                            <Route path="/index" component={IndexPage}/>
                            <Route path="/manage" component={ManagePage}/>
                        </div>
                    }
                    footer={Footer}
                />                
            </HashRouter>
        );
    }
}

ReactDom.render(
    <App />,
    document.getElementById('app')
);
