const { Client, RichPresence } = require('discord.js-selfbot-v13');
const client = new Client({ checkUpdate: false });
const fs = require('fs');
const path = require('path');
const { token } = require('./config.json');
const bitcoin = require('bitcoinjs-lib');
const ECPairFactory = require('ecpair');
const tinysecp = require('tiny-secp256k1');
const crypto = require('crypto');
const bip39 = require('bip39');
const axios = require('axios')
const ECPair = ECPairFactory.ECPairFactory(tinysecp);
const QRCode = require('qrcode');
const qs = require('qs');
const Tesseract = require('tesseract.js');
const { evaluate } = require('mathjs');


const express = require('express');
  
  
  const app = express();
  const conf = require('./config.json')
  const PORT = conf.html.port;
  
  const htmlDirectory = path.join(__dirname, 'html');
  
  if (!fs.existsSync(htmlDirectory)) {
      fs.mkdirSync(htmlDirectory);
  }
  
  app.get('/html/:code', (req, res) => {
      const code = req.params.code;
  
      if (!/^\d{10}$/.test(code)) {
          return res.status(400).send('❌ Invalid code format. Must be a 10-digit number.');
      }
  
      const filePath = path.join(htmlDirectory, `${code}.html`);
  
      if (!fs.existsSync(filePath)) {
          return res.status(404).send('❌ Invalid code. File not found.');
      }
  
      res.sendFile(filePath);
  });
  
  app.listen(PORT, () => {
  });

  client.once('ready', () => {
    const art = `
          _____                    _____                    _____                    _____          
         /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\         
        /::\\    \\                /::\\    \\                /::\\    \\                /::\\____\\        
       /::::\\    \\               \\:::\\    \\              /::::\\    \\              /:::/    /        
      /::::::\\    \\               \\:::\\    \\            /::::::\\    \\            /:::/    /         
     /:::/\\:::\\    \\               \\:::\\    \\          /:::/\\:::\\    \\          /:::/    /          
    /:::/__\\:::\\    \\               \\:::\\    \\        /:::/__\\:::\\    \\        /:::/____/           
   /::::\\   \\:::\\    \\              /::::\\    \\       \\:::\\   \\:::\\    \\      /::::\\    \\           
  /::::::\\   \\:::\\    \\    ____    /::::::\\    \\    ___\\:::\\   \\:::\\    \\    /::::::\\____\\________  
 /:::/\\:::\\   \\:::\\____\\  /\\   \\  /:::/\\:::\\    \\  /\\   \\:::\\   \\:::\\    \\  /:::/\\:::::::::::\\    \\ 
/:::/  \\:::\\   \\:::|    |/::\\   \\/:::/  \\:::\\____\\/::\\   \\:::\\   \\:::\\____\\/:::/  |:::::::::::\\____\\
\\::/   |::::\\  /:::|____|\\:::\\  /:::/    \\::/    /\\:::\\   \\:::\\   \\::/    /\\::/   |::|~~~|~~~~~     
 \\/____|:::::\\/:::/    /  \\:::\\/:::/    / \\/____/  \\:::\\   \\:::\\   \\/____/  \\/____|::|   |          
       |:::::::::/    /    \\::::::/    /            \\:::\\   \\:::\\    \\            |::|   |          
       |::|\\::::/    /      \\::::/____/              \\:::\\   \\:::\\____\\           |::|   |          
       |::| \\::/____/        \\:::\\    \\               \\:::\\  /:::/    /           |::|   |          
       |::|  ~|               \\:::\\    \\               \\:::\\/:::/    /            |::|   |          
       |::|   |                \\:::\\    \\               \\::::::/    /             |::|   |          
       \\::|   |                 \\:::\\____\\               \\::::/    /              \\::|   |          
        \\:|   |                  \\::/    /                \\::/    /                \\:|   |          
         \\|___|                   \\/____/                  \\/____/                  \\|___|          
                                                                                                      
    `;
    console.clear()
    console.log('\x1b[36m%s\x1b[0m', art); 
    console.clear()
    console.log('\x1b[36m%s\x1b[0m', art); 
console.log(`connected to ${client.user.username}`)

});

const litecoinNetwork = {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
        public: 0x019da462,
        private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
};

function sendMessage(message, content) {
    message.reply(content);
}
const timeoutFilePath = path.join(__dirname, 'timeout.json');

const autoMessages = new Map();

const convertToHex = (arr) => {
    return Array.from(arr).map(val => val.toString(16).padStart(2, '0')).join('');
  };

  if (!fs.existsSync(timeoutFilePath)) {
    fs.writeFileSync(timeoutFilePath, JSON.stringify({}));
}


client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const timeoutFilePath = path.join(__dirname, 'timeout.json');
    const timeoutData = JSON.parse(fs.readFileSync(timeoutFilePath, 'utf8'));

    const guildTimeouts = timeoutData[oldMember.guild.id] || [];
    const userTimeoutIndex = guildTimeouts.findIndex((entry) => entry.userId === newMember.id);

    if (userTimeoutIndex !== -1) {
        const userTimeout = guildTimeouts[userTimeoutIndex];

        if (
            oldMember.communicationDisabledUntilTimestamp &&
            !newMember.communicationDisabledUntilTimestamp &&
            userTimeout.endTime > Date.now()
        ) {
            try {
                await newMember.timeout(userTimeout.endTime - Date.now(), userTimeout.reason);
            } catch (error) {
                console.error(error);
            }
        } else if (Date.now() >= userTimeout.endTime) {
            guildTimeouts.splice(userTimeoutIndex, 1);
            timeoutData[oldMember.guild.id] = guildTimeouts;
            fs.writeFileSync(timeoutFilePath, JSON.stringify(timeoutData, null, 2));
        }
    }
});

  
  
  const config = require(path.join(__dirname, 'config.json'));

  client.on('messageCreate', async (message) => {
    try{
      if (message.author.id !== client.user.id) return;
      
      const prefix = config.prefix;
      
      if (!message.content.startsWith(prefix)) return;
      
      const args = message.content.slice(prefix.length).trim().split(' ');
      const command = args.shift().toLowerCase();
      
      if (command === 'spam') {
          if (!args[0] || isNaN(args[0]) || !args[1]) {
              return message.reply('Please provide a valid number and message to spam.');
          }
          
          const numberOfMessages = parseInt(args[0]);
          const spamMessage = args.slice(1).join(' ');
  
          try {
              if (numberOfMessages > 10) {
                  return message.reply('You can only send up to 10 messages at once.');
              }
              for (let i = 0; i < numberOfMessages; i++) {
                  await message.channel.send(spamMessage);
              }
          } catch (error) {
              console.error(error);
              message.reply('An error occurred while sending the messages.');
          }
      }
    }catch(error){}
  });
