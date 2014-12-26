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

			this.$el = document.getElementsByClassName('profit-loss')[0];

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

			xmlHttp.onreadystatechange = ProcessRequest;
			xmlHttp.open("GET", url, true);
			xmlHttp.send(null);

			function ProcessRequest() {

				if (xmlHttp.readyState !== 4 || xmlHttp.status !== 200) return;

				if(test_callbacks) test_callbacks.onsuccess();

				self.data = JSON.parse(xmlHttp.responseText);

				self.generateRows();

			}
		},

		// Generate rows of data corresponding to stocks purchased
		generateRows: function generateRows(){

			if (!this.data && this.data.picks && this.$el) return;

			var $tableBody = this.$el.getElementsByClassName('profit-loss--body')[0],
				tr = document.createElement('tr'),
				total = 0,
				self = this;

			// Hide preloader
			$tableBody.parentNode.className += ' profit-loss--loaded';

			// Add rows
			this.data.picks.forEach(function(row, index){

				var table_row = tr.cloneNode(true),
					ticker_profit_loss = self.calcProfitLoss(row.open_level, row.level, row.qty);

				// Odd row class
				if(index % 2 === 0) table_row.className = 'odd';

				// Table row for ticker
				table_row.innerHTML = 
					'<td title="'+row.name+'">'+row.ticker+'</td>' +
					'<td title="'+self.findMarket(row.exchange)+'">'+row.exchange+'</td>' +
					'<td>'+self.data.account.currency + self.calcBookCost(row.open_level, row.qty)+'</td>' +
					'<td>'+row.open_level+'</td>' +
					'<td>'+row.level+'</td>' +
					'<td>'+row.qty+'</td>' +
					'<td>'+self.data.account.currency + ticker_profit_loss+'</td>';

				$tableBody.appendChild(table_row);

				// Add profit loss to total
				total = self.calcTotalProfitLoss(total, ticker_profit_loss);

			});

			this.showTotal(total);
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

			this.$el
				.getElementsByClassName('profit-loss--total')[0]
				.innerHTML = this.data.account.currency + total;	
		}
		
	};

}(window.IG || {}));