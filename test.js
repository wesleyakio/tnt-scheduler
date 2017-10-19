const Scheduler = require('./index');

let sch = new Scheduler();

try {
    sch.createJob('route_0000', myLittleFaustaoPentelho);
} catch (error) {
    console.log(error.message);
}

try {
    sch.createJob('route_0000', myLittleFaustaoPentelho);
} catch (error) {
    console.log(error.message);
}

try {
    sch.createJob('route_0000', myLittleFaustaoPentelho);
} catch (error) {
    console.log(error.message);
}

try {
    sch.createJob('route_0000', myLittleFaustaoPentelho);
} catch (error) {
    console.log(error.message);
}

setInterval(()=>{
    try {
        sch.startJob('route_0000', 'banana', 12345);
        console.log('running route_0000');
    } catch (error) {
        console.log(error.message);
    }
}, 1000);


function myLittleFaustaoPentelho(arg1, arg2) {
    return new Promise(function (resolve, reject) {
        let odds = Math.round(Math.random());
        if(odds){
            setTimeout(()=>{
                console.log('resolving', arg1, arg2);
                resolve();
            }, 3000);
        } else {
            setTimeout(()=>{
                console.log('rejecting', arg1, arg2);
                reject();
            }, 3000);
        }
    })
}