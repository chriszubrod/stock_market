from flask import (Flask,
                   render_template,
                   redirect,
                   url_for)

import json
import pyodbc
import requests

# Create public variable for secrets.
SECRETS_JSON = json.loads(open('./static/secrets.json', 'r').read())

# Create instance of Flask class, and use name of running application.
app = Flask(__name__)

# Set secret_key variable.
app.secret_key = "1!2@3#4$"


def open_db_connection():
    '''Return conn pyodcb connection object.

    Args:
        None

    Returns:
        'conn' pyodbc connection object.
    '''
    conn = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};' +
        'SERVER=tcp:bchristopher.database.windows.net,1433;' +
        'DATABASE=trading;' +
        'UID=' + SECRETS_JSON['db']['Uid'] + ';' +
        'PWD=' + SECRETS_JSON['db']['Pwd'] + ';' +
        'Encrypt=yes;' +
        'Connection Timeout=30;'
    )
    return conn


# App route for main uri.
@app.route('/')
def show_dashboard():
    '''Return dashboard.html template.

    Args:
        None

    Returns:
        'dashboard.html' template.
    '''
    return render_template('dashboard.html')


# App route for tickers uri.
@app.route('/tickers', methods=['GET'])
def get_tickers():
    '''Query database and return dictionary of ticker symbols.

    Args:
        None

    Returns:
        tickers - dictionary of ticker symbols.
    '''
    # Create connection variable.
    with open_db_connection() as conn:

        # Try to execute query, format data in dictionary and return to client.
        try:

            # Create cursor variable.
            cursor = conn.cursor()

            # Execute sql query with cursor variable.
            # This query returns top ten tickers based on market cap value.
            cursor.execute(
                '''
                SELECT TOP(10) id, ticker_symbol,
                               ([close] * volume) AS market_cap
                FROM historical_prices
                WHERE [date] = (
                    SELECT MAX([date])
                    FROM historical_prices
                )
                ORDER BY ([close] * volume) DESC;
                '''
            )

            # Create dictionary variable.
            ticker_dict = {}

            # Loop through ticker list, and append to ticker_dict.
            for row in cursor:
                ticker_dict[row[0]] = row[1]

            # Return ticker_dict to client.
            return ticker_dict

        except Exception as e:

            # Print Exception
            print(e)


# App route for company uri.
@app.route('/company/<string:ticker>', methods=['GET'])
def get_company(ticker):
    '''Query database for company data and return dictionary result.

    Args:
        ticker - string symbol for ticker.

    Returns:
        company - dictionary of company data for ticker.
    '''
    # Create connection variable.
    with open_db_connection() as conn:

        # Try to execute query, format data in dictionary and return to client.
        try:

            # Create cursor variable.
            cursor = conn.cursor()

            # Execute sql query with cursor variable.
            # This query returns company data.
            cursor.execute(
                '''
                SELECT [name], website, sector, industry, [description]
                FROM company
                WHERE ticker_symbol = '{}';
                '''.format(ticker)
            )

            # Create dictionary variable.
            company_dict = {}

            # Loop through company data list, and append to company_dict.
            for row in cursor:
                company_dict['name'] = row[0]
                company_dict['website'] = row[1]
                company_dict['sector'] = row[2]
                company_dict['industry'] = row[3]
                company_dict['description'] = row[4]

            # Return company_dict to client.
            return company_dict

        except Exception as e:

            # Print Exception
            print(e)


# App route for historical prices uri.
@app.route('/historical/<string:ticker>', methods=['GET'])
def get_historical_prices(ticker):
    '''Query database for historical price data and return dictionary result.

    Args:
        ticker - string symbol for ticker.

    Returns:
        historical - dictionary of historical price data for ticker.
    '''
    # Create connection variable.
    with open_db_connection() as conn:

        # Try to execute query, format data in dictionary and return to client.
        try:

            # Create cursor variable.
            cursor = conn.cursor()

            # Execute sql query with cursor variable.
            # This query returns company data.
            cursor.execute(
                '''
                SELECT *
                FROM
                (
                    SELECT TOP (100) [date], [open], [high], [low], [close], [volume]
                    FROM historical_prices
                    WHERE ticker_symbol = '{}'
                    ORDER BY [date] DESC
                ) AS t
                ORDER BY [date] ASC;
                '''.format(ticker)
            )

            # Create dictionary variable.
            historical_dict = {}

            # Create list variable.
            historical_list = []

            # Loop through company data list, and append to historical_list.
            for row in cursor:
                historical_list.append(
                    {
                        'date': row[0],
                        'open': str(row[1]),
                        'high': str(row[2]),
                        'low': str(row[3]),
                        'close': str(row[4]),
                        'volume': row[5]
                    }
                )

            # Add to list historical_dict.
            historical_dict[ticker] = historical_list

            # Return company_dict to client.
            return historical_dict

        except Exception as e:

            # Print Exception
            print(e)


# Used only for local development.
if __name__ == '__main__':
    app.run(debug=True)
