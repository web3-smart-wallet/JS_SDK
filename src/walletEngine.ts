// 存储事件监听器
const listeners = new Map<string, Set<(...args: any[]) => void>>();

function getFlutterBridge() {
    return (window as any).flutterBridge;
}

// 触发事件函数
export function emitEvent(eventName: string, ...args: any[]) {
    if (listeners.has(eventName)) {
        for (const listener of listeners.get(eventName)!) {
            try {
                listener(...args);
            } catch (error) {
                console.error(`Event listener error:`, error);
            }
        }
    }
}

export const jsWalletEngine = {
    // EIP-1193标准方法
    async request(method: string, params: any[]) {
        // 记录请求
        console.log(`处理请求: ${method}`, params);

        switch (method) {
            // 账户相关
            case 'eth_accounts':
            case 'eth_requestAccounts':
                return getFlutterBridge().sendToFlutter('getAccounts', params);

            // 链相关
            case 'eth_chainId':
                return getFlutterBridge().sendToFlutter('getChainId', params);
            case 'wallet_switchEthereumChain':
                return getFlutterBridge().sendToFlutter('switchChain', params);
            case 'wallet_addEthereumChain':
                return getFlutterBridge().sendToFlutter('addChain', params);

            // 交易相关
            case 'eth_sendTransaction':
                return getFlutterBridge().sendToFlutter('send', params);
            case 'eth_signTransaction':
                return getFlutterBridge().sendToFlutter('signTransaction', params);
            case 'eth_sign':    //*
                return getFlutterBridge().sendToFlutter('sign', params);
            case 'personal_sign':
                return getFlutterBridge().sendToFlutter('sign', params);
            case 'eth_signTypedData':
            case 'eth_signTypedData_v4':
                return getFlutterBridge().sendToFlutter('signTypedData', params);

            // 查询相关
            case 'eth_call':    //*
                return getFlutterBridge().sendToFlutter('call', params);
            case 'eth_getBalance':
                return getFlutterBridge().sendToFlutter('getBalance', params);
            case 'eth_getCode':
                return getFlutterBridge().sendToFlutter('getCode', params);
            case 'eth_getTransactionCount':
                return getFlutterBridge().sendToFlutter('getTransactionCount', params);
            case 'eth_getTransactionByHash':
                return getFlutterBridge().sendToFlutter('getTransactionByHash', params);
            case 'eth_getTransactionReceipt':
                return getFlutterBridge().sendToFlutter('getTransactionReceipt', params);
            case 'eth_estimateGas':
                return getFlutterBridge().sendToFlutter('estimateGas', params);

            // 其他
            case 'eth_gasPrice':
                return getFlutterBridge().sendToFlutter('getGasPrice', params);
            case 'eth_blockNumber':
                return getFlutterBridge().sendToFlutter('getBlockNumber', params);
            case 'eth_getBlockByNumber':
                return getFlutterBridge().sendToFlutter('getBlockByNumber', params);

            default:
                throw new Error(`Unsupported method: ${method}`);
        }
    },

    // 添加事件监听器
    on: (eventName: string, listener: (...args: any[]) => void) => {
        if (!listeners.has(eventName)) {
            listeners.set(eventName, new Set());
        }
        listeners.get(eventName)!.add(listener);
    },

    // 移除事件监听器
    removeListener: (eventName: string, listener: (...args: any[]) => void) => {
        listeners.get(eventName)?.delete(listener);
    }
};