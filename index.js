class Scheduler {
    constructor(projects) {
        this.jobs = {};
    }

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

    removeJob(name){
        if (!this.jobs[name]) {
            throw new Error(`No job named ${name} found`);
        } else {
            delete this.jobs[name];
        }
    }

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