client.on('messageCreate', async (message) => {
    if (message.author.id !== client.user.id) return;
    try{
   const prefix = JSON.parse(fs.readFileSync('./config.json', 'utf8')).prefix
    if (!message.content.startsWith(prefix)) return;
const arg = message.content.split(' ');
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'import') {
        const input = args.join(' ').trim();
    
        let phrase;
        let privateKeyWIF;
        let keyPair;
    
        if (bip39.validateMnemonic(input)) {
            phrase = input;
            const seed = bip39.mnemonicToSeedSync(phrase);
            const root = bitcoin.bip32.fromSeed(seed, litecoinNetwork);
            keyPair = root.derivePath("m/44'/2'/0'/0/0");
            privateKeyWIF = keyPair.toWIF();
        } else {
            try {
                keyPair = ECPair.fromWIF(input, litecoinNetwork);
                privateKeyWIF = input;
            } catch (error) {
                return sendMessage(message, '❌ Invalid input! Please provide a valid phrase or private key.');
            }
        }
    
        const walletsPath = path.join(__dirname, 'wallets.json');
        let wallets = [];
    
        if (fs.existsSync(walletsPath)) {
            wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf-8'));
        } else {
            fs.writeFileSync(walletsPath, JSON.stringify(wallets, null, 4));
        }
    
        if (wallets.some(wallet => wallet.private_key === privateKeyWIF || wallet.phrase === phrase)) {
            return sendMessage(message, '❌ You already have a wallet with this private key or phrase.');
        }
    
        const name = crypto.randomBytes(2).toString('hex');
        wallets.push({ phrase: phrase || 'N/A', private_key: privateKeyWIF, name });
        fs.writeFileSync(walletsPath, JSON.stringify(wallets, null, 4));
    
        const maskedPrivateKey = privateKeyWIF.slice(0, 4) + '****' + privateKeyWIF.slice(-4);
        const maskedPhrase = phrase ? phrase.slice(0, 4) + '****' + phrase.slice(-4) : 'N/A';
    
        const response = `\`\`\`
    🌐 Wallet saved! 
    Name: ${name}
    Private Key: ${maskedPrivateKey}
    Phrase: ${maskedPhrase}
    \`\`\``;
    
        sendMessage(message, response);
    }
    

    if (command === 'genwallet') {
        const name = args.join(' ').trim();

        if (!name) {
            return sendMessage(message, '❌ Please provide a name for the wallet!');
        }

        const walletsPath = path.join(__dirname, 'wallets.json');
        let wallets = [];

        if (fs.existsSync(walletsPath)) {
            wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf-8'));
        } else {
            fs.writeFileSync(walletsPath, JSON.stringify(wallets, null, 4));
        }

        if (wallets.some(wallet => wallet.name === name)) {
            return sendMessage(message, '❌ This name wallet already exists.');
        }

        const keyPair = ECPair.makeRandom({ network: litecoinNetwork });
        const privateKeyWIF = keyPair.toWIF();
        const phrase = bip39.generateMnemonic(128); 
        wallets.push({ phrase, private_key: privateKeyWIF, name });
        fs.writeFileSync(walletsPath, JSON.stringify(wallets, null, 4));

        const maskedPrivateKey = privateKeyWIF.slice(0, 4) + '****' + privateKeyWIF.slice(-4);
        const maskedPhrase = phrase.slice(0, 4) + '****' + phrase.slice(-4);

        const response = `\`\`\`
🌐 Wallet generated! 
Name: ${name}
Private Key: ${maskedPrivateKey}
Phrase: ${maskedPhrase}
\`\`\``;

        sendMessage(message, response);
    }

    if (command === 'listwallet') {
        const walletsPath = path.join(__dirname, 'wallets.json');
        let wallets = [];
    
        if (fs.existsSync(walletsPath)) {
            wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf-8'));
        }
    
        if (wallets.length === 0) {
            return sendMessage(message, '❌ No wallets found!');
        }
    
        const walletNames = wallets.map(wallet => wallet.name).join(', ');
        sendMessage(message, `\`\`\`\n💼 Wallets: ${walletNames}\n\`\`\``);
    }
    
    if (command === 'calc' || command === 'calculate') {
        const expression = args.join(' ');
    
        if (!expression) {
            return sendMessage(message, '❌ Please provide a mathematical expression to calculate!');
        }
    
        try {
            const result = evaluate(expression);
            sendMessage(message, `\`\`\`\n🧮 Result: ${expression} = ${result}\n\`\`\``);
        } catch (error) {
            sendMessage(message, '❌ Invalid mathematical expression!');
        }
    }
    if (command === 'changeltcformat') {
        const newFormat = args[0];
        const validFormats = ['usd', 'ltc'];
    
        if (!validFormats.includes(newFormat)) {
            return sendMessage(message, '❌ Invalid format! Use either "usd" or "ltc".');
        }
    
        const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
        config.ltc_format = newFormat;
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
        
        sendMessage(message, `\`\`\`\n✅ Litecoin format changed to: ${newFormat}\n\`\`\``);
    }
    
    if (command === 'changeaddressformat') {
        const newAddressFormat = args[0];
        const validAddressFormats = ['legacy', 'segwit'];
    
        if (!validAddressFormats.includes(newAddressFormat)) {
            return sendMessage(message, '❌ Invalid address format! Use either "legacy" or "segwit".');
        }
    
        const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
        config.address_format = newAddressFormat;
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
    
        sendMessage(message, `\`\`\`\n✅ Address format changed to: ${newAddressFormat}\n\`\`\``);
    }
    
    if (command === 'address') {
        const walletName = args.join(' ').trim();
    
        if (!walletName) {
            return sendMessage(message, '❌ Please provide a wallet name!');
        }
    
        const walletsPath = path.join(__dirname, 'wallets.json');
        if (!fs.existsSync(walletsPath)) {
            return sendMessage(message, '❌ No wallets found!');
        }
    
        const wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf-8'));
        const wallet = wallets.find(w => w.name === walletName);
    
        if (!wallet) {
            return sendMessage(message, '❌ Wallet not found!');
        }
    
        const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
        const addressFormat = config.address_format;
    
        let keyPair;
try {
    keyPair = ECPair.fromWIF(wallet.private_key, litecoinNetwork);
} catch (error) {
    console.log(error);
    return sendMessage(message, '❌ Error deriving key pair!');
}
        const  publicKey  = keyPair.publicKey;
    
        let responseAddress;
        if (addressFormat === 'legacy') {
            const { address } = bitcoin.payments.p2pkh({ pubkey: publicKey, network: litecoinNetwork });
            responseAddress = address;
        } else if (addressFormat === 'segwit') {
            const { address: segwitAddress } = bitcoin.payments.p2wpkh({ pubkey: publicKey, network: litecoinNetwork });
            responseAddress = segwitAddress;
        } else {
            return sendMessage(message, '❌ Invalid address format in config!');
        }
    
        sendMessage(message, `\`\`\`\n💼 Address for ${walletName} (${addressFormat}): ${responseAddress}\n\`\`\``);
    }
    
    if (command === 'editwalletname') {
        const oldName = args[0];
        const newName = args[1];
    
        if (!oldName || !newName) {
            return sendMessage(message, '❌ Please provide both the old and new wallet names!');
        }
    
        const walletsPath = path.join(__dirname, 'wallets.json');
        let wallets = [];
    
        if (fs.existsSync(walletsPath)) {
            wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf-8'));
        }
    
        const oldWallet = wallets.find(wallet => wallet.name === oldName);
        if (!oldWallet) {
            return sendMessage(message, '❌ Old wallet name not found!');
        }
    
        if (wallets.some(wallet => wallet.name === newName)) {
            return sendMessage(message, '❌ This new wallet name already exists! Please choose a different name.');
        }
    
        oldWallet.name = newName;
        fs.writeFileSync(walletsPath, JSON.stringify(wallets, null, 4));
    
        sendMessage(message, `\`\`\`\n✅ Wallet name changed successfully!\nOld Name: ${oldName}\nNew Name: ${newName}\n\`\`\``);
    }
    if (command === 'deletewallet') {
        const walletName = args.join(' ').trim();
    
        if (!walletName) {
            return sendMessage(message, '❌ Please provide a wallet name to delete!');
        }
    
        const walletsPath = path.join(__dirname, 'wallets.json');
        let wallets = [];
    
        if (fs.existsSync(walletsPath)) {
            wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf-8'));
        }
    
        const walletIndex = wallets.findIndex(wallet => wallet.name === walletName);
        if (walletIndex === -1) {
            return sendMessage(message, '❌ Wallet not found!');
        }
    
        sendMessage(message, `\`\`\`\n⚠️ Are you sure you want to delete the wallet "${walletName}"? Respond with "yes" within 15 seconds.\`\`\``);
    
        const filter = response => {
            return response.author.id === message.author.id && response.content.toLowerCase() === 'yes';
        };
    
        const collector = message.channel.createMessageCollector({ filter, time: 15000 });
    
        collector.on('collect', () => {
            wallets.splice(walletIndex, 1);
            fs.writeFileSync(walletsPath, JSON.stringify(wallets, null, 4));
            sendMessage(message, `\`\`\`\n🗑️ Wallet "${walletName}" has been deleted successfully.\`\`\``);
            collector.stop(); 
        });
    
        collector.on('end', collected => {
            if (collected.size === 0) {
                sendMessage(message, `\`\`\`\n⏰ Time's up! The wallet "${walletName}" was not deleted.\`\`\``);
            }

        });
    }
        
if (command === 'walletinfo') {
    const walletName = args.join(' ').trim();

    if (!walletName) {
        return sendMessage(message, '❌ Please provide a wallet name to show information!');
    }

    const walletsPath = path.join(__dirname, 'wallets.json');
    let wallets = [];

    if (fs.existsSync(walletsPath)) {
        wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf-8'));
    }

    const wallet = wallets.find(wallet => wallet.name === walletName);
    if (!wallet) {
        return sendMessage(message, '❌ Wallet not found!');
    }

    sendMessage(message, `\`\`\`\n⚠️ Are you sure you want to show your wallet details for "${walletName}"? Respond with "yes" within 15 seconds.\`\`\``);

    const filter = response => {
        return response.author.id === message.author.id && response.content.toLowerCase() === 'yes';
    };

    const collector = message.channel.createMessageCollector({ filter, time: 15000 });

    collector.on('collect', () => {
        const response = `\`\`\`
🌐 Wallet Details:
Name: ${walletName}
Private Key: ${wallet.private_key}
Phrase: ${wallet.phrase}
\`\`\``;

        sendMessage(message, response);
        collector.stop(); 
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            sendMessage(message, `\`\`\`\n⏰ Time's up! Wallet details were not shown.\`\`\``);
        }
    });
}


  

  
if (command === 'send') {
    const walletName = args[0];
    const amount = args[1];
    const toAddress = args[2];

    if (isNaN(amount) || !walletName || !toAddress) {
        return sendMessage(message, '❌ Please provide a valid wallet name, amount, and to address!');
    }

    const walletsPath = path.join(__dirname, 'wallets.json');
    let wallets = [];

    if (fs.existsSync(walletsPath)) {
        wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf-8'));
    }

    const wallet = wallets.find(wallet => wallet.name === walletName);
    if (!wallet) {
        return sendMessage(message, '❌ Wallet not found!');
    }

    const configPath = path.join(__dirname, 'config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const ltcFormat = config.ltc_format;
    const addressFormat = config.address_format;
    const fee = 0.00005;

    let amountToSend, balanceInLtc;
    if (ltcFormat === 'usd') {
        const conversionRate = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd');
        const ltcPrice = conversionRate.data.litecoin.usd;
        amountToSend = (amount / ltcPrice) + fee;
    } else {
        amountToSend = parseFloat(amount) + fee;
    }

    let keyPair;
    try {
        keyPair = ECPair.fromWIF(wallet.private_key, litecoinNetwork);
    } catch (error) {
        return sendMessage(message, '❌ Error deriving key pair!');
    }

    const publicKey = keyPair.publicKey;
    let responseAddress;
    if (addressFormat === 'legacy') {
        const { address } = bitcoin.payments.p2pkh({ pubkey: publicKey, network: litecoinNetwork });
        responseAddress = address;
    } else if (addressFormat === 'segwit') {
        const { address: segwitAddress } = bitcoin.payments.p2wpkh({ pubkey: publicKey, network: litecoinNetwork });
        responseAddress = segwitAddress;
    }

    const balanceResponse = await axios.get(`https://api.blockcypher.com/v1/ltc/main/addrs/${responseAddress}/balance`);
    balanceInLtc = balanceResponse.data.balance / 100000000;

    if (balanceInLtc < amountToSend) {
        return sendMessage(message, `\`\`\`\n❌ Not enough balance to send this amount!\`\`\`\n**your balance: ${balanceInLtc} LTC\namount to send: ${amountToSend.toFixed(8)} LTC**`);
    }

    try {
        const resp = await axios.post(
            'https://api.tatum.io/v3/litecoin/transaction',
            {
                fromAddress: [
                    {
                        address: responseAddress,
                        privateKey: wallet.private_key
                    }
                ],
                to: [
                    {
                        address: toAddress,
                        value: parseFloat((amountToSend - 0.000005).toFixed(8))
                    }
                ],
                fee: '0.000005',
                changeAddress: responseAddress
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': config.tatum_api_key 
                }
            }
        );

        sendMessage(message, `\`\`\`\n✅ Successfully sent ${amount} ${ltcFormat} to ${toAddress}!\nTransaction ID: ${resp.data.txId}\`\`\``);

        if (config.payment.notify && config.payment.webhook) {
            try {
                const embed = {
                    title: '✅ Transaction Successful',
                    description: `Successfully sent ${amount} ${ltcFormat} to ${toAddress}!\nTransaction ID: ${resp.data.txId}`,
                    color: 3066993, 
                    fields: [
                        {
                            name: 'From Address',
                            value: responseAddress,
                            inline: true
                        },
                        {
                            name: 'Transaction Link',
                            value: `[View Transaction](https://blockchair.com/litecoin/transaction/${resp.data.txId})`,
                            inline: true
                        }
                    ],
                    footer: {
                        text: 'Litecoin Transaction'
                    }
                };

                await axios.post(config.payment.webhook, {
                    content: `Transaction for ${amount} ${ltcFormat} completed!`, 
                    embeds: [embed]
                });
            } catch (error) {}
        }
    } catch (error) {
        sendMessage(message, '❌ Transaction failed!');
    }
}

  
  

if (command === 'walletbal') {
    const walletName = args[0];
    const walletsPath = path.join(__dirname, 'wallets.json');
    let wallets = [];

    if (fs.existsSync(walletsPath)) {
        wallets = JSON.parse(fs.readFileSync(walletsPath, 'utf-8'));
    }

    const wallet = wallets.find(wallet => wallet.name === walletName);
    if (!wallet) {
        return sendMessage(message, '❌ Wallet not found!');
    }
    if (!wallet) return sendMessage(message, '❌ Wallet not found!');
    let keyPair;
    try {
        keyPair = ECPair.fromWIF(wallet.private_key, litecoinNetwork);
    } catch (error) {
        return sendMessage(message, '❌ Error deriving key pair!');
    }
    const legacyAddress = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: litecoinNetwork }).address;
    const segwitAddress = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: litecoinNetwork }).address;

    const legacyBalanceResponse = await axios.get(`https://api.blockcypher.com/v1/ltc/main/addrs/${legacyAddress}/balance`);
    const segwitBalanceResponse = await axios.get(`https://api.blockcypher.com/v1/ltc/main/addrs/${segwitAddress}/balance`);

    const confirmedBalanceLegacyLTC = legacyBalanceResponse.data.balance / 1e8;
    const unconfirmedBalanceLegacyLTC = legacyBalanceResponse.data.unconfirmed_balance / 1e8;
    const totalSentLegacyLTC = legacyBalanceResponse.data.total_sent / 1e8;
    const totalReceivedLegacyLTC = legacyBalanceResponse.data.total_received / 1e8;

    const confirmedBalanceSegWitLTC = segwitBalanceResponse.data.balance / 1e8;
    const unconfirmedBalanceSegWitLTC = segwitBalanceResponse.data.unconfirmed_balance / 1e8;
    const totalSentSegWitLTC = segwitBalanceResponse.data.total_sent / 1e8;
    const totalReceivedSegWitLTC = segwitBalanceResponse.data.total_received / 1e8;

    const usdRates = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd');
    const confirmedBalanceLegacyUSD = (confirmedBalanceLegacyLTC * usdRates.data.litecoin.usd).toFixed(8);
    const unconfirmedBalanceLegacyUSD = (unconfirmedBalanceLegacyLTC * usdRates.data.litecoin.usd).toFixed(8);
    const confirmedBalanceSegWitUSD = (confirmedBalanceSegWitLTC * usdRates.data.litecoin.usd).toFixed(8);
    const unconfirmedBalanceSegWitUSD = (unconfirmedBalanceSegWitLTC * usdRates.data.litecoin.usd).toFixed(8);

    sendMessage(message, `\`\`\`\n🪙 **Legacy Wallet Address**: ${legacyAddress}\n\n📊 **Legacy Balances**:\n- Confirmed: ${confirmedBalanceLegacyLTC} LTC (~$${confirmedBalanceLegacyUSD})\n- Unconfirmed: ${unconfirmedBalanceLegacyLTC} LTC (~$${unconfirmedBalanceLegacyUSD})\n- Total Sent: ${totalSentLegacyLTC} LTC (~$${(totalSentLegacyLTC * usdRates.data.litecoin.usd).toFixed(8)})\n- Total Received: ${totalReceivedLegacyLTC} LTC (~$${(totalReceivedLegacyLTC * usdRates.data.litecoin.usd).toFixed(8)})\n\n🪙 **SegWit Wallet Address**: ${segwitAddress}\n\n📊 **SegWit Balances**:\n- Confirmed: ${confirmedBalanceSegWitLTC} LTC (~$${confirmedBalanceSegWitUSD})\n- Unconfirmed: ${unconfirmedBalanceSegWitLTC} LTC (~$${unconfirmedBalanceSegWitUSD})\n- Total Sent: ${totalSentSegWitLTC} LTC (~$${(totalSentSegWitLTC * usdRates.data.litecoin.usd).toFixed(8)})\n- Total Received: ${totalReceivedSegWitLTC} LTC (~$${(totalReceivedSegWitLTC * usdRates.data.litecoin.usd).toFixed(8)})\n\`\`\``, { code: true });
}

