import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
 
class CustomScrollbar extends React.Component {
  render() {
    return (
        <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            renderThumbHorizontal={ this.horizontalTrack }
            renderThumbVertical={ this.verticalTrack }
            {...this.props}>
        </Scrollbars>
    );
  };

  horizontalTrack({style, ...props}) {
    return (<div {...props} className='custom-horizontal-track' />);
  };

  verticalTrack({style, ...props}) {
    return (<div {...props} className='custom-vertical-track' />);
  };
}

export default CustomScrollbar;