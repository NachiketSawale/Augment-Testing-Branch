/**
 * Created by baf on 01.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc service
	 * @name logisticPriceCconditionItemValidationService
	 * @description provides validation methods for logistic price  entities
	 */
	angular.module(moduleName).service('logisticPriceConditionItemValidationService', LogisticPriceConditionItemValidationService);

	LogisticPriceConditionItemValidationService.$inject = [
		'_', '$q', '$translate', '$http', 'platformValidationRevalidationEntitiesFactory', 'platformValidationServiceFactory',
		'platformValidationPeriodOverlappingService', 'platformDataValidationService', 'logisticPriceConditionConstantValues',
		'logisticPriceConditionItemDataService', 'basicsCompanyPeriodsService'
	];

	function LogisticPriceConditionItemValidationService(
		_, $q, $translate, $http, platformValidationRevalidationEntitiesFactory, platformValidationServiceFactory,
		platformValidationPeriodOverlappingService, platformDataValidationService, logisticPriceConditionConstantValues,
		logisticPriceConditionItemDataService, basicsCompanyPeriodsService
	) {

		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticPriceConditionConstantValues.schemes.priceConditionItem,
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticPriceConditionConstantValues.schemes.priceConditionItem),
			},
			self,
			logisticPriceConditionItemDataService);
		let specification = {
			customValidations: [
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
				},{
					model: 'WorkOperationTypeFk',
					revalidateGrid: [
						{model: 'ValidTo'},
						{model: 'ValidFrom'}
					]
				},{
					model: 'PricingGroupFk',
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
			logisticPriceConditionConstantValues.schemes.priceConditionItem,
			specification,
			self,
			logisticPriceConditionItemDataService
		);
		this.validateAdditionalValidFrom = function validateAdditionalValidFrom(entity,value,model,entities) {
			let res = platformDataValidationService.validatePeriodSimple(value,entity.ValidTo);
			if(platformDataValidationService.isResultValid(res)){
				return platformValidationPeriodOverlappingService.validateFrom(
					entity, value, model, self, logisticPriceConditionItemDataService, 'ValidTo',
					_.filter(entities,e => e.WorkOperationTypeFk === entity.WorkOperationTypeFk && e.PricingGroupFk === entity.PricingGroupFk)
				);
			}
			else{
				return res;
			}
		};
		this.asyncValidateAdditionalValidFrom = function(entity, value){
			return basicsCompanyPeriodsService.asyncIsPeriodFieldAValidCompanyPeriodField(entity, value, 'from');
		};
		this.validateAdditionalValidTo = function validateAdditionalValidTo(entity,value,model,entities) {
			let res = platformDataValidationService.validatePeriodSimple(entity.ValidFrom,value);
			if(platformDataValidationService.isResultValid(res)){
				return platformValidationPeriodOverlappingService.validateTo(
					entity,
					value,
					model,
					self,logisticPriceConditionItemDataService,
					'ValidFrom',
					_.filter(entities,e => e.WorkOperationTypeFk === entity.WorkOperationTypeFk && e.PricingGroupFk === entity.PricingGroupFk));
			}
			else{
				return res;
			}
		};
		this.asyncValidateAdditionalValidTo = function(entity, value){
			return basicsCompanyPeriodsService.asyncIsPeriodFieldAValidCompanyPeriodField(entity, value, 'to');
		};
	}
})(angular);