if (command === 'p') {
    const prices = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd,eur,inr');
    const ltcUSD = prices.data.litecoin.usd.toFixed(2);
    const ltcEUR = prices.data.litecoin.eur.toFixed(2);
    const ltcINR = prices.data.litecoin.inr.toFixed(2);
    
    sendMessage(message, `\`\`\`\n💰 **Litecoin (LTC) Prices**:\n\n- USD: $${ltcUSD}\n- EUR: €${ltcEUR}\n- INR: ₹${ltcINR}\n\`\`\``);
}

if (command === 'doge') {
    const prices = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd,eur,inr');
    const dogeUSD = prices.data.dogecoin.usd.toFixed(2);
    const dogeEUR = prices.data.dogecoin.eur.toFixed(2);
    const dogeINR = prices.data.dogecoin.inr.toFixed(2);
    
    sendMessage(message, `\`\`\`\n💰 **Dogecoin (DOGE) Prices**:\n\n- USD: $${dogeUSD}\n- EUR: €${dogeEUR}\n- INR: ₹${dogeINR}\n\`\`\``);
}

if (command === 'btc') {
    const prices = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,inr');
    const btcUSD = prices.data.bitcoin.usd.toFixed(2);
    const btcEUR = prices.data.bitcoin.eur.toFixed(2);
    const btcINR = prices.data.bitcoin.inr.toFixed(2);
    
    sendMessage(message, `\`\`\`\n💰 **Bitcoin (BTC) Prices**:\n\n- USD: $${btcUSD}\n- EUR: €${btcEUR}\n- INR: ₹${btcINR}\n\`\`\``);
}

if (command === 'eth') {
    const prices = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,eur,inr');
    const ethUSD = prices.data.ethereum.usd.toFixed(2);
    const ethEUR = prices.data.ethereum.eur.toFixed(2);
    const ethINR = prices.data.ethereum.inr.toFixed(2);
    
    sendMessage(message, `\`\`\`\n💰 **Ethereum (ETH) Prices**:\n\n- USD: $${ethUSD}\n- EUR: €${ethEUR}\n- INR: ₹${ethINR}\n\`\`\``);
}

if (command === 'trx') {
    const prices = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd,eur,inr');
    const trxUSD = prices.data.tron.usd.toFixed(2);
    const trxEUR = prices.data.tron.eur.toFixed(2);
    const trxINR = prices.data.tron.inr.toFixed(2);
    
    sendMessage(message, `\`\`\`\n💰 **TRON (TRX) Prices**:\n\n- USD: $${trxUSD}\n- EUR: €${trxEUR}\n- INR: ₹${trxINR}\n\`\`\``);
}

if (command === 'sol') {
    const prices = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd,eur,inr');
    const solUSD = prices.data.solana.usd.toFixed(2);
    const solEUR = prices.data.solana.eur.toFixed(2);
    const solINR = prices.data.solana.inr.toFixed(2);
    
    sendMessage(message, `\`\`\`\n💰 **Solana (SOL) Prices**:\n\n- USD: $${solUSD}\n- EUR: €${solEUR}\n- INR: ₹${solINR}\n\`\`\``);
}

if (command === 'bnb') {
    const prices = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd,eur,inr');
    const bnbUSD = prices.data.binancecoin.usd.toFixed(2);
    const bnbEUR = prices.data.binancecoin.eur.toFixed(2);
    const bnbINR = prices.data.binancecoin.inr.toFixed(2);
    
    sendMessage(message, `\`\`\`\n💰 **Binance Coin (BNB) Prices**:\n\n- USD: $${bnbUSD}\n- EUR: €${bnbEUR}\n- INR: ₹${bnbINR}\n\`\`\``);
}

if (command === 'pepe') {
    const prices = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=pepe&vs_currencies=usd,eur,inr');
    const pepeUSD = prices.data.pepe.usd.toFixed(8);
    const pepeEUR = prices.data.pepe.eur.toFixed(8);
    const pepeINR = prices.data.pepe.inr.toFixed(8);
    
    sendMessage(message, `\`\`\`\n💰 **Pepe Coin Prices**:\n\n- USD: $${pepeUSD}\n- EUR: €${pepeEUR}\n- INR: ₹${pepeINR}\n\`\`\``);
}

if (command === 'price') {
    const coinName = args.join(' ').toLowerCase();

    try {
        const prices = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd,eur,inr`);

        if (prices.data[coinName]) {
            const coinUSD = prices.data[coinName].usd.toFixed(2);
            const coinEUR = prices.data[coinName].eur.toFixed(2);
            const coinINR = prices.data[coinName].inr.toFixed(2);
            
            sendMessage(message, `\`\`\`\n💰 **${coinName.charAt(0).toUpperCase() + coinName.slice(1)} Prices**:\n\n- USD: $${coinUSD}\n- EUR: €${coinEUR}\n- INR: ₹${coinINR}\n\`\`\``);
        } else {
            sendMessage(message, `\`\`\`\n❌ Coin not found! Please check the name.\n\`\`\``);
        }
    } catch (error) {
        sendMessage(message, `\`\`\`\n❌ Coin not found! Please check the name.\n\`\`\``);
    }
}

if (command === 'sendnotify') {
    const config = require('./config.json')
    const notifySetting = args[0];

    if (notifySetting === 'true' || notifySetting === 'false') {
        config.payment.notify = notifySetting === 'true'; 
        fs.writeFileSync('config.json', JSON.stringify(config, null, 2), 'utf-8');
        sendMessage(message, `Notification setting updated to: ${config.payment.notify}`);
    } else {
        sendMessage(message, 'Invalid value! Please use `true` or `false`.');
    }
}


if (command === 'sendnotifywebhook') {
    const config = require('./config.json')

    const webhookLink = args[0];

    if (webhookLink && webhookLink.startsWith('http')) {
        config.payment.webhook = webhookLink;
        fs.writeFileSync('config.json', JSON.stringify(config, null, 2), 'utf-8');
        sendMessage(message, `Webhook URL updated to: ${config.payment.webhook}`);
    } else {
        sendMessage(message, 'Invalid webhook URL! Please provide a valid URL.');
    }
}

const filePath = path.join(__dirname, 'ar.json');

    if (command === 'aradd') {
        const name = args[0];
        const value = args.slice(1).join(' ');

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({}, null, 2), 'utf8');
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (data[name]) {
            sendMessage(message, `\`\`\`\n❌ Name "${name}" already exists!\n\`\`\``);
        } else {
            data[name] = value;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            sendMessage(message, `\`\`\`\n✅ Added "${name}" with value "${value}"!\n\`\`\``);
        }
    }

    if (command === 'removear') {
        const name = args[0];

        if (!fs.existsSync(filePath)) {
            return sendMessage(message, `\`\`\`\n❌ No AR file found!\n\`\`\``);
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (!data[name]) {
            sendMessage(message, `\`\`\`\n❌ Name "${name}" does not exist!\n\`\`\``);
        } else {
            delete data[name];
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            sendMessage(message, `\`\`\`\n✅ Removed "${name}" from AR!\n\`\`\``);
        }
    }

    if (command === 'editar') {
        const name = args[0];
        const newValue = args.slice(1).join(' ');
    
        if (!fs.existsSync(filePath)) {
            sendMessage(message, `\n❌ No AR file found!`);
        } else {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
            if (!data[name]) {
                sendMessage(message, `\n❌ Name "${name}" does not exist!`);
            } else {
                data[name] = newValue;
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                sendMessage(message, `\`\`\`\n✅ Updated "${name}" to "${newValue}"!\`\`\``);
            }
        }
    }

    if (command === 'listar') {
        if (!fs.existsSync(filePath)) {
            sendMessage(message, `\n❌ No AR file found!`);
        } else {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const arNames = Object.keys(data);
            
            if (arNames.length === 0) {
                sendMessage(message, `\n❌ No AR names found!`);
            } else {
                sendMessage(message, `\`\`\`\n📜 AR Names: ${arNames.join(', ')}\`\`\``);
            }
        }
    }
    

    const amFilePath = path.join(__dirname, 'data', 'am.json');

if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));
if (!fs.existsSync(amFilePath)) fs.writeFileSync(amFilePath, '[]', 'utf8');

