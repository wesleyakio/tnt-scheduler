## Purpose
- Register a Job and set its maximum concurrency;
- Be able to trigger the job manually many times with the gurarantee that the set concurrency will be respected;
- Be able to run a job at an interval with the guarantee muiltiple runs wont overlap.
- (Future) Be able to ensure these guarantees across multiple node servers by coordinating runs(redis? mysql? websockets?)

## Instalation
```
npm i tnt-scheduler --save
```

## See it working
[Run it in Runkit](https://npm.runkit.com/tnt-scheduler)

## Usage:

Creating a new scheduler:
```javascript
const Scheduler = require('tnt-scheduler');
let sch = new Scheduler();
```

Creating a new schedulable job with a concurrency of 1, the job executor is a simple javascript function that **must** return a promise:
```javascript
try {
    sch.createJob('my_job', myJob);
} catch (error) {
    console.log(error.message);
}
```

Creating a new schedulable job with a concurrency of 3, the job executor is a simple javascript function that **must** return a promise.
```javascript
try {
    sch.createJob('my_job', myJob, 3);
} catch (error) {
    console.log(error.message);
}
```

Triggering your job manualy:
```javascript
try {
    sch.startJob('my_job');
} catch (error) {
    console.log(error.message);
}
```

Passing arguments to your Job:
```javascript
try {
    sch.startJob('my_job', 'arg1', 'arg2', 'argN');
} catch (error) {
    console.log(error.message);
}
```

Scheduling your job at an interval:
```javascript
try {
    sch.scheduleJob('my_job', 1000);
} catch (error) {
    console.log(error.message);
}
```

Scheduling your job at an interval with arguments:
```javascript
try {
    sch.scheduleJob('my_job', 1000, 'arg1', 'arg2', 'argN');
} catch (error) {
    console.log(error.message);
}
```

Canceling a scheduled job:
```javascript
try {
    sch.clearSchedule('my_job');
} catch (error) {
    console.log(error.message);
}
```

Complete example: Scheduling a job.
```javascript
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
```

Complete example: Triggering a job
```javascript
const Scheduler = require('tnt-scheduler');
let sch = new Scheduler();

try {
    // This will succeed as there is no job by this name
    sch.createJob('my_job', myJob);
    // This will throw as we are using the name my_job again
    sch.createJob('my_job', myJob);
} catch (error) {
    // This will print 'Name my_job already taken' as the second
    //call to createJob throws
    console.log(error.message);
}

// This will start my_job once per second, since the job takes
//3 seconds to run it will fail 2 out of 3 times
setInterval(() => {
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

// myJob is a simple function that returns a promise that randomly 
//resolves or rejects
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
```

## Signatures
```javascript
    /**
     * Create a new Schedulable job
     * 
     * @param {string} name The name of your Job
     * @param {function} executor The executor function, it must return a promise
     * @param {number} concurrency The number of concurrent instances of the job that might be run
     * @throws {Error} Throws an Error if the name is already taken
     */
    createJob(name, executor, concurrency = 1)

    /**
     * Remove a Schedulable job from the Scheduler instance
     * 
     * @param {string} name The name of your Job
     * @throws {Error} Throws an Error if there is no Job registered by that name
     */
    removeJob(name)

    /**
     * Trigger a Schedulable job
     * 
     * @param {string} name The name of your Job
     * @param {...*} args The arguments that will be passed to your Job executor
     * @throws {Error} Throws an Error if there is no Job registered by that name
     * @throws {Error} Throws an Error if the job is already at max concurrency
     */
    startJob(name, ...args)

    /**
     * Run your Job periodically
     * 
     * @param {string} name The name of your Job
     * @param {number} interval The interval between run attempts
     * @param {...*} args The arguments that will be passed to your Job executor
     */
    scheduleJob(name, interval, ...args)

    /**
     * Stop Job's periodic runs
     * 
     * @param {string} name The name of your Job
     */
    clearSchedule(name)
```
