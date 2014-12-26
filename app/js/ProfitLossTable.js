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

			if(test_callbacks){
				// Turn DOM manipulation functionality off
				this.testMode = true;
			}else{
				this.$el = document.getElementsByClassName('profit-loss')[0];
			}

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

			if(!this.testMode){
				var $tbody = this.$el.getElementsByClassName('profit-loss--body')[0],
					$tr = document.createElement('tr');

				// Hide preloader
				$tbody.parentNode.className += ' profit-loss--loaded';
			}

			var total = 0,
				self = this;

			// Add rows
			this.data.picks.forEach(function(stock_pick, index){

				var ticker_profit_loss = self.calcProfitLoss(stock_pick.open_level, stock_pick.level, stock_pick.qty);

				if(!self.testMode){
					self.appendStockRow($tr, $tbody, index, stock_pick, ticker_profit_loss);
				}

				// Add profit loss to total
				total = self.calcTotalProfitLoss(total, ticker_profit_loss);

			});

			if(!this.testMode){
				this.showTotal(total);
			}
		},

		appendStockRow: function appendRow($tr, $tbody, index, stock_pick, ticker_profit_loss){

			var $table_row = $tr.cloneNode(true);

			// Odd row class
			if(index % 2 === 0) $table_row.className = 'odd';

			// Table row for ticker
			$table_row.innerHTML = 
				'<td title="'+stock_pick.name+'">'+stock_pick.ticker+'</td>' +
				'<td title="'+this.findMarket(stock_pick.exchange)+'">'+stock_pick.exchange+'</td>' +
				'<td>'+this.data.account.currency + this.calcBookCost(stock_pick.open_level, stock_pick.qty)+'</td>' +
				'<td>'+stock_pick.open_level+'</td>' +
				'<td>'+stock_pick.level+'</td>' +
				'<td>'+stock_pick.qty+'</td>' +
				'<td>'+this.data.account.currency + ticker_profit_loss+'</td>';

			$tbody.appendChild($table_row);

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

}(window.IG));