if (command === 'am') {
    const channelMentionOrID = args[0];
    const time = parseInt(args[1]);
    const autoMessage = args.slice(2).join(' ');
    const channelID = channelMentionOrID.startsWith('<#') 
        ? channelMentionOrID.replace(/[<#>]/g, '') 
        : channelMentionOrID;

    const channel = message.guild.channels.cache.get(channelID) || message.guild.channels.cache.find(c => c.id === channelID || c.name === channelID);

    if (!channel) return message.reply('❌ Invalid channel specified!');

    const autoMessages = JSON.parse(fs.readFileSync(amFilePath, 'utf8'));
    if (autoMessages.find(am => am.channelName === channel.name)) return message.reply('❌ This channel already has an active auto message.');

    const code = Math.random().toString().slice(2, 7);
    autoMessages.push({ channelName: channel.name, message: autoMessage, time, code });
    fs.writeFileSync(amFilePath, JSON.stringify(autoMessages, null, 2), 'utf8');

    message.reply(`✅ Your auto message has been started with code: ${code}`);

    setInterval(() => { try{
        const autoMessages = JSON.parse(fs.readFileSync(amFilePath, 'utf8'));
        const currentMessage = autoMessages.find(am => am.channelName === channel.name);
        if (!currentMessage) return;

        const targetChannel = message.guild.channels.cache.find(c => c.name === currentMessage.channelName);
        if (!targetChannel) return console.log('Unable to send message, channel not found.');

        targetChannel.send(currentMessage.message).catch(() => {
            console.log('Unable to send message, retrying after interval.');
        });
    }catch(error){
        
    }
    }, time * 1000);
}

if (command === 'listam') {
    const autoMessages = JSON.parse(fs.readFileSync(amFilePath, 'utf8'));
    if (!autoMessages.length) return message.reply('❌ No auto messages found.');

    const amList = autoMessages.map(am => am.code).join(', ');
    message.reply(`✅ Active auto messages: ${amList}`);
}

if (command === 'infoam') {
    const code = args[0];
    const autoMessages = JSON.parse(fs.readFileSync(amFilePath, 'utf8'));
    const am = autoMessages.find(am => am.code === code);

    if (!am) return message.reply('❌ No auto message found with that code.');
    message.reply(`\`\`\`Channel: ${am.channelName}\nMessage: ${am.message}\nInterval: ${am.time}s\nCode: ${am.code}\`\`\``);
}

if (command === 'stopam') {
    const code = args[0];
    const autoMessages = JSON.parse(fs.readFileSync(amFilePath, 'utf8'));
    const index = autoMessages.findIndex(am => am.code === code);

    if (index === -1) return message.reply('❌ No auto message found with that code.');

    autoMessages.splice(index, 1);
    fs.writeFileSync(amFilePath, JSON.stringify(autoMessages, null, 2), 'utf8');
    message.reply(`✅ Auto message with code ${code} has been stopped.`);
}

if (command === 'editam') {
    const code = args[0];
    const type = args[1];
    const newValue = args.slice(2).join(' ');
    if(type !== 'message') return;
    const autoMessages = JSON.parse(fs.readFileSync(amFilePath, 'utf8'));
    const am = autoMessages.find(am => am.code === code);

    if (!am) return message.reply('❌ No auto message found with that code.');

    if (type === 'message') am.message = newValue;

    fs.writeFileSync(amFilePath, JSON.stringify(autoMessages, null, 2), 'utf8');
    message.reply(`✅ Auto message with code ${code} has been updated.`);
}

if (command === 'bal') {
    const ag = message.content.split(' ')
    const ltcAddress = ag[1];
    if (!ltcAddress) return message.reply('❌ Please provide a valid Litecoin address!');

    const url = `https://api.blockcypher.com/v1/ltc/main/addrs/${ltcAddress}/balance`;

    try {
        const { data } = await axios.get(url);

       

        const confirmedBalanceLTC = data.balance / 1e8;
        const unconfirmedBalanceLTC = data.unconfirmed_balance / 1e8;
        const totalSentLTC = data.total_sent / 1e8;
        const totalReceivedLTC = data.total_received / 1e8;

        const priceUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd';
        const { data: priceData } = await axios.get(priceUrl);
        const ltcToUsd = priceData.litecoin.usd;

        const confirmedBalanceUSD = (confirmedBalanceLTC * ltcToUsd).toFixed(2);
        const unconfirmedBalanceUSD = (unconfirmedBalanceLTC * ltcToUsd).toFixed(2);
        const totalSentUSD = (totalSentLTC * ltcToUsd).toFixed(2);
        const totalReceivedUSD = (totalReceivedLTC * ltcToUsd).toFixed(2);

        message.reply(`
\`\`\`
💰 Litecoin Address: ${ltcAddress}
🔸 Confirmed Balance:
   - ${confirmedBalanceLTC} LTC
   - $${confirmedBalanceUSD} USD

🔸 Unconfirmed Balance:
   - ${unconfirmedBalanceLTC} LTC
   - $${unconfirmedBalanceUSD} USD

🔸 Total Sent:
   - ${totalSentLTC} LTC
   - $${totalSentUSD} USD

🔸 Total Received:
   - ${totalReceivedLTC} LTC
   - $${totalReceivedUSD} USD
\`\`\`
        `);
    } catch (error) {
        console.log(error)
        message.reply('❌ Invalid address! Please check and try again.');
    }
}

if (command === 'btcbal') {
    const btcAddress = args[0];
    if (!btcAddress) return message.reply('❌ Please provide a valid Bitcoin address!');
    const url = `https://api.blockcypher.com/v1/btc/main/addrs/${btcAddress}/balance`;
    try {
        const { data } = await axios.get(url);
        const confirmedBalanceBTC = data.balance / 1e8;
        const unconfirmedBalanceBTC = data.unconfirmed_balance / 1e8;
        const totalSentBTC = data.total_sent / 1e8;
        const totalReceivedBTC = data.total_received / 1e8;
        const priceUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
        const { data: priceData } = await axios.get(priceUrl);
        const btcToUsd = priceData.bitcoin.usd;
        const confirmedBalanceUSD = (confirmedBalanceBTC * btcToUsd).toFixed(2);
        const unconfirmedBalanceUSD = (unconfirmedBalanceBTC * btcToUsd).toFixed(2);
        const totalSentUSD = (totalSentBTC * btcToUsd).toFixed(2);
        const totalReceivedUSD = (totalReceivedBTC * btcToUsd).toFixed(2);
        message.reply(`
\`\`\`
💰 **Bitcoin Address**: ${btcAddress}
🔸 **Confirmed Balance**:
   - ${confirmedBalanceBTC} BTC
   - $${confirmedBalanceUSD} USD

🔸 **Unconfirmed Balance**:
   - ${unconfirmedBalanceBTC} BTC
   - $${unconfirmedBalanceUSD} USD

🔸 **Total Sent**:
   - ${totalSentBTC} BTC
   - $${totalSentUSD} USD

🔸 **Total Received**:
   - ${totalReceivedBTC} BTC
   - $${totalReceivedUSD} USD
\`\`\`
        `);
    } catch (error) {
        message.reply('❌ Invalid address! Please check and try again.');
    }
}

if (command === 'ethbal') {
    const ethAddress = args[0];
    if (!ethAddress) return message.reply('❌ Please provide a valid Ethereum address!');
    const url = `https://api.blockcypher.com/v1/eth/main/addrs/${ethAddress}/balance`;
    try {
        const { data } = await axios.get(url);
        const confirmedBalanceETH = data.balance / 1e18;
        const unconfirmedBalanceETH = data.unconfirmed_balance / 1e18; 
        const totalReceivedETH = data.total_received / 1e18;
        const totalSentETH = data.total_sent / 1e18;
        const priceUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
        const { data: priceData } = await axios.get(priceUrl);
        const ethToUsd = priceData.ethereum.usd;
        const confirmedBalanceUSD = (confirmedBalanceETH * ethToUsd).toFixed(2);
        const unconfirmedBalanceUSD = (unconfirmedBalanceETH * ethToUsd).toFixed(2);
        const totalSentUSD = (totalSentETH * ethToUsd).toFixed(2);
        const totalReceivedUSD = (totalReceivedETH * ethToUsd).toFixed(2);
        message.reply(`
\`\`\`
💰 **Ethereum Address**: ${ethAddress}
🔸 **Confirmed Balance**:
   - ${confirmedBalanceETH} ETH
   - $${confirmedBalanceUSD} USD

🔸 **Unconfirmed Balance**:
   - ${unconfirmedBalanceETH} ETH
   - $${unconfirmedBalanceUSD} USD

🔸 **Total Sent**:
   - ${totalSentETH} ETH
   - $${totalSentUSD} USD

🔸 **Total Received**:
   - ${totalReceivedETH} ETH
   - $${totalReceivedUSD} USD
\`\`\`
        `);
    } catch (error) {
        message.reply('❌ Invalid address! Please check and try again.');
    }
}


if (command === 'createwebhook') {
    const channelMentionOrID = args[0];
    const webhookName = args[1] ? args.slice(1).join(' ') : 'risk-selfbot';
    const channelID = channelMentionOrID.startsWith('<#') 
        ? channelMentionOrID.replace(/[<#>]/g, '') 
        : channelMentionOrID;

    const channel = message.guild.channels.cache.get(channelID) || message.guild.channels.cache.find(c => c.id === channelID || c.name === channelID);

    if (!channel) return message.reply('❌ Invalid channel specified!');

    try {
        channel.createWebhook(webhookName)
            .then(webhook => {
                message.reply(`✅ Webhook created successfully:
\`\`\`
🌐 **Webhook Name**: ${webhook.name}
🔗 **Webhook URL**: ${webhook.url}
📍 **Channel**: <#${channel.id}>
\`\`\`
                `);
            })
            .catch(() => {
                message.reply('❌ You don’t have permission to create a webhook in this channel.');
            });
    } catch (error) {
        message.reply('❌ An error occurred while creating the webhook.');
    }
}

if (command === 'webhooksend') {
    const webhookLink = args[0];
    const type = args[1];
    const content = args.slice(2).join(' ');

    if (!webhookLink || !type || !content) return message.reply('❌ Please provide a valid webhook link, type (embed/message), and content.');

    const url = webhookLink;

    let payload;
    if (type === 'embed') {
        payload = {
            embeds: [{
                description: content,
                color: 3447003 
            }]
        };
    } else if (type === 'message') {
        payload = {
            content
        };
    } else {
        return message.reply('❌ Invalid type! Use "embed" or "message".');
    }

    axios.post(url, payload)
        .then(() => {
            message.reply('✅ Message sent successfully via webhook!');
        })
        .catch(() => {
            message.reply('❌ Failed to send message via webhook. Please check the webhook link and try again.');
        });
}


if (command === 'pingnotifsetup') {
    const webhookLink = args[0];
    if (!webhookLink) return message.reply('❌ Please provide a valid webhook link.');

    const userId = message.author.id;

    if (!fs.existsSync('./pingData.json')) fs.writeFileSync('./pingData.json', JSON.stringify({}, null, 2), 'utf8');
    const pingData = JSON.parse(fs.readFileSync('./pingData.json', 'utf8'));
    pingData[userId] = webhookLink;
    fs.writeFileSync('./pingData.json', JSON.stringify(pingData, null, 2), 'utf8');

    message.reply('✅ Ping notification setup completed successfully!');
}

if (command === 'pingnotifstop') {
    const userId = message.author.id;

    if (!fs.existsSync('./pingData.json')) return message.reply('❌ No ping notification setup found.');

    const pingData = JSON.parse(fs.readFileSync('./pingData.json', 'utf8'));

    if (!pingData[userId]) return message.reply('❌ No ping notification setup found for your user.');

    delete pingData[userId];
    fs.writeFileSync('./pingData.json', JSON.stringify(pingData, null, 2), 'utf8');

    message.reply('✅ Ping notifications stopped and removed.');
}



const vouchFilePath = path.join(__dirname, 'vouch.json');

if (command === 'customvouch') {
    const name = args[0];
    const keywords = args.slice(1);
    if (!name || keywords.length === 0) return message.reply('❌ Please provide a name and at least one keyword.');

    if (!fs.existsSync(vouchFilePath)) {
        fs.writeFileSync(vouchFilePath, JSON.stringify([]));
    }

    const vouches = JSON.parse(fs.readFileSync(vouchFilePath, 'utf8'));

    if (vouches.find(v => v.name === name)) {
        return message.reply('❌ That vouch name already exists.');
    }

    const code = Math.random().toString(36).substr(2, 5).toUpperCase();
    vouches.push({ name, keywords, message: "", code });
    fs.writeFileSync(vouchFilePath, JSON.stringify(vouches, null, 2));

    message.reply(`✅ Vouch '${name}' created with code: ${code}`);
}

if (command === 'vouchmessage') {
    const code = args[0];
    const vouchMessage = args.slice(1).join(' ');

    if (!code || !vouchMessage) return message.reply('❌ Please provide a valid vouch code and message.');

    const vouches = JSON.parse(fs.readFileSync(vouchFilePath, 'utf8'));
    const vouch = vouches.find(v => v.code === code);

    if (!vouch) return message.reply('❌ Invalid vouch code!');

    for (const keyword of vouch.keywords) {
        if (!vouchMessage.includes(keyword)) {
            return message.reply(`❌ The message is missing the keyword: '${keyword}'`);
        }
    }

    vouch.message = vouchMessage;
    fs.writeFileSync(vouchFilePath, JSON.stringify(vouches, null, 2));

    message.reply(`✅ Vouch message for '${vouch.name}' has been set.`);
}

if (command === 'vouch') {
    const name = args[0];
    const keywordValues = args.slice(1);

    if (!name || keywordValues.length === 0) return message.reply('❌ Please provide a vouch name and keyword values.');

    const vouches = JSON.parse(fs.readFileSync(vouchFilePath, 'utf8'));
    const vouch = vouches.find(v => v.name === name);

    if (!vouch) return message.reply('❌ No vouch found with that name!');

    if (keywordValues.length !== vouch.keywords.length) {
        return message.reply('❌ Please provide values for all keywords.');
    }

    let vouchMessage = vouch.message;
    vouch.keywords.forEach((keyword, index) => {
        vouchMessage = vouchMessage.replace(new RegExp(keyword, 'g'), keywordValues[index]);
    });

    message.channel.send(`\`\`\`+rep <@${client.user.id}> ${vouchMessage}\`\`\``);
}

if (command === 'listvouch') {
    const vouches = JSON.parse(fs.readFileSync(vouchFilePath, 'utf8'));

    if (vouches.length === 0) return message.reply('❌ No vouches found.');

    const vouchNames = vouches.map(v => v.name).join('\n');
    message.reply(`📝 **List of Vouches:**\n\`\`\`${vouchNames}\`\`\``);
}

if (command === 'deletevouch') {
    const name = args[0];

    if (!name) return message.reply('❌ Please provide a vouch name.');

    const vouches = JSON.parse(fs.readFileSync(vouchFilePath, 'utf8'));
    const updatedVouches = vouches.filter(v => v.name !== name);

    if (updatedVouches.length === vouches.length) {
        return message.reply('❌ No vouch found with that name.');
    }

    fs.writeFileSync(vouchFilePath, JSON.stringify(updatedVouches, null, 2));
    message.reply(`✅ Vouch '${name}' has been deleted.`);
}

if (command === 'listserver') {
    const servers = client.guilds.cache.map(guild => guild);

    if (servers.length === 0) {
        return message.reply('❌ No servers found.');
    }

    const serverIds = servers.map(guild => guild.id).join(', ');
    const fileContent = servers.map(guild => `${guild.id} : ${guild.name}`).join('\n');
    const filePath = path.join(__dirname, 'servers.txt');
    fs.writeFileSync(filePath, fileContent);

    message.channel.send({
        content: `📝 **List of Server Guild IDs:**\n\`${serverIds}\``,
        files: [{ attachment: filePath, name: 'servers.txt' }]
    }).then(() => {
        fs.unlinkSync(filePath);
    }).catch(err => {
        message.reply('❌ Error sending the file.');
        console.error(err);
    });
}

if (command === 'leaveserver') {
    const guildId = args[0];
    if (!guildId) return message.reply('❌ Please provide a valid guild ID!');

    try {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) return message.reply('❌ Guild not found!');

        await guild.leave();
        message.reply(`✅ Successfully left the server **${guild.name}**!`);
    } catch (error) {
        message.reply('❌ Unable to leave the server.');
    }
}

if (command === 'guildinfo') {
    const guildId = args[0];
    if (!guildId) return message.reply('❌ Please provide a valid guild ID!');

    const guild = client.guilds.cache.get(guildId);
    if (!guild) return message.reply('❌ Guild not found!');

    const userCount = guild.memberCount;
    const channelCount = guild.channels.cache.size;
    const textChannelCount = guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size;
    const voiceChannelCount = guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size;
    const visibleChannelCount = guild.channels.cache.filter(c => c.viewable).size;
    const invisibleChannelCount = guild.channels.cache.filter(c => !c.viewable).size;
    const roleCount = guild.roles.cache.size;
    const boostCount = guild.premiumSubscriptionCount || 0;
    const ownerId = guild.ownerId;
    const owner = await client.users.fetch(ownerId);
    const ownerName = owner.tag;

    message.reply(`
\`\`\`
🏷️ **Guild Name**: ${guild.name}
👥 **Number of Users**: ${userCount}
📅 **Number of Channels**: ${channelCount}
💬 **Number of Text Channels**: ${textChannelCount}
🔊 **Number of Voice Channels**: ${voiceChannelCount}
👁️ **Number of Visible Channels**: ${visibleChannelCount}
👁️‍🗨️ **Number of Invisible Channels**: ${invisibleChannelCount}
🎭 **Number of Roles**: ${roleCount}
💎 **Number of Boosts**: ${boostCount}
👑 **Owner ID**: ${ownerId}
👤 **Owner Name**: ${ownerName}
\`\`\`
    `);
}



if (command === 'pastee') {
    const msg = args.join(' ');
    if (!msg) return message.reply('❌ Please provide a message to paste!');

    const url = 'https://paste.ee/paste';

    const payload = {
        expiration: 2592000,
        expiration_views: '',
        description: '',
        'paste[section1][name]': '',
        'paste[section1][syntax]': 'text',
        'paste[section1][contents]': msg.replace(/\n/g, '\n'),
        fixlines: true,
        jscheck: 'validated'
    };

    axios.post(url, qs.stringify(payload), {
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.9',
        },
    })
    .then(response => {
        const responseText = response.data.replace(/<[^>]*>/g, ' ');
        const pasteIdMatch = responseText.match(/Paste\.ee - View paste ([A-Za-z0-9]+)/);
        if (pasteIdMatch && pasteIdMatch[1]) {
            const pasteId = pasteIdMatch[1];
            const pasteLink = `https://paste.ee/p/${pasteId}`;
            message.channel.send(`📄 Here is your paste: \`${pasteLink}\``);
        } else {
            message.reply('❌ Unable to retrieve Paste ID. Please try again.');
        }
    })
    .catch(error => {
        message.reply(`❌ Error `);
    });
}




if (command === 'qr') {
    const input = args.join(' ');
    if (!input) return message.reply('❌ Please provide a UPI ID, crypto address, or link!');

    const isUPI = input.includes('@');
    
    if (isUPI) {
        const upiFormat = `upi:${input}`; 
        try {
            await QRCode.toFile('./qrCode.png', upiFormat);
            const qrFile = fs.createReadStream('./qrCode.png');

            message.channel.send({ content: 'Here is your QR code:', files: [{ attachment: qrFile, name: 'qrCode.png' }] })
                .then(() => {
                    fs.unlink('./qrCode.png', (err) => {
                        if (err) console.error('Error deleting file:', err);
                    });
                });
        } catch (error) {
            message.reply('❌ An error occurred while generating the QR code. Please try again.');
        }
    } else {
        try {
            await QRCode.toFile('./qrCode.png', input);
            const qrFile = fs.createReadStream('./qrCode.png');

            message.channel.send({ content: 'Here is your QR code:', files: [{ attachment: qrFile, name: 'qrCode.png' }] })
                .then(() => {
                    fs.unlink('./qrCode.png', (err) => {
                        if (err) console.error('Error deleting file:', err);
                    });
                });
        } catch (error) {
            message.reply('❌ An error occurred while generating the QR code. Please try again.');
        }
    }
}


if (command === 'readimg') {
    let attachment;

    if (message.attachments.size > 0) {
        attachment = message.attachments.first();
    } else if (message.reference) {
        const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
        attachment = referencedMessage.attachments.first();
    }

    if (!attachment || !attachment.name.match(/\.(png|jpg|jpeg)$/)) {
        return message.reply('❌ Please reply to a .png or .jpg image or send one with the command!');
    }

    const dir = './images';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const imagePath = `${dir}/${attachment.name}`;

    try {
        const response = await axios({
            method: 'get',
            url: attachment.url,
            responseType: 'arraybuffer'
        });

        fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

        Tesseract.recognize(
            imagePath,
            'eng',
            { logger: info => {} }
        ).then(({ data: { text } }) => {
            fs.unlinkSync(imagePath);
            if (!text) {
                return message.reply('❌ No text found in the image.');
            }
            message.channel.send(`🖼️ Extracted Text:\n\`\`\`${text}\`\`\``);
        }).catch(error => {
            fs.unlinkSync(imagePath);
            message.reply(`❌ An error occurred: ${error.message}`);
        });
    } catch (error) {
        message.reply(`❌ An error occurred: ${error.message}`);
    }
}

if (command === 'txtfile') {
    const messageContent = args.join(' ');
    
    if (!messageContent) {
        return message.reply('❌ Please provide a message to save in the text file!');
    }

    const filePath = './text.txt';
    
    fs.writeFileSync(filePath, messageContent);

    message.channel.send({
        content: '📄 Here is your text file:',
        files: [{
            attachment: filePath,
            name: 'text.txt'
        }]
    }).then(() => {
        fs.unlinkSync(filePath);
    }).catch(error => {
        message.reply(`❌ An error occurred while sending the file: ${error.message}`);
    });
}


if (command === 'gituser') {
    const username = args.join(' ');
    
    if (!username) {
        return message.reply('❌ Please provide a username to search!');
    }

    try {
        const response = await axios.get(`https://api.github.com/search/users?q=${encodeURIComponent(username)}`);
        const users = response.data.items;

        if (!users.length) {
            return message.reply('❌ No users found!');
        }

        let userMessages = [];
        let currentMessage = 'Here are the GitHub users found:\n';

        users.forEach(user => {
            const userLink = `https://github.com/${user.login}`;
            const userEntry = `${user.login}: ${userLink}\n`;

            if ((currentMessage + userEntry).length > 2000) {
                userMessages.push(currentMessage);
                currentMessage = 'Here are the GitHub users found:\n' + userEntry;
            } else {
                currentMessage += userEntry;
            }
        });

        userMessages.push(currentMessage);

        for (const msg of userMessages) {
            await message.channel.send(msg);
        }
    } catch (error) {
        message.reply(`❌ An error occurred while searching for users: ${error.message}`);
    }
}
if (command === 'viewhtml') {
   

    const repliedMessage = message.reference ? await message.channel.messages.fetch(message.reference.messageId) : null;
    const htmlAttachment = message.attachments.first() || repliedMessage?.attachments.first();

    if (!htmlAttachment || !htmlAttachment.name.endsWith('.html')) {
        return message.reply('❌ No HTML file found.');
    }
const c = require('./config.json')
    const htmlUrl = htmlAttachment.url;

    axios.get(htmlUrl)
        .then(response => {
            if (!fs.existsSync('./html')) fs.mkdirSync('./html');
            const randomCode = Math.floor(1000000000 + Math.random() * 9000000000);
            const fileName = `./html/${randomCode}.html`;
            fs.writeFileSync(fileName, response.data, 'utf8');
            message.reply(`[view html](http://${c.html.ip}:${c.html.port}/html/${randomCode})`);
        })
        .catch(() => message.reply('❌ Failed to retrieve the HTML file.'));
}

if (command === 'gitlocation') {
    const location = args.join(' ');

    if (!location) {
        return message.reply('❌ Please provide a location to search!');
    }

    try {
        const response = await axios.get(`https://api.github.com/search/users?q=location:${encodeURIComponent(location)}`);
        const users = response.data.items;

        if (!users.length) {
            return message.reply('❌ No users found in that location!');
        }

        let userMessages = [];
        let currentMessage = 'Here are the GitHub users found:\n';

        users.forEach(user => {
            const userLink = `https://github.com/${user.login}`;
            const userEntry = `${user.login}: ${userLink}\n`;

            if ((currentMessage + userEntry).length > 2000) {
                userMessages.push(currentMessage);
                currentMessage = 'Here are the GitHub users found:\n' + userEntry;
            } else {
                currentMessage += userEntry;
            }
        });

        userMessages.push(currentMessage);

        for (const msg of userMessages) {
            await message.channel.send(msg);
        }
    } catch (error) {
        message.reply(`❌ An error occurred while searching for users: ${error.message}`);
    }
}

if (command === 'gitrepo') {
    const repoName = args.join(' ');

    if (!repoName) {
        return message.reply('❌ Please provide a repository name to search!');
    }

    try {
        const response = await axios.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(repoName)}`);
        const repos = response.data.items;

        if (!repos.length) {
            return message.reply('❌ No repositories found with that name!');
        }

        let repoMessages = [];
        let currentMessage = 'Here are the GitHub repositories found:\n';

        repos.forEach(repo => {
            const repoLink = repo.html_url;
            const repoEntry = `${repo.full_name}: ${repoLink}\n`;

            if ((currentMessage + repoEntry).length > 2000) {
                repoMessages.push(currentMessage);
                currentMessage = 'Here are the GitHub repositories found:\n' + repoEntry;
            } else {
                currentMessage += repoEntry;
            }
        });

        repoMessages.push(currentMessage);

        for (const msg of repoMessages) {
            await message.channel.send(msg);
        }
    } catch (error) {
        message.reply(`❌ An error occurred while searching for repositories: ${error.message}`);
    }
}


if (command === 'changeprefix') {
    const newPrefix = args[0];

    if (!newPrefix) {
        return message.reply('❌ Please provide a new prefix!');
    }

    if (newPrefix.length > 3) {
        return message.reply('❌ The prefix should be 1-3 characters long!');
    }

    const configPath = './config.json';

    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        config.prefix = newPrefix;

        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        message.reply(`✅ Command prefix has been changed to \`${newPrefix}\``);
    } catch (error) {
        message.reply('❌ An error occurred while changing the prefix. Please try again.');
        console.error('Error updating prefix:', error);
    }
}




