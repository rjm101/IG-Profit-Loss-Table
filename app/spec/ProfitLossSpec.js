describe("Profit Loss Spec", function() {

	var profitLoss, request, onSuccess, $el;

	beforeEach(function() {

		// Append template to DOM
		$el = document.getElementsByTagName('body')[0].innerHTML += TestResponses.profitLossData.template;

		// AJAX setup
		jasmine.Ajax.install();

		onSuccess = jasmine.createSpy('onSuccess');

		profitLoss = Object.create(window.IG.ProfitLoss);

		profitLoss.init('data/data.json', {
			onSuccess: onSuccess
		});

		request = jasmine.Ajax.requests.mostRecent();

		// Test AJAX
		expect(request.url).toBe('data/data.json');
		expect(request.method).toBe('GET');
	});

	describe("on success", function() {

		beforeEach(function() {
			request.respondWith(TestResponses.profitLossData.success);
		});

		it("calls onSuccess and returns an array of markets and stock picks", function() {

			expect(onSuccess).toHaveBeenCalled();

			var successData = profitLoss.data;

			expect(successData.markets.length).toEqual(3);
			expect(successData.picks.length).toEqual(4);
		});


		it('should generate a list of stock picks', function(){

			var $rows = document.getElementsByClassName('profit-loss--stock_row');

			expect($rows.length).toEqual(4);
		});


		it('should calculate profit / loss per stock', function(){

			var stockProfitLosses = [200, 150, 600, -300],
				rows = profitLoss.data.picks;

			for(var i = 0; i < rows.length; i++){

				expect(profitLoss.calcProfitLoss(rows[i].open_level, rows[i].level, rows[i].qty)).toBe(stockProfitLosses[i]);
			}
		});


		it('should calculate a book cost', function(){

			var stockBookCosts = [900, 750, 900, 750],
				rows = profitLoss.data.picks;

			for(var i = 0; i < rows.length; i++){

				expect(profitLoss.calcBookCost(rows[i].open_level, rows[i].qty)).toBe(stockBookCosts[i]);
			}
		});


		it('should calculate a total profit / loss', function(){

			var total = document.getElementsByClassName('profit-loss--total')[0].innerHTML.substring(1);

			expect(parseInt(total, 10)).toBe(650);
		});
	});

	afterEach(function() {

		// Remove template
		var $profitLossTmpl = document.getElementsByClassName('profit-loss')[0];

		if($profitLossTmpl){
			$profitLossTmpl.parentNode.removeChild($profitLossTmpl);
		}

		// Uninstall ajax helper
		jasmine.Ajax.uninstall();
	});

});