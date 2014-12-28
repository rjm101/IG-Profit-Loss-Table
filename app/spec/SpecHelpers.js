// Global IG object
window.IG = {};

// Mock AJAX responses + dependancies
var TestResponses = {
	profitLossData: {
		success: {
			status: 200,
			responseText: '{"account": {"currency": "£"}, "markets": [{"id": "NYSE", "name": "New York Stock Exchange"}, {"id": "NASDAQ", "name": "National Association of Securities Dealers Automated Quotations"}, {"id": "LSE", "name": "London Stock Exchange"}], "picks": [{"ticker": "SSYS", "name": "Stratsys", "exchange": "NASDAQ", "qty": 5, "open_level": 180, "level": 220}, {"ticker": "BARC", "name": "Barclays", "exchange": "LSE", "qty": 40, "open_level": 18.75, "level": 22.50}, {"ticker": "LLOY", "name": "Lloyds Banking Group", "exchange": "LSE", "qty": 10, "open_level": 90, "level": 150}, {"ticker": "RMG", "name": "Royal Mail", "exchange": "LSE", "qty": 6, "open_level": 125, "level": 75}]}'
		},
		template: '<table id="profit-loss">' +
			'<thead>' +
				'<tr>' +
					'<td>Ticker</td>' +
					'<td>Exchange</td>' +
					'<td>Book Cost</td>' +
					'<td>Open Level</td>' +
					'<td>Level</td>' +
					'<td>Qty</td>' +
					'<td>Profit / Loss</td>' +
				'</tr>' +
			'</thead>' +
			'<tbody class="profit-loss--body">' +
				'<tr class="profit-loss--spinner">' +
					'<td colspan="7"><img src="img/spinner.gif" /></td>' +
				'</tr>' +
			'</tbody>' +
			'<tfoot>' +
				'<tr>' +
					'<td colspan="7"><b>Total profit / loss:</b> <span class="profit-loss--total"></span></td>' +
				'</tr>' +
			'</tfoot>' +
		'</table>'
	}
};