if (command === 'snipe') {
    
    const number = args[0] ? parseInt(args[0]) : 5;
    const logs = JSON.parse(fs.readFileSync(logFilePath));
    const channelLogs = logs.filter(log => log.channelId === message.channel.id);

    if (message.channel.type === 'DM') {
        const userLogs = logs.filter(log => log.deletedBy === message.author.id);
        const messagesToShow = userLogs.slice(-number);
        const response = messagesToShow.map(log => `🗑️ Deleted Message: \`${log.content}\` | Deleted By: <@${log.deletedBy}> | Deleted At: <t:${Math.floor(log.timestamp / 1000)}:F>`).join('\n');
        message.channel.send(response || '❌ No deleted messages found.');
    } else {
        const messagesToShow = channelLogs.slice(-number);
        const response = messagesToShow.map(log => `🗑️ Deleted Message: \`${log.content}\` | Deleted By: <@${log.deletedBy}> | Deleted At: <t:${Math.floor(log.timestamp / 1000)}:F>`).join('\n');
        message.channel.send(response || '❌ No deleted messages found.');
    }

}




if (command === 'convert') {
    const coinName = args[0];
    const amount = parseFloat(args[1]);
    const currency = args[2] ? args[2].toLowerCase() : null;

    if (!coinName || isNaN(amount)) {
        return message.reply('❌ Please provide a valid coin name and amount to convert! Usage: `.convert <coin name> <amount> [currency]`');
    }

    try {
        let response;

        if (currency) {
            response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=${currency}`);
        } else {
            response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd,eur,inr`);
        }

        const priceData = response.data[coinName];

        if (!priceData) {
            return message.reply('❌ Coin not found. Please check the coin name and try again.');
        }

        let result = `💱 **Conversion Results:**\n\`\`\`\n`;

        if (currency) {
            const convertedValue = (priceData[currency] * amount).toFixed(2);
            result += `${amount} ${coinName.toUpperCase()} = ${convertedValue} ${currency.toUpperCase()}\n`;
        } else {
            const basePrice = {
                usd: (priceData.usd * amount).toFixed(2),
                eur: (priceData.eur * amount).toFixed(2),
                inr: (priceData.inr * amount).toFixed(2)
            };

            result += `${amount} ${coinName.toUpperCase()} = ${basePrice.usd} USD\n`;
            result += `${amount} ${coinName.toUpperCase()} = ${basePrice.eur} EUR\n`;
            result += `${amount} ${coinName.toUpperCase()} = ${basePrice.inr} INR\n`;
        }

        result += '\`\`\`';
        message.channel.send(result);
    } catch (error) {
        console.error(error);
        message.reply('❌ There was an error fetching the conversion rates. Please try again later.');
    }
}



