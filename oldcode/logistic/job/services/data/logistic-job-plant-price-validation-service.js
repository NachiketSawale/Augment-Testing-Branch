/**
 * Created by leo on 12.03.2018
 */

(function (angular) {
	/* global _ */
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobPlantPriceValidationService
	 * @description provides validation methods for logistic job plant price entities
	 */
	angular.module(moduleName).service('logisticJobPlantPriceValidationService', LogisticJobPlantPriceValidationService);

	LogisticJobPlantPriceValidationService.$inject = ['platformValidationServiceFactory', 'platformValidationRevalidationEntitiesFactory',
		'platformValidationPeriodOverlappingService', 'platformDataValidationService',
		'basicsCompanyPeriodsService', 'logisticJobPlantPriceDataService','resourceWorkOperationTypePlantFilterLookupDataService'
	];

	function LogisticJobPlantPriceValidationService(platformValidationServiceFactory, platformValidationRevalidationEntitiesFactory,
		platformValidationPeriodOverlappingService, platformDataValidationService,
		basicsCompanyPeriodsService, logisticJobPlantPriceDataService, resourceWorkOperationTypePlantFilterLookupDataService
	) {
		const self = this;
		let scheme = {
			typeName: 'LogisticPlantPriceDto',
			moduleSubModule: 'Logistic.Job'
		};

		platformValidationServiceFactory.addValidationServiceInterface(
			scheme, {
				mandatory: ['PlantFk', 'WorkOperationTypeFk','JobFk','IsManual', 'UomFk', 'PricePortion1','PricePortion2','PricePortion3','PricePortion4','PricePortion5','PricePortion6']
			},
			self,
			logisticJobPlantPriceDataService
		);
		let specification = {
			customValidations: [
				{
					model: 'PlantFk',
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
				},{
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
				}
			],
			globals: {
				revalidateCellOnlyIfHasError: false,
				revalidateOnlySameEntity: false,
				revalidateGrid: false
			}
		};

		platformValidationRevalidationEntitiesFactory.addValidationServiceInterface(
			scheme,
			specification,
			self,
			logisticJobPlantPriceDataService
		);

		this.validateAdditionalValidFrom = function validateAdditionalValidFrom(entity,value,model,entities) {
			let res = platformDataValidationService.validatePeriodSimple(value,entity.ValidTo);
			if(platformDataValidationService.isResultValid(res)){
				return platformValidationPeriodOverlappingService.validateFrom(
					entity,
					value,
					model,
					self,
					logisticJobPlantPriceDataService,
					'ValidTo',
					_.filter(entities,e => e.WorkOperationTypeFk === entity.WorkOperationTypeFk && e.PlantFk === entity.PlantFk));
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
					self,
					logisticJobPlantPriceDataService,
					'ValidFrom',
					_.filter(entities,e => e.WorkOperationTypeFk === entity.WorkOperationTypeFk && e.PlantFk === entity.PlantFk));
			}
			else{
				return res;
			}
		};

		this.asyncValidateAdditionalValidTo = function(entity, value){
			return basicsCompanyPeriodsService.asyncIsPeriodFieldAValidCompanyPeriodField(entity, value, 'to');
		};

		self.validateAdditionalWorkOperationTypeFk = function (entity,value) {
			const res = resourceWorkOperationTypePlantFilterLookupDataService.getItemById(value, { lookupType: 'resourceWorkOperationTypePlantFilterLookupDataService' });
			entity.UomFk = !_.isNil(res) && res.UomFk !== null ? res.UomFk : entity.UomFk;

			return true;
		};
	}
})(angular);
