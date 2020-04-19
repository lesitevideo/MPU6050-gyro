var gyro = require("mpu6050-gyro");

var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var port = process.env.PORT || 3000;

// visible at http://raspberrypi.local:3000/ or http://localhost:3000/

var address = 0x68;
var bus = 1;
var gyro = new gyro( bus,address );

app.get('/', function(req, res){
	res.sendFile(__dirname + '/gyroscope.html');
});

app.use(express.static('public'));

server.listen(port, function(){
	console.log('listening on *:' + port);
});

async function update_telemetry() {
		
	var gyro_xyz = gyro.get_gyro_xyz();
	var accel_xyz = gyro.get_accel_xyz();
	
	var gyro_data = {
		gyro_xyz: gyro_xyz,
		accel_xyz: accel_xyz,
		rollpitch: gyro.get_roll_pitch( gyro_xyz, accel_xyz )
	}

	
	io.emit('telemetrie', {
		roll: gyro_data.rollpitch.roll,
		pitch: gyro_data.rollpitch.pitch,
	});
	
	setTimeout(update_telemetry, 500);
}

if ( gyro ) {
	update_telemetry();
}