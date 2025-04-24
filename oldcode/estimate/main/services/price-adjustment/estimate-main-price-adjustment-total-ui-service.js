
(function() {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estMainPriceAdjustmentTotalUIConfigurationService', ['estimateMainCommonUIService',
		function (estimateMainCommonUIService) {

			let customOptions = {
				allowNullColumns:['AdjustmentPrice','TenderPrice','DeltaA','DeltaB'],
				container:'price-adjustment-total'
			};
			return estimateMainCommonUIService.createUiService(
				['AdjType','Quantity','EstimatedPrice','AdjustmentPrice','TenderPrice','DeltaA','DeltaB'],
				null,
				['Quantity','AdjustmentPrice','TenderPrice','DeltaA','DeltaB'],
				false,customOptions);
		}]);
})();
