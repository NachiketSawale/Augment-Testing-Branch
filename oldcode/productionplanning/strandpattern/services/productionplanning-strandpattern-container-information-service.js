/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var pmodule = angular.module('productionplanning.strandpattern');

	/**
	 * @ngdoc service
	 * @name productionplanningStrandpatternContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	pmodule.factory('productionplanningStrandpatternContainerInformationService', ['$injector',
		function ($injector) {
			var service = {};

			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};

				switch (guid) {
					case '3efc0cfe89e54204b714580fc08b4ddf': // Strandpattern List Controller
						config.layout = $injector.get('productionplanningStrandpatternUIService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'productionplanningStrandpatternUIService';
						config.dataServiceName = 'productionplanningStrandpatternDataService';
						config.validationServiceName = 'productionplanningStrandpatternValidationService';
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case '719b1749c8224e22b0594293681281f5': // Strandpattern Detail Controller
						config.layout = $injector.get('productionplanningStrandpatternUIService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'productionplanningStrandpatternUIService';
						config.dataServiceName = 'productionplanningStrandpatternDataService';
						config.validationServiceName = 'productionplanningStrandpatternValidationService';
						break;
					case '3105a9e9ef8444c1bea3966fd6cb3052': // Strandpattern2PpsMaterial List Controller
						config.layout = $injector.get('productionplanningStrandpattern2materialUIService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'productionplanningStrandpattern2materialUIService';
						config.dataServiceName = 'productionplanningStrandpattern2materialDataService';
						config.validationServiceName = 'productionplanningStrandpattern2materialValidationService';
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
				}


				return config;
			};

			return service;
		}
	]);
})(angular);
