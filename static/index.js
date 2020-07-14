let xhttp = new XMLHttpRequest();

// After page load, get top 10 tickers by Market Capitalization
document.addEventListener("DOMContentLoaded", function() {
    let frag = new DocumentFragment();
    let tdiv = document.getElementById('tickers-div');
    tdiv.innerHTML = '';

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            for (r in response) {
                let d = document.createElement('div');
                d.setAttribute('class', 'ticker-div');

                let a = document.createElement('a');
                a.setAttribute('id', response[r]);
                a.setAttribute('class', 'ticker-a');
                a.setAttribute('onClick', 'javascript:update(this.id)');
                a.text = response[r];

                d.appendChild(a);

                frag.appendChild(d);
            }
            tdiv.appendChild(frag);
        };
    };
    xhttp.open("GET", "/tickers");
    xhttp.send();
});

function update_company(ticker) {
    let frag = new DocumentFragment();
    let cdiv = document.getElementById('company-div');
    cdiv.innerHTML = '';

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            
            let csdiv = document.createElement('div');
            csdiv.setAttribute('id', 'company-symbol-div');
            let csh2 = document.createElement('h2');
            csh2.setAttribute('id', 'company-symbol-h2');
            csh2.innerText = ticker
            csdiv.appendChild(csh2);
            frag.appendChild(csdiv);
            
            let cndiv = document.createElement('div');
            cndiv.setAttribute('id', 'company-name-div');
            let cnh3 = document.createElement('h3');
            cnh3.setAttribute('id', 'company-name-h3');
            cnh3.innerText = response.name;
            cndiv.appendChild(cnh3);
            frag.appendChild(cndiv);
            
            let cwdiv = document.createElement('div');
            cwdiv.setAttribute('id', 'company-website-div');
            let cwspan = document.createElement('span');
            cwspan.setAttribute('id', 'company-website-span');
            cwspan.innerText = response.website;
            cwdiv.appendChild(cwspan);
            frag.appendChild(cwdiv);
            
            let cddiv = document.createElement('div');
            cddiv.setAttribute('id', 'company-description-div');
            let cdp = document.createElement('p');
            cdp.setAttribute('id', 'company-description-p');
            cdp.innerText = response.description;
            cddiv.appendChild(cdp);
            frag.appendChild(cddiv);
            
            let csediv = document.createElement('div');
            csediv.setAttribute('id', 'company-sector-div');
            let csh4 = document.createElement('h4');
            csh4.setAttribute('id', 'company-sector-h4');
            csh4.innerText = response.sector;
            csediv.appendChild(csh4);
            frag.appendChild(csediv);
            
            let cidiv = document.createElement('div');
            cidiv.setAttribute('id', 'company-industry-div');
            let cih4 = document.createElement('h4');
            cih4.setAttribute('id', 'company-industry-h4');
            cih4.innerText = response.industry;
            cidiv.appendChild(cih4);
            frag.appendChild(cidiv);
            
            cdiv.appendChild(frag);
        };
    };
    xhttp.open("GET", "/company/" + ticker, false);
    xhttp.send();
};

function update_historical_prices(ticker) {
    let frag = new DocumentFragment();
    let hgdiv = document.getElementById('historical-graph-div');
    hgdiv.innerHTML = '';

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            dp = []
            start = 0
            for (r in response) {
                let prices = response[r];
                for (var i = 0; i < prices.length; i++) {
                    let d = prices[i].date;
                    let o = parseFloat(prices[i].open);
                    let h = parseFloat(prices[i].high);
                    let l = parseFloat(prices[i].low);
                    let c = parseFloat(prices[i].close);
                    let v = prices[i].volume;
                    dp.push({ x: new Date(d), y: [o, h, l, c] })
                };
            };

            let chart = new CanvasJS.Chart('historical-graph-div', {
                animationEnabled: true,
                exportEnabled: false,
                axisX: {
                    interval:1,
                    intervalType: "month",
                    xValueFormatString: "MMM"
                },
                axisY: {
                    includeZero:false,
                    prefix: "$"
                },
                data: [{
                    type: "ohlc",
                    yValueFormatString: "$###0.00", 
                    xValueFormatString: "MMM YYYY",
                    dataPoints: dp
                }]
            });
            chart.render();
        };
    };
    xhttp.open("GET", "/historical/" + ticker, false);
    xhttp.send();
}

// Ticker <a> element onClick, update company, earnings, historical price and live price
async function update(ticker) {

    update_company(ticker);
    update_historical_prices(ticker);
    // update_earnings(ticker);
    // update_live_price(ticker);
};