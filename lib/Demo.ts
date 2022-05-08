import axios from "axios";
(async ()=>{
    // get请求：
    let data = {
        sort:'-number',
        limit:1,
        count:true,
        number:40064224,
        source:true
    }
    let res = await axios({
        url: 'https://apilist.tronscan.org/api/block', // 向url发送get请求
        params: data, // 可携带参数，会自动转化为QueryString
    });
    console.log(res);
})();
