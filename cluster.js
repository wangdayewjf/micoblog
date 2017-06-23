var cluster = require("cluster");
var os = require("os");
var numCpus = os.cpus().length;
var workers = {};

if(cluster.isMaster){
	console.log("主线程:"+process.pid);
	cluster.on("exit",function(worker){
		delete workers[worker.pid];
		console.log("重新启动新线程"+worker.pid);
		workerNew = cluster.fork();
		workers[workerNew.pid] = workerNew;
	});
	for(var i=0;i<numCpus;i++){
		var worker = cluster.fork();
		workers[worker.pid] = worker;
	}
}else{
	console.log("启动线程，当前线程id为:"+process.pid);
	var app = require("./app");
	app.listen(3001);
}

process.on("SIGTERM",function(){//这段代码，其实所有子进程都是有的，只是，其他的woker对象为空
	console.log("线程:"+process.pid+"接收并执行SIGTERM");//问：
	for(var worker in workers){
		process.kill(worker.pid);
	}
});

process.on('exit', function () {
　　console.log('process，exit');
});

