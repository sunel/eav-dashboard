import { Component } from 'react';
import { notification } from 'antd';
import equal from 'fast-deep-equal';

class Errors extends Component {
    componentDidUpdate(prevProps) {
        if (this.props.error && !equal(prevProps.error, this.props.error)) {
            if(this.props.error.type === 'network') {
                notification.error({
                    message: 'Network Error',
                    description: this.props.error.message,
                    duration: 0
                });
            } 
            else if(this.props.error.type === 'server' && this.props.error.status === 500) {
                notification.error({
                    message: this.props.error.error.errors[0].title,
                    description: this.props.error.error.errors[0].detail,
                    duration: 0
                });
            }
        }
    }
    render() {
        return null;
    }
}

export default Errors;
