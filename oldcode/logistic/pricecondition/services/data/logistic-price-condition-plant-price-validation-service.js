/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionPlantPriceValidationService
	 * @description provides validation methods for logistic priceCondition plantPrice entities
	 */
	angular.module(moduleName).service('logisticPriceConditionPlantPriceValidationService', LogisticPriceConditionPlantPriceValidationService);

	LogisticPriceConditionPlantPriceValidationService.$inject = [
		'_','$injector', '$q', '$http', '$translate', 'platformValidationRevalidationEntitiesFactory', 'platformDataValidationService',
		'platformValidationPeriodOverlappingService', 'platformValidationServiceFactory',
		'logisticPriceConditionConstantValues', 'logisticPriceConditionPlantPriceDataService', 'basicsCompanyPeriodsService'
	];

	function LogisticPriceConditionPlantPriceValidationService(
		_, $injector, $q, $http, $translate, platformValidationRevalidationEntitiesFactory, platformDataValidationService,
		platformValidationPeriodOverlappingService, platformValidationServiceFactory,
		logisticPriceConditionConstantValues, logisticPriceConditionPlantPriceDataService, basicsCompanyPeriodsService
	) {

		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(
			logisticPriceConditionConstantValues.schemes.plantPrice,
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticPriceConditionConstantValues.schemes.plantPrice)
			},
			self,
			logisticPriceConditionPlantPriceDataService);

		let specification = {
			customValidations: [
				{
					model: 'PlantFk',
					revalidateGrid: [
						{model: 'ValidTo'},
						{model: 'ValidFrom'}
					]
				},{
					model: 'WorkOperationTypeFk',
					revalidateGrid: [
						{model: 'ValidTo'},
						{model: 'ValidFrom'}
					]
				},
				{
					model: 'ValidFrom',
					revalidateGrid: [
						{model: 'ValidTo'},
						{model: 'ValidFrom'}
					]
				},
				{
					model: 'ValidTo',
					revalidateGrid: [
						{model: 'ValidTo'},
						{model: 'ValidFrom'}
					]
				}
			],
			globals: {
				revalidateCellOnlyIfHasError: false,
				revalidateOnlySameEntity: false,
				revalidateGrid: false
			}
		};
		platformValidationRevalidationEntitiesFactory.addValidationServiceInterface(
			logisticPriceConditionConstantValues.schemes.plantPrice,
			specification,
			self,
			logisticPriceConditionPlantPriceDataService
		);

		this.validateAdditionalValidFrom = function validateAdditionalValidFrom(entity,value,model,entities) {
			let res = platformDataValidationService.validatePeriodSimple(value,entity.ValidTo);
			if(platformDataValidationService.isResultValid(res)){
				return platformValidationPeriodOverlappingService.validateFrom(
					entity,
					value,
					model,
					self,
					logisticPriceConditionPlantPriceDataService,
					'ValidTo',
					_.filter(entities,e => e.WorkOperationTypeFk === entity.WorkOperationTypeFk && e.PlantFk === entity.PlantFk));
			}
			else{
				return res;
			}
		};
		this.asyncValidateAdditionalValidFrom = function(entity, value){
			return basicsCompanyPeriodsService.asyncIsPeriodFieldAValidCompanyPeriodField(entity, value, 'from', entity.CompanyFk);
		};
		this.validateAdditionalValidTo = function validateAdditionalValidTo(entity,value,model,entities) {
			let res = platformDataValidationService.validatePeriodSimple(entity.ValidFrom,value);
			if(platformDataValidationService.isResultValid(res)){
				return platformValidationPeriodOverlappingService.validateTo(
					entity,
					value,
					model,
					self,
					logisticPriceConditionPlantPriceDataService,
					'ValidFrom',
					_.filter(entities,e => e.WorkOperationTypeFk === entity.WorkOperationTypeFk && e.PlantFk === entity.PlantFk));
			}
			else{
				return res;
			}
		};
		this.asyncValidateAdditionalValidTo = function(entity, value){
			return basicsCompanyPeriodsService.asyncIsPeriodFieldAValidCompanyPeriodField(entity, value, 'to', entity.CompanyFk);
		};

		this.asyncValidateAdditionalPlantFk = function(entity, value){
			return $http.post(globals.webApiBaseUrl + 'resource/equipment/plant/instance', {Id:value}).then(function (result) {
				entity.CompanyFk = result.data.CompanyFk;
				
				return true;
			});
		};

		self.validateAdditionalWorkOperationTypeFk = function (entity, value) {
			var res = $injector.get('resourceWorkOperationTypeLookupDataService').getItemById(value, { lookupType: 'resourceWorkOperationTypeLookupDataService' });
			entity.UomFk = !_.isNil(res) && res.UomFk !== null ? res.UomFk : entity.UomFk;
			return true;
		};
	}
})(angular);
