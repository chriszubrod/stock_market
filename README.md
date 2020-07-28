# stock_market

Portfolio project for a fictional financial services company.

The purpose of this project is to display skills relating to full stack web development. The backend of this project is managed by a python Flask framework handling uri routing and data retrieval. Data is stored within a SQL Server database hosted by Microsoft Azure. Data is sent to the client using json formatting, and connections established with the odbc driver for python (pyodbc).

This site will display the top ten most valuable companies by market capitalization. When clicking on each, you will be shown current market details sourced from The Investors Exchange (IEX) by connecting to their different APIs hosted by IEX Cloud. Market details include Company Information, Historical Pricing, News postings and Historical Earnings.

The required frameworks are below.

1. flask==1.1.2
2. jsonschema==3.2.0
3. pyodbc==4.0.30
4. requests==2.23.0

Please feel free to provide any comments or feedback.

Thanks,

Chris
