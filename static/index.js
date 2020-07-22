let xhttp = new XMLHttpRequest();
let company_data = {};
let historical_price_data = {};
let earnings_data = {};
let quote_data = {};
var v;

document.addEventListener("DOMContentLoaded", function() {
    update("AAPL");
});

// After page load, get top 10 tickers by Market Capitalization
document.addEventListener("DOMContentLoaded", function() {
    let frag = new DocumentFragment();
    let tdiv = document.getElementById('selector-div');
    tdiv.innerHTML = '';

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            for (r in response) {
                let d = document.createElement('div');
                d.setAttribute('id', 'tickers-div');

                let a = document.createElement('button');
                a.setAttribute('id', response[r]);
                a.setAttribute('class', 'tickers-button');
                a.setAttribute('onClick', 'javascript:update(this.id)');
                a.innerText = response[r];

                d.appendChild(a);

                frag.appendChild(d);
            };
        tdiv.appendChild(frag);
        };
    };
    xhttp.open("GET", "/tickers");
    xhttp.send();
});



function get_company_data(ticker) {
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            company_data = response;
        };
    };
    xhttp.open("GET", "/company/" + ticker, false);
    xhttp.send();
}

function get_historical_price_data(ticker) {
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            historical_price_data = response;
        };
    };
    xhttp.open("GET", "/historical/" + ticker, false);
    xhttp.send();
}

function get_earnings_data(ticker) {
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            earnings_data = response;
        };
    };
    xhttp.open("GET", "/earnings/" + ticker, false);
    xhttp.send();
}

function get_quote_data(ticker) {
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            quote_data = response;
        };
    };
    xhttp.open("GET", "/live/" + ticker, false);
    xhttp.send();
}

// Ticker <a> element onClick, update company, earnings, historical price and quote
async function update(ticker) {

    get_company_data(ticker);
    get_historical_price_data(ticker);
    get_earnings_data(ticker);
    get_quote_data(ticker);

    document.getElementById("company-sector-span").innerText = company_data['sector'];
    document.getElementById("company-industry-span").innerText = company_data['industry'];
    document.getElementById("company-name-h1").innerText = company_data['name'];
    document.getElementById("company-price-h1").innerText = '$' + quote_data['latestPrice'].toFixed(2);
    document.getElementById("company-variance-span").innerText = '$' + quote_data['change'].toFixed(2);
    document.getElementById("company-percentage-span").innerText = (quote_data['changePercent'] * 100).toFixed(2) + '%';
    document.getElementById("co-tic-span").innerText = ticker;
    document.getElementById("co-ask-span").innerText = quote_data['iexAskSize'] + ' @ ' + '$' + quote_data['iexAskPrice'].toFixed(2);
    document.getElementById("co-bid-span").innerText = quote_data['iexBidSize'] + ' @ ' + '$' + quote_data['iexBidPrice'].toFixed(2);

    let keys = Object.keys(historical_price_data);
    let prices = historical_price_data[keys[0]];
    let dates = [];
    let price = [];
    for (p in prices) {
        dates.push(prices[p]['date']);
        price.push(prices[p]['close']);
    }

    var trace = {
        line: {
            color: 'rgb(32, 42, 53)'
        },
        hovertemplate: '$%{y:.2f}<br>%{x}',
        mode: "lines",
        name: 'close',
        showLegend: "false",
        type: "scatter",
        x: dates,
        y: price,
        
    };

    var data = [trace];

    var layout = {
        autosize: true,
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 0
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)', //'#f7f8fb'
        xaxis: {
            showgrid: false,
            showline: false,
            zeroline: false
        },
        yaxis: {
            showgrid: false,
            showline: false,
            zeroline: false
        }
    };

    var options = {
        displayModeBar: false
    }

    Plotly.newPlot('historical-plot-div', data, layout, options);

}
