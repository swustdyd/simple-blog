import React from 'react'

export default class Button extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <button {...this.props}>{this.props.children}</button>
        )
    }
}