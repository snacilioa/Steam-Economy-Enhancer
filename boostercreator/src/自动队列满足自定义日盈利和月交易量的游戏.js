// ==UserScript==
// @name         �Զ����������Զ�����ӯ�����½���������Ϸ
// @version      1.0
// @description  �Զ����������Զ�����ӯ�����½���������Ϸ
// @author       ��������
// @match        https://steamcommunity.com//tradingcards/boostercreator/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function ($) {
    $.noConflict(true);
    //����̨����������ʽ��ѯ'����|��Ϊ'�����ؼ��ʵ��ܺ�Ϊ��Ϸ���������������Ϸ�������Ǿ�������Ϸ��ѯʧ�ܣ���ѯ'�޷�'��֪����Щ��Ϸ��ѯʧ��
    //���������۸�?������Ϊ999999˵���������۸��ȶ����䣬��ѯ���������۸����ֱ��ʹ��
    //��һ��ʹ�ã���Ҫf12�򿪿���̨������ignore���������е���Ϸ��������������Ϸ���ֶ�һ����������������۸�
    let SelectGameToCraftBoosterPacks = '';
    let alwaysCraftBoosterPacks = {
        1901370: true,
    }
    let idealprice = {}
    //������������
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
    button.innerHTML = "�Զ����з���Ҫ�����Ϸ";

    const displayElement1 = document.createElement('div');
    displayElement1.style.background = 'white';
    displayElement1.style.border = '1px solid black';
    displayElement1.style.minHeight = '20px';
    displayElement1.style.color = 'black';
    displayElement1.textContent = '��ʯ���ɱ�';
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
    label.appendChild(document.createTextNode('�г��۸��Ƿ��쳣'));

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
    button2.innerHTML = '�����ť��ʼ����ѯ��Ϸ���';
    button2.style.display = 'inline-bloc';
    button2.style.background = 'white';
    button2.style.border = '2px solid black';
    button2.style.borderRadius = '5px';
    button2.style.color = 'black';

    let button21 = document.createElement('button');
    button21.innerHTML = '�����ť��ֹ��ѯ��Ϸ';
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
    displayElement0.textContent = '����ӵڼ�����Ϸ��ʼ����(Ĭ��Ϊ0)';
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
        console.log('��ʼ����ѯ��Ϸ���');
    })

    button21.addEventListener('click', function () {
        i = 999999;
        console.log('��ֹ��ѯ��Ϸ');
    })

    container.appendChild(button);
    container.appendChild(row1);
    container.appendChild(row4);
    container.appendChild(row5);
    container.appendChild(row6);
    container.appendChild(displayElement4);
    document.body.appendChild(container);
    let totalprofit = 0, totalgame = 0, totalgem = 0;
    //��ʯ���۸�
    let savedPrice = GM_getValue('price', '');
    if (savedPrice) {
        inputBox1.value = savedPrice;
    }
    //���汦ʯ���۸�
    inputBox1.addEventListener('change', function () {
        GM_setValue('price', this.value);
    });
    // ��ȡ��һ�ε�modenormal״̬
    let modenormal = localStorage.getItem('modenormal') === 'false' ? false : true;
    checkbox.checked = !modenormal;
    // ������ѡ��״̬�仯
    checkbox.addEventListener('change', function () {
        modenormal = !checkbox.checked;
        localStorage.setItem('modenormal', modenormal);
        console.log('modenormal:', modenormal);
    });
    let delaytime = 1000, allmes = [];
    let checkedgame = {};
    // ��Ӱ�ť����¼�
    button.addEventListener("click", function () {
        // ��ʼ��ignore����
        let ignore = {};
        // ��ȡ���а�ť
        let buttons = document.querySelectorAll("button");
        // �������а�ť
        for (let i = 0; i < buttons.length; i++) {
            let button = buttons[i];
            let id = button.id;
            // ���id�Ƿ����"+reset"
            if (id.includes("+reset")) {
                // ��ȡ���ֲ���
                let number = id.split("+")[0];
                // �����ִ洢��ignore������
                ignore[number] = true;
            }
        }
        console.log(ignore);
        // ����һ���������洢ignore�е����ֲ���
        let extractedNumber = [];
        // ����ignore���ݲ������ֲ��ִ���extractedNumber������
        for (let key in ignore) {
            if (ignore.hasOwnProperty(key)) {
                extractedNumber.push(key);
            }
        }

        function processArrayWithDelay() {
            //��+outToBoosterȫ���Ƶ�����
            //��+boosterToOut�����Ƶ�ȫ��
            //��+collectToOut�ղ��Ƶ�ȫ��
            //��+outToCollectȫ���Ƶ��ղ�
            //��+outToBlackȫ���Ƶ�����
            //��+blackToOut�����Ƶ�ȫ��
            //��+collectToBooster�ղ��Ƶ�����
            //��+boosterToCollect�����Ƶ��ղ�
            let buttonId1 = extractedNumber[i] + "+outToBooster";
            let buttonId2 = extractedNumber[i] + "+boosterToOut";
            let buttonId3 = extractedNumber[i] + "+collectToOut";
            let buttonId4 = extractedNumber[i] + "+outToCollect";
            let buttonId5 = extractedNumber[i] + "+outToBlack";
            let buttonId6 = extractedNumber[i] + "+blackToOut";
            let buttonId7 = extractedNumber[i] + "+collectToBooster";
            let buttonId8 = extractedNumber[i] + "+boosterToCollect";
            //����״̬���ٲ�ѯ
            if (blacklist[extractedNumber[i]]) {
                console.log('ĿǰΪ��' + i + '����Ϸ��' + extractedNumber[i] + 'app��������״̬����ѯ��һ����Ϸ');
                let button = document.getElementById(buttonId5);
                if (button) {
                    button.click();
                }
                i++;
                setTimeout(processArrayWithDelay, 0);
                return;
            }
            if (i >= extractedNumber.length) {
                console.log('��ѯ����,���н������');
                console.log(allmes);
                console.log('bstopall Bot2')
                console.log('bstatus Bot2')
                console.log('\'booster Bot2 ' + SelectGameToCraftBoosterPacks + '\'');
                console.log(SelectGameToCraftBoosterPacks);
                return;
            }
            //��ѯһ�������۸�����
            let newURL = 'https://steamcommunity.com/market/search/render/?start=0&count=100&category_753_cardborder[]=tag_cardborder_0&appid=753&category_753_Game[]=tag_app_749520'.replace('749520', extractedNumber[i]);
            GM_xmlhttpRequest({
                method: "GET",
                url: newURL,
                onload: async function (response) {
                    let data = JSON.parse(response.response);
                    // ��ʼ���ܼۺͿ�������
                    let cardCount = data.total_count;
                    let totalPrice = 0;
                    if (!cardCount) {
                        console.log(extractedNumber[i] + '�޷���ѯ����ͨ���Ƶ���Ϣ�����²�ѯ����Ϸ');
                        setTimeout(processArrayWithDelay, delaytime);
                        return;
                    }
                    let cardList = document.createElement('div');
                    cardList.innerHTML = data.results_html;
                    //��ȡ���п������ӵ�ַ
                    let links = cardList.querySelectorAll('.market_listing_row_link');
                    //��ȡ��һ�ſ������ӵ�ַ
                    let link1 = links[0].href;
                    console.log('ĿǰΪ��' + i + '����Ϸ����һ����ͨ��������:' + link1);
                    let expence = 0, onecardexpence = 0, profitcardcount = 0;
                    if (modenormal) {
                        let elements = cardList.querySelectorAll('.market_table_value.normal_price .normal_price');
                        //������ɱ�
                        expence = boosterCostTemplate[cardCount].gemsCount / 1000 * savedPrice;
                        onecardexpence = expence / 3;
                        elements.forEach(function (priceElement) {
                            // ��ȡ���Ƽ۸��ı�
                            let priceText = priceElement.textContent;
                            // ���۸��ı�ת��Ϊ������
                            let price = parseFloat(priceText.replace(/[^\d.]/g, ""));
                            if (price >= onecardexpence) {
                                profitcardcount++;
                            }
                            // �ۼ��ܼ�
                            totalPrice += price;
                        });
                    } else {
                        //������ɱ�
                        expence = boosterCostTemplate[cardCount].gemsCount / 1000 * 2;
                        onecardexpence = expence / 3;
                        for (const item of links) {
                            let itemid = await getMarketItemNameId(item.href);
                            let price = await getCurrentItemOrdersHistogram(itemid);
                            console.log(extractedNumber[i] + '���Ƽ۸�:' + price);
                            while (!price) {
                                console.log(extractedNumber[i] + '��ѯ�����۸���Ϣ,����Ϊ:' + item.href);
                                price = await getCurrentItemOrdersHistogram(itemid);
                            }
                            if (price >= onecardexpence) {
                                profitcardcount++;
                            }
                            // �ۼ��ܼ�
                            totalPrice += price;
                        }
                    }
                    let profitcardpercent = profitcardcount / cardCount * 100;
                    if (totalPrice == 0) {
                        console.log(extractedNumber[i] + '��ѯ����ͨ���Ƽ۸�Ϊ0�����²�ѯ����Ϸ');
                        setTimeout(processArrayWithDelay, delaytime);
                        return;
                    }
                    // ����˰��ƽ���۸񣬺�˰�󿨰��۸�
                    const averagePrice = totalPrice / cardCount * 0.87;
                    const finalPrice = averagePrice * 3;
                    //��ѯ�������¼۸�
                    newURL = 'https://steamcommunity.com/market/search/render/?start=0&count=100&category_753_cardborder[]=tag_cardborder_1&appid=753&category_753_Game[]=tag_app_749520'.replace('749520', extractedNumber[i]);
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: newURL,
                        onload: async function (response) {
                            let data = JSON.parse(response.response);
                            // ��ʼ���ܼۺͿ�������
                            let totalPrice = 0;
                            if (!cardCount) {
                                console.log(extractedNumber[i] + '�޷���ѯ���������Ƶ���Ϣ�����²�ѯ����Ϸ');
                                setTimeout(processArrayWithDelay, delaytime);
                                return;
                            }
                            let cardList = document.createElement('div');
                            cardList.innerHTML = data.results_html;
                            let elements = cardList.querySelectorAll('.market_table_value.normal_price .normal_price');
                            let withoutcardcount = 0;
                            elements.forEach(function (priceElement) {
                                // ��ȡ���Ƽ۸��ı�
                                let priceText = priceElement.textContent;
                                // ���۸��ı�ת��Ϊ������
                                let price = parseFloat(priceText.replace(/[^\d.]/g, ""));
                                if (price == 0) {
                                    withoutcardcount++;
                                }
                                // �ۼ��ܼ�
                                totalPrice += price;
                            });
                            let hascardcount = elements.length - withoutcardcount;
                            let toaddprice = totalPrice / hascardcount * 2 * withoutcardcount;
                            totalPrice += toaddprice;
                            if (totalPrice == 0) {
                                console.log(extractedNumber[i] + '��ѯ���������Ƽ۸�Ϊ0�����²�ѯ����Ϸ');
                                setTimeout(processArrayWithDelay, delaytime);
                                return;
                            }
                            console.log(extractedNumber[i] + '��ѯ���������۸�' + totalPrice);
                            //���������۸���δȷ����ֱ�ӽ����������۸�����Ϊ999999�������ֶ���Ӹ���Ϸ���������ļ۸�
                            if (idealprice[extractedNumber[i]] == undefined) idealprice[extractedNumber[i]] = 999999;
                            //������������۸�<=��ѯ���������۸�ѡ�����������۸�
                            if (idealprice[extractedNumber[i]] <= totalPrice) {
                                totalPrice = idealprice[extractedNumber[i]];
                            }
                            console.log(extractedNumber[i] + '���������۸�' + idealprice[extractedNumber[i]]);
                            if (!alwaysCraftBoosterPacks[extractedNumber[i]] && (totalPrice < 100 && profitcardpercent < 35)) {
                                console.log('��ͨ����ӯ�������ٷֱ�:' + profitcardpercent);
                                if (document.getElementById(buttonId2) != null) {
                                    console.log(extractedNumber[i] + 'app����״̬�������ܼ�С��100����ͨ����ӯ�������ٷֱ�С��35%����Ϊ�ղ�״̬');
                                    let button = document.getElementById(buttonId8);
                                    button.click();
                                } else if (document.getElementById(buttonId3) != null) {
                                    console.log(extractedNumber[i] + 'app�ղ�״̬�������ܼ�С��100����ͨ����ӯ�������ٷֱ�С��35%������仯');
                                } else if (document.getElementById(buttonId5) != null) {
                                    console.log(extractedNumber[i] + 'appȫ��״̬�������ܼ�С��100����ͨ����ӯ�������ٷֱ�С��35%����Ϊ�ղ�״̬');
                                    let button = document.getElementById(buttonId4);
                                    button.click();
                                } else if (document.getElementById(buttonId6) != null) {
                                    console.log(extractedNumber[i] + 'app����״̬�������ܼ�С��100����ͨ����ӯ�������ٷֱ�С��35%������仯');
                                }
                                i++;
                                setTimeout(processArrayWithDelay, delaytime);
                                return;
                            }
                            //�������󣬰�ÿ��ʮ����������������75�۳�������Ȼ��۳�����˰13%
                            let profit = finalPrice - expence + (totalPrice / cardCount * 0.65) / 40;
                            if (profit >= 6) {
                                profit = 6;
                            }
                            console.log(extractedNumber[i] + '��ӯ��:' + profit);
                            if (isNaN(profit)) {
                                console.log('��' + i + '�β�ѯ����Ϸ' + extractedNumber[i] + '��ӯ��ΪNaN�����²�ѯ����Ϸ');
                                setTimeout(processArrayWithDelay, delaytime);
                                return;
                            }
                            //��+outToBoosterȫ���Ƶ�����
                            //��+boosterToOut�����Ƶ�ȫ��
                            //��+collectToOut�ղ��Ƶ�ȫ��
                            //��+outToCollectȫ���Ƶ��ղ�
                            //��+outToBlackȫ���Ƶ�����
                            //��+blackToOut�����Ƶ�ȫ��
                            //��+collectToBooster�ղ��Ƶ�����
                            //��+boosterToCollect�����Ƶ��ղ�
                            //��ӯ��С��0.1����Ϊ�ղ�״̬���ղ�״̬������״̬����仯
                            if (!alwaysCraftBoosterPacks[extractedNumber[i]] && profit < 0.1) {
                                if (document.getElementById(buttonId2) != null) {
                                    console.log(extractedNumber[i] + 'app����״̬����ӯ��С��0.1����Ϊ�ղ�״̬');
                                    let button = document.getElementById(buttonId8);
                                    button.click();
                                } else if (document.getElementById(buttonId3) != null) {
                                    console.log(extractedNumber[i] + 'app�ղ�״̬����ӯ��С��0.1������仯');
                                } else if (document.getElementById(buttonId5) != null) {
                                    console.log(extractedNumber[i] + 'appȫ��״̬����ӯ��С��0.1����Ϊ�ղ�״̬');
                                    let button = document.getElementById(buttonId4);
                                    button.click();
                                } else if (document.getElementById(buttonId6) != null) {
                                    console.log(extractedNumber[i] + 'app����״̬����ӯ��С��0.1������仯');
                                }
                                i++;
                                setTimeout(processArrayWithDelay, delaytime);
                            } else {
                                //��ѯ����Ϸ��һ����ͨ���ƽ�һ�����ڵ�����
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
                                            console.log(extractedNumber[i] + '�޷���ȡ��һ����ͨ���Ƶ���Ϣ�����²�ѯ����Ϸ');
                                            setTimeout(processArrayWithDelay, delaytime);
                                            return;
                                        }
                                        if (!data.prices) {
                                            console.log(extractedNumber[i] + '�޷���ȡ����һ����ͨ���ƵĽ��׼�¼�����²�ѯ����Ϸ');
                                            setTimeout(processArrayWithDelay, delaytime);
                                            return;
                                        }
                                        let prices = data.prices;
                                        let currentDate = new Date();
                                        let totalSales = 0;
                                        //�ۼӽ�30���������Ŀ�������
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
                                        console.log(extractedNumber[i] + '������Ϊ' + totalSales);
                                        //��+outToBoosterȫ���Ƶ�����
                                        //��+boosterToOut�����Ƶ�ȫ��
                                        //��+collectToOut�ղ��Ƶ�ȫ��
                                        //��+outToCollectȫ���Ƶ��ղ�
                                        //��+outToBlackȫ���Ƶ�����
                                        //��+blackToOut�����Ƶ�ȫ��
                                        //��+collectToBooster�ղ��Ƶ�����
                                        //��+boosterToCollect�����Ƶ��ղ�
                                        if (alwaysCraftBoosterPacks[extractedNumber[i]] || ((totalSales >= 30 && totalSales < 60 && profit >= 0.8) || (totalSales >= 60 && totalSales < 100 && profit >= 0.4) || (totalSales >= 100 && totalSales < 400 && profit >= 0.2) || (totalSales >= 400 && profit >= 0.1))) {
                                            if (document.getElementById(buttonId2) != null) {
                                                console.log(extractedNumber[i] + 'app����״̬����ӯ�����ڵ���0.1������������Ҫ������仯��������' + totalSales);
                                            } else if (document.getElementById(buttonId3) != null) {
                                                console.log(extractedNumber[i] + 'app�ղ�״̬����ӯ�����ڵ���0.1������������Ҫ�󣬱�Ϊ����״̬��������' + totalSales);
                                                let button = document.getElementById(buttonId7);
                                                button.click();
                                            } else if (document.getElementById(buttonId5) != null) {
                                                console.log(extractedNumber[i] + 'appȫ��״̬����ӯ�����ڵ���0.1������������Ҫ�󣬱�Ϊ����״̬��������' + totalSales);
                                                let button = document.getElementById(buttonId1);
                                                button.click();
                                            } else if (document.getElementById(buttonId6) != null) {
                                                console.log(extractedNumber[i] + 'app����״̬����ӯ�����ڵ���0.1������������Ҫ���ȱ�Ϊȫ��״̬���ӳ�500ms�ٱ�Ϊ����״̬��������' + totalSales);
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
                                                let mes = extractedNumber[i] + ',��ӯ��Ϊ' + profit.toFixed(2) + ',������Ϸ����' + totalgame + ',�Ͽ������豦ʯ' + boosterCostTemplate[cardCount].gemsCount + ',������Ϊ' + totalSales;
                                                allmes.push(mes);
                                                checkedgame[extractedNumber[i]] = true;
                                            }
                                            // console.log('����ӯ��Ϊ'+totalprofit.toFixed(2)+',������Ϸ����'+totalgame+',�Ͽ������豦ʯ'+totalgem);
                                            displayElement4.textContent = '����ӯ��Ϊ' + totalprofit.toFixed(2) + ',������Ϸ����' + totalgame + ',�Ͽ������豦ʯ' + totalgem;
                                        } else {
                                            if (document.getElementById(buttonId2) != null) {
                                                console.log(extractedNumber[i] + 'app����״̬����������к�������������ӯ��:' + profit + '��������:' + totalSales + '����Ϊ�ղ�״̬');
                                                let button = document.getElementById(buttonId8);
                                                button.click();
                                            } else if (document.getElementById(buttonId3) != null) {
                                                console.log(extractedNumber[i] + 'app�ղ�״̬����������к�������������ӯ��:' + profit + '��������:' + totalSales + '������仯');
                                            } else if (document.getElementById(buttonId5) != null) {
                                                console.log(extractedNumber[i] + 'appȫ��״̬����������к�������������ӯ��:' + profit + '��������:' + totalSales + '����Ϊ�ղ�״̬');
                                                let button = document.getElementById(buttonId4);
                                                button.click();
                                            } else if (document.getElementById(buttonId6) != null) {
                                                console.log(extractedNumber[i] + 'app����״̬����������к�������������ӯ��:' + profit + '��������:' + totalSales + '������仯');
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
