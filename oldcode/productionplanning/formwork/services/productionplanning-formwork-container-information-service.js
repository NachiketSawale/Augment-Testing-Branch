/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var productionplanningFormworkModule = angular.module('productionplanning.formwork');

	/**
	 * @ngdoc service
	 * @name productionplanningFormworkContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	productionplanningFormworkModule.factory('productionplanningFormworkContainerInformationService', ['$injector', 'ppsCommonClipboardService',
		function ($injector, ppsCommonClipboardService) {
			var service = {};

			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};

				switch (guid) {
					case '941072920c3b42ec9f2e9f222d0432a8': // ppsFormworkListController
						config.layout = $injector.get('ppsFormworkUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'ppsFormworkUIStandardService';
						config.dataServiceName = 'ppsFormworkDataService';
						config.validationServiceName = 'ppsFormworkValidationService';
						config.listConfig = {
							initCalled: false,
							grouping: true,
							type: 'productionplanning.formwork',
							dragDropService: ppsCommonClipboardService
						};
						break;
					case '76f48476ed6743f69a9fd0760cacd681': // ppsFormworkDetailController
						config.layout = $injector.get('ppsFormworkUIStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'ppsFormworkUIStandardService';
						config.dataServiceName = 'ppsFormworkDataService';
						config.validationServiceName = 'ppsFormworkValidationService';
						break;
				}
				return config;
			};

			return service;
		}
	]);
})(angular);
