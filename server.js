var express = require( 'express' ),
		path 		= require( 'path' ),
    http    = require( 'http' ),
    morgan  = require( 'morgan' ),
		arduino = require( './lib/arduino.js' );
    debug   = require( 'debug' )( 'water:server' );

var app = express();
var server = http.createServer(app);
var io = require( 'socket.io' )(server);

server.listen( 9000, function() {
  debug('express listening at %d', server.address().port);
} );

app.use( morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
}) );

app.use( express.static( path.join( __dirname, 'public' ) ) );

arduino.board().then(function() {
		arduino.temp().on( 'data', function() {
				debug('Temperature: ' + arduino.toCelcius(arduino.temp().value));
				io.emit( 'temperature', { temp: arduino.toCelcius(arduino.temp().value) } );
			} );

		arduino.photon().on( 'data', function() {
				debug( 'Photon: ' + arduino.photon().value );
				io.emit( 'photon', { photon: arduino.photon().value } );
		} );
} );

	