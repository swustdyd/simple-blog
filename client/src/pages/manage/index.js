import React from 'react'
import {LRLayout}  from '../../layout'
import Side from './side'

export default class IndexPage extends React.Component{
    render(){
        return (
            <LRLayout 
                left={Side}
                right={() => {
                    return <div>right</div>
                }}
            />
        )
    }
}