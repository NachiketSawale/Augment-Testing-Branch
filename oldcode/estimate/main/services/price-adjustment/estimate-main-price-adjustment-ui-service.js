
(function() {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).constant('estMainPriceAdjustmentUIFields', {
		AllFields: ['Reference', 'Reference2', 'BriefInfo', 'BasUomFk', 'BoqItemFlagFk', 'BoqLineTypeFk','Factor',
			'EpnaEstimagted', 'StatusImage','BasCurrencyFk', 'Comment','ItemInfo',
			'Urb1Estimated', 'Urb1Delta', 'Urb1Adjustment', 'Urb1Tender',
			'Urb2Estimated', 'Urb2Delta', 'Urb2Adjustment', 'Urb2Tender',
			'Urb3Estimated', 'Urb3Delta', 'Urb3Adjustment', 'Urb3Tender',
			'Urb4Estimated', 'Urb4Delta', 'Urb4Adjustment', 'Urb4Tender',
			'Urb5Estimated', 'Urb5Delta', 'Urb5Adjustment', 'Urb5Tender',
			'Urb6Estimated', 'Urb6Delta', 'Urb6Adjustment', 'Urb6Tender',
			'WqQuantity', 'WqEstimatedPrice', 'WqAdjustmentPrice', 'WqTenderPrice', 'WqDeltaPrice',
			'AqQuantity', 'AqEstimatedPrice', 'AqAdjustmentPrice', 'AqTenderPrice', 'AqDeltaPrice',
			'UrEstimated', 'UrDelta', 'UrAdjustment', 'UrTender'],
		NotReadonlyFields: ['Comment','UrDelta', 'UrAdjustment', 'UrTender',
			'Urb1Delta', 'Urb1Adjustment', 'Urb1Tender',
			'Urb2Delta', 'Urb2Adjustment', 'Urb2Tender',
			'Urb3Delta', 'Urb3Adjustment', 'Urb3Tender',
			'Urb4Delta', 'Urb4Adjustment', 'Urb4Tender',
			'Urb5Delta', 'Urb5Adjustment', 'Urb5Tender',
			'Urb6Delta', 'Urb6Adjustment', 'Urb6Tender',
			'WqAdjustmentPrice', 'WqTenderPrice', 'WqDeltaPrice',
			'AqQuantity', 'AqAdjustmentPrice', 'AqTenderPrice', 'AqDeltaPrice']
	});

	angular.module(moduleName).factory('estMainPriceAdjustmentUIConfigurationService', ['platformSchemaService', 'estimateMainCommonUIService', 'estMainPriceAdjustmentUIFields',
		function (platformSchemaService, estimateMainCommonUIService, estMainPriceAdjustmentUIFields) {
			let customSchemas = platformSchemaService.getSchemaFromCache({typeName: 'EstPriceAdjustmentItemDataDto', moduleSubModule: 'Estimate.Main'});
			if (customSchemas) {
				customSchemas = customSchemas.properties;
			}
			let customOptions = {
				customSchemas:customSchemas,
				allowNullColumns:estMainPriceAdjustmentUIFields.NotReadonlyFields.filter(e => e !== 'AqQuantity'),
				container:'price-adjustment'
			};
			return estimateMainCommonUIService.createUiService(estMainPriceAdjustmentUIFields.AllFields, null, estMainPriceAdjustmentUIFields.NotReadonlyFields, false, customOptions);
		}]);
})();
