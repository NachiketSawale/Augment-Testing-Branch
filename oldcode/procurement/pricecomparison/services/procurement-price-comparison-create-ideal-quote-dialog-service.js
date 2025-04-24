/**
 * Created by chi on 10/23/2018.
 */
(function(angular){
	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonCreateIdealQuoteDialogService', procurementPriceComparisonCreateIdealQuoteDialogService);

	procurementPriceComparisonCreateIdealQuoteDialogService.$inject = ['$http', 'globals'];

	function procurementPriceComparisonCreateIdealQuoteDialogService($http, globals){
		var service = {};

		service.getQuotesByRfqHeaderId = getQuotesByRfqHeaderId;
		service.createIdealQuote = createIdealQuote;

		return service;

		// ///////////////////////////
		function getQuotesByRfqHeaderId(rfqHeaderId, getIdealQuote, compareType) {
			return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/comparecolumn/getidealquotesbyrfqheaderid?rfqHeaderId=' + rfqHeaderId + '&getIdealQuote=' + getIdealQuote + '&compareType=' + compareType);
		}

		function createIdealQuote(rfqHeaderId, copyCondition, idealBidderDataType) {
			var data = {
				RfqHeaderId: rfqHeaderId,
				CopyCondition: copyCondition,
				IdealBidderDataType: idealBidderDataType
			};
			return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/item/createidealquote', data);
		}
	}
})(angular);