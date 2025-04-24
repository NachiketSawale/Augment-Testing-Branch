/*
 * $Id: basics-biplusdesigner-container-information-service.js 604408 2020-09-24 08:43:19Z lta $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var basicsBiPlusDesignerModule = angular.module('basics.biplusdesigner');

	/**
	 * @ngdoc service
	 * @name basicsBiPlusDesignerContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	basicsBiPlusDesignerModule.factory('basicsBiPlusDesignerContainerInformationService', ['$injector',
		function ($injector) {
			var service = {};
			
			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				/*
				switch (guid) {
					case 'mainEntityGuid': // basicsBiPlusDesignerMainEntityNameListController
						config.layout = $injector.get('basicsBiPlusDesignerMainEntityNameConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsBiPlusDesignerMainEntityNameConfigurationService';
						config.dataServiceName = 'basicsBiPlusDesignerMainEntityNameDataService';
						config.validationServiceName = null;
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case 'mainEntityDetailsGuid': // basicsBiPlusDesignerMainEntityNameDetailController
						config.layout = $injector.get('basicsBiPlusDesignerMainEntityNameConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsBiPlusDesignerMainEntityNameConfigurationService';
						config.dataServiceName = 'basicsBiPlusDesignerMainEntityNameDataService';
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
