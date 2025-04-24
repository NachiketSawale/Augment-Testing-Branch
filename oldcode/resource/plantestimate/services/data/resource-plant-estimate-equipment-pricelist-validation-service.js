(function (angular) {
	'use strict';

	var moduleName = 'resource.plantestimate';
	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateEquipmentPricelistValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('resourcePlantEstimateEquipmentPricelistValidationService', ResourcePlantEstimateEquipmentPricelistValidationService);

	ResourcePlantEstimateEquipmentPricelistValidationService.$inject = [
		'platformValidationServiceFactory', 'platformRuntimeDataService', 'resourcePlantEstimateConstantValues',
		'resourcePlantEstimateEquipmentPricelistDataService','platformDataValidationService', 'basicsCompanyPeriodsService',
		'platformValidationPeriodOverlappingService', 'platformValidationRevalidationEntitiesFactory', 'basicsLookupdataSimpleLookupService'
	];

	function ResourcePlantEstimateEquipmentPricelistValidationService(
		platformValidationServiceFactory, platformRuntimeDataService, resourcePlantEstimateConstantValues,
		resourcePlantEstimateEquipmentPricelistDataService, platformDataValidationService, basicsCompanyPeriodsService,
		platformValidationPeriodOverlappingService, platformValidationRevalidationEntitiesFactory, basicsLookupdataSimpleLookupService
	) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(
			resourcePlantEstimateConstantValues.schemes.plantPrices, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourcePlantEstimateConstantValues.schemes.plantPrices)
			},
			self,
			resourcePlantEstimateEquipmentPricelistDataService);

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
			resourcePlantEstimateConstantValues.schemes.plantPrices,
			specification,
			self,
			resourcePlantEstimateEquipmentPricelistDataService
		);

		self.validateIsManual = function (entity, value) {
			if (value === true) {
				for (var i = 1; i <= 6; i++) {
					platformRuntimeDataService.readonly(entity, [{ field: 'PricePortion' + i, readonly: false }]);
				}
			} else {
				for (var j = 1; j <= 6; j++) {
					platformRuntimeDataService.readonly(entity, [{ field: 'PricePortion' + j, readonly: true }]);
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
			return platformDataValidationService.validateMandatory(entity, value, model, this, resourcePlantEstimateEquipmentPricelistDataService);
		};
		
		this.asyncValidateAdditionalValidTo = function (entity, value) {
			return basicsCompanyPeriodsService.asyncIsPeriodFieldAValidCompanyPeriodField(entity, value, 'to');
		};
		this.asyncValidateAdditionalValidFrom = function (entity, value) {
			return basicsCompanyPeriodsService.asyncIsPeriodFieldAValidCompanyPeriodField(entity, value, 'from');
		};
		this.validateAdditionalValidFrom = function validateAdditionalValidFrom(entity, value, model, entities) {
			let res = platformDataValidationService.validatePeriodSimple(value, entity.ValidTo);
			if (platformDataValidationService.isResultValid(res)) {
				return platformValidationPeriodOverlappingService.validateFrom(
					entity, value, model,
					self, resourcePlantEstimateEquipmentPricelistDataService,
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
					entity, value, model, self, resourcePlantEstimateEquipmentPricelistDataService,
					'ValidFrom', _.filter(entities, e => e.PricelistFk === entity.PricelistFk)
				);
			}
			else {
				return res;
			}
		};

		this.asyncValidatePricelistFk = function (entity, value) {
			if (entity && value) {
				return basicsLookupdataSimpleLookupService.getItemById(value, {
					lookupModuleQualifier: 'basics.customize.equipmentpricelist',
					valueMember: 'Id',
				}).then(function (res) {								
					entity.UomFk = res.UomFk !== null ? res.UomFk : entity.UomFk;
					self.validateUomFk(entity, entity.UomFk, 'UomFk');

				});
			}
			return true;

		};
	}

})(angular);