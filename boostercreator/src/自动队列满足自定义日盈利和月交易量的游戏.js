// ==UserScript==
// @name         自动队列满足自定义日盈利和月交易量的游戏
// @version      1.0
// @description  自动队列满足自定义日盈利和月交易量的游戏
// @author       第三异星
// @match        https://steamcommunity.com//tradingcards/boostercreator/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function ($) {
    $.noConflict(true);
    //控制台开启正则表达式查询'无需|变为'两个关键词的总和为游戏总数，如果少于游戏总数，那就是有游戏查询失败，查询'无法'可知道哪些游戏查询失败
    //理论闪卡价格?，设置为999999说明该闪卡价格稳定不变，查询到的闪卡价格可以直接使用
    //第一次使用，需要f12打开控制台，复制ignore对象导入你有的游戏，后续买入新游戏，手动一个个添加理想闪卡价格
    let SelectGameToCraftBoosterPacks = '';
    let alwaysCraftBoosterPacks = {
        1901370: true,
    }
    let idealprice = {}
    //永久拉黑名单
    let blacklist = {
        "730": true,
        "4000": true,
        "252610": true,
        "292030": true,
        "327410": true,
        "337340": true,
        "417990": true,
        "424840": true,
        "431960": true,
        "434650": true,
        "489520": true,
        "503300": true,
        "508190": true,
        "575550": true,
        "531960": true,
        "635730": true,
        "599460": true,
        "644560": true,
        "646570": true,
        "712840": true,
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

    async function getMarketItemNameId(url) {
        let page = await $.get(url);
        let matches = /Market_LoadOrderSpread\( (.+) \);/.exec(page);
        let item_nameid = matches[1];
        return item_nameid;
    }

    async function getCurrentItemOrdersHistogram(itemid) {
        let url = window.location.protocol + '//steamcommunity.com/market/itemordershistogram?country=CN&language=english&currency=23&item_nameid=' + itemid + '&two_factor=0';
        let histogram = await $.get(url);
        let price = histogram.sell_order_graph[0][0];
        return price;
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
    displayElement1.style.color = 'black';
    displayElement1.textContent = '宝石袋成本';
    displayElement1.style.display = 'inline-block';

    let inputBox1 = document.createElement('input');
    inputBox1.style.background = 'green';
    inputBox1.style.color = 'white';
    inputBox1.style.display = 'inline-block';

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'modenormal-checkbox';

    let label = document.createElement('label');
    label.style.background = 'white';
    label.style.color = 'black';
    label.htmlFor = 'modenormal-checkbox';
    label.appendChild(document.createTextNode('市场价格是否异常'));

    const displayElement4 = document.createElement('div');
    displayElement4.style.background = 'white';
    displayElement4.style.border = '1px solid black';
    displayElement4.style.minHeight = '20px';
    displayElement4.style.color = 'orange';
    displayElement4.style.display = 'block';

    let row1 = document.createElement('div');
    row1.appendChild(displayElement1);
    row1.appendChild(inputBox1);

    let row4 = document.createElement('div');
    row4.appendChild(label);
    row4.appendChild(checkbox);

    let button2 = document.createElement('button');
    button2.innerHTML = '点击按钮初始化查询游戏序号';
    button2.style.display = 'inline-bloc';
    button2.style.background = 'white';
    button2.style.border = '2px solid black';
    button2.style.borderRadius = '5px';
    button2.style.color = 'black';

    let button21 = document.createElement('button');
    button21.innerHTML = '点击按钮终止查询游戏';
    button21.style.display = 'inline-bloc';
    button21.style.background = 'white';
    button21.style.border = '2px solid black';
    button21.style.borderRadius = '5px';
    button21.style.color = 'black';

    let row5 = document.createElement('div');
    row5.appendChild(button2);
    row5.appendChild(button21);

    let displayElement0 = document.createElement('div');
    displayElement0.style.background = 'white';
    displayElement0.style.border = '1px solid black';
    displayElement0.style.minHeight = '20px';
    displayElement0.style.color = 'black';
    displayElement0.style.background = 'white';
    displayElement0.textContent = '输入从第几个游戏开始找起(默认为0)';
    displayElement0.style.display = 'inline-block';

    let inputBox = document.createElement('input');
    inputBox.style.background = 'green';
    inputBox.style.display = 'inline-block';

    let row6 = document.createElement('div');
    row6.appendChild(displayElement0);
    row6.appendChild(inputBox);

    let i = 0;
    inputBox.addEventListener('change', function () {
        i = inputBox.value || 0;
    });

    button2.addEventListener('click', function () {
        i = 0;
        console.log('初始化查询游戏序号');
    })

    button21.addEventListener('click', function () {
        i = 999999;
        console.log('终止查询游戏');
    })

    container.appendChild(button);
    container.appendChild(row1);
    container.appendChild(row4);
    container.appendChild(row5);
    container.appendChild(row6);
    container.appendChild(displayElement4);
    document.body.appendChild(container);
    let totalprofit = 0, totalgame = 0, totalgem = 0;
    //宝石袋价格
    let savedPrice = GM_getValue('price', '');
    if (savedPrice) {
        inputBox1.value = savedPrice;
    }
    //保存宝石袋价格
    inputBox1.addEventListener('change', function () {
        GM_setValue('price', this.value);
    });
    // 获取上一次的modenormal状态
    let modenormal = localStorage.getItem('modenormal') === 'false' ? false : true;
    checkbox.checked = !modenormal;
    // 监听单选框状态变化
    checkbox.addEventListener('change', function () {
        modenormal = !checkbox.checked;
        localStorage.setItem('modenormal', modenormal);
        console.log('modenormal:', modenormal);
    });
    let delaytime = 1000, allmes = [];
    let checkedgame = {};
    // 添加按钮点击事件
    button.addEventListener("click", function () {
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
            //①+outToBooster全部移到队列
            //②+boosterToOut队列移到全部
            //③+collectToOut收藏移到全部
            //④+outToCollect全部移到收藏
            //⑤+outToBlack全部移到拉黑
            //⑥+blackToOut拉黑移到全部
            //⑦+collectToBooster收藏移到队列
            //⑧+boosterToCollect队列移到收藏
            let buttonId1 = extractedNumber[i] + "+outToBooster";
            let buttonId2 = extractedNumber[i] + "+boosterToOut";
            let buttonId3 = extractedNumber[i] + "+collectToOut";
            let buttonId4 = extractedNumber[i] + "+outToCollect";
            let buttonId5 = extractedNumber[i] + "+outToBlack";
            let buttonId6 = extractedNumber[i] + "+blackToOut";
            let buttonId7 = extractedNumber[i] + "+collectToBooster";
            let buttonId8 = extractedNumber[i] + "+boosterToCollect";
            //拉黑状态不再查询
            if (blacklist[extractedNumber[i]]) {
                console.log('目前为第' + i + '个游戏，' + extractedNumber[i] + 'app永久拉黑状态，查询下一个游戏');
                let button = document.getElementById(buttonId5);
                if (button) {
                    button.click();
                }
                i++;
                setTimeout(processArrayWithDelay, 0);
                return;
            }
            if (i >= extractedNumber.length) {
                console.log('查询结束,队列结果如下');
                console.log(allmes);
                console.log('bstopall Bot2')
                console.log('bstatus Bot2')
                console.log('\'booster Bot2 ' + SelectGameToCraftBoosterPacks + '\'');
                console.log(SelectGameToCraftBoosterPacks);
                return;
            }
            //查询一个卡包价格及利润
            let newURL = 'https://steamcommunity.com/market/search/render/?start=0&count=100&category_753_cardborder[]=tag_cardborder_0&appid=753&category_753_Game[]=tag_app_749520'.replace('749520', extractedNumber[i]);
            GM_xmlhttpRequest({
                method: "GET",
                url: newURL,
                onload: async function (response) {
                    let data = JSON.parse(response.response);
                    // 初始化总价和卡牌数量
                    let cardCount = data.total_count;
                    let totalPrice = 0;
                    if (!cardCount) {
                        console.log(extractedNumber[i] + '无法查询到普通卡牌的信息，重新查询该游戏');
                        setTimeout(processArrayWithDelay, delaytime);
                        return;
                    }
                    let cardList = document.createElement('div');
                    cardList.innerHTML = data.results_html;
                    //获取所有卡牌链接地址
                    let links = cardList.querySelectorAll('.market_listing_row_link');
                    //获取第一张卡牌链接地址
                    let link1 = links[0].href;
                    console.log('目前为第' + i + '个游戏，第一张普通卡牌链接:' + link1);
                    let expence = 0, onecardexpence = 0, profitcardcount = 0;
                    if (modenormal) {
                        let elements = cardList.querySelectorAll('.market_table_value.normal_price .normal_price');
                        //补充包成本
                        expence = boosterCostTemplate[cardCount].gemsCount / 1000 * savedPrice;
                        onecardexpence = expence / 3;
                        elements.forEach(function (priceElement) {
                            // 获取卡牌价格文本
                            let priceText = priceElement.textContent;
                            // 将价格文本转换为浮点数
                            let price = parseFloat(priceText.replace(/[^\d.]/g, ""));
                            if (price >= onecardexpence) {
                                profitcardcount++;
                            }
                            // 累加总价
                            totalPrice += price;
                        });
                    } else {
                        //补充包成本
                        expence = boosterCostTemplate[cardCount].gemsCount / 1000 * 2;
                        onecardexpence = expence / 3;
                        for (const item of links) {
                            let itemid = await getMarketItemNameId(item.href);
                            let price = await getCurrentItemOrdersHistogram(itemid);
                            console.log(extractedNumber[i] + '卡牌价格:' + price);
                            while (!price) {
                                console.log(extractedNumber[i] + '查询不到价格信息,链接为:' + item.href);
                                price = await getCurrentItemOrdersHistogram(itemid);
                            }
                            if (price >= onecardexpence) {
                                profitcardcount++;
                            }
                            // 累加总价
                            totalPrice += price;
                        }
                    }
                    let profitcardpercent = profitcardcount / cardCount * 100;
                    if (totalPrice == 0) {
                        console.log(extractedNumber[i] + '查询到普通卡牌价格为0，重新查询该游戏');
                        setTimeout(processArrayWithDelay, delaytime);
                        return;
                    }
                    // 计算税后平均价格，和税后卡包价格
                    const averagePrice = totalPrice / cardCount * 0.87;
                    const finalPrice = averagePrice * 3;
                    //查询闪亮徽章价格
                    newURL = 'https://steamcommunity.com/market/search/render/?start=0&count=100&category_753_cardborder[]=tag_cardborder_1&appid=753&category_753_Game[]=tag_app_749520'.replace('749520', extractedNumber[i]);
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: newURL,
                        onload: async function (response) {
                            let data = JSON.parse(response.response);
                            // 初始化总价和卡牌数量
                            let totalPrice = 0;
                            if (!cardCount) {
                                console.log(extractedNumber[i] + '无法查询到闪亮卡牌的信息，重新查询该游戏');
                                setTimeout(processArrayWithDelay, delaytime);
                                return;
                            }
                            let cardList = document.createElement('div');
                            cardList.innerHTML = data.results_html;
                            let elements = cardList.querySelectorAll('.market_table_value.normal_price .normal_price');
                            let withoutcardcount = 0;
                            elements.forEach(function (priceElement) {
                                // 获取卡牌价格文本
                                let priceText = priceElement.textContent;
                                // 将价格文本转换为浮点数
                                let price = parseFloat(priceText.replace(/[^\d.]/g, ""));
                                if (price == 0) {
                                    withoutcardcount++;
                                }
                                // 累加总价
                                totalPrice += price;
                            });
                            let hascardcount = elements.length - withoutcardcount;
                            let toaddprice = totalPrice / hascardcount * 2 * withoutcardcount;
                            totalPrice += toaddprice;
                            if (totalPrice == 0) {
                                console.log(extractedNumber[i] + '查询到闪亮卡牌价格为0，重新查询该游戏');
                                setTimeout(processArrayWithDelay, delaytime);
                                return;
                            }
                            console.log(extractedNumber[i] + '查询到的闪卡价格' + totalPrice);
                            //理论闪卡价格尚未确定，直接将理论闪卡价格设置为999999，后续手动添加该游戏理论闪卡的价格
                            if (idealprice[extractedNumber[i]] == undefined) idealprice[extractedNumber[i]] = 999999;
                            //如果理论闪卡价格<=查询到的闪卡价格，选择理论闪卡价格
                            if (idealprice[extractedNumber[i]] <= totalPrice) {
                                totalPrice = idealprice[extractedNumber[i]];
                            }
                            console.log(extractedNumber[i] + '理论闪卡价格' + idealprice[extractedNumber[i]]);
                            if (!alwaysCraftBoosterPacks[extractedNumber[i]] && (totalPrice < 100 && profitcardpercent < 35)) {
                                console.log('普通卡牌盈利数量百分比:' + profitcardpercent);
                                if (document.getElementById(buttonId2) != null) {
                                    console.log(extractedNumber[i] + 'app队列状态，闪卡总价小于100，普通卡牌盈利数量百分比小于35%，变为收藏状态');
                                    let button = document.getElementById(buttonId8);
                                    button.click();
                                } else if (document.getElementById(buttonId3) != null) {
                                    console.log(extractedNumber[i] + 'app收藏状态，闪卡总价小于100，普通卡牌盈利数量百分比小于35%，无需变化');
                                } else if (document.getElementById(buttonId5) != null) {
                                    console.log(extractedNumber[i] + 'app全部状态，闪卡总价小于100，普通卡牌盈利数量百分比小于35%，变为收藏状态');
                                    let button = document.getElementById(buttonId4);
                                    button.click();
                                } else if (document.getElementById(buttonId6) != null) {
                                    console.log(extractedNumber[i] + 'app拉黑状态，闪卡总价小于100，普通卡牌盈利数量百分比小于35%，无需变化');
                                }
                                i++;
                                setTimeout(processArrayWithDelay, delaytime);
                                return;
                            }
                            //计算利润，按每四十个卡包开出闪卡以75折出售闪卡然后扣除交易税13%
                            let profit = finalPrice - expence + (totalPrice / cardCount * 0.65) / 40;
                            if (profit >= 6) {
                                profit = 6;
                            }
                            console.log(extractedNumber[i] + '日盈利:' + profit);
                            if (isNaN(profit)) {
                                console.log('第' + i + '次查询的游戏' + extractedNumber[i] + '日盈利为NaN，重新查询该游戏');
                                setTimeout(processArrayWithDelay, delaytime);
                                return;
                            }
                            //①+outToBooster全部移到队列
                            //②+boosterToOut队列移到全部
                            //③+collectToOut收藏移到全部
                            //④+outToCollect全部移到收藏
                            //⑤+outToBlack全部移到拉黑
                            //⑥+blackToOut拉黑移到全部
                            //⑦+collectToBooster收藏移到队列
                            //⑧+boosterToCollect队列移到收藏
                            //日盈利小于0.1，变为收藏状态，收藏状态和拉黑状态无需变化
                            if (!alwaysCraftBoosterPacks[extractedNumber[i]] && profit < 0.1) {
                                if (document.getElementById(buttonId2) != null) {
                                    console.log(extractedNumber[i] + 'app队列状态，日盈利小于0.1，变为收藏状态');
                                    let button = document.getElementById(buttonId8);
                                    button.click();
                                } else if (document.getElementById(buttonId3) != null) {
                                    console.log(extractedNumber[i] + 'app收藏状态，日盈利小于0.1，无需变化');
                                } else if (document.getElementById(buttonId5) != null) {
                                    console.log(extractedNumber[i] + 'app全部状态，日盈利小于0.1，变为收藏状态');
                                    let button = document.getElementById(buttonId4);
                                    button.click();
                                } else if (document.getElementById(buttonId6) != null) {
                                    console.log(extractedNumber[i] + 'app拉黑状态，日盈利小于0.1，无需变化');
                                }
                                i++;
                                setTimeout(processArrayWithDelay, delaytime);
                            } else {
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
                                    onload: function (response) {
                                        let data = JSON.parse(response.responseText);
                                        if (!data) {
                                            console.log(extractedNumber[i] + '无法获取第一张普通卡牌的信息，重新查询该游戏');
                                            setTimeout(processArrayWithDelay, delaytime);
                                            return;
                                        }
                                        if (!data.prices) {
                                            console.log(extractedNumber[i] + '无法获取到第一张普通卡牌的交易记录，重新查询该游戏');
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
                                        console.log(extractedNumber[i] + '月销量为' + totalSales);
                                        //①+outToBooster全部移到队列
                                        //②+boosterToOut队列移到全部
                                        //③+collectToOut收藏移到全部
                                        //④+outToCollect全部移到收藏
                                        //⑤+outToBlack全部移到拉黑
                                        //⑥+blackToOut拉黑移到全部
                                        //⑦+collectToBooster收藏移到队列
                                        //⑧+boosterToCollect队列移到收藏
                                        if (alwaysCraftBoosterPacks[extractedNumber[i]] || ((totalSales >= 30 && totalSales < 60 && profit >= 0.8) || (totalSales >= 60 && totalSales < 100 && profit >= 0.4) || (totalSales >= 100 && totalSales < 400 && profit >= 0.2) || (totalSales >= 400 && profit >= 0.1))) {
                                            if (document.getElementById(buttonId2) != null) {
                                                console.log(extractedNumber[i] + 'app队列状态，日盈利大于等于0.1，月销量满足要求，无需变化，月销量' + totalSales);
                                            } else if (document.getElementById(buttonId3) != null) {
                                                console.log(extractedNumber[i] + 'app收藏状态，日盈利大于等于0.1，月销量满足要求，变为队列状态，月销量' + totalSales);
                                                let button = document.getElementById(buttonId7);
                                                button.click();
                                            } else if (document.getElementById(buttonId5) != null) {
                                                console.log(extractedNumber[i] + 'app全部状态，日盈利大于等于0.1，月销量满足要求，变为队列状态，月销量' + totalSales);
                                                let button = document.getElementById(buttonId1);
                                                button.click();
                                            } else if (document.getElementById(buttonId6) != null) {
                                                console.log(extractedNumber[i] + 'app拉黑状态，日盈利大于等于0.1，月销量满足要求，先变为全部状态，延迟500ms再变为队列状态，月销量' + totalSales);
                                                let button = document.getElementById(buttonId6);
                                                button.click();
                                                setTimeout(function () {
                                                    let button = document.getElementById(buttonId1);
                                                    button.click();
                                                }, 500);
                                            }
                                            if (!checkedgame[extractedNumber[i]] && typeof extractedNumber[i] !== 'undefined') {
                                                totalprofit += profit;
                                                totalgem += boosterCostTemplate[cardCount].gemsCount;
                                                totalgame++;
                                                SelectGameToCraftBoosterPacks += extractedNumber[i] + ',';
                                                let mes = extractedNumber[i] + ',日盈利为' + profit.toFixed(2) + ',队列游戏总数' + totalgame + ',合卡包所需宝石' + boosterCostTemplate[cardCount].gemsCount + ',月销量为' + totalSales;
                                                allmes.push(mes);
                                                checkedgame[extractedNumber[i]] = true;
                                            }
                                            // console.log('日总盈利为'+totalprofit.toFixed(2)+',队列游戏总数'+totalgame+',合卡包所需宝石'+totalgem);
                                            displayElement4.textContent = '日总盈利为' + totalprofit.toFixed(2) + ',队列游戏总数' + totalgame + ',合卡包所需宝石' + totalgem;
                                        } else {
                                            if (document.getElementById(buttonId2) != null) {
                                                console.log(extractedNumber[i] + 'app队列状态，不满足队列和拉黑条件，日盈利:' + profit + '，月销量:' + totalSales + '，变为收藏状态');
                                                let button = document.getElementById(buttonId8);
                                                button.click();
                                            } else if (document.getElementById(buttonId3) != null) {
                                                console.log(extractedNumber[i] + 'app收藏状态，不满足队列和拉黑条件，日盈利:' + profit + '，月销量:' + totalSales + '，无需变化');
                                            } else if (document.getElementById(buttonId5) != null) {
                                                console.log(extractedNumber[i] + 'app全部状态，不满足队列和拉黑条件，日盈利:' + profit + '，月销量:' + totalSales + '，变为收藏状态');
                                                let button = document.getElementById(buttonId4);
                                                button.click();
                                            } else if (document.getElementById(buttonId6) != null) {
                                                console.log(extractedNumber[i] + 'app拉黑状态，不满足队列和拉黑条件，日盈利:' + profit + '，月销量:' + totalSales + '，无需变化');
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
})(jQuery);
