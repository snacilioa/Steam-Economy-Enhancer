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


    }
    let idealprice = {
        //����û�е���Ϸ
        "348540": 130,
        "458420": 99,
        "916060": 1700,
        "997070": 99,
        "429060": 99,
        "399090": 99,
        "1179080": 120,
        "1567440": 130,
        "1469910":300,
        "347730": 99,
        "889700": 400,
        "359050": 50,
        "499420": 10,
        "575680": 10,
        "542550": 20,
        "591420": 99,
        "562220": 99,
        "508900": 99,
        "1238840":10,
        "232770": 400,
        "814540": 550,
        "707300": 450,
        "586340": 40,
        "518650": 20,
        "2275150": 450,
        "257350": 350,
        "553210": 360,
        "449940": 10,
        "603150": 10,
        "1213700": 170,
        "1478160": 250,
        "605210": 10,
        "310360": 270,
        "1694960": 300,
        "1536980": 1200,
        "1218900": 40,
        "602930": 170,
        "378850": 10,
        "1960590": 200,
        "1639610": 310,
        "269630": 370,
        "2242710": 900,
        "284850": 110,
        "926990": 350,
        "431180": 230,
        "414060": 150,
        "1205960": 60,
        "1186460": 500,
        "2458530": 900,
        "790060": 320,
        "610080": 110,
        "359600": 500,
        "658560":10,
        "1966070": 1400,
        "414660": 180,
        "2262610": 250,
        "1468260": 440,
        "1603640": 200,
        "1569200": 400,
        "1608230": 320,
        "604330": 223,
        "1407420": 350,
        "367140": 240,
        "619390": 1000,
        "399120": 1000,
        "654260": 650,
        "1238730": 738,
        "981770": 150,
        "312370": 200,
        "695330": 400,
        "639490": 230,
        "1607280": 170,
        "481110": 250,
        "270190": 150,
        "400360": 43,
        "715650": 364,
        "1899060": 600,
        "1524650": 230,
        "773670": 150,
        "1528130": 142,
        "526490": 380,
        "312280": 450,
        "207230": 440,
        "227800": 1351,
        "244410": 49,
        "252370": 213,
        "286320": 15,
        "320760": 153,
        "331480": 42,
        "348450": 55,
        "349320": 182,
        "353330": 579,
        "365420": 3,
        "375020": 2,
        "377680": 27.3,
        "384490": 193,
        "407340": 62,
        "429720": 81,
        "435360": 162,
        "441870": 54,
        "455120": 23,
        "474980": 164,
        "491620": 25,
        "494470": 1616,
        "509930": 2,
        "515040": 387,
        "526740": 92,
        "544610": 38,
        "552160": 100,
        "589320": 119,
        "602700": 153,
        "655100": 30,
        "755890": 36,
        "1141550": 219,
        "1334700": 70,
        "1383740": 200,
        "1451160": 290,
        "1733060": 92,
        "1986840": 351,
        "730": 8,
        "426690": 350,
        "361970": 5,
        "614900": 6,
        "1212830": 126,
        "602910": 12,
        "389700": 28,
        "2089350": 500,
        "1808780": 130,
        "629960": 120,
        "555570": 45,
        "1414250": 1200,
        "363330": 45,
        "1238680": 93,
        "595640": 8,
        "208600": 69,
        "461520": 25,
        "545040": 200,
        "417110": 242,
        "1871310": 157,
        "206610": 131,
        "1972710": 150,
        "604780": 14,
        "452440": 378,
        "595500": 1000,
        "867490": 1100,
        "1148760": 440,
        "349140": 148,
        "658620": 500,
        "1379870": 660,
        "415420": 103,
        "270010": 13,
        "441380": 404,
        "273500": 2,
        "1933660": 800,
        "2081400": 600,
        "1451940": 97,
        "533300": 18,
        "933860": 232,
        "631830": 18,
        "325120": 150,
        "966630": 151,
        "1098340": 58,
        "617670": 6,
        "601220": 31,
        "400740": 7,
        "841350": 64,
        "610360": 16,
        "658550": 75,
        "566160": 12,
        "575640": 17,
        "1148510": 42,
        "333930": 235,
        "2016370": 346,
        "813700": 426,
        "595120": 107,
        "369000": 1,
        "733740": 322,
        "763770": 55,
        "1162070": 80,
        "299660": 41,
        "496550": 3,
        "225600": 118,
        "1343400": 121,
        "611980": 19,
        "866510": 21,
        "482920": 42,
        "517330": 52,
        "314000": 60,
        "1944240": 85,
        "390720": 160,
        "475490": 211,
        "1817000": 50,
        "591960": 148,
        "893030": 113,
        "215100": 580,
        "603750": 19,
        "2206150": 300,
        "457590": 180,
        "777130": 134,
        "417860": 143,
        "391460": 170,
        "965200": 60,
        "4000": 6,
        "1999360": 72,
        "33680": 770,
        "99900": 178,
        "206440": 72,
        "218410": 110,
        "244430": 288,
        "252610": 12,
        "267490": 678,
        "1859290": 850,
        "282900": 79,
        "284140": 500,
        "292030": 32,
        "298160": 297,
        "303310": 257,
        "304930": 28,
        "307950": 100,
        "315810": 249,
        "324160": 129,
        "326480": 51,
        "327410": 31,
        "375680": 273,
        "329860": 145,
        "330100": 60,
        "335010": 3,
        "337340": 27,
        "340220": 41,
        "359610": 315,
        "359940": 967,
        "363970": 60,
        "370280": 53,
        "372150": 107,
        "374280": 115,
        "374510": 56,
        "381100": 700,
        "381640": 123,
        "383080": 49,
        "384180": 280,
        "391210": 65,
        "391640": 132,
        "393980": 240,
        "397270": 428,
        "400790": 44,
        "400910": 164,
        "407310": 253,
        "409070": 12,
        "411370": 215,
        "412830": 101,
        "420530": 85,
        "421660": 390,
        "424840": 8,
        "431960": 2,
        "433360": 170,
        "434650": 1,
        "438030": 1,
        "438040": 50,
        "444640": 147,
        "447530": 111,
        "460160": 400,
        "472870": 242,
        "476240": 2,
        "487430": 220,
        "489520": 19,
        "489630": 15,
        "496260": 460,
        "503300": 0,
        "504230": 28,
        "508190": 0,
        "511090": 60,
        "514620": 20,
        "531730": 611,
        "544730": 159,
        "545690": 9,
        "548840": 500,
        "552280": 134,
        "554310": 77,
        "554690": 377,
        "560640": 70,
        "562260": 14,
        "562480": 750,
        "575550": 0,
        "577480": 275,
        "577690": 339,
        "578590": 1,
        "589870": 300,
        "594810": 20,
        "599460": 8,
        "599480": 590,
        "600600": 65,
        "608990": 180,
        "617700": 306,
        "621000": 50,
        "623080": 414,
        "635730": 0,
        "638930": 550,
        "644560": 8,
        "646570": 6,
        "695630": 1100,
        "712840": 0,
        "719750": 500,
        "734750": 260,
        "745960": 110,
        "749520": 60,
        "756880": 70,
        "758090": 164,
        "760890": 300,
        "766280": 40,
        "779640": 27,
        "782690": 445,
        "783120": 116,
        "794600": 367,
        "799070": 10,
        "802890": 127,
        "831660": 42,
        "844660": 260,
        "844920": 395,
        "844930": 54,
        "878380": 140,
        "880950": 250,
        "882710": 223,
        "897220": 573,
        "899970": 220,
        "921590": 270,
        "931500": 199,
        "943980": 154,
        "944020": 136,
        "951000": 400,
        "960090": 11,
        "976390": 127,
        "983150": 207,
        "1002560": 89,
        "1007350": 283,
        "1025070": 280,
        "1033420": 140,
        "1044620": 100,
        "1047440": 115,
        "1069230": 77,
        "1071130": 450,
        "1091920": 240,
        "1092400": 350,
        "1094530": 120,
        "1094820": 270,
        "1111460": 56,
        "1126310": 280,
        "1144400": 80,
        "1146630": 123,
        "1161190": 194,
        "1173370": 96,
        "1183260": 108,
        "1202540": 80,
        "1226530": 567,
        "1230140": 125,
        "1250760": 101,
        "1257410": 600,
        "1277930": 313,
        "1277940": 410,
        "1307690": 600,
        "1310990": 340,
        "1343370": 236,
        "1345740": 220,
        "1353300": 50,
        "1377550": 255,
        "1424300": 800,
        "1434480": 136,
        "1481080": 227,
        "1518770": 390,
        "1558510": 430,
        "1567800": 320,
        "1575450": 10,
        "1584090": 63,
        "1605010": 115,
        "1691970": 470,
        "1718570": 132,
        "1725640": 160,
        "1776970": 328,
        "1812060": 380,
        "1829650": 415,
        "1854980": 520,
        "1901370": 220,
        "1944250": 400,
        "1964220": 90,
        "1969080": 66,
        "1996210": 350,
        "2050680": 300,
        "2066360": 500,
        "2070550": 120,
        "2084930": 250,
        "2109640": 440,
        "2156620": 700,
        "2185770": 500,
        "2206340": 387,
        "2209680": 400,
        "2321180": 400,
        "2313250":150,
        "337420":200,
        "2009010":1000,
        "2280520":500,
        "1949000":500,
        "1630650":150,
        "2781370":0,
        "1919040":0,
        "2667970":50,
        "2313240":50,
        "2356500":50,
        "2551170":50,
        "2567190":300,
        "487430":200,
        "481510":350,
        "602930":100,
        "2543050":100,


    };
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
        "1575450":true,
        "997070":true,
        "1469910":true,
        "381640":true,
        "552970":true,


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
        19: {
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
    let checkedgame = {},checkTimes = {},errorGame = [];
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
                console.log('bstopall bot1')
                console.log('bstatus bot1')
                console.log('\'booster bot1 ' + SelectGameToCraftBoosterPacks + '\'');
                console.log(SelectGameToCraftBoosterPacks);
                console.log(errorGame);
                return;
            }

            if (checkTimes[extractedNumber[i]] == undefined) {
                checkTimes[extractedNumber[i]] = 0;
            }
            checkTimes[extractedNumber[i]]++;
            console.log('��' + i + '�β�ѯ����Ϸ' + extractedNumber[i] + '��ѯ����Ϊ'+checkTimes[extractedNumber[i]])
            if (checkTimes[extractedNumber[i]]>30) {
                console.log('��' + i + '�β�ѯ����Ϸ' + extractedNumber[i] + '��ѯ��������30�Σ���ѯ��һ����Ϸ')
                errorGame.push(extractedNumber[i] + '��Ϸ��ѯ�쳣')
                i++;
                setTimeout(processArrayWithDelay, delaytime);
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
                                    price = 30;
                                    //withoutcardcount++;
                                }
                                // �ۼ��ܼ�
                                totalPrice += price;
                            });
                            //let hascardcount = elements.length - withoutcardcount;
                            //let toaddprice = totalPrice / hascardcount * 2 * withoutcardcount;
                            //totalPrice += toaddprice;
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
                                        if (alwaysCraftBoosterPacks[extractedNumber[i]] || ((totalSales >= 40 && totalSales < 60 && profit >= 1) || (totalSales >= 60 && totalSales < 80 && profit >= 0.5) || (totalSales >= 80 && totalSales < 100 && profit >= 0.4)  || (totalSales >= 100 && totalSales < 120 && profit >= 0.3) || (totalSales >= 120 && totalSales < 600 && profit >= 0.2) || (totalSales >= 600 && profit >= 0.1))) {
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
