<template>
    <div>
        <div>
            <div class="display_info">
                <el-button type="primary" @click="getAppInfo"
                    >getAppInfo</el-button
                >
                <el-button type="primary" @click="getWallet"
                    >getWallet</el-button
                >
                <el-button type="primary" @click="getCurrentWallet"
                    >getCurrentWallet</el-button
                >
                <el-button type="primary" @click="back">back</el-button>
                <el-button type="primary" @click="close">close</el-button>
            </div>
        </div>
        <el-dialog
            v-model="displayInformation"
            title="展示信息"
            width="80%"
            center
        >
            {{ connector[connector.getKey] }}
            <el-button
                v-if="
                    connector.getKey == 'signEthTransaction' ||
                    connector.getKey == 'signCosmosTransaction'
                "
                type="primary"
                @click="confirmSend"
                >确认发送</el-button
            >
        </el-dialog>
    </div>
</template>
<script>
import {
    reactive,
    ref
} from 'vue'
import icplaza from '../icplaza.js'
import { ElMessage } from 'element-plus'
export default {
    setup() {
        const displayInformation = ref(false)
        
        let connector = reactive({
            getKey: ''
        })

        const confirmSend = async () => {
            let singer = ''
            let sendres = ''
            if (connector.getKey == 'signEthTransaction') {
                singer = connector.signEthTransaction
                console.log(
                    'signEthTransaction',
                    connector.web3.eth.sendTransaction
                )
                try {
                    sendres = await connector.web3.eth.sendTransaction(
                        connector.ctx,
                        (err) => {
                            console.log('err', err)
                        }
                    )
                } catch (error) {
                    console.log('error', error.message) // "Oops!"
                }
            } else {
                singer = connector.signCosmosTransaction
            }
            console.log(sendres, singer)
            if (sendres) {
                ElMessage({
                    type: 'success',
                    msg: sendres.data.message,
                })
            } else {
                ElMessage({
                    type: 'error',
                    msg: sendres.data.message,
                })
            }
        }
        const signEthTransaction = async () => {
            const ctx = {
                to: '0x17e40c8c6d2d5d18ebec371d936ea1b91f7a1c73',
                value: 100000,
                contract: '0xc1d8aff8a9cbfe46691351353e04beb1ea9b0881',
            }
            let signres = await icplaza.signEthTransaction(ctx)
            displayInformation.value = true
            connector.getKey = 'signEthTransaction'
            connector.signEthTransaction = signres
        }
        const back = async () => {
            await icplaza.back()
        }
        const close = async () => {
            await icplaza.close()
        }
        const getCurrentWallet = async () => {
            let res = await icplaza.getCurrentWallet()
            displayInformation.value = true
            connector.getKey = 'getCurrentWallet'
            connector.getCurrentWallet = res
        }
        const getWallet = async () => {
            let res = await icplaza.getWallet({
                walletTypes: ['eth', 'icplaza'],
            })
            displayInformation.value = true
            connector.getKey = 'getWallet'
            connector.getWallet = res
        }
        const getAppInfo = async () => {
            let res = await icplaza.getAppInfo()
            displayInformation.value = true

            connector.getKey = 'getAppInfo'
            connector.getAppInfo = res
        }

        return {
            displayInformation,
            connector,
            getAppInfo,
            getWallet,
            getCurrentWallet,
            back,
            close,
            confirmSend,
            signEthTransaction,
        }
    },
}
</script>
<style>
.el-tabs {
    /* width: 40%; */
    margin: 0 auto;
}
.display_info {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.el-button {
    margin-top: 10px;
}
.connect_header {
    display: flex;
    justify-content: space-between;
}
</style>
