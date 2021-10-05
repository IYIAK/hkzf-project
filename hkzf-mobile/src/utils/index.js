import axios from 'axios'



export const getCurrentCity = async () => {
    // 从本地存储中获取当前城市
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
    if (!localCity) {  //没有获取到的话从服务器获取

        /* 如果不用promise而是直接 return result.data.body 的话,会先执行return操作,然后才去执行异步操作get,自然是不行的*/
        return new Promise((resolve, reject) => {
            const myCity = new window.BMapGL.LocalCity()

            myCity.get(async (res) => {
                try {
                    const cityName = res.name
                    // console.log('当前定位城市名称', cityName)
                    const result = await axios.get(`http://localhost:8080/area/info?name=${cityName}`)  /* 服务器会返回北上广深之一 */
                    // 存储到本地存储(对象转换为JSON字符串)
                    localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
                    resolve(result.data.body)
                } catch (e) {
                    reject(e)
                }
            })
        })


        /* 下面是自己改写的一种异步操作的处理方式,返回的直接是city值而不是promise */
        /* 其实也就是自己接了一下promise */
        /* 因为myCity.get()的返回值不是promise对象,所以没法用await接,只能自己写promise */

        // const myCity = new window.BMapGL.LocalCity()
        // var city = await fn()

        // function fn() {
        //     return new Promise((resolve,reject) => {                
        //         // 下面的异步操作必须写在promise中,而不是只把最后结果写在return的promise的resolve里
        //         // 否则会先执行同步语句(包括return操作和外面的log(city)),然后再回头执行异步操作
        //         myCity.get(async (res) => {
        //             try {
        //                 const cityName = res.name
        //                 // console.log('当前定位城市名称', cityName)
        //                 const result = await axios.get(`http://localhost:8080/area/info?name=${cityName}`)  /* 服务器会返回北上广深之一 */
        //                 // 存储到本地存储(对象转换为JSON字符串)
        //                 localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
        //                 // resolve(result.data.body)
        //                 console.log('result.data.body', result.data.body);
        //                 resolve(result.data.body)
        //             } catch (e) {
        //                 reject(e)
        //             }
        //         })
        //     })
        // }

        // console.log('city', city);  //city {label: "上海", value: "AREA|dbf46d32-7e76-1196"}
    }

    // 如果本地有数据
    // 注意:因为上面是返回promise,为了返回值的统一,这里也要返回promise
    return Promise.resolve(localCity)
}