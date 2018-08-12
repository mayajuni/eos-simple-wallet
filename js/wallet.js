const config = {
    httpEndpoint: 'https://api.main-net.eosnodeone.io',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
};
const eos = Eos(config);

function getInfo() {
    const accountName = document.getElementById('accountName').value;
    eos.getAccount(accountName).then((account) => {
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
        document.getElementById('refund').innerHTML = refund + ' EOS';

        const totalResources = account.total_resources;
        document.getElementById('cpu').innerHTML = `${account.cpu_limit.used}up / ${account.cpu_limit.max}up (${totalResources.cpu_weight})`;
        document.getElementById('net').innerHTML = `${account.net_limit.used}byte / ${account.net_limit.max}byte (${totalResources.net_weight})`;
        document.getElementById('ram').innerHTML = `${account.ram_usage}byte / ${account.ram_quota}byte`;
    }).catch(e => {

    });
}
