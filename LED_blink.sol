pragma solidity ^0.4.14; //mention the version we will be using

contract Blink { //create a contract called Blink (constructor)
uint public myData;

event blinkEvent(uint data); //event which will act as the trigger for the LED to blink on the pi

function getData() constant returns (uint retData) {
return myData;
}

function setData(uint theData) {
myData=theData;
blinkEvent(myData); //Event and thus the LED blink call is triggered

}

}
