class Scheduler {
    constructor(projects) {
        this.jobs = {};
    }

    /**
     * Create a new Schedulable job
     * 
     * @param {string} name The name of your Job
     * @param {function} executor The executor function, it must return a promise
     * @param {number} concurrency The number of concurrent instances of the job that might be run
     * @throws {Error} Throws an Error if the name is already taken
     */
    createJob(name, executor, concurrency = 1) {
        if (this.jobs[name]) {
            throw new Error(`Name ${name} already taken`);
        } else {
            this.jobs[name] = {
                current: 0,
                concurrency: concurrency,
                executor: executor,
            }
        }
    }

    /**
     * Remove a Schedulable job from the Scheduler instance
     * 
     * @param {string} name The name of your Job
     * @throws {Error} Throws an Error if there is no Job registered by that name
     */
    removeJob(name){
        if (!this.jobs[name]) {
            throw new Error(`No job named ${name} found`);
        } else {
            delete this.jobs[name];
        }
    }

    /**
     * Trigger a Schedulable job
     * 
     * @param {string} name The name of your Job
     * @param {...*} args The arguments that will be passed to your Job executor
     * @throws {Error} Throws an Error if there is no Job registered by that name
     * @throws {Error} Throws an Error if the job is already at max concurrency
     */
    startJob(name, ...args) {
        if (!this.jobs[name]) {
            throw new Error(`No job named ${name} found`);
        }

        let job = this.jobs[name];
        if (job.current >= job.concurrency) {
            throw new Error(`Job ${name} is at max concurrency level of ${job.concurrency}`);
        }

        job.current++;
        let promise = job.executor(...args);
        promise.then(() => { job.current-- }, () => { job.current-- });
        return promise;
    }
}

module.exports = Scheduler;