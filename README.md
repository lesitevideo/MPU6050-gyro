# mpu6050-gyro

A node driver for the MPU-6050 IMU. Tested and working on Raspberry pi.

## Installation

```sh
npm install mpu6050-gyro
```

## Usage


```js
var gyro = require("mpu6050-gyro");

var address = 0x68; //MPU6050 address
var bus = 1; //i2c bus used

var gyro = new gyro( bus,address );

async function update_telemetry() {
	
	var gyro_xyz = gyro.get_gyro_xyz();
	var accel_xyz = gyro.get_accel_xyz();
	
	var gyro_data = {
		gyro_xyz: gyro_xyz,
		accel_xyz: accel_xyz,
		rollpitch: gyro.get_roll_pitch( gyro_xyz, accel_xyz )
	}
	
	console.log(gyro_data);
	
	setTimeout(update_telemetry, 500);
}

if ( gyro ) {
	update_telemetry();
}
```

### Hardware setup

This driver reads MPU-6050 datas over I2C.<br/>
Plug VCC to 3.3V ( pin #1 ),<br/>
GND to GROUND  ( pin #6 ),<br/>
SDA to SDA ( pin #3 / GPIO 2 ),<br/>
SCL to SCL ( pin #5 / GPIO 3 ).

![RPI Wiring Diagram](https://raw.githubusercontent.com/lesitevideo/MPU6050-gyro/master/wiring.jpg)

## Available Methods

gyro.**get_gyro_xyz()**  
Returns JSON object with raw x,y,z datas from gyroscope.

gyro.**get_accel_xyz()**  
Returns JSON object with raw x,y,z datas from accelerometer.

gyro.**get_roll_pitch( gyro_xyz, accel_xyz )**  
Returns JSON object with roll and pitch in degrees.



## Contributions

Pull requests welcome.

## License

MIT

##

[![https://nodei.co/npm/mpu6050-gyro.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/mpu6050-gyro.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/mpu6050-gyro)
