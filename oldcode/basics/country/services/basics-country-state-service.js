(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCountryMainService
	 * @function
	 *
	 * @description
	 * basicsCountryMainService is the data service for all Country related functionality.
	 */
	var moduleName = 'basics.country';
	var countryModule = angular.module(moduleName);
	countryModule.factory('basicsCountryStateService', ['basicsCountryMainService', 'platformDataServiceFactory', 'basicsCountryStateValidationProcessor',

		function (basicsCountryMainService, platformDataServiceFactory, basicsCountryStateValidationProcessor) {
			var factoryOptions = {
				flatLeafItem: {
					module: countryModule,
					serviceName: 'basicsCountryStateService',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/country/state/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/country/state/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = basicsCountryMainService.getSelected();
							readData.Id = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = basicsCountryMainService.getSelected();
								creationData.Id = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'State', parentService: basicsCountryMainService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = basicsCountryStateValidationProcessor;
			return serviceContainer.service;

		}]);
})(angular);
