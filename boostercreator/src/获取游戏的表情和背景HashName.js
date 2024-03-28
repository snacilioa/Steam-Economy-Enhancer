// ==UserScript==
// @name         获取游戏的表情和背景HashName
// @version      1.0
// @description  获取游戏的表情和背景HashName
// @author       第三异星
// @match        https://steamcommunity.com/market/search?*tag_app_*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
    'use strict';
    let container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.left = '10px';

    let button = document.createElement('button');
    button.textContent = '点击获取游戏的表情和背景HashName';
    button.style.position = 'fixed';
    button.style.zIndex = 9999;

    let displayElement1 = document.createElement('div');
    displayElement1.style.background = 'white';
    displayElement1.style.border = '1px solid black';
    displayElement1.style.minHeight = '20px';
    displayElement1.style.color = 'black';
    displayElement1.textContent = '物品转为宝石数量：';
    displayElement1.style.display = 'block';

    let inputBox1 = document.createElement('input');
    inputBox1.style.background = 'white';
    inputBox1.style.color = 'black';
    inputBox1.style.display = 'block';

    container.appendChild(button);
    container.appendChild(displayElement1);
    container.appendChild(inputBox1);
    document.body.appendChild(container);

    let GemCount = GM_getValue('GemCount', '');
    if (GemCount) {
        inputBox1.value = GemCount;
    }
    inputBox1.addEventListener('change', function () {
        GM_setValue('GemCount', this.value);
    });
    button.addEventListener('click', function () {
        let GemCount = GM_getValue('GemCount', '');
        let elements = document.querySelectorAll('.market_listing_row.market_recent_listing_row.market_listing_searchresult');
        let dataHashNames = {};
        elements.forEach((element) => {
            let dataHashName = element.getAttribute('data-hash-name');
            dataHashNames[dataHashName] = parseInt(GemCount, 10);
        });
        let json = JSON.stringify(dataHashNames);
        json = json.slice(1, -1).replace(/,/g, ',\n') + ',';//逗号后加上换行符，删除{}后结尾加个,
        navigator.clipboard.writeText(json).then(function () {
        });
        console.log(dataHashNames);
    });

})();
