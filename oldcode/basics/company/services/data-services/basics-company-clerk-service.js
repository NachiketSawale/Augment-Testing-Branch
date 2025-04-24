(function () {

	'use strict';
	var companyModule = angular.module('basics.company');
	/**
	 * @ngdoc service
	 * @name basicsCompanyClerkService
	 * @function
	 *
	 * @description
	 * basicsCompanyClerkService is the data service for all Company related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	companyModule.factory('basicsCompanyClerkService', ['globals', 'basicsCompanyMainService', 'platformDataServiceFactory','platformDataServiceProcessDatesBySchemeExtension',

		function (globals, basicsCompanyMainService, platformDataServiceFactory,platformDataServiceProcessDatesBySchemeExtension) {
			var basicsCompanyServiceOption = {
				flatLeafItem: {
					module: companyModule,
					serviceName: 'basicsCompanyClerkService',
					entityNameTranslationID: 'basics.clerk.entityClerk',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/company/clerk/' },
					httpRead: { route: globals.webApiBaseUrl + 'basics/company/clerk/' },
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({ typeName: 'Company2ClerkDto', moduleSubModule: 'Basics.Company'})],
					actions: { delete: true, create: 'flat' },
					entityRole: { leaf: { itemName: 'Clerk', parentService: basicsCompanyMainService  } }
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCompanyServiceOption);

			return serviceContainer.service;
		}]);
})(angular);
