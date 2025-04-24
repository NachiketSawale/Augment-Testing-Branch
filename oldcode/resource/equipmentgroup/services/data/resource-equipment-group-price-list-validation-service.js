/**
 * Created by baf on 26.09.2018
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupPriceListValidationService
	 * @description provides validation methods for resource equipmentGroup priceList entities
	 */
	angular.module(moduleName).service('resourceEquipmentGroupPriceListValidationService', ResourceEquipmentGroupPriceListValidationService);

	ResourceEquipmentGroupPriceListValidationService.$inject = ['platformRuntimeDataService', 'platformDataValidationService', 'platformContextService', 'platformValidationRevalidationEntitiesFactory',
		'platformValidationPeriodOverlappingService', 'platformValidationServiceFactory', 'basicsCompanyPeriodsService','basicsLookupdataSimpleLookupService',
		'resourceEquipmentGroupPriceListDataService', 'resourceEquipmentGroupConstantValues'
	];

	function ResourceEquipmentGroupPriceListValidationService(platformRuntimeDataService, platformDataValidationService, platformContextService, platformValidationRevalidationEntitiesFactory,
		platformValidationPeriodOverlappingService, platformValidationServiceFactory, basicsCompanyPeriodsService,basicsLookupdataSimpleLookupService,
																														resourceEquipmentGroupPriceListDataService, resourceEquipmentGroupConstantValues) {

		const self = this;

		platformValidationServiceFactory.addValidationServiceInterface(
			resourceEquipmentGroupConstantValues.schemes.groupPrice, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentGroupConstantValues.schemes.groupPrice)
			},
			self,
			resourceEquipmentGroupPriceListDataService);

		let specification = {
			customValidations: [
				{
					model: 'PlantPriceListFk',
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
			resourceEquipmentGroupConstantValues.schemes.groupPrice,
			specification,
			self,
			resourceEquipmentGroupPriceListDataService
		);

		self.validateIsManual = function (entity, value) {
			if (value === true) {
				for (let i = 1; i <= 6; i++) {
					platformRuntimeDataService.readonly(entity, [{ field: 'PricePortion0' + i, readonly: false }]);
					platformRuntimeDataService.readonly(entity, [{ field: 'QualityFactor', readonly: false }]);
				}
			} else {
				for (let j = 1; j <= 6; j++) {
					platformRuntimeDataService.readonly(entity, [{ field: 'PricePortion0' + j, readonly: true }]);
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
		self.calcPricePortionSum = self.getCalcPricePortionSum(self.getPricePortionCandidates('PricePortion0'));

		self.validatePricePortion01 = function (entity, value, model) {
			entity.PricePortionSum = self.calcPricePortionSum(entity, value, model);
		};
		self.validatePricePortion02 = function (entity, value, model) {
			entity.PricePortionSum = self.calcPricePortionSum(entity, value, model);
		};
		self.validatePricePortion03 = function (entity, value, model) {
			entity.PricePortionSum = self.calcPricePortionSum(entity, value, model);
		};
		self.validatePricePortion04 = function (entity, value, model) {
			entity.PricePortionSum = self.calcPricePortionSum(entity, value, model);
		};
		self.validatePricePortion05 = function (entity, value, model) {
			entity.PricePortionSum = self.calcPricePortionSum(entity, value, model);
		};
		self.validatePricePortion06 = function (entity, value, model) {
			entity.PricePortionSum = self.calcPricePortionSum(entity, value, model);
		};

		self.validateUomFk = function (entity, value, model) {
			if (value === 0) {
				value = null;
			}
			return platformDataValidationService.validateMandatory(entity, value, model, this, resourceEquipmentGroupPriceListDataService);
		};

		this.asyncValidateAdditionalValidTo = function (entity, value) {
			let companyId = platformContextService.clientId;

			return basicsCompanyPeriodsService.asyncIsPeriodFieldAValidCompanyPeriodField(entity, value, 'to', companyId);
		};

		this.asyncValidateAdditionalValidFrom = function (entity, value) {
			let companyId = platformContextService.clientId;

			return basicsCompanyPeriodsService.asyncIsPeriodFieldAValidCompanyPeriodField(entity, value, 'from', companyId);
		};

		this.validateAdditionalValidFrom = function validateAdditionalValidFrom(entity, value, model, entities) {
			let res = platformDataValidationService.validatePeriodSimple(value, entity.ValidTo);
			if (platformDataValidationService.isResultValid(res)) {
				return platformValidationPeriodOverlappingService.validateFrom(
					entity, value, model,
					self, resourceEquipmentGroupPriceListDataService,
					'ValidTo', _.filter(entities, ent => ent.PlantPriceListFk === entity.PlantPriceListFk)
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
					entity, value, model, self, resourceEquipmentGroupPriceListDataService,
					'ValidFrom', _.filter(entities, e => e.PlantPriceListFk === entity.PlantPriceListFk)
				);
			}
			else {
				return res;
			}
		};

		this.asyncValidateAdditionalPlantPriceListFk = function asyncValidateAdditionalPlantPriceListFk(entity, value) {
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


