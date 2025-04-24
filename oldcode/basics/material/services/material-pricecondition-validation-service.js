(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	/**
	 * @ngdoc service
	 * @name basicsMaterialPriceConditionValidationService
	 * @description provides validation methods for materialPriceCondition
	 */
	angular.module(moduleName).factory('basicsMaterialPriceConditionValidationService',
		['basicsLookupdataLookupDescriptorService', '$q', 'platformDataValidationService', 'basicsMaterialCalculationHelper',
			function (basicsLookupdataLookupDescriptorService, $q, platformDataValidationService, basicsMaterialCalculationHelper) {
				return function (dataService) {
					var service = {};
					let basRoundTypes = basicsMaterialCalculationHelper.basRoundingType;
					service.asyncValidatePrcPriceConditionTypeFk = function validatePrcPriceConditionTypeFk(entity, value) {
						var model = 'PrcPriceConditionTypeFk';
						var itemList = dataService.getList();
						var result = platformDataValidationService.validateIsUnique(entity, value, model, itemList, service, dataService);

						if (!result.valid) {
							return $q.when(result);
						}

						if (entity.PrcPriceConditionTypeFk !== value) {
							var defer = $q.defer();
							entity.PriceConditionType = _.find(basicsLookupdataLookupDescriptorService.getData('prcpriceconditiontype'), {Id: value});
							entity.PrcPriceConditionTypeFk = value;
							entity.Description = entity.PriceConditionType.DescriptionInfo.Translated;
							entity.Value = basicsMaterialCalculationHelper.round(basRoundTypes.UnitRate, entity.PriceConditionType.Value);
							entity.IsPriceComponent = entity.PriceConditionType.IsPriceComponent;
							entity.TotalOc = 0;
							entity.Total = 0;
							dataService.updateReadOnly(entity);
							dataService.recalculate(dataService.parentService().getSelected()).then(function () {
								defer.resolve(true);
							});

							return defer.promise;
						}

						return $q.when(true);
					};

					service.validateValue = function validateValue(entity, value) {
						if (entity.Value !== value) {
							entity.Value = value;
							dataService.recalculate(dataService.parentService().getSelected());
						}
						return true;
					};

					service.validateTotalOc = function validateTotalOc(entity, value) {
						if (entity.TotalOc !== value) {
							entity.TotalOc = value;
							dataService.recalculate(dataService.parentService().getSelected());
						}
						return true;
					};

					service.validateIsActivated = function validateIsActivated(entity, value) {
						if (entity.IsActivated !== value) {
							entity.IsActivated = value;
							dataService.recalculate(dataService.parentService().getSelected());
						}
						return true;
					};

					service.validateValueForBulkConfig = function validateValueFkForBulkConfig(entity, value, model){
						if (entity[model] !== value) {
							entity[model] = value;
						}
						return true;
					};

					service.validateIsActivatedForBulkConfig = function validateIsActivatedFkForBulkConfig(entity, value, model){
						if (entity[model] !== value) {
							entity[model] = value;
						}
						return true;
					};

					service.validateTotalOcForBulkConfig = function validateTotalOcFkForBulkConfig(entity, value, model){
						if (entity[model] !== value) {
							entity[model] = value;
						}
						return true;
					};

					return service;
				};
			}
		]);
})(angular);
