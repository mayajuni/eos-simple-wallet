const config = {
    httpEndpoint: 'http://dev.cryptolions.io:38888',
    chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca'
};

function getInfo() {
    const accountName = document.getElementById('accountName').value;
    Eos(config).getAccount(accountName).then((account) => {
        document.getElementById('accountBox').style.display = 'block';
        document.getElementById('account').innerHTML = account.account_name;

        const unstaked = account.core_liquid_balance ? Number(account.core_liquid_balance.replace('EOS', '')) : 0;
        const staked = account.voter_info ? account.voter_info.staked / 10000 : 0;
        let refund = 0;
        const refundReq = account.refund_request;
        if(refundReq) {
            refund = Number(refundReq.net_amount.replace('EOS', '')) +
                Number(refundReq.cpu_amount.replace('EOS', ''));
        }

        document.getElementById('total').innerHTML = Number((refund + unstaked + staked).toFixed(4)) + ' EOS';
        document.getElementById('unstake').innerHTML = unstaked + ' EOS';
        document.getElementById('stake').innerHTML = staked + ' EOS';
        document.getElementById('refund').innerHTML = refund + ' E/**/OS';

        const totalResources = account.total_resources;
        document.getElementById('cpu').innerHTML = `${account.cpu_limit.used}up / ${account.cpu_limit.max}up (${totalResources.cpu_weight})`;
        document.getElementById('net').innerHTML = `${account.net_limit.used}byte / ${account.net_limit.max}byte (${totalResources.net_weight})`;
        document.getElementById('ram').innerHTML = `${account.ram_usage}byte / ${account.ram_quota}byte`;
    });
}

function send() {
    const to = document.getElementById('to').value;
    const quantity = document.getElementById('quantity').value;
    const memo = document.getElementById('memo').value;
    const privateKey = document.getElementById('privateKey').value;
    const from = document.getElementById('account').innerHTML;

    Eos({...config, keyProvider: [privateKey]}).transaction('eosio.token', (coin) => {
        coin.transfer(from, to, `${quantity.toFixed(4)} EOS`, memo);
    }).then(result => {
        console.log(result);
    });
}
