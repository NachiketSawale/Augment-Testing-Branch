(function (angular) {
	'use strict';

	var moduleName = 'resource.equipment';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantPricelistValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('resourceEquipmentPlantPricelistValidationService', ResourceEquipmentPlantPricelistValidationService);

	ResourceEquipmentPlantPricelistValidationService.$inject = [
		'platformValidationServiceFactory', 'platformRuntimeDataService', 'resourceEquipmentConstantValues',
		'resourceEquipmentPlantPricelistDataService','platformDataValidationService', 'basicsCompanyPeriodsService',
		'platformValidationPeriodOverlappingService', 'platformValidationRevalidationEntitiesFactory', 'basicsLookupdataSimpleLookupService',
		'resourceEquipmentPlantDataService'
	];

	function ResourceEquipmentPlantPricelistValidationService(
		platformValidationServiceFactory, platformRuntimeDataService, resourceEquipmentConstantValues,
		resourceEquipmentPlantPricelistDataService, platformDataValidationService, basicsCompanyPeriodsService,
		platformValidationPeriodOverlappingService, platformValidationRevalidationEntitiesFactory, basicsLookupdataSimpleLookupService,
		resourceEquipmentPlantDataService
	) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(
			resourceEquipmentConstantValues.schemes.plantPrices, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentConstantValues.schemes.plantPrices)
			},
			self,
			resourceEquipmentPlantPricelistDataService);

		let specification = {
			customValidations: [
				{
					model: 'PricelistFk',
					revalidateGrid: [
						{ model: 'ValidTo' },
						{ model: 'ValidFrom' }
					]
				},
				{
					model: 'ValidFrom',
					revalidateGrid: [
						{ model: 'ValidTo' },
						{ model: 'ValidFrom' }
					]
				},
				{
					model: 'ValidTo',
					revalidateGrid: [
						{ model: 'ValidTo' },
						{ model: 'ValidFrom' }
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
			resourceEquipmentConstantValues.schemes.plantPrices,
			specification,
			self,
			resourceEquipmentPlantPricelistDataService
		);

		self.validateIsManual = function (entity, value) {
			if (value === true) {
				for (var i = 1; i <= 6; i++) {
					platformRuntimeDataService.readonly(entity, [{ field: 'PricePortion' + i, readonly: false }]);
					platformRuntimeDataService.readonly(entity, [{ field: 'QualityFactor', readonly: false }]);
				}
			} else {
				for (var j = 1; j <= 6; j++) {
					platformRuntimeDataService.readonly(entity, [{ field: 'PricePortion' + j, readonly: true }]);
					platformRuntimeDataService.readonly(entity, [{ field: 'QualityFactor', readonly: true }]);
				}
			}
		};

		self.getPricePortionCandidates = function getPricePortionCandidates(pricePortionNamingTemplate) {
			return [1, 2, 3, 4, 5, 6].map(num => pricePortionNamingTemplate + num);
		};

		self.getCalcPricePortionSum = function getCalcPricePortionSum(candidates) {
			return function calcPricePortionSum(entity, value, model) {
				return _.sum(candidates.map(can => model === can ? value : _.get(entity, can)));
			};
		};
		self.calcPricePortionSum = self.getCalcPricePortionSum(self.getPricePortionCandidates('PricePortion'));

		self.validatePricePortion1 = function (entity, value, model) {
			entity.PricePortionSum = self.calcPricePortionSum(entity, value, model);
		};
		self.validatePricePortion2 = function (entity, value, model) {
			entity.PricePortionSum = self.calcPricePortionSum(entity, value, model);
		};
		self.validatePricePortion3 = function (entity, value, model) {
			entity.PricePortionSum = self.calcPricePortionSum(entity, value, model);
		};
		self.validatePricePortion4 = function (entity, value, model) {
			entity.PricePortionSum = self.calcPricePortionSum(entity, value, model);
		};
		self.validatePricePortion5 = function (entity, value, model) {
			entity.PricePortionSum = self.calcPricePortionSum(entity, value, model);
		};
		self.validatePricePortion6 = function (entity, value, model) {
			entity.PricePortionSum = self.calcPricePortionSum(entity, value, model);
		};

		self.validateUomFk = function (entity, value, model) {
			if (value === 0) {
				value = null;
			}
			return platformDataValidationService.validateMandatory(entity, value, model, this, resourceEquipmentPlantPricelistDataService);
		};

		this.asyncValidateAdditionalValidTo = function (entity, value) {
			let companyId = null;
			if(resourceEquipmentPlantDataService.getSelected() !== 'undefined' || resourceEquipmentPlantDataService.getSelected() !== null){
				companyId = resourceEquipmentPlantDataService.getSelected().CompanyFk;
			}
			return basicsCompanyPeriodsService.asyncIsPeriodFieldAValidCompanyPeriodField(entity, value, 'to', companyId);
		};
		this.asyncValidateAdditionalValidFrom = function (entity, value) {
			let companyId = null;
			if(resourceEquipmentPlantDataService.getSelected() !== 'undefined' || resourceEquipmentPlantDataService.getSelected() !== null){
				companyId = resourceEquipmentPlantDataService.getSelected().CompanyFk;
			}
			return basicsCompanyPeriodsService.asyncIsPeriodFieldAValidCompanyPeriodField(entity, value, 'from', companyId);
		};
		this.validateAdditionalValidFrom = function validateAdditionalValidFrom(entity, value, model, entities) {
			let res = platformDataValidationService.validatePeriodSimple(value, entity.ValidTo);
			if (platformDataValidationService.isResultValid(res)) {
				return platformValidationPeriodOverlappingService.validateFrom(
					entity, value, model,
					self, resourceEquipmentPlantPricelistDataService,
					'ValidTo', _.filter(entities, ent => ent.PricelistFk === entity.PricelistFk)
				);
			}
			else {
				return res;
			}
		};
		this.validateAdditionalValidTo = function validateAdditionalValidTo(entity, value, model, entities) {
			let res = platformDataValidationService.validatePeriodSimple(entity.ValidFrom, value);
			if (platformDataValidationService.isResultValid(res)) {
				return platformValidationPeriodOverlappingService.validateTo(
					entity, value, model, self, resourceEquipmentPlantPricelistDataService,
					'ValidFrom', _.filter(entities, e => e.PricelistFk === entity.PricelistFk)
				);
			}
			else {
				return res;
			}
		};

		this.asyncValidateAdditionalPricelistFk = function (entity, value) {
			if (entity && value) {
				return basicsLookupdataSimpleLookupService.getItemById(value, {
					lookupModuleQualifier: 'basics.customize.equipmentpricelist',
					valueMember: 'Id',
				}).then(function (res) {
					entity.UomFk = res.UomFk !== null ? res.UomFk : entity.UomFk;
					self.validateUomFk(entity, entity.UomFk, 'UomFk');

					return true;
				});
			}
			return true;

		};
	}

})(angular);