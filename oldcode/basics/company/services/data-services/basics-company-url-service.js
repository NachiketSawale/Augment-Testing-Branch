(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCompanyUrlService
	 * @function
	 *
	 * @description
	 * basicsCompanyUrlService is the data service for all CompanyUrl related functionality.
	 */
	var moduleName= 'basics.company';
	var companyModule = angular.module(moduleName);
	companyModule.factory('basicsCompanyUrlService', ['basicsCompanyMainService', 'platformDataServiceFactory',

		function ( basicsCompanyMainService, platformDataServiceFactory) {
			var factoryOptions = {
				flatLeafItem: {
					module: companyModule,
					serviceName: 'basicsCompanyUrlService',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/company/url/' },
					httpRead: { route: globals.webApiBaseUrl + 'basics/company/url/'},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: { itemName: 'Url', parentService: basicsCompanyMainService  }
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			return serviceContainer.service;

		}]);
})(angular);
