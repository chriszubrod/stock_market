SELECT TOP(10) id, ticker_symbol, ([close] * volume) AS market_cap
FROM historical_prices
WHERE [date] = (
	SELECT MAX([date])
	FROM historical_prices
)
ORDER BY ([close] * volume) DESC;

SELECT [name], industry, sector, exchange, website, [description], ceo, [address], [state], city, zip
FROM company
WHERE ticker_symbol = 'AAPL';

SELECT *
FROM
	(
		SELECT TOP (100) [date], [open], [high], [low], [close], [volume]
        FROM historical_prices
        WHERE ticker_symbol = 'AAPL'
        ORDER BY [date] DESC
    ) AS t
ORDER BY [date] ASC;

SELECT *
FROM
	(
		SELECT TOP (4) fiscal_end_date, actual_eps, consensus_eps
        FROM earnings
        WHERE ticker_symbol = 'AAPL'
        ORDER BY fiscal_end_date DESC
    ) AS t
ORDER BY fiscal_end_date ASC;
