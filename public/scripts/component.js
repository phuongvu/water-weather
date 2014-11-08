/**
 * @jsx React.DOM
 */

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Night = React.createClass({
  render: function () {
    var cx = React.addons.classSet;
    var day = this.props.day;

    var moonClasses = cx({
      'moon hide' : day,
      'moon show' : !day
    });
    var starsClasses = cx({
      'stars hide' : day,
      'stars show' : !day
    });

    return (
      <div>
        <div className = {moonClasses}></div>
        <div className = {starsClasses}></div>
      </div>
    );
  }
});

var Day = React.createClass({
  render: function () {
    var cx = React.addons.classSet;
    var day = this.props.day;
    var temp = this.props.temp;

    var sunClasses = cx({
      'sun show'  : day && temp >= 25,
      'sun hide': !day || temp < 25
    });
    var windClasses = cx({
      'wind show'  : day && temp > 15 && temp < 25,
      'wind hide'  : !day && temp >= 25
    });
    var snowClasses = cx({
      'snow show'  : day && temp <= 15,
      'snow hide'  : !day && temp > 15
    });
    var cloudClasses = cx({
      'cloud show'  : day,
      'cloud hide'  : !day
    });
    var snowflakeClasses = cx({
      'snowflake' : temp < 15
    });

    return (
      <div>
        <div className = {sunClasses}></div>
        <div className = {windClasses}></div>
        <div className = {snowClasses}></div>
        <div className = {cloudClasses}></div>
        <div className = {snowflakeClasses}></div>
      </div>
    );
  }
});

var Weather = React.createClass({

  getDefaultProps: function () {
    return { day: false };
  },

  componentDidMount: function () {
    var socket = io( this.props.url );
    var self = this;
    socket.on('temperature', function (data) {
      self.setProps( { temp: data.temp } );                                           
    });

    socket.on('photon', function (data) {
      self.setProps( { day: self.evaluatePhoton(data.photon) } );
    });
  },

  evaluatePhoton: function (photon) {
  	return (photon > 100);
  },

  render: function () {
    var cx = React.addons.classSet;
    var day = this.props.day;
    var temp = this.props.temp;
    var panelClasses = cx({
      'night': !day,
      'day black-color': day
    });
    return (
      <div className = {panelClasses}>
        <Day temp = {temp} day = {day} />
        <Night day = {day} />
        <div className='weather__temp-panel centered'>
          <div className='weather__temp-panel__number centered'>{temp}&deg;C</div>
        </div>
      </div>
    );
  }
});

React.render(<Weather url='http://localhost' />, document.getElementById('content'));
