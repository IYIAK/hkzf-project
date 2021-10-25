# 这里写点笔记吧
## await的知识点
await其实只是替代了`promise.then()`方法,但是还是没法省略掉promise对象.  
await的后面必须跟一个promise对象,跟的是函数的话函数的返回值也要是promise对象.  
所以如果异步操作的函数里面没有返回promise对象,那还是得自己再包一层函数,将异步操作放在return的promise对象里才行.  
比如  
`var data=await setTimeout(()={//...}) `  
是不行的,因为await后面跟的不是promise对象,需要写成:  
```javascript
async function f3() {
    var data = await new Promise((resolve) => {
        setTimeout(() => {
            resolve('time over')
        }, 500);
    })
    console.log(data);
}
```

注意 await 要用在函数里面,函数外侧需要有 async;  
还有就是 promise 内必须要调用 `resolve()` 或者 `reject()` 方法

<b>总之, promise 是躲不掉的 </b>

原先接 promise 的返回值是要 `promise.then((data)=>{ //... })`

这样写就有点麻烦，用了 await 就成了：  
```javascript
var data=await promise
//...
```  
可以看到 data 就直接拿到外面来了，下面再写对 data 的处理,这样看起来就像普通的同步操作一样，这也就是 await 最大的用处。

还有就是，async 函数的返回值是 Promise 对象，也就是说，await 后面可以直接跟一个用async修饰的函数。

Promise 对象内部也是单线程的，异步操作也是放在最后执行，所以 `resolve()` 不能直接写在异步操作外面，这样会先执行 resolve，后进行异步操作，自然会出问题
当然，即使 resolve 了 promise 内部的操作还会继续执行

比如：
```javascript
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

/* 
结果：
同步操作
外部操作 输出data: 0
异步操作
*/
```

可以看到首先执行了 promise 内部的同步操作，接着直接 `resolve(data)` ，外部在 resolve 后获取到了data值（未修改的）继续执行，输出了 data，最后 promise 内部的异步操作结束

---- 
## 关于 React 里面为什么渲染重复组件时用 map() 不用 forEach()
首先，`arr.map(callback())` 和 `arr.forEach(callback())` 都可以遍历数组,二者区别在于，`map()` 会返回一个新的数组,而 `forEach()` 则不会。  

先看一下项目里的用法吧：   
```javascript
    renderTabItem() {
        return tabItems.map((item) => {
            return (
                <TabBar.Item
                    //...
                >
                </TabBar.Item>
            )
        })
    }

    //...
    render() {
        return (
            <div className="home">
                //...
                <TabBar>
                    {
                        this.renderTabItem()
                    }
                </TabBar>
            </div>
        )
    }
    }
```
以下是个人理解：  
既然是要渲染 dom 元素，那最后必然要有返回值才行。这里 `map()` 的回调函数中的 `return` ，实际上是返回了一个新数组中的一个个元素。也就是说，最后会得到一个元素为 dom 节点的新数组，然后再经由最外侧的 `return` 返回给 `render()` 用于渲染组件（也许jsx会自己把数组中的元素一个个渲染出来？）。

如果用 `forEach()` 的话，没有返回值，所以不行。   

----
## 关于 onClick={} 的问题
简单来说，有三种情况：   
1. 不需要传参，不需要获取触发事件的元素本身。这时直接写函数名即可，不需要使用箭头函数。  
    ```javascript
        function f(){}

        <div onClick={f} />
    ```

2. 不需要传参，但需要获取触发事件的元素本身。
    ```javascript
        function f(e){
            //event.currentTarget就是绑定的元素本身
        }

        <div onClick={(e)=>f(e)} />
    ```
    需要注意的是，箭头函数的右侧不要写花括号，`f(e)` 是返回值，箭头函数只有返回值时可以同时省略 `return` 和 `{}` 。  

    或者也可以直接写成：
    ```javascript
        function f(e){}

        <div onClick={f} />
    ```

3. 需要传参。
    ```javascript
        function f(){}
        
        let a=0
        <div onClick={()=>f(a)} />
    ```
    参数的来源暂且不论，一般来说根据函数的闭包直接写 `f(a)` 即可
    
----- 

## 正则替换
```
classname=\{styles.([A-Za-z0-9]+)\}
className='$1'
```

正则表达式除了用于查询之外，还可以用于替换。  
替换要用到圆括号 () 和 $。   
   
圆括号表示捕获组的意思，本身并不影响匹配，但是在查询时可以实现查找重复内容。  
比如要查询字符串 `abcd123+123efg` 中的 `123+123` 部分，正则表达式可以写成：`([0-9]+)\+\1`  。  
其中，`\1`就代表前面的 `([0-9]+)` 匹配到的内容。  
要注意的是，匹配的是内容而不是正则表达式，也就是说，假如上述字符串为 `abcd123+456efg` ，那就没法匹配成功，因为 `456` 和 `123` 不一样，而 `\1` 代表的的是前面的 `([0-9]+)` 所匹配到的 `123` ,而不是它自身。  
   
接着话题回到替换上。替换基本上也是和上面一样，但是把反斜杠 `\` 换成了 `$` ,用于表示要保留的内容（大概）。  
举个例子，要把 `className={styles.mapContainer}` 替换成 `className='mapContainer'` ，查找和替换的正则表达式可以这么写：

```
classname=\{styles.([A-Za-z0-9]+)\}  //查找
className='$1'  //替换
```

其中的 `$1` 就代表 `([A-Za-z0-9]+)` 所匹配到的内容: `mapContainer` ，也就是想要保留的部分。要是有多个捕获组，当然也可以用 `$2`、`$3` 这类。   
个人觉得吧，替换的部分可能压根就不能用正则表达式，顶多只能像这样复用一下查找时匹配到的内容吧？  

高软老师的补充：
>昨天课后讨论有关捕获组的用法，在匹配时仅适用于重复的字串，比如219219219或者ABC ABC，这样的才能用\1替代捕获组小括号里的匹配结果，在（）+这样将捕获组作为一个元素出现1次或多次的情况，\1代表最后一次匹配结果。