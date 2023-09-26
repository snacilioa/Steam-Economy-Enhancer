// ==UserScript==
// @name         Steam卡牌价格计算器
// @version      1.0
// @description  获取卡包去税后价格加上闪卡爆率*闪卡价格的日盈亏，获取游戏卡牌数量、普通卡牌的流通性以及卡牌交易时长，获取游戏商店价格以及计算回本天数
// @author       第三异星
// @match        https://steamcommunity.com/market/*
// @match        https://store.steampowered.com/*
// @match        https://steamdb.info/app/*
// @match        https://www.steamcardexchange.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==


(function() {

        'use strict';

        function getPriceBeforeFees(price) {
            price = price*100;
            var feeInfo = CalculateFeeAmount(price, 0.1);
            return (price - feeInfo.fees)/100;
        };
        function CalculateFeeAmount(amount, publisherFee) {

            var iterations = 0; // shouldn't be needed, but included to be sure nothing unforseen causes us to get stuck
            var nEstimatedAmountOfWalletFundsReceivedByOtherParty = parseInt(amount / (0.05+ publisherFee+ 1));
            var bEverUndershot = false;
            var fees = CalculateAmountToSendForDesiredReceivedAmount(nEstimatedAmountOfWalletFundsReceivedByOtherParty, publisherFee);
            while (fees.amount != amount && iterations < 10) {
                if (fees.amount > amount) {
                    if (bEverUndershot) {
                        fees = CalculateAmountToSendForDesiredReceivedAmount(nEstimatedAmountOfWalletFundsReceivedByOtherParty - 1, publisherFee);
                        fees.steam_fee += (amount - fees.amount);
                        fees.fees += (amount - fees.amount);
                        fees.amount = amount;
                        break;
                    } else {
                        nEstimatedAmountOfWalletFundsReceivedByOtherParty--;
                    }
                } else {
                    bEverUndershot = true;
                    nEstimatedAmountOfWalletFundsReceivedByOtherParty++;
                }
                fees = CalculateAmountToSendForDesiredReceivedAmount(nEstimatedAmountOfWalletFundsReceivedByOtherParty, publisherFee);
                iterations++;
            }
            // fees.amount should equal the passed in amount
            return fees;
        }

        function CalculateAmountToSendForDesiredReceivedAmount(receivedAmount, publisherFee) {
            var nSteamFee = parseInt(Math.floor(Math.max(receivedAmount * 0.05, 1)));
            var nPublisherFee = parseInt(Math.floor(Math.max(receivedAmount * publisherFee, 1)));
            var nAmountToSend = receivedAmount + nSteamFee + nPublisherFee;
            return {
                steam_fee: nSteamFee,
                publisher_fee: nPublisherFee,
                fees: nSteamFee + nPublisherFee,
                amount: parseInt(nAmountToSend)
            };
        }

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
        container.style.top = '100px';
        container.style.right = '10px';

        let button0 = document.createElement('button');
        button0.innerHTML = '跳转到该游戏商店页面';
        button0.style.display = 'block';

        let button = document.createElement('button');
        button.innerHTML = '跳转到该游戏普通卡牌页面';
        button.style.display = 'block';

        let button1 = document.createElement('button');
        button1.innerHTML = '跳转到该游戏foil卡牌页面';
        button1.style.display = 'block';

        let inputBox = document.createElement('input');
        inputBox.style.display = 'inline-block';

        const displayElement0 = document.createElement('div');
        displayElement0.style.background = 'white';
        displayElement0.style.border = '1px solid black';
        displayElement0.style.minHeight = '20px';
        displayElement0.style.color='black';
        displayElement0.textContent='宝石袋成本';
        displayElement0.style.display = 'inline';

        const displayElement2 = document.createElement('div');
        displayElement2.style.background = 'white';
        displayElement2.style.border = '1px solid black';
        displayElement2.style.minHeight = '20px';
        displayElement2.style.color='orange';

        const displayElement3 = document.createElement('div');
        displayElement3.style.background = 'white';
        displayElement3.style.border = '1px solid black';
        displayElement3.style.minHeight = '20px';
        displayElement3.style.color='black';

        const displayElement4 = document.createElement('div');
        displayElement4.style.background = 'white';
        displayElement4.style.border = '1px solid black';
        displayElement4.style.minHeight = '20px';

        const displayElement5 = document.createElement('div');
        displayElement5.style.background = 'white';
        displayElement5.style.border = '1px solid black';
        displayElement5.style.minHeight = '20px';
        displayElement5.style.color='orange';

        const displayElement6 = document.createElement('div');
        displayElement6.style.background = 'white';
        displayElement6.style.border = '1px solid black';
        displayElement6.style.minHeight = '20px';
        displayElement6.style.color='black';

        const displayElement7 = document.createElement('div');
        displayElement7.style.background = 'white';
        displayElement7.style.border = '1px solid black';
        displayElement7.style.minHeight = '20px';
        displayElement7.style.color='black';

        const displayElement8 = document.createElement('div');
        displayElement8.style.background = 'white';
        displayElement8.style.border = '1px solid black';
        displayElement8.style.minHeight = '20px';
        displayElement8.style.color='black';

        const displayElement9 = document.createElement('div');
        displayElement9.style.background = 'white';
        displayElement9.style.border = '1px solid black';
        displayElement9.style.minHeight = '20px';
        displayElement9.style.color='orange';

        /*     const displayElement10 = document.createElement('div');
        displayElement10.style.background = 'white';
        displayElement10.style.border = '1px solid black';
        displayElement10.style.minHeight = '20px';
        displayElement10.style.color='black'; */
        //正则表达式匹配四个网站的steam游戏id，存入extractedNumber
        const url = window.location.href;
        const isMatch = /^https:\/\/store\.steampowered\.com\//.test(url);
        const isMatch1 = /^https:\/\/steamcommunity\.com\/market\/search/.test(url);
        const isMatch2 = /^https:\/\/www\.steamcardexchange\.net\//.test(url);
        const isMatch3 = /^https:\/\/steamdb\.info\//.test(url);
        const isMatch4 = /^https:\/\/steamcommunity\.com\/market\/listings/.test(url);
        let extractedNumber;
        if(isMatch||isMatch3){
            extractedNumber = url.match(/\/app\/(\d+)/)[1];
        }else if(isMatch1){
            extractedNumber = url.match(/tag_app_(\d+)/)[1];
        }else if(isMatch2){
            extractedNumber = url.match(/gamepage-appid-(\d+)/)[1];
        }else if(isMatch3){
            extractedNumber = url.match(/(\d+)/)[1];
        }else if(isMatch4){
            extractedNumber = url.match(/\/753\/(\d+)/)[1];
        }
        //宝石袋价格
        let savedPrice = GM_getValue('price', '');
        if (savedPrice) {
            inputBox.value = savedPrice;
        }
        //保存宝石袋价格
        inputBox.addEventListener('change', function() {
            GM_setValue('price', this.value);
        });
        //第一张卡牌链接地址
        let link1;
        let newURL;
        // 为按钮添加事件监听器，跳转到游戏商店页面
        button0.addEventListener('click', function() {
            // 将URL中的749520替换为用户输入的值
            newURL = 'https://store.steampowered.com/app/749520'.replace('749520', extractedNumber);
            // 跳转到新的URL
            window.location.href = newURL;
        });
        // 为按钮添加事件监听器，跳转到游戏普通卡牌页面
        button.addEventListener('click', function() {
            // 将URL中的749520替换为用户输入的值
            newURL = 'https://steamcommunity.com/market/search?appid=753&category_753_Game%5B%5D=tag_app_749520&category_753_cardborder%5B%5D=tag_cardborder_0'.replace('749520', extractedNumber);
            // 跳转到新的URL
            window.location.href = newURL;
        });
        // 为按钮添加事件监听器，跳转到游戏闪亮卡牌页面
        button1.addEventListener('click', function() {
            // 将URL中的749520替换为用户输入的值
            newURL = 'https://steamcommunity.com/market/search?appid=753&category_753_Game%5B%5D=tag_app_749520&category_753_cardborder%5B%5D=tag_cardborder_1'.replace('749520', extractedNumber);
            // 跳转到新的URL
            window.location.href = newURL;
        });
        if(window.location.href==='https://steamcommunity.com/market/'){
            return;
        }
        //查询一个卡包价格及利润
        newURL='https://steamcommunity.com/market/search/render/?start=0&count=100&category_753_cardborder[]=tag_cardborder_0&appid=753&category_753_Game[]=tag_app_749520'.replace('749520', extractedNumber);
        GM_xmlhttpRequest({
            method: "GET",
            url: newURL,
            onload: async function(response) {
                let data = JSON.parse(response.response);
                // 初始化总价和卡牌数量
                let cardCount = data.total_count;
                let totalPrice = 0;
                if (!cardCount) {
                    console.log = '没有找到卡牌信息';
                    return;
                }
                displayElement9.textContent = '卡牌数量：' + cardCount+'张';
                let cardList = document.createElement('div');
                cardList.innerHTML = data.results_html;
                //获取所有卡牌链接地址
                let links = cardList.querySelectorAll('.market_listing_row_link');
                //获取第一张卡牌链接地址
                link1 = links[0].href;
                console.log('link1:'+link1);
                let elements = cardList.querySelectorAll('.market_table_value.normal_price .normal_price');
                elements.forEach(function(priceElement) {
                    // 获取卡牌价格文本
                    let priceText = priceElement.textContent;
                    // 将价格文本转换为浮点数
                    let price = parseFloat(priceText.replace(/[^\d.]/g, ""));
                    /*                    console.log('卡牌税前价格：'+price)
                                        console.log('卡牌税后价格：'+getPriceBeforeFees(price))*/
                    // 累加总价
                    totalPrice += getPriceBeforeFees(price);
                });
                // 计算税后卡包价格
                const finalPrice=totalPrice / cardCount*3;
                //补充包成本
                let expence=boosterCostTemplate[cardCount].gemsCount/1000*savedPrice;
                displayElement2.textContent ='一个卡包去税后的价格：' + finalPrice.toFixed(2);
                displayElement3.textContent ='合成补充包成本：' + expence.toFixed(2);
                /*             let mincardprice=expence/0.87/5;
                displayElement10.textContent ='坐庄白卡建议最低定价：?' + mincardprice.toFixed(2); */
                //查询闪亮徽章价格
                newURL='https://steamcommunity.com/market/search/render/?start=0&count=100&category_753_cardborder[]=tag_cardborder_1&appid=753&category_753_Game[]=tag_app_749520'.replace('749520', extractedNumber);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: newURL,
                    onload: async function(response) {
                        let data = JSON.parse(response.response);
                        let totalPrice = 0;
                        if (!cardCount) {
                            console.log('查询不到卡牌信息');
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
                        displayElement5.textContent = '闪亮徽章去税前参考价格：' + totalPrice.toFixed(2);
                        //计算利润，按每四十个卡包开出闪卡以75折出售闪卡然后扣除交易税13%
                        const profit=finalPrice-expence+(totalPrice/cardCount*0.65)/40;
                        displayElement4.textContent = '日盈亏：' + profit.toFixed(2);
                        //日盈亏标色
                        if (profit < 0) {
                            displayElement4.style.color = 'red';//亏损标红
                        } else if (profit > 0) {
                            displayElement4.style.color = 'green';//盈利标绿
                        }
                        //获取游戏价格，计算回本时间
                        let shopurl = `https://store.steampowered.com/api/appdetails?appids=433360`.replace('433360', extractedNumber);
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: shopurl,
                            onload: function(response) {
                                let data = JSON.parse(response.response);
                                console.log(data[extractedNumber])
                                if(data[extractedNumber].success==false){
                                    console.log(extractedNumber+'为锁区游戏')
                                    return;
                                }
                                let gameData = data[extractedNumber].data;
                                let price=0;
                                if (gameData.is_free==false){
                                    price=gameData.price_overview.final/100;
                                }
                                let day=Math.floor(price/profit);
                                displayElement8.textContent ='游戏价格：' + price+'，回本天数：' + day;
                            }
                        });
                    },
                });
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
                            displayElement6.textContent ='无法获取到第一张普通卡牌的交易记录';
                            return;
                        }
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
                        //获取卡牌累计交易天数
                        let startdateStr = prices[0][0];
                        let date = new Date(startdateStr);
                        let timeDiff = currentDate - date;
                        let daysDiff = timeDiff / (1000 * 3600 * 24);
                        displayElement6.textContent ='第一张普通卡牌近30天的销量：' + totalSales;
                        displayElement7.textContent ='卡牌累计交易天数：' + Math.floor(daysDiff);
                        //日盈亏标色
                        if (totalSales <=50) {
                            displayElement6.style.color = 'purple';//亏损标紫，流通性极低
                        } else if (totalSales > 50&&totalSales<=100) {
                            displayElement6.style.color = 'red';//盈利标红，流通性较低
                        }else if (totalSales > 101&&totalSales<=200) {
                            displayElement6.style.color = 'black';//盈利标黑，流通性一般
                        }else if (totalSales > 201) {
                            displayElement6.style.color = 'blue';//盈利标蓝，流通性较高
                        }
                        //卡牌累计交易天数小于60天需要谨慎考虑
                        if(daysDiff<=60){
                            displayElement7.style.color = 'purple';
                        }
                    }
                });
            },
        });
        // 将按钮、输入框和层添加到容器中
        container.appendChild(button0);
        container.appendChild(button);
        container.appendChild(button1);
        container.appendChild(displayElement0);
        container.appendChild(inputBox);
        container.appendChild(displayElement3);
        container.appendChild(displayElement2);
        container.appendChild(displayElement9);
        container.appendChild(displayElement5);
        container.appendChild(displayElement4);
        container.appendChild(displayElement6);
        container.appendChild(displayElement7);
        container.appendChild(displayElement8);
        /*     container.appendChild(displayElement10); */
        // 将容器添加到页面中
        document.body.appendChild(container);
    }
)();
