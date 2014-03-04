var intel = require('intel');

	intel.addHandler(
		new intel.handlers.File({
		file: 'log.txt',
		level: process.env.NODE_ENV=='development'?intel.DEBUG: intel.WARN,
		formatter: new intel.Formatter('[%(date)s] %(name)s %(levelname)s:: %(message)s'),
		timeout: 5000
		})
	);
	
module.exports = intel;