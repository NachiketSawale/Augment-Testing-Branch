(function () {

	'use strict';
	var companyModule = angular.module('basics.company');
	/**
	 * @ngdoc service
	 * @name basicsCompanyTextModuleService
	 * @function
	 *
	 * @description
	 * basicsCompanyTextModuleService is the data service for all Company related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	companyModule.factory('basicsCompanyTextModuleService', ['globals', 'basicsCompanyMainService', 'platformDataServiceFactory',

		function (globals, basicsCompanyMainService, platformDataServiceFactory) {

			var basicsCompanyServiceOption = {
				flatLeafItem: {
					module: companyModule,
					serviceName: 'basicsCompanyTextModuleService',
					entityNameTranslationID: 'basics.company.entityPeriod',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/company/textmodule/' },
					httpRead: { route: globals.webApiBaseUrl + 'basics/company/textmodule/' },
					actions: { delete: true, create: 'flat' },
					entityRole: { leaf: { itemName: 'TextModule', parentService: basicsCompanyMainService  } }
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCompanyServiceOption);
			//serviceContainer.data.newEntityValidator = basicsCompanyTextModuleValidationProcessor;

			return serviceContainer.service;
		}]);
})(angular);
