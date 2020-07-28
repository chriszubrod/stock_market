let xhttp = new XMLHttpRequest();
let company_data = {};
let historical_price_data = {};
let earnings_data = {};
let quote_data = {};
let news_data = {};
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
    xhttp.open("GET", "/live/quote/" + ticker, false);
    xhttp.send();
}

function get_news_data(ticker) {
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            news_data = response;
        };
    };
    xhttp.open("GET", "/live/news/" + ticker, false);
    xhttp.send();
}

// Ticker <a> element onClick, update company, earnings, historical price and quote
async function update(ticker) {

    get_company_data(ticker);
    get_historical_price_data(ticker);
    get_earnings_data(ticker);
    get_quote_data(ticker);
    get_news_data(ticker);

    // About Section
    document.getElementById("company-sector-span").innerText = company_data['sector'];
    document.getElementById("company-industry-span").innerText = company_data['industry'];
    document.getElementById("company-name-h1").innerText = company_data['name'];
    document.getElementById("company-price-h1").innerText = '$' + quote_data['latestPrice'].toFixed(2);
    document.getElementById("company-variance-span").innerText = '$' + quote_data['change'].toFixed(2);
    document.getElementById("company-percentage-span").innerText = (quote_data['changePercent'] * 100).toFixed(2) + '%';
    document.getElementById("co-tic-span").innerText = ticker;
    document.getElementById("co-ask-span").innerText = quote_data['iexAskSize'] + ' @ ' + '$' + quote_data['iexAskPrice'].toFixed(2);
    document.getElementById("co-bid-span").innerText = quote_data['iexBidSize'] + ' @ ' + '$' + quote_data['iexBidPrice'].toFixed(2);

    // Historical Prices Section
    // let keys = Object.keys(historical_price_data);
    let prices = historical_price_data[ticker];
    let dates = [];
    let price = [];
    for (p in prices) {
        dates.push(prices[p]['date']);
        price.push(prices[p]['close']);
    }

    var c = '';
    if (price[0] > price[price.length - 1]) {
        c = 'rgb(255, 80, 0)'
    } else {
        c = '#56C271'
    };

    var trace = {
        line: {
            color: c
        },
        hovertemplate: '$%{y:.2f}<br>%{x}',
        mode: "lines",
        name: 'Close',
        type: "scatter",
        x: dates,
        y: price
    };

    var data = [trace];

    var layout = {
        autosize: true,
        height: 200,
        margin: {
            l: 45,
            r: 5,
            b: 0,
            t: 5,
            pad: 0
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
            showgrid: false,
            showline: false,
            zeroline: false,
            showticklabels: false,
            rangeslider: {
                range: [dates[0], dates[dates.length - 1]]
            }
        },
        yaxis: {
            showgrid: false,
            showline: false,
            zeroline: false,
            showticklabels: true,
            tickfont: {
                family: 'Montserrat, sans-serif',
                size: 13,
                color: 'rgb(32, 42, 53)'
            },
            tickformat: '$',
            zeroline: false,
        }
    };

    var options = {
        displayModeBar: false,
        responsive: true
    }

    Plotly.newPlot('historical-plot-div', data, layout, options);

    // About Section
    document.getElementById("description-p").innerText = company_data['description'];
    document.getElementById("ceo-span").innerText = company_data['ceo'];
    document.getElementById("website-a").innerText = company_data['website'];
    document.getElementById("website-a").setAttribute('href', company_data['website']);
    document.getElementById("exchange-span").innerText = company_data['exchange'];
    document.getElementById("address-span").innerText = company_data['address'];
    document.getElementById("city-span").innerText = company_data['city'];
    document.getElementById("state-span").innerText = company_data['state'];
    document.getElementById("zip-span").innerText = company_data['zip'];

    // News Section
    let d = new Date(news_data['datetime']);
    document.getElementById("source-date").innerText = d.toLocaleDateString('en-US');
    document.getElementById("source").innerText = news_data['source'];
    document.getElementById("news-headline-a").innerText = news_data['headline'];
    document.getElementById("news-headline-a").setAttribute('href', news_data['url']);
    document.getElementById("news-summary-p").innerText = news_data['summary'];
    document.getElementById("news-img").setAttribute('src', news_data['image']);

    // Earnings Section
    let earnings = earnings_data[ticker];
    let edates = [];
    let eactual = [];
    let econsensus = [];
    for (e in earnings) {
        edates.push(earnings[e]['fiscal_end_date']);
        eactual.push(earnings[e]['actual_eps']);
        econsensus.push(earnings[e]['consensus_eps']);
    }

    var atrace = {
        line: {
            color: '#56C271'
        },
        mode: "markers",
        name: 'Act',
        type: "scatter",
        x: edates,
        y: eactual,
    };

    var ctrace = {
        line: {
            color: 'rgb(255, 80, 0)'
        },
        mode: "markers",
        name: 'Cons',
        type: "scatter",
        x: edates,
        y: econsensus,
    };

    var edata = [atrace, ctrace];

    var elayout = {
        autosize: true,
        height: 200,
        margin: {
            l: 30,
            r: 5,
            b: 5,
            t: 0,
            pad: 0
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        showLegend: false,
        xaxis: {
            showgrid: false,
            showline: false,
            showticklabels: true,
            tickfont: {
                family: 'Montserrat, sans-serif',
                size: 13,
                color: 'rgb(32, 42, 53)'
            },
            zeroline: false
        },
        yaxis: {
            showgrid: false,
            showline: false,
            showticklabels: true,
            tickfont: {
                family: 'Montserrat, sans-serif',
                size: 13,
                color: 'rgb(32, 42, 53)'
            },
            tickformat: '$',
            zeroline: false,
        }
    };

    var eoptions = {
        displayModeBar: false,
        responsive: true
    }

    Plotly.newPlot('earnings-plot-div', edata, elayout, eoptions);

}
