/**
 * Created by Aaron on 2018/3/26.
 */
import React from 'react'
import moment from 'moment'

class Footer extends React.Component{
    render(){
        return(
            <div className="footer-content">
                Blog Admin ©{moment(Date.now()).format('YYYY')} Created by DYDd
            </div>
        );
    }
}
export default Footer;