import {Connection, Keypair,SystemProgram, PublicKey,sendAndConfirmTransaction,Transaction} from '@solana/web3.js';
import {getOrCreateAssociatedTokenAccount, transfer} from '@solana/spl-token';
import { decode} from 'micro-base58';

(async () => {
    //@ts-ignore
    const bridge = window.WebViewJavascriptBridge;
    if (!bridge) {
        console.log("window.WebViewJavascriptBridge 没有挂载成功！！");
        return;
    } else {
        console.log("window.WebViewJavascriptBridge 挂载成功！！");
    }
    bridge.callHandler('generateSolanaWeb3', {'key': 'value'}, function (response) {
        console.log("solanaWeb3 初始化成功");
    });

    // solana主链币转账
    bridge.registerHandler('solanaMainTransfer', function (data, responseCallback) {
         (async () => {
            try {
                // Connect to cluster
                const connection = new Connection(data.endpoint, 'confirmed');
                console.log("connection----->");
                const from = Keypair.fromSecretKey(decode(data.secretKey));
                console.log("from----->");
                const toPublicKey = new PublicKey(data.toPublicKey);
                console.log("toPublicKey----->");
                // Add transfer instruction to transaction
                var transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: from.publicKey,
                        toPubkey: toPublicKey,
                        lamports: data.amount,
                    }),
                );
                console.log("transaction.signature()");
                // Sign transaction, broadcast, and confirm
                let signature = await sendAndConfirmTransaction(
                    connection,
                    transaction,
                    [from],
                );
                console.log('signature');
                console.log(signature);
                let ret = {result: true, txid: signature};
                //JS拿到数据，返回给原生
                responseCallback(ret);
            } catch (err) {
                let ret = {result: false, txid: err};
                //JS拿到数据，返回给原生
                responseCallback(ret);
            }
        })();
    });

    // solana代币转账
    bridge.registerHandler('solanaTokenTransfer', function (data, responseCallback) {
          (async () => {
            try {
                const connection = new Connection(data.endpoint, 'confirmed');
                let toPublicKey = new PublicKey(data.toPublicKey);
                console.log("toPublicKey--->");
                console.log(data.secretKey);
                let fromWallet = Keypair.fromSecretKey(decode(data.secretKey));
                console.log("fromWallet--->");
                console.log("createMint  begin--->");
                const mint = new PublicKey(data.mintAuthority);
                console.log("createMint  end--->");
                // Get the token account of the fromWallet address, and if it does not exist, create it
                const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                    connection,
                    fromWallet,
                    mint,
                    fromWallet.publicKey
                );
                console.log("fromTokenAccount ->>>getOrCreateAssociatedTokenAccount----->>>>>>>");
                // Get the token account of the toWallet address, and if it does not exist, create it
                const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toPublicKey);
                console.log("toTokenAccount ->>>getOrCreateAssociatedTokenAccount----->>>>>>>");
                console.log('transfer begin:');
                let signature = await transfer(
                    connection,
                    fromWallet,
                    fromTokenAccount.address,
                    toTokenAccount.address,
                    fromWallet.publicKey,
                    data.amount,
                );
                console.log('transfer tx:');
                console.log(signature);
                let ret = {result: true, txid: signature};
                //JS拿到数据，返回给原生
                responseCallback(ret);
            } catch (err) {
                let ret = {result: false, txid: err};
                //JS拿到数据，返回给原生
                responseCallback(ret);
            }
        })();
    });
})();


