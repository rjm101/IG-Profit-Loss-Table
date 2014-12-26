describe("Profit Loss Spec", function() {

	// TODO:
	// it should calculate a book cost 
	// it should calculate a profit / loss on each stock
	// it should generate a list of rows per stock
	// it should calculate a total profit / loss

	var profitLoss, request, onSuccess;

	beforeEach(function() {

		jasmine.Ajax.install();

		onSuccess = jasmine.createSpy('onSuccess');

		profitLoss = Object.create(window.IG.ProfitLoss);

		profitLoss.init('data/data.json', {
			onSuccess: onSuccess
		});

		request = jasmine.Ajax.requests.mostRecent();
		expect(request.url).toBe('data/data.json');
		expect(request.method).toBe('GET');
	});

	afterEach(function() {
		jasmine.Ajax.uninstall();
	});

	describe("on success", function() {

		beforeEach(function() {
			request.respondWith(TestResponses.profitLossData.success);
		});

		it("calls onSuccess with an array markets and stock picks", function() {

			expect(onSuccess).toHaveBeenCalled();

			var successData = profitLoss.data;

			expect(successData.markets.length).toEqual(3);
			expect(successData.picks.length).toEqual(4);
		});
	});

});