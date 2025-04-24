/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const resourcePlantpricingModule = angular.module('resource.plantpricing');

	/**
	 * @ngdoc service
	 * @name resourcePlantpricingContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	resourcePlantpricingModule.service('resourcePlantpricingContainerInformationService', ResourcePlantpricingContainerInformationService);

	ResourcePlantpricingContainerInformationService.$inject = ['platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'resourceCommonLayoutHelperService', 'resourcePlantpricingConstantValues'];
	function ResourcePlantpricingContainerInformationService (platformLayoutHelperService, basicsLookupdataConfigGenerator,
		resourceCommonLayoutHelperService, resourcePlantpricingConstantValues) {
		const self = this;

		/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = null;

			switch (guid) {
				case resourcePlantpricingConstantValues.uuid.container.pricelistTypeList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getPricelistTypeServiceInfo());
					break;
				case resourcePlantpricingConstantValues.uuid.container.pricelistTypeDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPricelistTypeServiceInfo());
					break;
				case resourcePlantpricingConstantValues.uuid.container.pricelistList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getPricelistServiceInfo());
					break;
				case resourcePlantpricingConstantValues.uuid.container.pricelistDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPricelistServiceInfo());
					break;
				case resourcePlantpricingConstantValues.uuid.container.estPricelistList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getEstPricelistServiceInfo());
					break;
				case resourcePlantpricingConstantValues.uuid.container.estPricelistDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getEstPricelistServiceInfo());
					break;
			}

			return config;
		};

		this.getPricelistTypeServiceInfo = function getPricelistTypeServiceInfo() {
			return {
				standardConfigurationService: 'resourcePlantpricingPricelistTypeLayoutService',
				dataServiceName: 'resourcePlantpricingPricelistTypeDataService',
				validationServiceName: 'resourcePlantpricingPricelistTypeValidationService'
			};
		};

		this.getPricelistTypeLayout = function getPricelistTypeLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.plantpricing.pricelisttype',
				['descriptioninfo',
					'isdefault',
					'sorting',
					'islive']);

			res.addAdditionalColumns = true;

			return res;
		};

		this.getPricelistServiceInfo = function getPricelistServiceInfo() {
			return {
				standardConfigurationService: 'resourcePlantpricingPricelistLayoutService',
				dataServiceName: 'resourcePlantpricingPricelistDataService',
				validationServiceName: 'resourcePlantpricingPricelistValidationService'
			};
		};

		this.getPricelistLayout = function getPricelistLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.plantpricing.pricelist',
				['descriptioninfo',
				 'equipmentcontextfk',
				 'equipmentcatalogfk',
				 'currencyfk',
				 'percent',
				 'ismanualeditplantmaster',
				 'ismanualeditjob',
				 'ismanualeditdispatching',
				 'priceportion1name',
				 'priceportion2name',
				 'priceportion3name',
				 'priceportion4name',
				 'priceportion5name',
				 'priceportion6name',
				 'commenttext',
				 'validfrom',
				 'validto',
				 'equipmentcalculationtypefk',
				 'referenceyear',
				 'uomfk']);

			res.overloads = platformLayoutHelperService.getOverloads(
				['equipmentcontextfk',
					'equipmentcatalogfk',
					'currencyfk',
					'equipmentcalculationtypefk',
					'uomfk'], self);

			res.addAdditionalColumns = true;

			return res;
		};

		this.getEstPricelistServiceInfo = function getEstPricelistServiceInfo() {
			return {
				standardConfigurationService: 'resourcePlantpricingEstPricelistLayoutService',
				dataServiceName: 'resourcePlantpricingEstPricelistDataService',
				validationServiceName: 'resourcePlantpricingEstPricelistValidationService'
			};
		};

		this.getEstPricelistLayout = function getEstPricelistLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.plantpricing.estpricelist',
				['descriptioninfo',
					'masterdatalineitemcontextfk',
					'masterdatacontextfk',
					'equipmentdivisionfk',
					'equipmentcalculationtypefk',
					'equipmentcatalogfk',
					'percent',
					'referenceyear',
					'commenttext',
					'isdefault',
					'islive',
					'sorting',
					'uomfk']);

			res.overloads = platformLayoutHelperService.getOverloads(
				['masterdatalineitemcontextfk',
					'masterdatacontextfk',
					'equipmentdivisionfk',
					'equipmentcalculationtypefk',
					'equipmentcatalogfk',
					'uomfk'], self);

			res.addAdditionalColumns = true;

			return res;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch(overload) {
				case 'currencyfk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideCurrencyLookupSpecification()); break;
				case 'equipmentcalculationtypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantcalculationtype'); break;
				case 'equipmentcatalogfk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'resourceCatalogLookupDataService'
				}, {
					required: true
				});
					break;
				case 'equipmentcontextfk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentcontext'); break;
				case 'equipmentdivisionfk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentdivision'); break;
				case 'masterdatacontextfk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.masterdatacontext'); break;
				case 'masterdatalineitemcontextfk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.lineitemcontext.internal'); break;
				case 'uomfk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification()); break;
			}

			return ovl;
		};
	}
})(angular);
