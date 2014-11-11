/**
 * @jsx React.DOM
 */

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Night = React.createClass({
  render: function () {
    var cx = React.addons.classSet;
    var day = this.props.day;
    var temp = this.props.temp;

    var moonClasses = cx({
      'moon'     : day,
      'moon show': !day
    });
    var starsClasses = cx({
      'stars'     : day,
      'stars show': !day
    });
    var snowClasses = cx({
      'canvas'     : !day && temp > 17,
      'canvas show': !day && temp <= 17
    });

    return (
      <div>
        <div className = {moonClasses}></div>
        <div className = {starsClasses}></div>
        <canvas id = 'canvas' className = {snowClasses}></canvas>
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
      'sun show': day && temp >= 22,
      'sun'     : !day || day && temp < 22
    });
    var windClasses = cx({
      'wind show': day && temp > 20 && temp < 22,
      'wind'     : !day || day && temp >= 22 || day && temp <= 20
    });
    var cloudClasses = cx({
      'cloud show': day && temp < 22 && temp > 20,
      'cloud'     : !day || day && temp >= 22 || day && temp <= 20
    });
    var slushClasses = cx({
      'slush show': day && temp > 17 && temp <= 20,
      'slush'     : !day || day && temp > 20 || day && temp <= 17
    });
    var rainClasses = cx({
      'rain show': day && temp > 17 && temp <= 20,
      'rain'     : !day || day && temp > 20 || day && temp <= 17
    });
    var snowflakeClasses = cx({
      'snowflake show': day && temp <= 17,
      'snowflake'     : !day || day && temp > 17
    });

    return (
      <div className = 'symbols'>
        <div key = 'sun' className = {sunClasses}></div>
        <div key = 'wind' className = {windClasses}></div>
        <div key = 'slush' className = {slushClasses}></div>
        <div key = 'rain' className = {rainClasses}></div>
        <div key = 'cloud' className = {cloudClasses}></div>
        <div key = 'snowflake' className = {snowflakeClasses}></div>
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

    //Make it rain
    createRain();
    //Make it snow
    snowfall();

    socket.on('temperature', function (data) {
      self.setProps( { temp: data.temp } );                                           
    });

    socket.on('photon', function (data) {
      self.setProps( { day: self.evaluatePhoton(data.photon) } );
    });
  },

  evaluatePhoton: function (photon) {
  	return (photon > 200);
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
        <Night temp = {temp} day = {day} />
        <div className='weather__temp-panel centered'>
          <div className='weather__temp-panel__number centered'>{temp}&deg;C</div>
        </div>
      </div>
    );
  }
});

React.render(<Weather url='http://localhost' />, document.getElementById('content'));
