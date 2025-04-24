/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var controllingEnterpriseModule = angular.module('controlling.enterprise');

	/**
	 * @ngdoc service
	 * @name controllingEnterpriseContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	controllingEnterpriseModule.factory('controllingEnterpriseContainerInformationService', [/* '$injector', */
		function (/* $injector */) {
			var service = {};
			
			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(/* guid */) {
				var config = {};
				/*
				switch (guid) {
					case 'mainEntityGuid': // controllingEnterpriseMainEntityNameListController
						config.layout = $injector.get('controllingEnterpriseMainEntityNameConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'controllingEnterpriseMainEntityNameConfigurationService';
						config.dataServiceName = 'controllingEnterpriseMainEntityNameDataService';
						config.validationServiceName = null;
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case 'mainEntityDetailsGuid': // controllingEnterpriseMainEntityNameDetailController
						config.layout = $injector.get('controllingEnterpriseMainEntityNameConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'controllingEnterpriseMainEntityNameConfigurationService';
						config.dataServiceName = 'controllingEnterpriseMainEntityNameDataService';
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
