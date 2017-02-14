var logger = require('winston'),
    helper = require('./_helper.js');

logger.setLevels({debug:0,info:1,current:2,warn:3,error:4});
logger.addColors({debug:'green',info:'cyan',current:'blue',warn:'yellow',error:'red'});
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console,{level:helper.log_level,colorize:true});

module.exports = logger;