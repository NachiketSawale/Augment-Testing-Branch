/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var productionPlanningFormulaConfigurationModule = angular.module('productionplanning.formulaconfiguration');

	/**
	 * @ngdoc service
	 * @name productionPlanningFormulaConfigurationContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	productionPlanningFormulaConfigurationModule.factory('productionplanningFormulaconfigurationContainerInformationService', ['$injector',
		function ($injector) {
			var service = {};

			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};

				switch (guid) {
					case '025e8f7c4d624f31bcc7d5a493bdbca4': // ppsFormulaListController
						config.layout = $injector.get('ppsFormulaUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'ppsFormulaUIStandardService';
						config.dataServiceName = 'ppsFormulaDataService';
						config.validationServiceName = 'ppsFormulaValidationService';
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case '462bbc55ac864fc2a2078ed568f4debd': // ppsFormulaDetailController
						config.layout = $injector.get('ppsFormulaUIStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'ppsFormulaUIStandardService';
						config.dataServiceName = 'ppsFormulaDataService';
						config.validationServiceName = 'ppsFormulaValidationService';
						break;
					case '7d65f3bd54224873bef7ef881eeab365': // ppsFormulaVersionListController
						config.layout = $injector.get('ppsFormulaVersionUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'ppsFormulaVersionUIStandardService';
						config.dataServiceName = 'ppsFormulaVersionDataService';
						config.validationServiceName = 'ppsFormulaVersionValidationService';
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case '204126a8563e49caa9aa4fa95ff5c786': // ppsFormulaInstanceListController
						config.layout = $injector.get('ppsFormulaInstanceUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'ppsFormulaInstanceUIStandardService';
						config.dataServiceName = 'ppsFormulaInstanceDataService';
						config.validationServiceName = 'ppsFormulaInstanceValidationService';
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case 'b70a255d837043c09bf55d3309e98d62': // ppsFormulaParameterListController
						config.layout = $injector.get('productionplanningFormulaConfigurationParameterUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'productionplanningFormulaConfigurationParameterUIStandardService';
						config.dataServiceName = 'ppsFormulaParameterDataService';
						config.validationServiceName = $injector.get('productionplanningFormulaConfigurationParameterValidationServiceFactory').getService({'dataService': $injector.get('ppsFormulaParameterDataService')});
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
