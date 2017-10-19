## tnt-scheduler

### Instalation
```
npm i tnt-scheduler --save
```

### Signatures
```javascript
    /**
     * Create a new Schedulable job
     * 
     * 
     * 
     * @param {string} name The name of your Job
     * @param {function} executor The executor function, it must return a promise
     * @param {number} concurrency The number of concurrent instances of the job that might be run
     */
    createJob(name, executor, concurrency = 1);

    /**
     * Remove a Schedulable job from the Scheduler instance
     * 
     * @param {string} name The name of your Job
     */
    removeJob(name)

    /**
     * Trigger a Schedulable job
     * 
     * @param {string} name The name of your Job
     * @param {...*} args The arguments that will be passed to your Job executor
     */
    startJob(name, ...args)
}

module.exports = Scheduler;
```

### Usage:

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

Running your job:
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

Full example:
```javascript
const Scheduler = require('./index');
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
```