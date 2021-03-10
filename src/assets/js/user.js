import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
  web3FromAddress,
  web3FromSource,
} from "@polkadot/extension-dapp";
web3Enable("mathwallet");

class User {
  constructor() {
    let provider = new WsProvider("wss://polkadot.maiziqianbao.net/ws");

    this.api = ApiPromise.create({provider});
  }

  async getApi() {
    return await this.api;
  }

  // 获取钱包账号
  async getAccounts() {
    if (isWeb3Injected) {
      return await web3Accounts({ ss58Format:0 }).then((accounts) => {
        accounts.map((account) => {
          account.isActive = false;
        });
        return accounts;
      });
    } else {
      return null;
    }
  }

  // 签名操作
  async signMessage(account, str = "Like this project") {
    const injector = await web3FromSource( account.meta.source );
    let signRes = await injector.signer.signRaw(
      {
        address: account.address,
        data: '0x'+Buffer(str).toString('hex'),
        type: "bytes"
      }
    );

    return signRes?signRes.signature:null;
  }

}

export default new User();
