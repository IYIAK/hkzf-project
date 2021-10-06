/* async function test1() {
    var a = await timer()
    var b = setTimeout(() => {
        console.log('4444');
        return '4444'
    }, 500);

    console.log('2222');

    console.log('a', a);

    // console.log('b', b)
}

function timer() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('1111');
            resolve('3333')
        }, 1000);
    })
}

test1() */


function f1() {
    let str = '0000'
    setTimeout(() => {
        str = '2222'
        console.log('3333');
    }, 2000);
    return new Promise((resolve) => {
        resolve('1111')
    })
}

function f2() {
    return new Promise(async (resolve) => {
        var a = await f1()
        console.log('f2', a);
        resolve(a)
        return a
    })
}

// f2()
// console.log(f2().then((val) => {
//     return val
// }));

// f2().then((val) => {
//     return val
// }).then((val) => {
//     return val
// })

// f1().then((data) => {
//     console.log(data);
// })

// console.log(f1());
// f2().then((data) => {
//     console.log(data);
// })

async function f3() {
    var data = await new Promise((resolve) => {
        setTimeout(() => {
            resolve('time over')
        }, 500);
    })
    console.log(data);
}

async function f4() {
    await new Promise((resolve) => {
        new Promise((resolve2) => {
            setTimeout(() => {
                console.log("promise{promise}");

            }, 300);
            resolve('1')
        })
        // resolve('1')
    })

    console.log('f4');
}

// f4()

async function f5() {
    var data = await new Promise((resolve) => {
        data = 0
        setTimeout(() => {
            console.log('异步操作');
            data = 1
        }, 300);
        console.log('同步操作');
        resolve(data)
    })
    console.log('外部操作 输出data:', data);
}
f5()