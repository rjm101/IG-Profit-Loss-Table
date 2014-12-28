/**
 * Profit Loss data table.
 * init function expects a API url to call.
 */
(function(IG){
	"use strict";

	IG.ProfitLoss = IG.ProfitLoss || {

		data: null,

		/* 
		 * Setup
		 * @param {string} url API url to call
		 * @param {Object} test_callbacks Jasmine test callbacks on states
		 */
		init: function(url, test_callbacks){

			this.$el = document.getElementById('profit-loss');

			this.retrieveData(url, test_callbacks);
		},

		/*
		 * Retrieve profit loss data using AJAX
		 * @param {string} url API data url
		 * @param {Object} test_callbacks Jasmine test callbacks on states
		 */ 
		retrieveData: function retrieveData(url, test_callbacks) {

			if (!url) return;

			var xmlHttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
				self = this;

			xmlHttp.url = url;
			xmlHttp.method = "GET";
			xmlHttp.onreadystatechange = ProcessRequest;
			xmlHttp.open(xmlHttp.method, xmlHttp.url, true);
			xmlHttp.send(null);

			function ProcessRequest() {

				if (xmlHttp.readyState !== 4 || xmlHttp.status !== 200) return;

				if (test_callbacks) test_callbacks.onSuccess();

				self.data = JSON.parse(xmlHttp.responseText);

				self.generateRows();

			}

			return xmlHttp;
		},

		// Generate rows of data corresponding to stocks purchased
		generateRows: function generateRows(){

			if (!this.data && this.data.picks && this.$el) return;

			var $tbody = document.getElementsByClassName('profit-loss--body', 'tbody', this.$el)[0],
				total = 0,
				self = this;

			// Hide preloader
			$tbody.parentNode.className += ' profit-loss--loaded';

			// Add rows
			this.data.picks.forEach(function(stock_pick, index){

				var ticker_profit_loss = self.calcProfitLoss(stock_pick.open_level, stock_pick.level, stock_pick.qty);

				var columns = [
					{title: stock_pick.name, content: stock_pick.ticker},
					{title: self.findMarket(stock_pick.exchange), content: stock_pick.ticker},
					{content: self.data.account.currency + self.calcBookCost(stock_pick.open_level, stock_pick.qty)},
					{content: stock_pick.open_level},
					{content: stock_pick.level},
					{content: stock_pick.qty},
					{content: self.data.account.currency + ticker_profit_loss}
				];

				self.appendStockRow($tbody, index, columns);

				// Add profit loss to total
				total = self.calcTotalProfitLoss(total, ticker_profit_loss);

			});

			this.showTotal(total);
		},

		/*
		 * Add cells and append row to stock table
		 * @param {Object} $tbody to append to
		 * @param {Int} index row
		 * @param {Array} columns for indvidual cell contents
		 */
		appendStockRow: function appendRow($tbody, index, columns){

			var $table_row = $tbody.insertRow();

			// Odd row class
			if(index % 2 === 0) $table_row.className = 'odd';

			$table_row.className += ' profit-loss--stock_row';

			// Append cell (innerHTML not supported in <= IE9)
			columns.forEach(function(cell){

				var $tcell = $table_row.insertCell();
				
				if(cell.title) $tcell.title = cell.title;
				
				$tcell.innerHTML = cell.content;

				$table_row.appendChild($tcell);

			});

		},

		/*
		 * Retrieve market name by supplying market ID
		 * @param {string} marketId e.g. NYSE
		 */ 
		findMarket: function findMarket(marketId){

			if(!this.data.markets) return '';

			return this.data.markets.reduce(function(map, market){

				if(marketId === market.id){

					map = market.name;
				}

				return map;

			}, '');
		},

		/*
		 * Calculate cost of original share price purchase
		 * @param {int} open_level market price of stock when purchased
		 * @param {int} qty number of shares purchased
		 */
		calcBookCost: function calcBookCost(open_level, qty){
			
			return open_level * qty;
		},

		/*
		 * Current profit loss on stock
		 * @param {int} open_level market price of stock when purchased
		 * @param {int} level market price
		 * @param {int} qty number of shares purchased
		 */
		calcProfitLoss: function calcProfitLoss(open_level, level, qty){

			return (level - open_level) * qty;
		},

		/*
		 * Add profit / loss on stock to total profit / loss
		 * @param {int} total current profit / loss
		 * @param {int} ticker_profit_loss
		 */
		calcTotalProfitLoss: function calculateProfitLoss(total, ticker_profit_loss){

			return total + ticker_profit_loss;
		},

		// Add total to html
		showTotal: function generateTotal(total){

			document.getElementsByClassName('profit-loss--total', 'span', this.$el)[0]
				.innerHTML = this.data.account.currency + total;	
		}
		
	};

}(window.IG));