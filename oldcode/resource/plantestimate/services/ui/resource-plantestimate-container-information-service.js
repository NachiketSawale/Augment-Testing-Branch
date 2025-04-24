/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const resourcePlantestimateModule = angular.module('resource.plantestimate');

	/**
	 * @ngdoc service
	 * @name resourcePlantestimateContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	resourcePlantestimateModule.service('resourcePlantestimateContainerInformationService', ResourcePlantestimateContainerInformationService);

	ResourcePlantestimateContainerInformationService.$inject = ['_', '$injector', 'platformLayoutHelperService',
		'basicsLookupdataLookupFilterService', 'basicsLookupdataConfigGenerator',
		'resourceCommonContextService', 'resourceEquipmentContainerInformationService', 'resourcePlantEstimateConstantValues'];

	function ResourcePlantestimateContainerInformationService (_, $injector, platformLayoutHelperService,
		basicsLookupdataLookupFilterService, basicsLookupdataConfigGenerator,
		resourceCommonContextService, resourceEquipmentContainerInformationService, resourcePlantEstimateConstantValues) {
		const guids = resourcePlantEstimateConstantValues.uuid.container;
		const self = this;
		let dynamicConfigurations = {};
		let masterDataContext = resourceCommonContextService.getMasterDataContext();

		basicsLookupdataLookupFilterService.registerFilter([
			{
				key: 'resource-estimation-group-pricelist-filter',
				fn: function (item, plantestimatepricelist) {
					let plantDataService = $injector.get('resourcePlantEstimateEquipmentDataService');
					let plant = plantDataService.getItemById(plantestimatepricelist.PlantFk);

					return item.MdcContextFk === masterDataContext && item.EtmDivisionFk === plant.EquipmentDivisionFk;
				}
			}
		]);

		/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};

			switch (guid) {
				case guids.plantList:
					config = self.getPlantContainerConfig(guid);
					break;
				case guids.plantDetails:
					config = self.getPlantContainerConfig(guid);
					break;
				case guids.plantAccessoryList:
					config = self.getPlantAccessoryContainerConfig(guid);
					break;
				case guids.plantAccessoryDetails:
					config = self.getPlantAccessoryContainerConfig(guid);
					break;
				case guids.plantAssignmentList:
					config = self.getPlantAssignmentContainerConfig(guid);
					break;
				case guids.plantAssignmentDetails:
					config = self.getPlantAssignmentContainerConfig(guid);
					break;
				case guids.plantCatalogCalcList:
					config = self.getPlantCatalogCalcContainerConfig(guid);
					break;
				case guids.plantCatalogCalcDetails:
					config = self.getPlantCatalogCalcContainerConfig(guid);
					break;
				case guids.plantEstimatePriceListList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlantEstimatePriceListServiceInfos());
					break;
				case guids.plantEstimatePriceListDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlantEstimatePriceListServiceInfos());
					break;
				case guids.plantPricesList:
					config = self.getPlantPricesContainerConfig(guid);
					break;
				case guids.plantPricesDetails:
					config = self.getPlantPricesContainerConfig(guid);
					break;
				case guids.sourceCatalogRecord1:
					config = resourceEquipmentContainerInformationService.getContainerInfoByGuid(guid);
					break;
				case guids.sourceCatalogRecord2:
					config = resourceEquipmentContainerInformationService.getContainerInfoByGuid(guid);
					break;
				case guids.specificValueList:
					config = self.getPlantSpecificValuesContainerConfig(guid);
					break;
				case guids.specificValueDetails:
					config = self.getPlantSpecificValuesContainerConfig(guid);
					break;

				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : null;
					break;
			}

			return config;
		};


		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNil(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};

		this.getPlantContainerConfig = function getPlantContainerConfig(guid) {
			let config = resourceEquipmentContainerInformationService.getContainerInfoByGuid(guid);
			config.dataServiceName = 'resourcePlantEstimateEquipmentDataService';
			config.validationServiceName = 'resourcePlantEstimateEquipmentValidationService';

			return config;
		};

		this.getPlantAccessoryContainerConfig = function getPlantAccessoryContainerConfig(guid) {
			let config = resourceEquipmentContainerInformationService.getContainerInfoByGuid(guid);
			config.dataServiceName = 'resourcePlantEstimateEquipmentAccessoryDataService';
			config.validationServiceName = 'resourcePlantEstimateEquipmentAccessoryValidationService';

			return config;
		};

		this.getPlantAssignmentContainerConfig = function getPlantAssignmentContainerConfig(guid) {
			let config = resourceEquipmentContainerInformationService.getContainerInfoByGuid(guid);
			config.dataServiceName = 'resourcePlantEstimateEquipmentAssignmentDataService';
			config.validationServiceName = 'resourcePlantEstimateEquipmentAssignmentValidationService';

			return config;
		};

		this.getPlantCatalogCalcContainerConfig = function getPlantCatalogCalcContainerConfig(guid) {
			let config = resourceEquipmentContainerInformationService.getContainerInfoByGuid(guid);

			config.dataServiceName = 'resourcePlantEstimateEquipmentEurolistDataService';
			config.validationServiceName = 'resourcePlantEstimateEquipmentEurolistValidationService';
			config.listConfig.dragDropService = $injector.get('resourcePlantEstimateEurolistDropService');

			return config;
		};

		this.getPlantEstimatePriceListServiceInfos = function getPlantEstimatePriceListServiceInfos() {
			return {
				standardConfigurationService: 'resourcePlantEstimatePriceListLayoutService',
				dataServiceName: 'resourcePlantEstimatePriceListDataService',
				validationServiceName: 'resourcePlantEstimatePriceListValidationService',
			};
		};

		this.getPlantEstimatePriceListLayout = function getPlantEstimatePriceListLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipment.plant2estimatepricelist', ['plantestimatepricelistfk', 'uomfk', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['plantestimatepricelistfk', 'uomfk'], self);
			return res;
		};

		this.getPlantPricesContainerConfig = function getPlantPricesContainerConfig(guid) {
			let config = resourceEquipmentContainerInformationService.getContainerInfoByGuid(guid);
			config.dataServiceName = 'resourcePlantEstimateEquipmentPricelistDataService';
			config.validationServiceName = 'resourcePlantEstimateEquipmentPricelistValidationService';

			return config;
		};

		this.getPlantSpecificValuesContainerConfig = function getPlantSpecificValuesContainerConfig(guid) {
			let config = resourceEquipmentContainerInformationService.getContainerInfoByGuid(guid);
			config.dataServiceName = 'resourcePlantEstimateEquipmentSpecificValueDataService';
			config.validationServiceName = 'resourcePlantEstimateEquipmentSpecificValueValidationService';

			return config;
		};

		this.getOverload = function getOverload(overload) {
			let ovl = null;

			switch (overload) {
				case 'plantestimatepricelistfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantestimatepricelist', null, {
						filterKey: 'resource-estimation-group-pricelist-filter',
						customIntegerProperty: 'MDC_CONTEXT_FK',
						customIntegerProperty1: 'ETM_DIVISION_FK',
					});
					break;

				case 'uomfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						additionalColumns: false,
					});
					break;
			}

			return ovl;
		};
	}
})(angular);
