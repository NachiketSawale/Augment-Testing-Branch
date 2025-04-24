(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainPriceAdjustmentValidationService',
		['$http', '_', '$timeout', '$translate', '$injector','estMainPriceAdjustmentUIFields','platformDataValidationService',
			'estimateMainPriceAdjustmentDataService','estimateMainPriceAdjustmentCalculateService',
			function ($http, _, $timeout, $translate, $injector,estMainPriceAdjustmentUIFields,platformDataValidationService,
				estimateMainPriceAdjustmentDataService,estimateMainPriceAdjustmentCalculateService) {

				let service = {};

				let validFields = estMainPriceAdjustmentUIFields.NotReadonlyFields;

				let generateMandatory = function (field) {
					return function (entity, value) {
						return platformDataValidationService.finishValidation({valid: true}, entity, value, field, service, estimateMainPriceAdjustmentDataService);
					};
				};

				let generateAsyncValidation = function (field) {
					return function generateAsyncValidation(entity, value) {
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateMainPriceAdjustmentDataService);
						// entity[field] = value;
						asyncMarker.myPromise = service.valueChangeCalculationAsync(entity, field, value).then(function (newValue) {
							return platformDataValidationService.finishAsyncValidation({valid: true}, entity, newValue, field, asyncMarker, service, estimateMainPriceAdjustmentDataService);
						});
						return asyncMarker.myPromise;
					};
				};


				service.valueChangeCalculationAsync = function(entity, field, newValue) {
					if (field === 'WqTenderPrice' && estimateMainPriceAdjustmentDataService.canEditWqTenderPrice(entity)) {
						return estimateMainPriceAdjustmentDataService.updateGridItem(null, [entity], newValue, entity.WqAdjustmentPrice).then(function () {
							return entity[field];
						});
					}
					return estimateMainPriceAdjustmentDataService.checkPriceAdjustment([entity]).then(function () {
						if (field !== 'Comment') {
							estimateMainPriceAdjustmentCalculateService.recalculate(entity, field, newValue);
							estimateMainPriceAdjustmentDataService.updateFilterTotalData(estimateMainPriceAdjustmentDataService.filterItemList);
							return entity[field];
						}
					});
				};

				_.each(validFields, function (field) {
					service['validate' + field] = generateMandatory(field);
					service['asyncValidate' + field] = generateAsyncValidation(field);
				});
				return service;
			}
		]);
})(angular);

