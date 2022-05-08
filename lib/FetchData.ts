import axios from "axios";

(async function fetchRecord(){
    // get请求：
    let data = {
        limit:40,
        start:0,
        sort:'-timestamp',
        count:true,
        relatedAddress:'TJA52qU6TFNT2X3ftMKW9tcm71MKAmy888'

    }
    //https://apilist.tronscan.org/api/token_trc20/transfers
    // ?limit=20&
    // start=0
    // &sort=-timestamp
    // &count=true&
    // relatedAddress=TUwTnxD25T7KdDgDFkUtnrqXPPonMMMMMM
    let res = await axios({
        url: 'https://apilist.tronscan.org/api/token_trc20/transfers', // 向url发送get请求
        params: data, // 可携带参数，会自动转化为QueryString
    })
    let longDragon = {
        single:0,
        double:0,
    };


    let token_transfers =  res.data.token_transfers;
    let  transaction_ids = [];
    token_transfers.map(item =>{
        // console.log(item.transaction_id);
        transaction_ids.push(item.transaction_id);
        let lastNumber = getLastNumber(item.transaction_id);
        console.log("后面第一个出现的数字是:",lastNumber);
        if(isSingle(lastNumber)){
            longDragon.single ++;
        }else{
            longDragon.double ++;
        }
    });
    console.log(transaction_ids)

    // console.log(token_transfers); // 后端传回的数据
    console.log(longDragon);// 后端传回的数据
})();

function getLastNumber(transaction_id:string):number {
    let str = transaction_id.split("").reverse().join("");
    let pattern = new RegExp("[0-9]+");
    let num = str.match(pattern);
    let str2 = String(num);
    let str3 = str2.substr(0,1);
    return Number(str3);
}

function isSingle(num:number):boolean {
    return num % 2 != 0;
}

/**
 * 获取连续最多的字符 - 双指针
 * @return [char, count]
 */

function findContinueChar1(str:string):[string,number] {
    let i = 0;
    let j = 1;
    let maxRepeat = 0;
    let result = '';

    while (i < str.length - 1) {
        if (str[i] !== str[j]) {
            if ((j - i) > maxRepeat) {
                maxRepeat = j - i;
                result = str[i];
            }
            i = j;
        }
        j++;
    }
    console.log(result);
    console.log(maxRepeat);
    return [result, maxRepeat];
}
function findContinueChar2(str: string): [string, number] {
    let char = '';
    let count = 0;
    const len = str.length;

    if (!len) return [char, count];

    let i = 0;
    let j = 0;
    let tempCount = 0;

    for (; i < len; i++) {
        const si = str[i];
        const sj = str[j];
        // 字符相同增加记数
        if (si === sj) {
            tempCount ++;
        }
        // 字符不同或已循环到末尾
        if (si !== sj || i === len - 1) {
            if (tempCount > count) {
                count = tempCount;
                char = sj;
            }
            // 重置记数
            tempCount = 0;

            if (i < len - 1) {
                // 让 j 追上 i
                j = i;
                i --;
            }
        }
    }

    return [char, count];
}
