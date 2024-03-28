// ==UserScript==
// @name        选择框
// @namespace    http://tampermonkey.net/
// @version      2024-01-15
// @description  try to take over the world!
// @author       You
// @match        https://steamcommunity.com/profiles/76561199153336413/inventory/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// ==/UserScript==



window.location.href = 'https://steamcommunity.com/profiles/76561199153336413/inventory/#753';
setTimeout(function(){
    location.reload();
}, 300000);
let button = document.createElement('button');
button.textContent = '300';
button.style.position = 'fixed';
button.style.top = '30px';
button.style.left = '20px';
button.style.zIndex = 9999;
button.style.color = "green";
document.body.appendChild(button);
let number = 300;
setInterval(function (){
    number= number-1;
    button.textContent = number.toString();

},1000)

setTimeout(function (){
    let element = document.querySelector(`a.unpack_booster_packs`);//显示打开补充包的按钮
    element.style.display = '';
    let element1 = document.querySelector(`a.turn_into_gems`);//显示转换宝石的按钮
    element1.style.display = '';
    let tagShow = document.querySelector('#filter_tag_show');//点击 显示高级筛选条件
    tagShow.click();
    setTimeout(function (){
        let input = document.querySelector('#tag_filter_753_6_droprate_droprate_0');//点击稀有度普通选项
        if(input) input.click();
        input.click();
        setTimeout(function (){
            let divs = document.querySelectorAll("div.itemHolder");//选中所有物品
            for (let i = 0; i < divs.length; i++) {
                divs[i].className = "itemHolder ui-selectee ui-selected";
            }
            setTimeout(function (){
                let unpack_booster_packs = document.querySelector('a.unpack_booster_packs > *:first-child');//打开补充包
                unpack_booster_packs.click();
                setTimeout(function (){
                    // let displayMore = document.querySelectorAll('.econ_tag_filter_collapsable_tags_showlink whiteLink')//显示更多
                    // for(let i = 0; i<displayMore.length;i++){
                    //     if(displayMore[i])
                    //     displayMore[i].click();
                    //     console.info(displayMore[i])
                    // }
                    let emoji = document.querySelector('#tag_filter_753_6_item_class_item_class_4');//表情
                    if(emoji) emoji.click();
                    let background = document.querySelector('#tag_filter_753_6_item_class_item_class_3');//背景
                    if(background) background.click();
                    let Dota = document.querySelector('#tag_filter_753_6_Game_app_570');//Dota
                    if(Dota) Dota.click();
                    let Csgo = document.querySelector('#tag_filter_753_6_Game_app_730');//CSGO
                    if(Csgo) Csgo.click();
                    let Winter2023 = document.querySelector('#tag_filter_753_6_Game_app_2640280');//Winter Sale 2023
                    if(Winter2023) Winter2023.click();

                    let sevendaytodie = document.querySelector('#tag_filter_753_6_Game_app_251570');//sevendaytodie
                    if(sevendaytodie) sevendaytodie.click();
                    let Deadbydaylight = document.querySelector('#tag_filter_753_6_Game_app_381210');//Deadbydaylight
                    if(Deadbydaylight) Deadbydaylight.click();
                    let DeepRockGalactic = document.querySelector('#tag_filter_753_6_Game_app_548430');//DeepRockGalactic
                    if(DeepRockGalactic) DeepRockGalactic.click();
                    let DontStarveTogether  = document.querySelector('#tag_filter_753_6_Game_app_322330');//DontStarveTogether
                    if(DontStarveTogether) DontStarveTogether.click();


                    let divs1 = document.querySelectorAll("div.itemHolder.ui-selectee.ui-selected");//选中所有物品
                    /*for (let i = 0; i < divs1.length; i++) {
                        divs1[i].className = "itemHolder ui-selectee";
                    }*/
                    for (let i = 0; i < divs1.length; i++) {
                        if(divs1[i].style.display == 'none'){
                            divs1[i].className = "itemHolder ui-selectee";
                        }
                    }

                    let turn_into_gems = document.querySelector('a.turn_into_gems > *:first-child');//分解宝石
                    if(Dota || Csgo || Winter2023) {
                        turn_into_gems.click();
                    }
                    setTimeout(function (){
                        let tagHide = document.querySelector('#filter_tag_hide')
                        tagHide.click();
                        let sell_all_cards = document.querySelector('a.sell_all_cards > *:first-child');//sell All Cards
                        sell_all_cards.click();
                    },5000)
                },3000)
            },3000)
        },1000)
    },1000)
},5000)