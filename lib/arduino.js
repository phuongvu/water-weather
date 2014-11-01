'use strict';

var Promise = require( 'bluebird' ),
		five  = Promise.promisifyAll(require( 'johnny-five' )),
		debug = require( 'debug' )( 'water:arduino' ),
		tempsensor, photoresistor;

var board = new five.Board();

board.onAsync('ready').then(function() {
	
	tempsensor = new five.Sensor( {
		pin: 'A0',
		freq: 250
	} );
	
	photoresistor = new five.Sensor( {
  	pin: "A1",
		freq: 250
	} );
});

module.exports = {
	board: function() {
		return board.onAsync('ready');
	},
	temp: function() {
		return tempsensor;
	},
	photon: function() {
		return photoresistor;
	},
	toCelcius: function(analog) {
		return ((analog * 0.004882814) - 0.5) * 100;
	}
};

	
