// ==UserScript==
// @name         查询有合卡价值的游戏
// @namespace    AI之家
// @version      1.0
// @description  打开月销量大于等于70小于等于4000，发售日期超过50天，日盈利超过0.5，回本周期在20天以下的游戏，永久忽略月销量小于70或者大于4000的游戏
// @author       AI之家
// @match        https://www.steamcardexchange.net/index.php?badgeprices
// @match        https://www.steamcardexchange.net/index.php?foilbadgeprices
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    //控制台查询忽略的ignore对象：localStorage.getItem('ignore')
    //控制台开启正则表达式查询'无法|锁区'获取查询出错的游戏

    //理论闪卡价格，设置为999999说明，该闪卡价格稳定不变，查询到的闪卡价格可以直接使用
    let idealprice={
        "648120":4,
        "744900":23,
        "545040":230,
        "1243220":30,
        "356380":30,
        "926990":420,
        "740260":160,
        "1116780":120,
        "839670":120,
        "248970":240,
        "539670":160,
    }
    //定义ignore对象，从localStorage中获取ignore对象或者为空（只执行第一次）
    let ignore =JSON.parse(localStorage.getItem('ignore')) || {};
    //下面代码可以添加准备忽略的游戏，用于添加没有商店页面、自己已买、放进愿望单、锁区和停售的游戏
    //可以将从"获取Steam已有的游戏"脚本获取到的ignore数据粘贴到ignoredata里面，只需要获取一次即可，有新买的游戏需要手动一个个添加
    let ignoredata = {
        "730":true,

    }
    //使用Object.assign()方法把data对象的属性复制到ignore对象中
    Object.assign(ignore,ignoredata);
    //把更新后的ignore对象转换成JSON字符串并存储到本地存储中
    localStorage.setItem('ignore', JSON.stringify(ignore));
    //卡牌数量对应合成卡包消耗的宝石
    const boosterCostTemplate = {
        5: {
            gemsCount: 1200
        },
        6: {
            gemsCount: 1000
        },
        7: {
            gemsCount: 857
        },
        8: {
            gemsCount: 750
        },
        9: {
            gemsCount: 667
        },
        10: {
            gemsCount: 600
        },
        11: {
            gemsCount: 545
        },
        12: {
            gemsCount: 500
        },
        13: {
            gemsCount: 462
        },
        14: {
            gemsCount: 429
        },
        15: {
            gemsCount: 400
        },
    }

    let container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50px';
    container.style.right = '10px';
    document.body.appendChild(container);

    let button1 = document.createElement('button');
    button1.innerHTML = '页面加载完成后,点击按钮自动打开月销量≥70的游戏';
    button1.style.display = 'block';
    button1.style.background = '#99DD00';
    button1.style.border = '2px solid black';
    button1.style.borderRadius = '5px';
    button1.style.color = 'black';
    container.appendChild(button1);

    let button2 = document.createElement('button');
    button2.innerHTML = '点击按钮初始化查询游戏序号';
    button2.style.display = 'inline-bloc';
    button2.style.background = 'lightgray';
    button2.style.border = '2px solid black';
    button2.style.borderRadius = '5px';
    button2.style.color = 'black';

    let button21 = document.createElement('button');
    button21.innerHTML = '点击按钮终止查询游戏';
    button21.style.display = 'inline-bloc';
    button21.style.background = 'lightgray';
    button21.style.border = '2px solid black';
    button21.style.borderRadius = '5px';
    button21.style.color = 'black';

    let button4 = document.createElement('button');
    button4.innerHTML = '点击按钮跳转到上一页';
    button4.style.display = 'inline-block';
    button4.style.background = 'lightblue';
    button4.style.border = '2px solid black';
    button4.style.borderRadius = '5px';
    button4.style.color = 'black';

    let button3 = document.createElement('button');
    button3.innerHTML = '点击按钮跳转到下一页';
    button3.style.display = 'inline-block';
    button3.style.background = 'lightblue';
    button3.style.border = '2px solid black';
    button3.style.borderRadius = '5px';
    button3.style.color = 'black';

    let div = document.createElement('div');
    div.innerHTML = '当前页数';
    div.style.display = 'inline-block';
    div.style.background = 'lightblue';
    div.style.border = '2px solid black';
    div.style.borderRadius = '5px';
    div.style.color = 'black';

    let row1 = document.createElement('div');
    row1.appendChild(button2);
    row1.appendChild(button21);
    container.appendChild(row1);

    let row2 = document.createElement('div');
    row2.appendChild(button4);
    row2.appendChild(button3);
    row2.appendChild(div);
    container.appendChild(row2);

    let displayElement0 = document.createElement('div');
    displayElement0.style.background = 'white';
    displayElement0.style.border = '1px solid black';
    displayElement0.style.minHeight = '20px';
    displayElement0.style.color='black';
    displayElement0.style.background = 'white';
    displayElement0.textContent='输入从第几个游戏开始找起(默认为0)';
    displayElement0.style.display = 'inline-block';

    let inputBox = document.createElement('input');
    inputBox.style.background = 'green';
    inputBox.style.display = 'inline-block';

    const displayElement1 = document.createElement('div');
    displayElement1.style.background = 'white';
    displayElement1.style.border = '1px solid black';
    displayElement1.style.minHeight = '20px';
    displayElement1.style.color='black';
    displayElement1.textContent='宝石袋成本';
    displayElement1.style.display = 'inline-block';

    let inputBox1 = document.createElement('input');
    inputBox1.style.background = 'green';
    inputBox1.style.display = 'inline-block';

    let row3 = document.createElement('div');
    row3.appendChild(displayElement0);
    row3.appendChild(inputBox);
    container.appendChild(row3);

    let row4 = document.createElement('div');
    row4.appendChild(displayElement1);
    row4.appendChild(inputBox1);
    container.appendChild(row4);

    let index = 0;
    inputBox.addEventListener('change', function() {
        index=inputBox.value||0;
    });
    //宝石袋价格
    let savedPrice = GM_getValue('price', '');
    if (savedPrice) {
        inputBox1.value = savedPrice;
    }
    //保存宝石袋价格
    inputBox1.addEventListener('change', function() {
        GM_setValue('price', this.value);
    });

    button2.addEventListener('click', function() {
        index = 0;
        console.log('初始化查询游戏序号');
    })
    button21.addEventListener('click', function() {
        index = 999999;
        console.log('终止查询游戏');
    })

    button3.addEventListener('click', function() {
        document.querySelector('.paginate_button.next').click();
        console.log('跳转到下一页');
        let element = document.querySelector('.paginate_button.current');
        if (element) {
            div.innerHTML = '当前页数为'+element.innerHTML;
        }
    })

    button4.addEventListener('click', function() {
        document.querySelector('.paginate_button.previous').click();
        console.log('跳转到上一页');
        let element = document.querySelector('.paginate_button.current');
        if (element) {
            div.innerHTML = '当前页数为'+element.innerHTML;
        }
    })
    let delaytime=500;
    button1.addEventListener('click', function() {
        let element = document.querySelector('.paginate_button.current');
        if (element) {
            div.innerHTML = '当前页数为'+element.innerHTML;
        }
        //获取游戏链接
        let links = [];
        let oddLinks = document.querySelectorAll('.odd .w-72 a');
        let evenLinks = document.querySelectorAll('.even .w-72 a');
        oddLinks.forEach(link => {
            links.push(link);
        });
        evenLinks.forEach(link => {
            links.push(link);
        });
        //获取游戏id
        let appids = [];
        links.forEach(link => {
            let href = link.getAttribute('href');
            if (href && href.includes('/index.php?gamepage-appid-')) {
                let appid = href.split('-').pop();
                appids.push(appid);
            }
        });
        function queryNextGame() {
            if (index >= appids.length) {
                console.log('查询结束');
                return;
            }
            //游戏id
            let appid=appids[index];
            //检查appid是否在ignore对象中，如果是，忽略该游戏不运行GM_xmlhttpRequest
            if (ignore[appid]) {
                index++;
                setTimeout(queryNextGame, 0);
                return;
            }
            let newURL='https://steamcommunity.com/market/search/render/?start=0&count=100&category_753_cardborder[]=tag_cardborder_0&appid=753&category_753_Game[]=tag_app_749520'.replace('749520', appid);
            GM_xmlhttpRequest({
                method: "GET",
                url: newURL,
                onload: async function(response) {
                    let data = JSON.parse(response.response);
                    if(!data){
                        console.log('第'+index+'次查询的游戏'+appid+'无法获取普通卡牌的信息，重新查询该游戏');
                        setTimeout(queryNextGame, delaytime);
                        return;
                    }
                    let cardCount = data.total_count;
                    let totalPrice = 0;
                    let cardList = document.createElement('div');
                    cardList.innerHTML = data.results_html;
                    //获取所有卡牌链接地址
                    let links = cardList.querySelectorAll('.market_listing_row_link');
                    if (!links[0]) {
                        console.log('第'+index+'次查询的游戏'+appid+'无法获取到第一张普通卡牌的信息，重新查询该游戏');
                        setTimeout(queryNextGame, delaytime);
                        return;
                    }
                    //获取第一张卡牌链接地址
                    let link1 = links[0].href;
                    let elements = cardList.querySelectorAll('.market_table_value.normal_price .normal_price');
                    elements.forEach(function(priceElement) {
                        // 获取卡牌价格文本
                        let priceText = priceElement.textContent.replace('¥ ','').replace(',','').trim();
                        // 将价格文本转换为浮点数
                        let price = parseFloat(priceText);
                        // 累加总价
                        totalPrice += price;
                    });
                    // 计算税后平均价格，和税后卡包价格
                    const averagePrice = totalPrice / cardCount*0.87;
                    const finalPrice=averagePrice*3;
                    //补充包成本
                    if(!boosterCostTemplate[cardCount]){
                        console.log('第'+index+'次查询的游戏'+appid+'无法获取补充包所需的宝石，重新查询该游戏');
                        setTimeout(queryNextGame, delaytime);
                        return;
                    }
                    let expence=boosterCostTemplate[cardCount].gemsCount/1000*savedPrice;
                    //查询该游戏第一张普通卡牌近一个月内的销量
                    let match = link1.match(/\/753\/(.+)$/);
                    let market_hash_name;
                    if (match) {
                        market_hash_name = match[1];
                    }
                    let saleurl = `https://steamcommunity.com/market/pricehistory/?appid=753&market_hash_name=${market_hash_name}`;
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: saleurl,
                        onload: function(response) {
                            let data = JSON.parse(response.responseText);
                            let prices = data.prices;
                            if(prices.length==0){
                                console.log('第'+index+'次查询的游戏'+appid+'无法获取到第一张普通卡牌的交易记录，重新查询该游戏');
                                setTimeout(queryNextGame, delaytime);
                                return;
                            }
                            let currentDate = new Date();
                            let totalSales = 0;
                            for (let i = prices.length - 1; i >= 0; i--) {
                                let dateStr = prices[i][0];
                                let date = new Date(dateStr);
                                let timeDiff = currentDate - date;
                                let daysDiff = timeDiff / (1000 * 3600 * 24);
                                if (daysDiff <= 30) {
                                    totalSales += parseInt(prices[i][2]);
                                } else {
                                    break;
                                }
                            }
                            //获取卡牌累计交易天数
                            if(prices[0][0]==undefined){
                                console.log('第'+index+'次查询的游戏'+appid+'无法获取到第一张普通卡牌的首次交易日期，重新查询该游戏');
                                setTimeout(queryNextGame, delaytime);
                                return;
                            }
                            let startdateStr = prices[0][0];
                            let date = new Date(startdateStr);
                            let timeDiff = currentDate - date;
                            let daysDiff = timeDiff / (1000 * 3600 * 24);
                            if(daysDiff<50){
                                console.log('第'+index+'次查询的游戏'+appid+'卡牌交易时长小于50天，查询下一个游戏');
                                index++;
                                setTimeout(queryNextGame, delaytime);
                                return;
                            }
                            //月销量大于等于70小于等于4000的游戏进一步计算日盈利和回本周期，其余全部永久不再查询
                            if(totalSales >=70&&totalSales <=4000) {
                                //查询闪亮徽章价格
                                newURL='https://steamcommunity.com/market/search/render/?start=0&count=100&category_753_cardborder[]=tag_cardborder_1&appid=753&category_753_Game[]=tag_app_749520'.replace('749520', appid);
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: newURL,
                                    onload: async function(response) {
                                        let data = JSON.parse(response.response);
                                        if(!data){
                                            console.log('第'+index+'次查询的游戏'+appid+'无法获取闪亮卡牌的信息，重新查询该游戏');
                                            setTimeout(queryNextGame, delaytime);
                                            return;
                                        }
                                        let totalPrice = 0;
                                        let cardList = document.createElement('div');
                                        cardList.innerHTML = data.results_html;
                                        let elements = cardList.querySelectorAll('.market_table_value.normal_price .normal_price');
                                        elements.forEach(function(priceElement) {
                                            // 获取卡牌价格文本
                                            let priceText = priceElement.textContent.replace('¥ ','').replace(',','').trim();
                                            // 将价格文本转换为浮点数
                                            let price = parseFloat(priceText);
                                            // 累加总价
                                            totalPrice += price;
                                        });
                                        //理论闪卡价格尚未确定，直接将理论闪卡价格设置为999999，后续手动添加该游戏理论闪卡的价格
                                        if (idealprice[appid] == undefined) idealprice[appid] = 999999;
                                        //如果理论闪卡价格<=查询到的闪卡价格，选择理论闪卡价格
                                        if(idealprice[appid]<=totalPrice){
                                            totalPrice=idealprice[appid];
                                        }
                                        //计算日盈利，按每四十个卡包开出闪卡以75折出售闪卡然后扣除交易税13%
                                        const profit=finalPrice-expence+(totalPrice/cardCount*0.65)/40;
                                        if(profit<=0.5){
                                            console.log('第'+index+'次查询的游戏'+appid+'日盈利小于等于0.5，不查询回本时间，查询下一个游戏');
                                            index++;
                                            setTimeout(queryNextGame, delaytime);
                                            return;
                                        }
                                        //获取游戏价格，计算回本时间
                                        let shopurl = `https://store.steampowered.com/app/749520`.replace('749520', appid);
                                        GM_xmlhttpRequest({
                                            method: "GET",
                                            url: shopurl,
                                            onload: function(response) {
                                                let parser = new DOMParser();
                                                let doc = parser.parseFromString(response.responseText, "text/html");
                                                let priceElements=doc.querySelectorAll(".game_area_purchase_game .game_purchase_price.price");
                                                let priceElement;
                                                //除去买入框有字母成分以及买入框含有体验的游戏
                                                for (let i = 0; i < elements.length; i++) {
                                                    if (priceElements[i]!=null&&(!/[a-zA-Z]/.test(priceElements[i].textContent)&&!priceElements[i].textContent.includes('体验'))) {
                                                        priceElement = priceElements[i];
                                                        break;
                                                    }
                                                }
                                                //免费游戏
                                                if (priceElement!=null&&(priceElement.textContent.includes("免费")||priceElement.textContent.includes("Free"))) {
                                                    priceElement.textContent=0;
                                                }
                                                //折扣游戏
                                                if (priceElement == null) {
                                                    priceElement = doc.querySelector(".game_area_purchase_game .discount_final_price");
                                                }
                                                //只有一个.game_area_purchase_game .game_purchase_price.price元素而且被上面排除了的游戏
                                                if(priceElement==null&&priceElements.length!=0){
                                                    priceElement = priceElements[0];
                                                    priceElement.textContent=0;
                                                }
                                                //锁区游戏
                                                if(priceElement == null){
                                                    console.log('第'+index+'次查询的游戏'+appid+'锁区游戏，查询下一个游戏');
                                                    index++;
                                                    setTimeout(queryNextGame, delaytime);
                                                    return;
                                                }
                                                console.log('第'+index+'次查询的游戏'+appid+'第一张普通卡牌超链接'+link1);
                                                console.log('第'+index+'次查询的游戏'+appid+'第一张普通卡牌30天的销量'+totalSales);
                                                console.log('第'+index+'次查询的游戏'+appid+'游戏价格：'+priceElement.textContent);
                                                let priceText = priceElement.textContent;
                                                let priceNumber= parseFloat(priceText.replace(/[^\d.]/g, ""));
                                                //回本时间
                                                let day=Math.floor(priceNumber/profit);
                                                if(profit==NaN){
                                                    console.log('第'+index+'次查询的游戏'+appid+'日盈利为NaN，重新查询该游戏');
                                                    setTimeout(queryNextGame, delaytime);
                                                    return;
                                                }
                                                console.log('第'+index+'次查询的游戏'+appid+'日盈利：'+profit+'，回本天数：'+day+'，卡牌交易时长：'+daysDiff);
                                                //日盈利超过0.5，回本天数在20天以下的，卡牌交易时长大于等于50天，打开商店链接
                                                if(profit>=0.5&&day<=20&&daysDiff>=50){
                                                    let url='https://store.steampowered.com/app/749520'.replace('749520', appid);
                                                    console.log('月销量大于等于70小于等于4000，日盈利超过0.5，回本天数在20天以下的，卡牌交易时长大于等于50天的游戏网址：' + url);
                                                    window.open(url);
                                                }
                                                index++;
                                                setTimeout(queryNextGame, delaytime);
                                            }
                                        });
                                    },
                                });
                            }
                            else{
                                console.log('第'+index+'次查询的游戏'+appid+'第一张普通卡牌超链接'+link1);
                                console.log('第'+index+'次查询的游戏'+appid+'第一张普通卡牌30天的销量'+totalSales);
                                console.log('第'+index+'次查询的游戏'+appid+'月销量小于70或者大于4000，永远不再查询该游戏，查询下一个游戏')
                                ignore[appid] = true;
                                //将更新后的ignore对象存储到localStorage中
                                localStorage.setItem('ignore', JSON.stringify(ignore));
                                index++;
                                setTimeout(queryNextGame, delaytime);
                            }
                        }
                    });
                },
            });
        }
        queryNextGame();
    });
})();