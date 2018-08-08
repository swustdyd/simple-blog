/**
 * Created by Aaron on 2018/3/1.
 */
import React from 'react'

class HMFLayout extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            windowInnerHeight: window.innerHeight,
            windowInnerWidth: window.innerWidth,
            headerHeight: 0,
            footerHeight: 0
        }
    }

    componentDidMount(){
        this.setState({
            headerHeight: this.refs.header.clientHeight,
            footerHeight: this.refs.footer.clientHeight
        });
        window.addEventListener('resize', () => {
            this.setState({
                windowInnerHeight: window.innerHeight,
                windowInnerWidth: window.innerWidth
            });
        });
    }

    render(){
        const {headerHeight, footerHeight, windowInnerHeight} = this.state;
        const contentStyle = {
            minHeight: windowInnerHeight - headerHeight - footerHeight
        };
        return(
            <div className="hmf-layout">
                <div ref="header" className="header">
                    {(typeof this.props.header) === 'function' ?  <this.props.header /> : this.props.header }
                </div>
                <div ref="content" className="content" style={contentStyle}>
                    {(typeof this.props.content) === 'function' ?  <this.props.content /> : this.props.content }
                </div>
                <div ref="footer" className="footer">
                    {(typeof this.props.footer) === 'function' ?  <this.props.footer /> : this.props.footer }
                </div>
            </div>
        );
    }
}

export default HMFLayout;
