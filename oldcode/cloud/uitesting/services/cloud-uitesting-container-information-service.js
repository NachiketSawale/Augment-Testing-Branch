/*
 * $Id: cloud-uitesting-container-information-service.js 562411 2019-10-10 11:46:18Z ong $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var cloudUitestingModule = angular.module('cloud.uitesting');

	/**
	 * @ngdoc service
	 * @name cloudUitestingContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	cloudUitestingModule.factory('cloudUitestingContainerInformationService', ['$injector',
		function ($injector) {
			var service = {};
			
			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
/*
				switch (guid) {
					case 'mainEntityGuid': // cloudUitestingMainEntityNameListController
						config.layout = $injector.get('cloudUitestingMainEntityNameConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'cloudUitestingMainEntityNameConfigurationService';
						config.dataServiceName = 'cloudUitestingMainEntityNameDataService';
						config.validationServiceName = null;
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case 'mainEntityDetailsGuid': // cloudUitestingMainEntityNameDetailController
						config.layout = $injector.get('cloudUitestingMainEntityNameConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'cloudUitestingMainEntityNameConfigurationService';
						config.dataServiceName = 'cloudUitestingMainEntityNameDataService';
						config.validationServiceName = null;
						break;
				}
*/

				return config;
			};

			return service;
		}
	]);
})(angular);
