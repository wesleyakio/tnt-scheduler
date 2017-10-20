const Scheduler = require('tnt-scheduler');
let sch = new Scheduler();
 
try {
    // This will succeed as there is no job by this name
    sch.createJob('my_job', myJob);
    // This will throw as we are using the name my_job again
    sch.createJob('my_job', myJob);
} catch (error) {
    // This will print 'Name my_job already taken' as the second call to createJob throws
    console.log(error.message);
}
 
// This will start my_job once per second, since the job takes 3 seconds
//to run it will fail 2 out of 3 times
let interval = setInterval(() => {
    try {
        // Starting the job with two arguments
        sch.startJob('my_job', 'arg1', 12345);
    } catch (error) {
        // Will print if startJob throws
        console.log(error.message);
    }
}, 1000);
 
// The code above will log something like this to the console:
//running myJob
//Job my_job is at max concurrency level of 1
//Job my_job is at max concurrency level of 1
//resolving arg1 12345
//running myJob
//Job my_job is at max concurrency level of 1
//Job my_job is at max concurrency level of 1
//rejecting arg1 12345
// ...
 
// myJob is a simple function that returns a promise that randomly resolves or rejects
function myJob(arg1, arg2) {
    // Will print if the job is started sucessfully
    console.log('running myJob');
    // returns our promise
    return new Promise(function (resolve, reject) {
 
        // Waits 3 seconds
        setTimeout(() => {
            // Roll the dice
            let odds = Math.round(Math.random());
            if (odds) {
                // Resolves if 1;
                console.log('resolving', arg1, arg2);
                resolve();
            } else {
                // Rejects if 0
                console.log('rejecting', arg1, arg2);
                reject();
            }
        }, 3000);
    })
}

// Clears the schedule after 10 seconds
setTimeout(()=>{
    clearInterval(interval);
},10000)