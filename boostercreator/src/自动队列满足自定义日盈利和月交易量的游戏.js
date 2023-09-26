// ==UserScript==
// @name         自动队列满足自定义日盈利和月交易量的游戏
// @version      1.0
// @description  自动队列满足自定义日盈利和月交易量的游戏
// @author       第三异星
// @match        https://steamcommunity.com//tradingcards/boostercreator/
// @match        https://steamcommunity.com/tradingcards/boostercreator/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';
    //控制台开启正则表达式查询'无需|变为'两个关键词的总和为游戏总数，如果少于游戏总数，那就是有游戏查询失败，查询'无法'可知道哪些游戏查询失败
    //理论闪卡价格¥，设置为999999说明该闪卡价格稳定不变，查询到的闪卡价格可以直接使用
    //第一次使用，需要f12打开控制台，复制ignore对象导入你有的游戏，后续买入新游戏，手动一个个添加理想闪卡价格
    let SelectGameToCraftBoosterPacks='booster Bot2 ';
    let idealprice= {
        "730": 8,

    };//该行-19为游戏个数
    let alwayscraftbooster={
        // "1469910":true,
        "1901370":true,

    }
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
    container.style.top = '10px';
    container.style.right = '10px';

    let button = document.createElement("button");
    button.innerHTML = "自动队列符合要求的游戏";

    const displayElement1 = document.createElement('div');
    displayElement1.style.background = 'white';
    displayElement1.style.border = '1px solid black';
    displayElement1.style.minHeight = '20px';
    displayElement1.style.color='black';
    displayElement1.textContent='宝石袋成本';
    displayElement1.style.display = 'inline-block';

    let inputBox1 = document.createElement('input');
    inputBox1.style.background = 'green';
    inputBox1.style.color='white';
    inputBox1.style.display = 'inline-block';

    const displayElement2 = document.createElement('div');
    displayElement2.style.background = 'white';
    displayElement2.style.border = '1px solid black';
    displayElement2.style.minHeight = '20px';
    displayElement2.style.color='black';
    displayElement2.textContent='日盈利大于等于';
    displayElement2.style.display = 'inline-block';

    let inputBox2 = document.createElement('input');
    inputBox2.style.background = 'green';
    inputBox2.style.color='white';
    inputBox2.style.display = 'inline-block';

    const displayElement3 = document.createElement('div');
    displayElement3.style.background = 'white';
    displayElement3.style.border = '1px solid black';
    displayElement3.style.minHeight = '20px';
    displayElement3.style.color='black';
    displayElement3.textContent='月销量大于等于';
    displayElement3.style.display = 'inline-block';

    let inputBox3 = document.createElement('input');
    inputBox3.style.background = 'green';
    inputBox3.style.color='white';
    inputBox3.style.display = 'inline-block';

    const displayElement4 = document.createElement('div');
    displayElement4.style.background = 'white';
    displayElement4.style.border = '1px solid black';
    displayElement4.style.minHeight = '20px';
    displayElement4.style.color='orange';
    displayElement4.style.display = 'block';

    let row1 = document.createElement('div');
    row1.appendChild(displayElement1);
    row1.appendChild(inputBox1);

    let row2 = document.createElement('div');
    row2.appendChild(displayElement2);
    row2.appendChild(inputBox2);

    let row3 = document.createElement('div');
    row3.appendChild(displayElement3);
    row3.appendChild(inputBox3);

    container.appendChild(button);
    container.appendChild(row1);
    container.appendChild(row2);
    container.appendChild(row3);
    container.appendChild(displayElement4);
    document.body.appendChild(container);
    //总日盈利
    let totalprofit=0,totalgame=0,totalgem=0;
    //宝石袋价格
    let savedPrice = GM_getValue('price', '');
    if (savedPrice) {
        inputBox1.value = savedPrice;
    }
    //保存宝石袋价格
    inputBox1.addEventListener('change', function() {
        GM_setValue('price', this.value);
    });
    //日盈利限制
    let profitlimit = GM_getValue('profitlimit', '');
    if (profitlimit) {
        inputBox2.value = profitlimit;
    }
    //保存日盈利限制
    inputBox2.addEventListener('change', function() {
        GM_setValue('profitlimit', this.value);
    });
    //月销量限制
    let totalSaleslimit = GM_getValue('totalSaleslimit', '');
    if (totalSaleslimit) {
        inputBox3.value = totalSaleslimit;
    }
    //保存月销量限制
    inputBox3.addEventListener('change', function() {
        GM_setValue('totalSaleslimit', this.value);
    });
    //输出
    let gemsCountAll = GM_getValue('gemsCountAll', '');
    if (gemsCountAll) {
        displayElement4.value = gemsCountAll;
    }
    //保存输出
    displayElement4.addEventListener('change', function() {
        GM_setValue('gemsCountAll', this.value);
    });
    let i=0,delaytime=1000;
    // 添加按钮点击事件
    button.addEventListener("click", function() {
        // 初始化ignore对象
        let ignore = {};
        // 获取所有按钮
        let buttons = document.querySelectorAll("button");
        // 遍历所有按钮
        for (let i = 0; i < buttons.length; i++) {
            let button = buttons[i];
            let id = button.id;
            // 检查id是否包含"+reset"
            if (id.includes("+reset")) {
                // 提取数字部分
                let number = id.split("+")[0];
                // 将数字存储到ignore对象中
                ignore[number] = true;
            }
        }
        console.log(ignore);
        // 创建一个数组来存储ignore中的数字部分
        let extractedNumber = [];
        // 遍历ignore数据并将数字部分存入extractedNumber数组中
        for (let key in ignore) {
            if (ignore.hasOwnProperty(key)) {
                extractedNumber.push(key);
            }
        }
        function processArrayWithDelay() {
            let buttonId1 = extractedNumber[i] + "+outToBooster";
            let buttonId2 = extractedNumber[i] + "+boosterToOut";
            let buttonId3 = extractedNumber[i] + "+collectToOut";
            let buttonId4 = extractedNumber[i] + "+outToCollect";
            let buttonId5 = extractedNumber[i] + "+outToBlack";
            let buttonId6 = extractedNumber[i] + "+blackToOut";
            let buttonId7 = extractedNumber[i] + "+collectToBooster";
            let buttonId8 = extractedNumber[i] + "+boosterToCollect";
            //拉黑状态不再查询
            if(document.getElementById(buttonId6)!=null){
                console.log('目前为第'+(i+1)+'个游戏，'+extractedNumber[i]+'app拉黑状态，查询下一个游戏');
                i++;
                setTimeout(processArrayWithDelay, 0);
                return;
            }
            /*             //龙姬2242710 1901370
            if(extractedNumber[i] == 1469910 || extractedNumber[i] == 2242710 || extractedNumber[i] == 1901370){
                console.log('目前为第'+(i+1)+'个游戏,查询为龙姬/想要传达给你的爱恋，跳过'+extractedNumber[i]);
                i++;
                setTimeout(processArrayWithDelay, 0);
                return;
            } */
            /*             if(alwayscraftbooster[extractedNumber[i]]){
                console.log('目前为第'+(i+1)+'个游戏,'+extractedNumber[i]+'为无条件合成补充包游戏，队列完查询下一个游戏');
                if(document.getElementById(buttonId2)!=null){
                    console.log(extractedNumber[i]+'app队列状态，无需变化');
                }else if(document.getElementById(buttonId3)!=null){
                    console.log(extractedNumber[i]+'app收藏状态，变为队列状态');
                    let button = document.getElementById(buttonId7);
                    button.click();
                }else if(document.getElementById(buttonId5)!=null){
                    console.log(extractedNumber[i]+'app全部状态，变为队列状态');
                    let button = document.getElementById(buttonId1);
                    button.click();
                }
                i++;
                setTimeout(processArrayWithDelay, 0);
                return;
            } */
            if (i >= extractedNumber.length) {
                console.log('查询结束');
                SelectGameToCraftBoosterPacks=SelectGameToCraftBoosterPacks.slice(0,SelectGameToCraftBoosterPacks.length-1);
                console.log('bstopall Bot2');
                console.log('\''+SelectGameToCraftBoosterPacks+'\'');
                return;
            }
            //查询一个卡包价格及利润
            let newURL='https://steamcommunity.com/market/search/render/?start=0&count=100&category_753_cardborder[]=tag_cardborder_0&appid=753&category_753_Game[]=tag_app_749520'.replace('749520', extractedNumber[i]);
            GM_xmlhttpRequest({
                method: "GET",
                url: newURL,
                onload: async function(response) {
                    let data = JSON.parse(response.response);
                    // 初始化总价和卡牌数量
                    let cardCount = data.total_count;
                    let totalPrice = 0;
                    if (!cardCount) {
                        console.log(extractedNumber[i]+'无法查询到普通卡牌的信息，重新查询该游戏');
                        setTimeout(processArrayWithDelay, delaytime);
                        return;
                    }
                    let cardList = document.createElement('div');
                    cardList.innerHTML = data.results_html;
                    //获取所有卡牌链接地址
                    let links = cardList.querySelectorAll('.market_listing_row_link');
                    //获取第一张卡牌链接地址
                    let link1 = links[0].href;
                    console.log('目前为第'+(i+1)+'个游戏，第一张普通卡牌链接:'+link1);
                    let elements = cardList.querySelectorAll('.market_table_value.normal_price .normal_price');
                    elements.forEach(function(priceElement) {
                        // 获取卡牌价格文本
                        let priceText = priceElement.textContent.replace('¥ ','').replace(',','').trim();
                        // 将价格文本转换为浮点数
                        let price = parseFloat(priceText);
                        // 累加总价
                        totalPrice += price;
                    });
                    if(totalPrice==0){
                        console.log(extractedNumber[i]+'查询到普通卡牌价格为0，重新查询该游戏');
                        setTimeout(processArrayWithDelay, delaytime);
                        return;
                    }
                    // 计算税后平均价格，和税后卡包价格
                    const averagePrice = totalPrice / cardCount*0.87;
                    const finalPrice=averagePrice*3;
                    //补充包成本
                    let expence=boosterCostTemplate[cardCount].gemsCount/1000*savedPrice;
                    //查询闪亮徽章价格
                    newURL='https://steamcommunity.com/market/search/render/?start=0&count=100&category_753_cardborder[]=tag_cardborder_1&appid=753&category_753_Game[]=tag_app_749520'.replace('749520', extractedNumber[i]);
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: newURL,
                        onload: async function(response) {
                            let data = JSON.parse(response.response);
                            // 初始化总价和卡牌数量
                            let totalPrice = 0;
                            if (!cardCount) {
                                console.log(extractedNumber[i]+'无法查询到闪亮卡牌的信息，重新查询该游戏');
                                setTimeout(processArrayWithDelay, delaytime);
                                return;
                            }
                            let cardList = document.createElement('div');
                            cardList.innerHTML = data.results_html;
                            let elements = cardList.querySelectorAll('.market_table_value.normal_price .normal_price');
                            let withoutcardcount=0;
                            elements.forEach(function(priceElement) {
                                // 获取卡牌价格文本
                                let priceText = priceElement.textContent;
                                // 将价格文本转换为浮点数
                                let price = parseFloat(priceText.replace(/[^\d.]/g, ""));
                                if(price==0){
                                    withoutcardcount++;
                                }
                                // 累加总价
                                totalPrice += price;
                            });
                            let hascardcount=elements.length-withoutcardcount;
                            let toaddprice=totalPrice/hascardcount*2*withoutcardcount;
                            totalPrice+=toaddprice;
                            if(totalPrice==0){
                                console.log(extractedNumber[i]+'查询到闪亮卡牌价格为0，重新查询该游戏');
                                setTimeout(processArrayWithDelay, delaytime);
                                return;
                            }
                            console.log(extractedNumber[i]+'查询到的闪卡价格'+totalPrice);
                            //理论闪卡价格尚未确定，直接将理论闪卡价格设置为999999，后续手动添加该游戏理论闪卡的价格
                            if (idealprice[extractedNumber[i]] == undefined) idealprice[extractedNumber[i]] = 999999;
                            //如果理论闪卡价格<=查询到的闪卡价格，选择理论闪卡价格
                            if(idealprice[extractedNumber[i]]<=totalPrice){
                                totalPrice=idealprice[extractedNumber[i]];
                            }
                            console.log(extractedNumber[i]+'理论闪卡价格'+idealprice[extractedNumber[i]]);
                            //计算利润，按每四十个卡包开出闪卡以75折出售闪卡然后扣除交易税13%
                            const profit=finalPrice-expence+(totalPrice/cardCount*0.65)/40;
                            console.log(extractedNumber[i]+'日盈利:'+profit);
                            if (isNaN(profit)) {
                                console.log('第' + i + '次查询的游戏' + extractedNumber[i] + '日盈利为NaN，重新查询该游戏');
                                setTimeout(processArrayWithDelay, delaytime);
                                return;
                            }
                            console.log(extractedNumber[i]+'日盈利:'+profit);
                            //①+outToBooster全部移到队列
                            //②+boosterToOut队列移到全部
                            //③+collectToOut收藏移到全部
                            //④+outToCollect全部移到收藏
                            //⑤+outToBlack全部移到拉黑
                            //⑥+blackToOut拉黑移到全部
                            //⑦+collectToBooster收藏移到队列
                            //⑧+boosterToCollect队列移到收藏
                            //日盈利小于0.3，变为收藏状态，收藏状态和拉黑状态无需变化
                            if(profit<profitlimit&&!alwayscraftbooster[extractedNumber[i]]){
                                if(document.getElementById(buttonId2)!=null){
                                    console.log(extractedNumber[i]+'app队列状态，日盈利小于'+profitlimit+'，变为收藏状态');
                                    let button = document.getElementById(buttonId8);
                                    button.click();
                                }else if(document.getElementById(buttonId3)!=null){
                                    console.log(extractedNumber[i]+'app收藏状态，日盈利小于'+profitlimit+'，无需变化');
                                }else if(document.getElementById(buttonId5)!=null){
                                    console.log(extractedNumber[i]+'app全部状态，日盈利小于'+profitlimit+'，变为收藏状态');
                                    let button = document.getElementById(buttonId4);
                                    button.click();
                                }
                                /*                                 else if(document.getElementById(buttonId6)!=null){
                                    console.log(extractedNumber[i]+'app拉黑状态，日盈利小于'+profitlimit+'，无需变化');
                                } */
                                i++;
                                setTimeout(processArrayWithDelay, delaytime);
                            }else{
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
                                        if (!data) {
                                            console.log(extractedNumber[i]+'无法查询到第一张普通卡牌的交易记录，重新查询该游戏');
                                            setTimeout(processArrayWithDelay, delaytime);
                                            return;
                                        }
                                        if(!data.prices){
                                            console.log(extractedNumber[i]+'无法获取到第一张普通卡牌的交易记录，重新查询该游戏');
                                            setTimeout(processArrayWithDelay, delaytime);
                                            return;
                                        }
                                        let prices = data.prices;
                                        let currentDate = new Date();
                                        let totalSales = 0;
                                        //累加近30天内卖出的卡牌数量
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
                                        console.log(extractedNumber[i]+'月销量为'+totalSales);
                                        //此处所有游戏日盈利都大于等于0.3，月销量大于等于50，变为队列状态，否则变为收藏状态，月销量小于50，变为拉黑状态
                                        //①+outToBooster全部移到队列
                                        //②+boosterToOut队列移到全部
                                        //③+collectToOut收藏移到全部
                                        //④+outToCollect全部移到收藏
                                        //⑤+outToBlack全部移到拉黑
                                        //⑥+blackToOut拉黑移到全部
                                        //⑦+collectToBooster收藏移到队列
                                        //⑧+boosterToCollect队列移到收藏
                                        if(totalSales>=totalSaleslimit||alwayscraftbooster[extractedNumber[i]]){
                                            if(document.getElementById(buttonId2)!=null){
                                                console.log(extractedNumber[i]+'app队列状态，日盈利大于等于'+profitlimit+'，月销量大于等于'+totalSaleslimit+'，无需变化，月销量'+totalSales);
                                            }else if(document.getElementById(buttonId3)!=null){
                                                console.log(extractedNumber[i]+'app收藏状态，日盈利大于等于'+profitlimit+'，月销量大于等于'+totalSaleslimit+'，变为队列状态，月销量'+totalSales);
                                                let button = document.getElementById(buttonId7);
                                                button.click();
                                            }else if(document.getElementById(buttonId5)!=null){
                                                console.log(extractedNumber[i]+'app全部状态，日盈利大于等于'+profitlimit+'，月销量大于等于'+totalSaleslimit+'，变为队列状态，月销量'+totalSales);
                                                let button = document.getElementById(buttonId1);
                                                button.click();
                                            }
                                            /*                                             else if(document.getElementById(buttonId6)!=null){
                                                console.log(extractedNumber[i]+'app拉黑状态，日盈利大于等于'+profitlimit+'，月销量大于等于'+totalSaleslimit+'，先变为全部状态，延迟500ms再队列，月销量'+totalSales);
                                                let button = document.getElementById(buttonId6);
                                                button.click();
                                                setTimeout(function() {
                                                    let button = document.getElementById(buttonId1);
                                                    button.click();
                                                }, 500);
                                            } */
                                            totalprofit+= profit;
                                            totalgem+=boosterCostTemplate[cardCount].gemsCount;
                                            totalgame++;
                                            SelectGameToCraftBoosterPacks+=extractedNumber[i]+',';
                                            displayElement4.textContent='日总盈利为'+totalprofit.toFixed(2)+',队列游戏总数'+totalgame+',合卡包所需宝石'+totalgem;
                                        }else if(totalSales<totalSaleslimit){
                                            //①+outToBooster全部移到队列
                                            //②+boosterToOut队列移到全部
                                            //③+collectToOut收藏移到全部
                                            //④+outToCollect全部移到收藏
                                            //⑤+outToBlack全部移到拉黑
                                            //⑥+blackToOut拉黑移到全部
                                            //⑦+collectToBooster收藏移到队列
                                            //⑧+boosterToCollect队列移到收藏
                                            if(document.getElementById(buttonId5)!=null){
                                                console.log(extractedNumber[i]+'app全部状态，月销量小于'+totalSaleslimit+'，变为拉黑，月销量'+totalSales);
                                                let button = document.getElementById(buttonId5);
                                                button.click();
                                            }else if(document.getElementById(buttonId3)!=null){
                                                console.log(extractedNumber[i]+'app收藏状态，月销量小于'+totalSaleslimit+'，先变为全部状态，延迟500ms再变为拉黑状态，月销量'+totalSales);
                                                let button = document.getElementById(buttonId3);
                                                button.click();
                                                setTimeout(function() {
                                                    let button = document.getElementById(buttonId5);
                                                    button.click();
                                                }, 500);
                                            }else if(document.getElementById(buttonId2)!=null){
                                                console.log(extractedNumber[i]+'app队列状态，月销量小于'+totalSaleslimit+'，先变为全部状态，延迟500ms再变为拉黑状态，月销量'+totalSales);
                                                let button = document.getElementById(buttonId2);
                                                button.click();
                                                setTimeout(function() {
                                                    let button = document.getElementById(buttonId5);
                                                    button.click();
                                                }, 500);
                                            }else if(document.getElementById(buttonId6)!=null){
                                                console.log(extractedNumber[i]+'app拉黑状态，月销量小于'+totalSaleslimit+'，无需变化，月销量'+totalSales);
                                            }
                                        }
                                        i++;
                                        setTimeout(processArrayWithDelay, delaytime);
                                    }
                                });
                            }
                        },
                    });
                },
            });
        }
        processArrayWithDelay(extractedNumber, 0);
    });
})();