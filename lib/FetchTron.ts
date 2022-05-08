import axios from "axios";

function writeStringToFile(content:string){
    // const content = 'a plain text.11111111';
    const blob = new Blob([ content ], {type: "text/plain;charset=utf-8"});
    const objectURL = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = objectURL;
    anchor.download = "TJA52qU6TFNT2X3ftMKW9tcm71MKAmy888 交易哈希.txt";
    anchor.click();
    URL.revokeObjectURL(objectURL);
}

(()=>{
    const hashBlocks: string[] = [];
    const singleAndDouble: string[] = [];
    fetchHashBlackContinue(40064224);
    function fetchHashBlackContinue(hash:number){
        (async ()=>{
            // if (hash<= (40061677-2)){
            //     // console.log(hashBlocks);
            //     console.log('递归结束拉，数组长度',singleAndDouble.length);
            //     let content1 = singleAndDouble.join('');
            //     console.log("content1----->");
            //     console.log(content1);
            //     let obj = findContinueChar1(content1);
            //     console.log(obj);
            //     return;
            // }
            // get请求：
            let data = {
                sort:'-number',
                limit:1,
                count:true,
                number:hash,
                source:true
            }
            let res = await axios({
                url: 'https://apilist.tronscan.org/api/block', // 向url发送get请求
                params: data, // 可携带参数，会自动转化为QueryString
            });
            if (res.data.data.length == 0){
                console.log("最新块还没有出来");
                console.log("过去的个blockHash的值是");
                let content1 = singleAndDouble.join('');
                console.log("content1----->");
                console.log(content1);
                let obj = findContinueChar1(content1);
                //只查询最新过去6个区块，
                // 双单单双单双双双单双单单双双单单双双单双单双双单单双单双双单双双双双双双单双双双单单单双双双
                // 如果过去6个区块是单，我就买双
                // 如果过去6个区块是双，我就买单
                // 就是压区块的单双
                console.log(obj);
                console.log("老子延迟1秒钟 接着干....");
                setTimeout(()=>{
                    fetchHashBlackContinue(hash);
                },1000);
                return;
            }
            let value = res.data.data[0];
            const hashValue = value.hash;
            const parentHash = value.parentHash;

            let lastNumber = getLastNumber(hashValue);
            if(isSingle(lastNumber)){
                singleAndDouble.push("单");
            } else {
                singleAndDouble.push("双");
            }
            let lastParentHashNumber = getLastNumber(parentHash);
            if(isSingle(lastParentHashNumber)){
                singleAndDouble.push("单");
            } else {
                singleAndDouble.push("双");
            }
            hash += 2;
            fetchHashBlackContinue(hash);
        })();
    }
})();


(()=>{
    // const transaction_idsAll: string[] = [];
// const singleAndDouble: string[] = [];
// fetchRecordContinue(1);
// function fetchRecordContinue(page:number){
//     (async ()=>{
//         if (page >= 250){
//             console.log('递归结束拉，数组长度',singleAndDouble.length);
//             // let content = transaction_idsAll.join();
//             console.log("singleAndDouble------>");
//             // console.log(singleAndDouble);
//             let content1 = singleAndDouble.join('');
//             console.log("content1----->");
//             console.log(content1);
//             let obj = findContinueChar1(content1);
//             console.log(obj);
//             // writeStringToFile(content);
//             writeStringToFile(content1);
//             return
//         }
//         // get请求：
//         let data = {
//             limit:40,
//             start:page,
//             sort:'-timestamp',
//             count:true,
//             toAddress:'TJA52qU6TFNT2X3ftMKW9tcm71MKAmy888',
//             relatedAddress:'TJA52qU6TFNT2X3ftMKW9tcm71MKAmy888'
//         }
//         //https://apilist.tronscan.org/api/block?sort=-number&limit=1&count=true&number=40058118&source=true
//         let res = await axios({
//             url: 'https://apilist.tronscan.org/api/token_trc20/transfers', // 向url发送get请求
//             params: data, // 可携带参数，会自动转化为QueryString
//         });
//         let token_transfers = res.data.token_transfers;
//         token_transfers.map(item =>{
//             let lastNumber = getLastNumber(item.transaction_id);
//             if(isSingle(lastNumber)){
//                 singleAndDouble.push("单");
//             } else {
//                 singleAndDouble.push("双");
//             }
//         });
//         // console.log("transaction_idsAll------>");
//         // console.log(transaction_idsAll);
//         page++;
//         fetchRecordContinue(page);
//     })();
// }
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
