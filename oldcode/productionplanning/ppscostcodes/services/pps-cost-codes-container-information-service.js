/*
 * $Id: productionplanning-ppscostcodes-container-information-service.js 64239 2022-11-30 08:03:08Z jay.ma $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const productionPlanningPpsCostCodesModule = angular.module('productionplanning.ppscostcodes');

	/**
	 * @ngdoc service
	 * @name productionplanningPpscostcodesContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	productionPlanningPpsCostCodesModule.factory('productionplanningPpscostcodesContainerInformationService', containerInformationService);

	containerInformationService.$inject = ['$injector', 'ppsCostCodesConstantValues'];

	function containerInformationService($injector, ppsCostCodesConstantValues) {
		const service = {};

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			const config = {};
			let layoutService = null;

			switch (guid) {
				case ppsCostCodesConstantValues.uuid.container.costCodeList:
					layoutService = $injector.get('ppsCostCodesUIStandardService');
					config.layout = layoutService.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsCostCodesUIStandardService';
					config.dataServiceName = 'ppsCostCodesDataService';
					config.validationServiceName = 'ppsCostCodesValidationService';
					config.listConfig = {
						initCalled: false,
						columns: [],
						parentProp: 'CostCodeParentFk',
						childProp: 'CostCodes',
					};
					break;
				case ppsCostCodesConstantValues.uuid.container.costCodeDetail:
					layoutService = $injector.get('ppsCostCodesUIStandardService');
					config.layout = layoutService.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'ppsCostCodesUIStandardService';
					config.dataServiceName = 'ppsCostCodesDataService';
					config.validationServiceName = 'ppsCostCodesValidationService';
					break;
			}

			return config;
		};

		return service;
	}
})(angular);
