/*
 * $Id: resource-wot-container-information-service.js 623508 2021-02-11 13:04:50Z nitsche $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var resourceWotModule = angular.module('resource.wot');

	/**
	 * @ngdoc service
	 * @name resourceWotContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	resourceWotModule.service('resourceWotContainerInformationService', ResourceWotContainerInformationService);

	ResourceWotContainerInformationService.$inject = ['platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'resourceCommonLayoutHelperService', 'resourceWotConstantValues'];

	function ResourceWotContainerInformationService(platformLayoutHelperService, basicsLookupdataConfigGenerator,
		resourceCommonLayoutHelperService, resourceWotConstantValues) {
		var self = this;
		var guids = resourceWotConstantValues.uuid.container;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};

			switch (guid) {
				case guids.workOperationTypeList: // resourceWotWorkOperationTypeListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getWorkOperationTypeServiceInfo(), self.getWorkOperationTypeLayout);
					break;
				case guids.workOperationTypeDetails: // resourceWotWorkOperationTypeDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getWorkOperationTypeServiceInfo(), self.getWorkOperationTypeLayout);
					break;
				case guids.operationPlantTypeList: // resourceWotOperationPlantTypeListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getOperationPlantTypeServiceInfo(), self.getOperationPlantTypeLayout);
					break;
				case guids.operationPlantTypeDetails: // resourceWotOperationPlantTypeDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getOperationPlantTypeServiceInfo(), self.getOperationPlantTypeLayout);
					break;
			}

			return config;
		};

		this.getWorkOperationTypeServiceInfo = function getWorkOperationTypeServiceInfo() {
			return {
				standardConfigurationService: 'resourceWotWorkOperationTypeLayoutService',
				dataServiceName: 'resourceWotWorkOperationTypeDataService',
				validationServiceName: 'resourceWotWorkOperationTypeValidationService'
			};
		};

		this.getWorkOperationTypeLayout = function getWorkOperationTypeLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.wot.workoperationtype',
				['code', 'descriptioninfo','uomfk','ishire', 'isminorequipment', 'hasloadingcosts', 'islive','sorting','isdefault','reservationstatusstartfk', 'isestimate']);

			res.overloads = platformLayoutHelperService.getOverloads(['uomfk','reservationstatusstartfk'], self);

			return res;
		};

		this.getOperationPlantTypeServiceInfo = function getOperationPlantTypeServiceInfo() {
			return {
				standardConfigurationService: 'resourceWotOperationPlantTypeLayoutService',
				dataServiceName: 'resourceWotOperationPlantTypeDataService',
				validationServiceName: 'resourceWotOperationPlantTypeValidationService'
			};
		};

		this.getOperationPlantTypeLayout = function getOperationPlantTypeLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.wot.operationplanttype',
				['planttypefk', 'comment', 'isdefault', 'istimekeepingdefault']);

			res.overloads = platformLayoutHelperService.getOverloads(['planttypefk'], self);

			return res;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch(overload) {
				case 'planttypefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomizePantTypeLookupDataService'
					});
					break;
				case 'uomfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						additionalColumns: false
					});
					break;
				case 'reservationstatusstartfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resreservationstatus');
					break;
			}

			return ovl;
		};
	}
})(angular);
