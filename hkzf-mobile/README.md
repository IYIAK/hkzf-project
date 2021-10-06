这里写点笔记吧

await其实只是替代了promise.then()方法,但是还是没法省略掉promise对象.await的后面必须跟一个promise对象,跟的是函数的话函数的返回值也要是promise对象
所以如果异步操作的函数里面没有返回promise对象,那还是得自己再包一层函数,将异步操作放在return的promise对象里才行
比如
var data=await setTimeout(()={//...}) 
是不行的,因为await后面跟的不是promise对象,需要写成:
async function f3() {
    var data = await new Promise((resolve) => {
        setTimeout(() => {
            resolve('time over')
        }, 500);
    })
    console.log(data);
}

注意await要用在函数里面,函数外侧需要有async;
还有就是promise内必须要调用resolve或者rejecte方法


总之,promise是躲不掉的 

原先接promise的返回值是要
promise.then((data)=>{ //... })

这样写就有点麻烦,用了await就成了
var data=await promise
//...
可以看到data就直接拿到外面来了,下面再写对data的处理,这样看起来就像普通的同步操作一样,这也就是await最大的用处

还有就是，async函数的返回值是Promise对象，也就是说，await后面可以直接跟一个用async修饰的函数

Promise对象内部也是单线程的，异步操作也是放在最后执行，所以resolve不能直接写在异步操作外面，这样会先执行resolve，后进行异步操作，自然会出问题
当然，即使resolve了promise内部的操作还会继续执行

比如：

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

结果：
同步操作
外部操作 输出data: 0
异步操作

可以看到首先执行了promise内部的同步操作，接着直接resolve，外部在resolve后继续执行，输出了data，最后promise内部的异步操作结束