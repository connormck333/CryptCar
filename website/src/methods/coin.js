async function loadAccountBalance(coinContract, account) {
    try {
        const bal = await coinContract.getBalanceOfAddress(account);
        return parseInt(bal);
    } catch (err) {
        return 0;
    }
}

export {
    loadAccountBalance
}