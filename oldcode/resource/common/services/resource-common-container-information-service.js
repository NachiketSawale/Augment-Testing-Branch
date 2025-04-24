/*
 * $Id: resource-common-container-information-service.js 547810 2019-06-14 13:16:26Z baf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var resourceCommonModule = angular.module('resource.common');

	/**
	 * @ngdoc service
	 * @name resourceCommonContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	resourceCommonModule.service('resourceCommonContainerInformationService', ResourceCommonContainerInformationService);
	// ResourceCommonContainerInformationService.$inject = [];//Add injections there and provide them as parameter of ResourceCommonContainerInformationService

	function ResourceCommonContainerInformationService() {
		this.getContainerInfoByGuid = function getContainerInfoByGuid() {
			return {};
		};

		this.getPlantLocationListInfo = function getPlantLocationListInfo(dataServiceName) {
			return {
				standardConfigurationService: 'resourceEquipmentPlantAllocationViewUIStandardService',
				dataServiceName: dataServiceName,
				validationServiceName: ''
			};
		};
	}
})(angular);
