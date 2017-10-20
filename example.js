const Scheduler = require('tnt-scheduler');
let sch = new Scheduler();

// This is only necessary if you are using scheduleJob
sch.on('error', error => {
    console.log(error.message);
});

try {
    sch.createJob('my_job', myJob);
} catch (error) {
    console.log(error.message);
}

sch.on('running::my_job', promise => {
    console.log('running my_job');
    promise.then(resolution=>{
        console.log('resolved with', resolution);
    }, error=>{
        console.log('rejected with', error);
    })
});

try {
    sch.scheduleJob('my_job', 1000, 'arg1', 2, {arg: 3});
} catch (error) {
    console.log(error.message);
}

// myJob is a simple function that returns a promise that randomly 
//resolves or rejects after 3000 ms
function myJob(...args) {
    // returns our promise
    return new Promise(function (resolve, reject) {
        // Waits 3 seconds
        setTimeout(() => {
            // Roll the dice
            let odds = Math.round(Math.random());
            if (odds) {
                // Resolves if 1;
                resolve(args);
            } else {
                // Rejects if 0
                reject('Boom!');
            }
        }, 3000);
    })
}

// Clears the schedule after 10 seconds
setTimeout(() => {
    sch.clearSchedule('my_job');
}, 10000)