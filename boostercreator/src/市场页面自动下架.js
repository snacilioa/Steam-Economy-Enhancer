// ==UserScript==
// @name         市场页面自动上架
// @namespace    http://tampermonkey.net/
// @version      2024-02-11
// @description  try to take over the world!
// @author       You
// @match        https://steamcommunity.com/market/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// ==/UserScript==

setTimeout(function(){
    location.reload();
}, 600000);
let button = document.createElement('button');
button.textContent = '600';
button.style.position = 'fixed';
button.style.top = '30px';
button.style.left = '20px';
button.style.zIndex = 9999;
button.style.color = "green";
document.body.appendChild(button);
let number = 600;
setInterval(function (){
    number= number-1;
    button.textContent = number.toString();

},1000)


setTimeout(function (){
    let element = document.querySelector('div.market_listing_table_header')
        .querySelector('span.market_listing_my_price');
    if(element) element.click();




},40000)
setInterval(function (){

    let overpriced = document.querySelector('h3.my_market_header')
        .querySelector('a.select_overpriced')
        .querySelector('span.item_market_action_button_contents');
    if(overpriced) overpriced.click();
    let remove = document.querySelector('h3.my_market_header')
        .querySelector('a.remove_selected')
        .querySelector('span.item_market_action_button_contents');
    if(remove) remove.click();
},40000)