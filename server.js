'use strict';


const
	http = require('http'),
	app = require('./app'),
	server = http.createServer(app);


const
	port = app.get('port'),
	env = app.get('env');


server.listen(port, () => {
return console.log(`Dynamic CRUD server up on port:${server.address().port} in ${env} mode.`);
})


if(require.main != module){
	module.exports = server;
}