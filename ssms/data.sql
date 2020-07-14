SELECT TOP(10) historical_prices.ticker_symbol, (historical_prices.[close] * historical_prices.volume) AS market_cap
FROM historical_prices
WHERE historical_prices.[date] = (
	SELECT MAX(historical_prices.[date])
	FROM historical_prices)
ORDER BY (historical_prices.[close] * historical_prices.volume) DESC;

SELECT [name], website, sector, industry, [description]
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