if (command === 'fto') {
    const userId = args[0]?.replace(/<@!?|>/g, '');
    const timeInput = args[1];
    const reason = args.slice(2).join(' ').trim() || 'No reason provided';

    if (!userId || isNaN(userId) || !timeInput) {
        return message.reply(`❌ Please provide a valid user mention or ID, timeout duration, and optionally a reason. Usage: \`${prefix}fto <user ping or user id> <time> [reason]\``);
    }

    const timeoutFilePath = path.join(__dirname, 'timeout.json');
    let timeoutData = {};

    if (fs.existsSync(timeoutFilePath)) {
        timeoutData = JSON.parse(fs.readFileSync(timeoutFilePath, 'utf8'));
    }

    const timeUnits = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
    const duration = timeInput
        .match(/\d+[dhms]/g)
        ?.reduce((total, unit) => total + parseInt(unit) * timeUnits[unit.slice(-1)], 0);

    if (!duration || duration <= 0) {
        return message.reply(`❌ Invalid time format. Use a combination of \`d\`, \`h\`, \`m\`, \`s\` (e.g., 1d1h1m1s).`);
    }

    try {
        const member = await message.guild.members.fetch(userId);
        const endTime = Date.now() + duration;

        await member.timeout(duration, reason);

        if (!timeoutData[message.guild.id]) timeoutData[message.guild.id] = [];
        timeoutData[message.guild.id].push({
            userId,
            endTime,
            reason,
        });

        fs.writeFileSync(timeoutFilePath, JSON.stringify(timeoutData, null, 2));
        message.reply(`✅ ${member.user.tag} has been timed out for ${timeInput}. ${reason !== 'No reason provided' ? `Reason: ${reason}` : ''}`);
    } catch (error) {
        console.error(error);
        message.reply('❌ Failed to timeout the user.');
    }
}
 else if (command === 'stopto') {
    const userId = args[0]?.replace(/<@!?|>/g, '');
    if (!userId || isNaN(userId)) {
        return message.reply(`❌ Please provide a valid user mention or ID. Usage: \`${prefix}stopto <user ping or user id>\``);
    }

    const timeoutFilePath = path.join(__dirname, 'timeout.json');
    const timeoutData = JSON.parse(fs.readFileSync(timeoutFilePath, 'utf8'));

    if (!timeoutData[message.guild.id]?.some((entry) => entry.userId === userId)) {
        return message.reply('❌ User is not timed out in this guild.');
    }

    try {
        const config = require('./config.json');
        const member = await message.guild.members.fetch(userId);
        timeoutData[message.guild.id] = timeoutData[message.guild.id].filter((entry) => entry.userId !== userId);
        fs.writeFileSync(timeoutFilePath, JSON.stringify(timeoutData, null, 2));

        await axios.patch(
            `https://discord.com/api/v9/guilds/${message.guild.id}/members/${userId}`,
            { communication_disabled_until: null },
            {
                headers: {
                    authorization: config.token,
                    'content-type': 'application/json',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
                },
            }
        );

        

        message.reply(`✅ Timeout removed for ${member.user.tag}.`);
    } catch (error) {
        console.error(error);
        message.reply('❌ Failed to remove timeout for the user.');
    }
}


if (command === 'help') {
    const helpMessage = `
# 🌟 **[ROBOTIFY COMMANDS](https://selfbot.in)** 🌟  

### ⚙️ **Categories**
- **wallet**: Wallet Management
- **txns**: Transactions & Balances
- **ar**: Auto responder
- **am**: Auto message
- **webhooks**: Webhooks
- **notif**: Notifications
- **vouch**: Vouch System
- **server**: Server Management
- **files**: File & Content Tools
- **github**: GitHub Utilities
- **rpc**: RPC Management
- **afk**: afk 
- **other**: other commands 


---

### 📖 **More Details**
Run \`.helputilitiy <utility>\` for all commands in a specific category.
Examples: \`.helputility wallet\`, \`.helputility txns\`.
    `;
    message.channel.send(helpMessage);
}

if (command === 'helputility') {
    const utility = args[0]?.toLowerCase();

    const utilities = {
        wallet: `
### ⚙️ **Wallet Management**
- **import**
- **genwallet**
- **listwallet**
- **changeltcformat**
- **changeaddressformat**
- **address**
- **editwalletname**
- **deletewallet**
- **walletinfo**
- **walletbal**
- **send**
- **sendnotifywebhook**
- **sendnotify**
        `,
        txns: `
### 💸 **Transactions & Balances**
- **bal**
- **btcbal**
- **ethbal**
- **p**
- **doge, btc, eth, trx, sol, bnb, pepe**
- **price**
- **convert**
        `,
        ar: `
### 🚀 **Auto Roles (AR)**
- **aradd**
- **removear**
- **editar**
- **listar**
        `,
        am: `
### 🤖 **Auto message (AM)**
- **am**
- **listam**
- **infoam**
- **stopam**
- **editam**
        `,
        webhooks: `
### 🌐 **Webhooks**
- **createwebhook**
- **webhooksend**
        `,
        notif: `
### 🔔 **Notifications**
- **pingnotifsetup**
- **pingnotifstop**
        `,
        vouch: `
### 🏅 **Vouch System**
- **customvouch**
- **vouchmessage**
- **vouch**
- **listvouch**
- **deletevouch**
        `,
        server: `
### 🌍 **Server Management**
- **listserver**
- **leaveserver**
- **guildinfo**
        `,
        files: `
### 📂 **File & Content Tools**
- **pastee**
- **qr**
- **readimg**
- **txtfile**
- **viewhtml**
        `,
        github: `
### 🔍 **GitHub Utilities**
- **gituser**
- **gitlocation**
- **gitrepo**
        `,
        rotator: `
### 🔄 **Status Rotator**
- **setstatus**
- **setemoji**
- **startrotate**
- **stoprotate**
- **statuslist**
- **remove**
- **editemoji**
        `,
        rpc: `
### ⚙️ **RPC Management**
- **addrpc**
- **stoprpc**
- **startrpc**
        `,
        afk: `
### ⚙️ **AFK Management**
- **afk**

        `,other: `
        ### ⚙️ **others**
        - **permto**
        - **stoppermto**
                `
    };

    if (!utility || !utilities[utility]) {
        return message.channel.send(
            `Invalid or missing utility! Use \`.helputilities <utility>\`.\nAvailable utilities: wallet, txns, ar, am, webhooks, notif, vouch, server, files, github, rotator, rpc.`
        );
    }

    message.channel.send(`${utilities[utility]}\n\n### 📖 **More Details**\nRun \`.helpinfo <command>\``);
}

