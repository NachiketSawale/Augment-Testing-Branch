/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var awpMainModule = angular.module('awp.main');

	/**
	 * @ngdoc service
	 * @name awpMainContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	awpMainModule.factory('awpMainContainerInformationService', ['$injector',
		function ($injector) {
			var service = {};
			
			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
/*
				switch (guid) {
					case 'mainEntityGuid': // awpMainMainEntityNameListController
						config.layout = $injector.get('awpMainMainEntityNameConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'awpMainMainEntityNameConfigurationService';
						config.dataServiceName = 'awpMainMainEntityNameDataService';
						config.validationServiceName = null;
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case 'mainEntityDetailsGuid': // awpMainMainEntityNameDetailController
						config.layout = $injector.get('awpMainMainEntityNameConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'awpMainMainEntityNameConfigurationService';
						config.dataServiceName = 'awpMainMainEntityNameDataService';
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
