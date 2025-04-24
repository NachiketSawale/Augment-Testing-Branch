/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionSundryServicePriceValidationService
	 * @description provides validation methods for logistic priceCondition sundryServicePrice entities
	 */
	angular.module(moduleName).service('logisticPriceConditionSundryServicePriceValidationService', LogisticPriceConditionSundryServicePriceValidationService);

	LogisticPriceConditionSundryServicePriceValidationService.$inject = ['$injector','_', 'platformValidationServiceFactory', 'logisticPriceConditionConstantValues',
		'logisticPriceConditionSundryServicePriceDataService', 'platformValidationRevalidationEntitiesFactory',
		'platformDataValidationService', 'platformValidationPeriodOverlappingService', 'logisticSundryServiceLookupDataService','platformRuntimeDataService'];

	function LogisticPriceConditionSundryServicePriceValidationService($injector,_, platformValidationServiceFactory, logisticPriceConditionConstantValues,
		logisticPriceConditionSundryServicePriceDataService,platformValidationRevalidationEntitiesFactory,
		platformDataValidationService, platformValidationPeriodOverlappingService, logisticSundryServiceLookupDataService, platformRuntimeDataService) {
		var self = this;
		var getActualValidationMethod = function (model) {
			return _.isFunction(self[model]) ? self[model] : function () {return true;};
		};

		platformValidationServiceFactory.addValidationServiceInterface(
			logisticPriceConditionConstantValues.schemes.sundryServicePrice,
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticPriceConditionConstantValues.schemes.sundryServicePrice),
			},
			self,
			logisticPriceConditionSundryServicePriceDataService);

		var ValidFromModel = 'ValidFrom';
		var ValidToModel = 'ValidTo';

		platformValidationRevalidationEntitiesFactory.addValidationServiceInterface(
			logisticPriceConditionConstantValues.schemes.sundryServicePrice,
			{
				customValidations: [
					{
						model: 'SundryServiceFk',
						validation: getActualValidationMethod('SundryServiceFk'), // reminde possible validation from platformValidationServiceFactory
						revalidateGrid: [
							{
								model: ValidFromModel
							},
							{
								model: ValidToModel
							}
						]
					},
					{
						model: ValidFromModel,
						validation: getActualValidationMethod(ValidFromModel), // reminde possible validation from platformValidationServiceFactory
						revalidateGrid: [
							{
								model: ValidFromModel
							},
							{
								model: ValidToModel
							}
						]
					},
					{
						model: ValidToModel,
						validation: getActualValidationMethod(ValidToModel), // reminde possible validation from platformValidationServiceFactory
						revalidateGrid: [
							{
								model: ValidFromModel
							},
							{
								model: ValidToModel
							}
						]
					}
				],
				globals:{
					revalidateCellOnlyIfHasError: false,
					revalidateOnlySameEntity: false,
					revalidateGrid : false
				}
			},
			self,
			logisticPriceConditionSundryServicePriceDataService);

		var filterSameSundryService = function(entity, entities){
			return _.filter(entities,function (e) {
				return e.SundryServiceFk === entity.SundryServiceFk;
			});
		};
		self.validateAdditionalValidFrom = function validateAdditionalValidFrom(entity,value,model,entities) {
			var res = platformDataValidationService.validatePeriodSimple(value, entity[ValidToModel]);
			if(platformDataValidationService.isResultValid(res)){

				res = platformValidationPeriodOverlappingService.validateFrom(entity, value, model, self, logisticPriceConditionSundryServicePriceDataService, ValidToModel, filterSameSundryService(entity,entities));
			}
			return res;
		};

		self.validateAdditionalValidTo = function validateAdditionalValidTo(entity,value,model,entities) {
			var res = platformDataValidationService.validatePeriodSimple(entity[ValidFromModel],value);
			if(platformDataValidationService.isResultValid(res)){

				res = platformValidationPeriodOverlappingService.validateTo(entity, value, model, self, logisticPriceConditionSundryServicePriceDataService, ValidFromModel, filterSameSundryService(entity,entities));
			}
			return res;
		};

		self.validateSundryServiceFk = function (entity, value) {
			var sundryserviceData = $injector.get('logisticSundryServiceLookupDataService').getItemById(value, { lookupType: 'SundryServiceHeaderChained' });

			if (sundryserviceData.IsManual === false) {
				for (var i = 1; i <= 6; i++) {
				platformRuntimeDataService.readonly(entity, [{ field: 'IsManual', readonly: true }]);
				platformRuntimeDataService.readonly(entity, [{ field: 'PricePortion' + i, readonly: true }]);
				}

			} else {
				for (var j = 1; j <= 6; j++) {
					platformRuntimeDataService.readonly(entity, [{ field: 'IsManual', readonly: false }]);
					platformRuntimeDataService.readonly(entity, [{ field: 'PricePortion' + j, readonly: false }]);

				}
			}

		};
	}

})(angular);
