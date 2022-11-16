
var TYPE_MAP = {
    icplaza: '9000',
}

var BLOCKCHAIN_ID_MAP = {
    9000: 'icplaza',
}

var _getCallbackName = function () {
    var ramdom = parseInt(Math.random() * 100000)
    return 'icplaza_callback_' + new Date().getTime() + ramdom
}

var _sendIcplazaRequest = function (methodName, params, callback) {
    if (window.android) {
        window.android.callMessage(methodName, params, callback)
    }
    // ios
    if (window.webkit) {
        window.webkit.messageHandlers[methodName].postMessage({
            body: {
                params: params,
                callback: callback,
            },
        })
    }
}

var icplaza = {
    version: '1.0.1',
    isConnected: function () {
        return !!(
            window.android ||
            (window.webkit &&
                window.webkit.messageHandlers &&
                window.webkit.messageHandlers.getDeviceId)
        )
    },
    getAppInfo: function () {
        return new Promise(function (resolve, reject) {
            var icplazaCallbackFun = _getCallbackName()

            window[icplazaCallbackFun] = function (result) {
                result = result.replace(/\r/gi, '').replace(/\n/gi, '')
                try {
                    var res = JSON.parse(result)
                    resolve(res)
                } catch (e) {
                    reject(e)
                }
            }
            _sendIcplazaRequest('getAppInfo', '', icplazaCallbackFun)
        })
    },
    getWallets: function () {
        return new Promise(function (resolve, reject) {
            var icplazaCallbackFun = _getCallbackName()

            window[icplazaCallbackFun] = function (result) {
                result = result.replace(/\r/gi, '').replace(/\n/gi, '')
                try {
                    var res = JSON.parse(result)

                    if (res.data && res.data.length) {
                        for (var i = 0; i < res.data.length; i++) {
                            res.data[i].blockchain =
                                BLOCKCHAIN_ID_MAP[
                                    res.data[i].blockchain_id + ''
                                ] || res.data[i].blockchain_id
                        }
                    }

                    resolve(res)
                } catch (e) {
                    reject(e)
                }
            }

            _sendIcplazaRequest('getWallets', '', icplazaCallbackFun)
        })
    },
    getCurrentWallet: function () {
        return new Promise(function (resolve, reject) {
            var icplazaCallbackFun = _getCallbackName()
            // callback
            window[icplazaCallbackFun] = function (result) {
                result = result.replace(/\r/gi, '').replace(/\n/gi, '')
                try {
                    var res = JSON.parse(result)
                    if (res.rawTransaction) {
                        res.data = res.rawTransaction
                    }

                    if (res.data && res.data.blockchain_id) {
                        res.data.blockchain =
                            BLOCKCHAIN_ID_MAP[res.data.blockchain_id + ''] ||
                            res.data.blockchain_id
                    }

                    resolve(res)
                } catch (e) {
                    reject(e)
                }
            }
            _sendIcplazaRequest('getCurrentWallet', '', icplazaCallbackFun)
        })
    },
    sign: function (params) {
        return new Promise(function (resolve, reject) {
            var icplazaCallbackFun = _getCallbackName()

            window[icplazaCallbackFun] = function (result) {
                result = result.replace(/\r/gi, '').replace(/\n/gi, '')
                try {
                    var res = JSON.parse(result)
                    resolve(res)
                } catch (e) {
                    reject(e)
                }
            }

            _sendIcplazaRequest(
                'sign',
                JSON.stringify(params),
                icplazaCallbackFun
            )
        })
    },
    back: function () {
        _sendIcplazaRequest('back', '', '')
    },
    close: function () {
        _sendIcplazaRequest('close', '', '')
    },
    sendEthTransaction: function (params) {
        return new Promise(function (resolve, reject) {
            var icplazaCallbackFun = _getCallbackName()

            window[icplazaCallbackFun] = function (result) {
                result = result.replace(/\r/gi, '').replace(/\n/gi, '')
                try {
                    var res = JSON.parse(result)
                    resolve(res)
                } catch (e) {
                    reject(e)
                }
            }

            _sendIcplazaRequest(
                'sendEthTransaction',
                JSON.stringify(params),
                icplazaCallbackFun
            )
        })
    },
    signEthTransaction: function (params) {
        return new Promise(function (resolve, reject) {
            var icplazaCallbackFun = _getCallbackName()

            window[icplazaCallbackFun] = function (result) {
                result = result.replace(/\r/gi, '').replace(/\n/gi, '')
                try {
                    var res = JSON.parse(result)
                    resolve(res)
                } catch (e) {
                    reject(e)
                }
            }

            _sendIcplazaRequest(
                'signEthTransaction',
                JSON.stringify(params),
                icplazaCallbackFun
            )
        })
    },
    signCosmosTransaction: function (params) {
        return new Promise(function (resolve, reject) {
            var icplazaCallbackFun = _getCallbackName()

            window[icplazaCallbackFun] = function (result) {
                result = result.replace(/\r/gi, '').replace(/\n/gi, '')
                try {
                    var res = JSON.parse(result)
                    resolve(res)
                } catch (e) {
                    reject(e)
                }
            }

            _sendIcplazaRequest(
                'signCosmosTransaction',
                JSON.stringify(params),
                icplazaCallbackFun
            )
        })
    },
    getWallet: function (params) {
        if (params.walletTypes && params.walletTypes.length) {
            params.walletTypes = params.walletTypes.map(function (item) {
                return TYPE_MAP[item.toLowerCase()] || item
            })
        } else {
            params.walletTypes = []
        }

        // default
        if (undefined === params.switch) {
            params.switch = true
        }

        return new Promise(function (resolve, reject) {
            var icplazaCallbackFun = _getCallbackName()

            window[icplazaCallbackFun] = function (result) {
                result = result.replace(/\r/gi, '').replace(/\n/gi, '')
                try {
                    var res = JSON.parse(result)

                    if (res.data && res.data.blockchain_id) {
                        res.data.blockchain =
                            BLOCKCHAIN_ID_MAP[res.data.blockchain_id + ''] ||
                            res.data.blockchain_id
                    }

                    resolve(res)
                } catch (e) {
                    reject(e)
                }
            }
            _sendIcplazaRequest(
                'getWallet',
                JSON.stringify(params),
                icplazaCallbackFun
            )
        })
    },
    getWcUrl: function (url) {
        return new Promise((reslove) => {
            _sendIcplazaRequest('getWcUrl', url, '')
            reslove(true)
        })
    },
}

export default icplaza