/*
 * created by miu on 08/19 2024
*/
(function (angular) {
	'use strict';
	let moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonItemEvaluationItemListService', ['_', 'platformDataServiceFactory',
		'procurementPriceComparisonItemEvaluationService',
		function(_, platformDataServiceFactory, itemEvaluationService) {

			let serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonItemEvaluationItemListService',
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/pricecomparison/item/',
					endRead: 'prcItems4wizarditemevaluation',
					usePostForRead: true,
					initReadData: function(readData){
						let selectedQuoteHeaders = itemEvaluationService.quoteHeaders();
						if (selectedQuoteHeaders && selectedQuoteHeaders.length > 0) {
							readData.QtnHeaderIds = _.map(selectedQuoteHeaders, quote => quote.QuoteHeaderId);
							readData.IsNotSubmitted = itemEvaluationService.updateNotSubmitted;
							readData.IsEvaluated = itemEvaluationService.updateIsEvaluated;
						}
					}
				},
				dataProcessor: [],
				entitySelection: {},
				modification: { multi: {} },
				presenter: {
					list: {
						incorporateDataRead: function(readData, data) {
							_.forEach(readData, function (item) {
								item.IsChecked = true;
							});
							itemEvaluationService.selectedPrcItems(readData);
							return data.handleReadSucceeded(readData, data, true);
						}
					}
				}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = container.service;
			let data = container.data;

			data.markItemAsModified = function () {
			};
			service.markItemAsModified = function () {
			};

			service.createItem = null;
			service.deleteItem = null;


			return service;
		}]);
})(angular);