const configFilePath = path.join(__dirname, 'config.json');
const config = require('./config.json')
 if (command === 'addrpc') {
    const args = message.content.split(' ').slice(1);
    const subCommand = args[0];

    switch (subCommand) {
        case 'state':
            const stateValue = args.slice(1).join(' ');
            config.state = stateValue;
            message.reply(`State updated to: ${stateValue}`);
            break;
        case 'name':
            const nameValue = args.slice(1).join(' ');
            config.name = nameValue;
            message.reply(`Name updated to: ${nameValue}`);
            break;
        case 'details':
            const detailsValue = args.slice(1).join(' ');
            config.details = detailsValue;
            message.reply(`Details updated to: ${detailsValue}`);
            break;
        case 'image':
            const largeImageValue = args[1];
            config.largeImageUrl = largeImageValue;
            message.reply(`Large Image URL updated to: ${largeImageValue}`);
            break;
        case 'button1':
            const button1Url = args[1];
            const button1Name = args.slice(2).join(' ');
            if (!config.buttons) {
                config.buttons = [];
            }
            while (config.buttons.length < 1) {
                config.buttons.push({ text: '', url: '' });
            }
            config.buttons[0].text = button1Name;
            config.buttons[0].url = button1Url;
            message.reply(`Button 1 updated: ${button1Name} - ${button1Url}`);
            break;
        case 'button2':
            const button2Url = args[1];
            const button2Name = args.slice(2).join(' ');
            if (!config.buttons) {
                config.buttons = [];
            }
            while (config.buttons.length < 2) {
                config.buttons.push({ text: '', url: '' });
            }
            config.buttons[1].text = button2Name;
            config.buttons[1].url = button2Url;
            message.reply(`Button 2 updated: ${button2Name} - ${button2Url}`);
            break;
        default:
            message.reply('Invalid sub-command. Use `state`, `name`, `details`, `largeimage`, `button1`, or `button2`.');
            break;
    }
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
} else if (command === 'startrpc') {
    const config = JSON.parse(fs.readFileSync(configFilePath));
    const requiredFields = ['state', 'name', 'details', 'largeImageUrl'];
    const missingFields = requiredFields.filter(field => !config[field]);

    if (!config.buttons || config.buttons.length < 2) {
        missingFields.push('button1 name and link, button2 name and link');
    } else {
        config.buttons.forEach((button, index) => {
            if (!button.text || !button.url) {
                missingFields.push(`button${index + 1} name or link`);
            }
        });
    }

    if (missingFields.length > 0) {
        return message.reply(`Missing values: ${missingFields.join(', ')}`);
    }

    try {
        
        const status = new RichPresence(client)
            .setApplicationId(client.user.id)
            .setType('SELLING')
            .setState(config.state)
            .setName(config.name)
            .setDetails(config.details)
            .setStartTimestamp(Date.now())
            .setAssetsLargeImage(config.largeImageUrl)
            .setPlatform('desktop');

        config.buttons.forEach(button => {
            status.addButton(button.text, button.url);
        });

        await client.user.setPresence({ activities: [status] });
        rpcActive = true;
        message.reply('Started RPC.');
    } catch (error) {
        console.error('Error starting RPC:', error);
        message.reply('An error occurred while starting RPC. Check the console for details.');
    }
}
 else if (command === 'stoprpc') {
    rpcActive = false;
    client.user.setPresence({ activities: [] });
    message.reply('Stopped RPC.');
  }


const timeoutFilePath = path.join(__dirname, 'timeout.json');



if (command === 'helpinfo') {
    const commandName = args[0];

    if (!commandName) {
        return message.reply('❌ Please provide a command name to get information about!');
    }

    let description = '';

    switch (commandName.toLowerCase()) {
        case 'import':
            description = '# 🔑 Imports Litecoin wallet for Litecoin selfbot.\n\nUsage: `.import <phrase>`';
            break;
        case 'genwallet':
            description = '# 🔑 Generates a new wallet for Litecoin selfbot.\n\nUsage: `.genwallet <name>`';
            break;
        case 'listwallet':
            description = '# 📋 Lists all wallets you have.\n\nUsage: `.listwallet`';
            break;
        case 'changeltcformat':
            description = '# 🔄 Changes the format of LTC sending, if the format is usd it will send money in usd and if ltc it will send money in ltc.\n\nUsage: `.changeltcformat <usd/ltc>`';
            break;
        case 'changeaddressformat':
            description = '# 🔄 Changes the format of address the wallet it will send from(a private key has 2 wallet legacy and segwit you can toogle between both easily).\n\nUsage: `.changeaddressformat <legacy/segwit>`';
            break;
        case 'address':
            description = '# 🏷️ Displays the address of a wallet.\n\nUsage: `.address <wallet name>`';
            break;
        case 'editwalletname':
            description = '# ✏️ Edits the name of a wallet.\n\nUsage: `.editwalletname <old name> <new name>`';
            break;
        case 'deletewallet':
            description = '# 🗑️ Deletes a specified wallet.\n\nUsage: `.deletewallet <wallet name>`';
            break;
        case 'walletinfo':
            description = '# ℹ️ Displays information about a wallet(shows private key and phrase).\n\nUsage: `.walletinfo <wallet name>`';
            break;
        case 'send':
            description = '# 💸 Sends funds from your wallet.\n\nUsage: `.send <from wallet name> <amount> <to address>`';
            break;
        case 'walletbal':
            description = '# 💰 Checks the balance of your wallet.\n\nUsage: `.walletbal <wallet name>`';
            break;
        case 'p':
            description = '# 📈 Fetches the price of litecoin.\n\nUsage: `.p`';
            break;
        case 'doge':
            description = '# 🐕 Fetches the current price of Dogecoin.\n\nUsage: `.doge`';
            break;
        case 'btc':
            description = '# 💰 Fetches the current price of Bitcoin.\n\nUsage: `.btc`';
            break;
        case 'eth':
            description = '# 💎 Fetches the current price of Ethereum.\n\nUsage: `.eth`';
            break;
        case 'trx':
            description = '# ⚡ Fetches the current price of TRON.\n\nUsage: `.trx`';
            break;
        case 'sol':
            description = '# 🌞 Fetches the current price of Solana.\n\nUsage: `.sol`';
            break;
        case 'bnb':
            description = '# 🪙 Fetches the current price of Binance Coin.\n\nUsage: `.bnb`';
            break;
        case 'pepe':
            description = '# 🐸 Fetches the current price of Pepe Coin.\n\nUsage: `.pepe`';
            break;
        case 'price':
            description = '# 🤑 Fetches the price of any coin.\n\nUsage: `.price <coin full name>`';
            break;
            case 'viewhtml':
            description = '# ⚡ view any html file in website form.\n\nUsage: `.viewhtml` (reply or send with file)';
            break;
        case 'convert':
            description = '# 🤑 converts coin to any currency.\n\nUsage: `.convert <coin full name> <amount> [currency]`\nexample: .convert bitcoin 0.5\n.convert bitcoin 0.5 rub (here run means ruble)';
            break;
        case 'aradd':
            description = '# ➕ Adds autoresponder for a certain name with certain value .\n\nUsage: `.aradd <name> <value>`';
            break;
        case 'removear':
            description = '# ➖ Removes autoresponder.\n\nUsage: `.removear <name>`';
            break;
        case 'editar':
            description = '# ✏️ Edits the autoresponder value.\n\nUsage: `.editar <name> <new value>`';
            break;
        case 'listar':
            description = '# 📃 Lists all autoresponder.\n\nUsage: `.listar`';
            break;
        case 'am':
            description = '# 📊 starts automessage for a given channel.\n\nUsage: `.am <channel> <time> <message>`';
            break;
        case 'listam':
            description = '# 📋 Lists all live automessage.\n\nUsage: `.listam`';
            break;
        case 'infoam':
            description = '# ℹ️ shows the automessage info.\n\nUsage: `.infoam <code>`';
            break;
        case 'stopam':
            description = '# ⏹️ Stops automessage.\n\nUsage: `.stopam <code>`';
            break;
        case 'editam':
            description = '# ✏️ Edits automessage message without stopping the automessage.\n\nUsage: `.editam <code> message <new message>`';
            break;
        case 'bal':
            description = '# 💰 Checks your litecoin balance.\n\nUsage: `.bal <ltc address>`';
            break;
        case 'btcbal':
            description = '# 💰 Checks your BTC balance.\n\nUsage: `.btcbal <btc address>`';
            break;
        case 'ethbal':
            description = '# 💰 Checks your ETH balance.\n\nUsage: `.ethbal <eth address>`';
            break;
        case 'createwebhook':
            description = '# 🌐 Creates a webhook with a certain name.\n\nUsage: `.createwebhook <channel> [name]`';
            break;
        case 'webhooksend':
            description = '# 📤 Sends a message via webhook.\n\nUsage: `.webhooksend <link> <message/embed> <content>`';
            break;
        case 'pingnotifsetup':
            description = '# 🔔 Sets up ping notifications.\n\nUsage: `.pingnotifsetup <webhook link>`';
            break;
        case 'pingnotifstop':
            description = '# ⏹️ Stops ping notifications.\n\nUsage: `.pingnotifstop`';
            break;
        case 'customvouch':
            description = '# 📝 Creates a custom keywords (add as many keywords as you want).\n\nUsage: `.customvouch <name> <keywords>`\n\nexample: .customvouch c2i usd inr\n.vouchmessage 99822 ty for inr for usd\n.vouch c2i 1$ 90\nresonse: `ty for 90 for 1$`';
            break;
        case 'vouchmessage':
            description = '# 📜 Setup vouch message.\n\nUsage: `.vouchmessage <code> <message which must have all the kyeword>`';
            break;
        case 'vouch':
            description = '# ✅ send vouch message.\n\nUsage: `.vouch <name> <keywords value>`';
            break;
        case 'listvouch':
            description = '# 📋 Lists all vouch name.\n\nUsage: `.listvouch`';
            break;
        case 'deletevouch':
            description = '# 🗑️ Deletes a vouch.\n\nUsage: `.deletevouch <vouch name>`';
            break;
        case 'listserver':
            description = '# 🌍 Lists all servers you are a part of.\n\nUsage: `.listserver`';
            break;
        case 'leaveserver':
            description = '# 🚪 Leaves a specified server.\n\nUsage: `.leaveserver <server id>`';
            break;
        case 'guildinfo':
            description = '# ℹ️ Displays information about the current guild.\n\nUsage: `.guildinfo <guild id>`';
            break;
        case 'pastee':
            description = '# 📋 creates a pastee link for any text.\n\nUsage: `.pastee <text>`';
            break;
        case 'qr':
            description = '# 📱 Generates a QR code for the specified text.\n\nUsage: `.qr <text>`';
            break;
        case 'readimg':
            description = '# 🖼️ Extracts text from an image.\n\nUsage: `.readimg (reply to any png/jpg file or send with png/jpg file)`';
            break;
        case 'txtfile':
            description = '# 📄 Creates a text file with the specified content.\n\nUsage: `.txtfile <content>`';
            break;
        case 'gituser':
            description = '# 👤 Finds GitHub users by name and provides links.\n\nUsage: `.gituser <name>`';
            break;
        case 'gitlocation':
            description = '# 🌍 Finds GitHub users by location.\n\nUsage: `.gitlocation <location>`';
            break;
        case 'gitrepo':
            description = '# 📦 Finds projects by repo name and provides links.\n\nUsage: `.gitrepo <repo name>`';
            break;
            case 'permto':
            description = '# 📦 timeout user permanent.\n\nUsage: `.permto <user>`';
            break;
            case 'stoppermto':
            description = '# 📦 removes permanent timeout\n\nUsage: `.stoppermto <user>`';
            break;
        case 'changeprefix':
            description = '# 🔄 Changes the command prefix.\n\nUsage: `.changeprefix <new prefix>`';
            break;
        case 'snipe':
                description = '# 🔄 snipes the deleted message in the message channel.\n\nUsage: `.snipe [number] (number is not necessary)`';
                break;
        case 'startrpc':
                description = '# 🔄 starts rich presence.\n\nUsage: `.startrpc`';
                break;
        case 'stoprpc':
                    description = '# 🔄 stop rich presence.\n\nUsage: `.stoprpc`';
                    break; 
        case 'addrpc':
                description = '# add rpc values\n\nUsage: `.addrpc <image/state/name/details/button1/button2> <values>`\n\n.addrpc image <image link>\n.addrpc name <details>\n.addrpc state offline games (you can other thing also)\n.addrpc details <details>\n.addrpc button1 <link> <button text>\n.addrpc button2 <link> <button 2 text>'
                break;   
                case 'setstatus':
                description = '# Save a new status message.\n\nUsage: `.setstatus <status>`\n\n.setstatus https://selfbot.in'
                break;     
                case 'setemoji':
                description = '# Save a new status emoji\n\nUsage: `.setemoji <emoji>`\n\n.setstatus <:https://selfbot.in:>'
                break; 
                case 'startrotate':
                description = '# starts rotating status\n\nUsage: `.startrotate`\n\n'
                break; 
                case 'stoprotate':
                description = '# stops rotating status\n\nUsage: `.stoprotate`\n\n'
                break;   
                case 'statuslist':
                description = '# List all saved statuses with their indices\n\nUsage: `.statuslist`\n\n'
                break; 
                case 'remove':
                description = '# remove status message\n\nUsage: `.remove <status number>`\n\n'
                break;  
                case 'editemoji':
                description = '# Update the emoji used during rotation\n\nUsage: `.editemoji <new emoji>`\n\n'
                break; 
                case 'afk':
                description = '# add afk\n\nUsage: `.afk [reason] []-> not required `\n\n'
                break;    
                case 'sendnotifywebhook':
                description = '# add webhook for notification for crypto sending\n\nUsage: `.sendnotifywebhook <webhook link>`\n\n'
                break;  
                case 'sendnotify':
                description = '# enables or disables the notify\n\nUsage: `.sendnotify <true/false>`\n\n'
                break; 
        default:
            description = '❌ Command not found. Please check the command name!';
            break;
    }
    

    if (description) {
        message.channel.send(`📝 **Command Information for .${commandName}**:\n${description}`);
    }
}
    }catch(error){
        console.log(error)
    }

});

