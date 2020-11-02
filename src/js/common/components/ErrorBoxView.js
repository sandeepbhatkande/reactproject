import React from 'react';

class ErrorBoxView extends React.Component {
    constructor(props) {
		super(props);

        this.state = {};
    };
    
    render() {
        return (
            <div className="message_cnt pos_abs full_height full_width">
                <div className="pos_abs white_bg message_body message_error">
					<div className="message_hdr full_width error_warning_bg">
						<svg className="pos_abs">
							<path d="M -35 190 q 150 -70 300 0" fill="#ffffff"></path>
						</svg>
						<img src={'images/error-illustration.png' } alt="msg_illustratio"></img>
					</div>
					<div className="msg_text_cnt align_center color_black">
						<span className="bold float_left full_width"> Oh No...</span>
						<span dangerouslySetInnerHTML={{ __html: this.props.dataHtml }}></span>
                    </div>
				</div>
            </div>
        )
    };
}

export default ErrorBoxView;