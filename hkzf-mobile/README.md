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