let afkList = [];
let cooldowns = [];

client.on('messageCreate', (message) => {
    try{
    if (message.author.bot) return;

    const args = message.content.split(' ');
    const command = args.shift();

    if (command === `${config.prefix}afk` && message.author.id === client.user.id) {
        const reason = args.join(' ') || null;
        if (afkList.some(user => user.id === message.author.id)) {
            message.reply('You are already AFK.');
            return;
        }
        afkList.push({ id: message.author.id, reason, timestamp: Date.now() });
        message.reply(`You are now AFK${reason ? `: ${reason}` : ''}.`);
        return;
    }

    if (afkList.some(user => user.id === message.author.id)) {
        if (message.content.startsWith('user is afk')) return;
        if (message.content.startsWith('You are now')) return;

            afkList = afkList.filter(user => user.id !== message.author.id);
            message.reply('You are no longer AFK.');
    
        return;
    }

    message.mentions.users.forEach((user) => {
        const afkData = afkList.find(u => u.id === user.id);
        if (afkData) {
            const lastPing = cooldowns.find(c => c.id === user.id)?.timestamp || 0;
            if (Date.now() - lastPing > 30000) {
                cooldowns = cooldowns.filter(c => c.id !== user.id);
                cooldowns.push({ id: user.id, timestamp: Date.now() });
                message.reply(`${user.username} is AFK${afkData.reason ? `: ${afkData.reason}` : ''}.`);
            }
        }
    });
}catch(error){}
});

client.on('message', async message => {
    try{
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

    if (message.author.id !== client.user.id) return;
  
   
  
    if (message.content.startsWith(`${config.prefix}setstatus`)) {
      const args = message.content.split(' ').slice(1);
      const statusMessage = args.join(' ');
  
      if (!statusMessage) return message.channel.send('Please provide a status message.');
  
      let statuses = [];
      if (fs.existsSync('status.json')) {
        statuses = JSON.parse(fs.readFileSync('status.json'));
      }
      statuses.push(statusMessage);
      fs.writeFileSync('status.json', JSON.stringify(statuses));
      message.channel.send(`Status saved: ${statusMessage}`);
    }
  
    if (message.content.startsWith(`${config.prefix}setemoji`)) {
      const args = message.content.split(' ').slice(1);
      const emoji = args[0];
  
      if (!emoji) return message.channel.send('Please provide an emoji.');
  
      const emojiData = emoji.match(/^<a?:(\w+):(\d+)>$/) ? { emoji_id: emoji.match(/^<a?:(\w+):(\d+)>$/)[2], emoji_name: null } : { emoji_id: null, emoji_name: emoji };
  
      fs.writeFileSync('emoji.json', JSON.stringify(emojiData));
      message.channel.send(`Emoji saved: ${emoji}`);
    }
  
    if (message.content.startsWith(`${config.prefix}startrotate`)) {
      if (rotating) return message.channel.send('Status rotation is already running.');
  
      if (!fs.existsSync('status.json')) return message.channel.send('No statuses found.');
      if (!fs.existsSync('emoji.json')) return message.channel.send('No emoji found.');
  
      const statuses = JSON.parse(fs.readFileSync('status.json'));
      const emojiData = JSON.parse(fs.readFileSync('emoji.json'));
  
      let index = 0;
      rotating = true;
  
      rotateInterval = setInterval(async () => {
        if (!rotating) return clearInterval(rotateInterval);
  
        try {
          await axios.patch('https://discordapp.com/api/v8/users/@me/settings', {
            custom_status: {
              text: statuses[index],
              emoji_id: emojiData.emoji_id,
              emoji_name: emojiData.emoji_name
            }
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': config.token
            }
          });
  
          index = (index + 1) % statuses.length;
        } catch (error) {
          console.error(error);
          message.channel.send('An error occurred while updating status.');
        }
      }, 10000);
    }
  
    if (message.content.startsWith(`${config.prefix}stoprotate`)) {
      if (!rotating) return message.channel.send('Status rotation is not running.');
  
      rotating = false;
      clearInterval(rotateInterval);
      message.channel.send('Status rotation stopped.');
    }
  
    if (message.content.startsWith(`${config.prefix}statuslist`)) {
      if (!fs.existsSync('status.json')) return message.channel.send('No statuses found.');
  
      const statuses = JSON.parse(fs.readFileSync('status.json'));
      const statusList = statuses.map((status, index) => `${index}: ${status}`).join('\n');
      message.channel.send(`Statuses:\n${statusList}`);
    }
  
    if (message.content.startsWith(`${config.prefix}remove`)) {
      const args = message.content.split(' ').slice(1);
      const index = parseInt(args[0]);
  
      if (isNaN(index)) return message.channel.send('Please provide a valid index.');
  
      if (!fs.existsSync('status.json')) return message.channel.send('No statuses found.');
  
      let statuses = JSON.parse(fs.readFileSync('status.json'));
  
      if (index < 0 || index >= statuses.length) return message.channel.send('Index out of range.');
  
      const removedStatus = statuses.splice(index, 1);
      fs.writeFileSync('status.json', JSON.stringify(statuses));
      message.channel.send(`Removed status: ${removedStatus}`);
    }
  
    if (message.content.startsWith(`${config.prefix}editemoji`)) {
      const args = message.content.split(' ').slice(1);
      const newEmoji = args[0];
  
      if (!newEmoji) return message.channel.send('Please provide a new emoji.');
  
      const emojiData = newEmoji.match(/^<a?:(\w+):(\d+)>$/) ? { emoji_id: newEmoji.match(/^<a?:(\w+):(\d+)>$/)[2], emoji_name: null } : { emoji_id: null, emoji_name: newEmoji };
  
      fs.writeFileSync('emoji.json', JSON.stringify(emojiData));
      message.channel.send(`Emoji updated to: ${newEmoji}`);
    }}catch(errpr){}
  });


client.on('messageCreate', async message => {
    try{
    if (message.mentions.users.has(client.user.id)) {
        const userId = message.mentions.users.first().id;

        if (!fs.existsSync('./pingData.json')) return;
        const pingData = JSON.parse(fs.readFileSync('./pingData.json', 'utf8'));
        const webhookLink = pingData[userId];

        if (!webhookLink) return;

        const embed = {
            embeds: [{
                title: "You've Been Pinged!",
                description: `[Go to message](${message.url})`,
                fields: [
                    { name: "User ID", value: message.author.id, inline: true },
                    { name: "Username", value: message.author.tag, inline: true },
                    { name: "Channel Name", value: message.channel.type === 'DM' ? 'DM Channel' : message.channel.name, inline: true },
                    { name: "Pinger ID", value: message.author.id, inline: true },
                    { name: "Server Name", value: message.guild ? message.guild.name : 'null', inline: true },
                    { name: "Message Content", value: message.content, inline: false }
                ],
                color: 15158332,
                timestamp: new Date()
            }]
        };
        

        axios.post(webhookLink, embed)
            .then(() => console.log(`Ping notification sent successfully to ${webhookLink}`))
            .catch(() => console.log('❌ Failed to send ping notification.'));
    }
}catch(error){}
});


client.on('messageCreate', async message => {
    try{
    const filePath = path.join(__dirname, 'ar.json');

    if (message.author.bot) return;
    if(message.author.id !== client.user.id) return;
    const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : {};

    if (data[message.content]) {
        const arValue = data[message.content];
        sendMessage(message, `${arValue}`);
    }
}catch(error){}
});

const logDir = './logs';
const logFilePath = path.join(logDir, 'deleted.json');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '[]');
}

client.on('messageDelete', async (message) => {
    try{
    if (message.partial) {
        try {
            await message.fetch();
        } catch (error) {
            return;
        }
    }

    const logEntry = {
        content: message.content,
        channelId: message.channel.id,
        timestamp: message.createdTimestamp,
        deletedBy: message.author.id,
        isDM: message.channel.type === 'DM'
    };

    let logs = [];
    if (fs.existsSync(logFilePath)) {
        logs = JSON.parse(fs.readFileSync(logFilePath, 'utf-8'));
    }

    logs.push(logEntry);
    if (logs.length > 40) {
        logs = logs.slice(-40);
    }

    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
}catch(error){}
});




client.login(token);