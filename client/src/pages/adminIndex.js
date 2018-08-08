import React from 'react'
import baseConfig from '../../../configs/base'

export default class Index extends React.Component{
    constructor(){
        super();
        this.state = {
        }
    }

    render(){
        const {session} = this.state;
        return(
            <div className="index">
                Index Page
            </div>
        );
    }
}