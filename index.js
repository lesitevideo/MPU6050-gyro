var async = require('async');
var i2c = require('i2c-bus');

// MPU6050 Registers
var PWR_MGMT_1 = 0x6b,
	PWR_MGMT_2 = 0x6c,
	SMPLRT_DIV = 0x19;
var CONFIG = 0x1A,
	GYRO_CONFIG = 0x1B,
	INT_ENABLE = 0x38;
var ACCEL_XOUT_H = 0x3B,
	ACCEL_YOUT_H = 0x3D,
	ACCEL_ZOUT_H = 0x3F;
var TEMP_OUT = 0x41;
var GYRO_XOUT_H = 0x43,
	GYRO_YOUT_H = 0x45,
	GYRO_ZOUT_H = 0x47;
var ACCEL_LSB_SENSITIVITY = 16384,
	GYRO_LSB_SENSITIVITY = 131;



function gyroscope( i2cbus, mpuaddress ) {
	if (!(this instanceof gyroscope)) {
		return new gyroscope(i2cbus, mpuaddress);
	}
	this.bus = i2c.openSync(i2cbus);
	this.address = mpuaddress;
	
	// On réveille le capteur
	this.bus.writeByteSync(this.address, PWR_MGMT_1, 0);
	//write to sample rate register
	this.bus.writeByteSync(this.address, SMPLRT_DIV, 7);
	//Write to Configuration register
	this.bus.writeByteSync(this.address, CONFIG, 0);
	//Write to Gyro configuration register
	this.bus.writeByteSync(this.address, GYRO_CONFIG, 24);
	//Write to interrupt enable register
	this.bus.writeByteSync(this.address, INT_ENABLE, 1);
}

//i2c read mpu6050 raw data
gyroscope.prototype.read_raw_data = function (addr) {
	var high = this.bus.readByteSync(this.address, addr);
	var low = this.bus.readByteSync(this.address, addr+1);
	var value = (high << 8) + low;
	if (value > 32768) {
		value = value - 65536;
	}
	return value;
};

//Read Gyroscope raw xyz
gyroscope.prototype.get_gyro_xyz = function(done) {
	var x = this.read_raw_data(GYRO_XOUT_H);
	var y = this.read_raw_data(GYRO_YOUT_H);
	var z = this.read_raw_data(GYRO_ZOUT_H);
	var gyro_xyz = {
		x:x,
		y:y,
		z:z
	}
	return gyro_xyz;
}

//Read Accel raw xyz
gyroscope.prototype.get_accel_xyz = function(done) {
	var x = this.read_raw_data(ACCEL_XOUT_H);
	var y = this.read_raw_data(ACCEL_YOUT_H);
	var z = this.read_raw_data(ACCEL_ZOUT_H);
	var accel_xyz = {
		x:x,
		y:y,
		z:z
	}
	return accel_xyz;
}

//Full scale range +/- 250 degree/C as per sensitivity scale factor
gyroscope.prototype.get_roll_pitch = function( gyro_xyz, accel_xyz ) {
	var Ax = accel_xyz.x/16384.0;
	var Ay = accel_xyz.y/16384.0;
	var Az = accel_xyz.z/16384.0;
	var Gx = gyro_xyz.x/131.0;
	var Gy = gyro_xyz.y/131.0;
	var Gz = gyro_xyz.z/131.0;
	var roll = Ax*-100;
	var pitch = Ay*-100;
	var roll_pitch = {
		roll: roll,
		pitch: pitch
	}
	return roll_pitch;
}


module.exports = gyroscope;