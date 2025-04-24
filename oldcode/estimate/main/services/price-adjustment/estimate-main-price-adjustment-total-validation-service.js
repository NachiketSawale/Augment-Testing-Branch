(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainPriceAdjustmentTotalValidationService',
		['$http', '_', '$q','$timeout', '$translate', '$injector','platformDataValidationService',
			'estimateMainPriceAdjustmentTotalDataService','estimateMainPriceAdjustmentCalculateService',
			'estimateMainPriceAdjustmentValidationService',
			function ($http, _, $q, $timeout, $translate, $injector,platformDataValidationService,
				estimateMainPriceAdjustmentTotalDataService,estimateMainPriceAdjustmentCalculateService,
				estimateMainPriceAdjustmentValidationService) {

				let service = {};

				let validFields = ['Quantity','AdjustmentPrice','TenderPrice','DeltaA','DeltaB'];

				let generateMandatory = function (field) {
					return function (entity, value) {
						return platformDataValidationService.finishValidation({valid: true}, entity, value, field, service, estimateMainPriceAdjustmentTotalDataService);
					};
				};

				let generateAsyncValidation = function (field) {
					return function generateAsyncValidation(entity, value) {
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateMainPriceAdjustmentTotalDataService);
						// entity[field] = value;
						asyncMarker.myPromise = valueChangeCalculationAsync(entity, field, value).then(function () {
							return platformDataValidationService.finishAsyncValidation({valid: true}, entity, value, field, asyncMarker, service, estimateMainPriceAdjustmentTotalDataService);
						});
						return asyncMarker.myPromise;
					};
				};

				function valueChangeCalculationAsync(entity, field, newValue) {
					let adjustmentTotalEntity = estimateMainPriceAdjustmentTotalDataService.getAdjustmentTotalEntity();
					if (adjustmentTotalEntity) {
						let newField = adjustmentTotalEntity.getMappingField(entity, field);
						if (newField) {
							// adjustmentTotalEntity.entity[newField] = newValue;
							return estimateMainPriceAdjustmentValidationService.valueChangeCalculationAsync(adjustmentTotalEntity.entity, newField, newValue);
						} else {
							if (field === 'DeltaB') {
								let result = adjustmentTotalEntity.calculateDeltaBUpdate(entity, newValue);
								return estimateMainPriceAdjustmentValidationService.valueChangeCalculationAsync(adjustmentTotalEntity.entity, result.newField, result.newValue);
							}
						}
					}
					return $q.when(null);
				}

				_.each(validFields, function (field) {
					service['validate' + field] = generateMandatory(field);
					service['asyncValidate' + field] = generateAsyncValidation(field);
				});
				return service;
			}
		]);
})(angular);

