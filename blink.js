import RpiLeds from 'rpi-leds'; // see https://www.npmjs.com/package/rpi-leds for more details
import Web3 from 'web3';

//import gpio from 'rpi-gpio';
import gpio from 'gpio';

export default (app) => {
  console.log("Hi blinkExample")
  const leds = new RpiLeds();
  const web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider("http://192.168.1.113:8545")); //replace this with the ip address of your pi


  var coinbase = web3.eth.coinbase; //The coinbase is the private key that is creating the genesis block
  var balance = web3.eth.getBalance(coinbase);

  var contractAddress = '0x5dadf5f93ef4dba46e7f26a28f1ad495bc9e2d54'; //replace this with the address of your contract 

  var ABI = JSON.parse('[{"constant":true,"inputs":[],"name":"getData","outputs":[{"name":"retData","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"inData","type":"uint256"}],"name":"setData","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"msgData","type":"uint256"}],"name":"blinkEvent","type":"event"}]');

  const blinkContract = web3.eth.contract(ABI).at(contractAddress); //To speak with the smart contract

  blinkContract.blinkEvent({}, (error, msg)=> {
    if(!error) {
      console.log(msg);
      app.blinkLeds();
    } else {
      console.log(error);
    }
  });

  app.blinkLeds = () => {
    app.ledStatus = false;
    let iv = setInterval(()=>{
      if(app.ledStatus) {
        console.log("sleepy.. so sleepy")
        leds.power.turnOff();
        leds.status.turnOff();
      } else {
        console.log("turn on!")
        leds.power.turnOn();
        leds.status.turnOn();
      }
      app.ledStatus = !app.ledStatus;
    }, 500);

    setTimeout(()=>{
      clearInterval(iv);
    }, 10000)
  }

  return app;
}
