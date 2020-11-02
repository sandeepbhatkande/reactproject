import React from 'react';

class ErrorPageView extends React.Component {
    constructor(props) {
		super(props);

        this.state = {};
        this.errorImgs = [
            '', 'images/error/404_1.png', 'images/error/404_2.png', 'images/error/404_3.png',
            'images/error/404_4.png', 'images/error/404_5.png', 'images/error/404_6.png',
            'images/error/404_7.png'
        ];
    };
    
    render() {
        return (
            <img src={ this.errorImgs[ Math.floor( Math.random() * 7 ) + 1 ] } className='full_width full_height' alt='404 Error'></img>
        )
    };
}

export default ErrorPageView;