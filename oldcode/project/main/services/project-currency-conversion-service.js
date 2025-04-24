/**
 * Created by baf on 18.11.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCurrencyConversionService
	 * @function
	 * @description
	 * basicsCurrencyConversionService is the data service for Currency Conversion related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('projectMainCurrencyConversionDataService', ['projectMainService', 'platformDataServiceFactory',
		function (projectMainService, platformDataServiceFactory) {

			// The instance of the main service - to be filled with functionality below
			var basicsCurrencyConversionServiceOption = {
				flatLeafItem: {
					module: projectMainModule,
					serviceName: 'projectMainCurrencyConversionDataService',
					entityNameTranslationID: 'cloud.common.entityCurrencyConversion',
					httpRead: {
						route: globals.webApiBaseUrl + 'project/main/currencyconversion/', endRead: 'list', initReadData: function (readData) {
							var project = projectMainService.getSelected();
							var company = project.CompanyFk;
							readData.filter = '?companyId=' + company;
						}
					},
					entitySelection: {},
					entityRole: { leaf: { itemName: 'CurrencyConversion', parentService: projectMainService } },
					actions: {},
					presenter: { list: {} }
				}
			};
			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCurrencyConversionServiceOption);

			return serviceContainer.service;
		}]);
})(angular);
