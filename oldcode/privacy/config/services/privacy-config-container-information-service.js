/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var privacyConfigModule = angular.module('privacy.config');

	/**
	 * @ngdoc service
	 * @name privacyConfigContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	privacyConfigModule.factory('privacyConfigContainerInformationService', ['$injector',
		function ($injector) {
			var service = {};
			
			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case '2fc25afb5e2b4b06afac50f375b2469a': // privacyConfigHandledTypeListController
						config.layout = $injector.get('privacyConfigHandledTypeConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'privacyConfigHandledTypeConfigurationService';
						config.dataServiceName = 'privacyConfigHandledTypeDataService';
						config.validationServiceName = null;
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case 'daa575f137f247b18b3b2b395f0e40ff': // privacyConfigHandledTypeDetailController
						config.layout = $injector.get('privacyConfigHandledTypeConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'privacyConfigHandledTypeConfigurationService';
						config.dataServiceName = 'privacyConfigHandledTypeDataService';
						config.validationServiceName = null;
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);
