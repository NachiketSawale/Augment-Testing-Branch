/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var controllingActualsModule = angular.module('controlling.actuals');

	/**
	 * @ngdoc service
	 * @name controllingActualsContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	controllingActualsModule.factory('controllingActualsContainerInformationService', ['$injector',
		function ($injector) {
			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};

				switch (guid) {
					case 'bb7a4b489f674664a5f853259d5382ff': // controllingActualsCostHeaderListController
						config.layout = $injector.get('controllingActualsUIConfigurationService').getCompanyCostHeaderDetailLayout();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'controllingActualsCostHeaderConfigurationService';
						config.dataServiceName = 'controllingActualsCostHeaderListService';
						config.validationServiceName = null;
						config.listConfig = {
							initCalled: false,
							grouping: true,
							type : 'controlling.actuals.costheader',
							dragDropService : $injector.get('controllingCommonClipboardService')
						};
						break;
					case 'bd82c66d78c84a3ca67c3baf4135fd98': // controllingActualsCostHeaderDetailController
						config.layout = $injector.get('controllingActualsUIConfigurationService').getCompanyCostHeaderDetailLayout();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'controllingActualsCostHeaderConfigurationService';
						config.dataServiceName = 'controllingActualsCostHeaderListService';
						config.validationServiceName = null;
						break;

					case '519f57ab55da420694b4d52264db09b4': // controllingActualsCostDataListController
						config.layout = $injector.get('controllingActualsUIConfigurationService').getCompanyCostDataDetailLayout();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'controllingActualsCostDataConfigurationService';
						config.dataServiceName = 'controllingActualsCostDataListService';
						config.validationServiceName = null;
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case '8c235d8d773a4828995911974a6b4a87': // controllingActualsCostDataDetailController
						config.layout = $injector.get('controllingActualsUIConfigurationService').getCompanyCostDataDetailLayout();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'controllingActualsCostDataConfigurationService';
						config.dataServiceName = 'controllingActualsCostDataDetailService';
						config.validationServiceName = null;
						break;
				}


				return config;
			};

			return service;
		}
	]);
})(angular);
