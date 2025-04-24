(function () {

	'use strict';
	var companyModule = angular.module('basics.company');
	/**
	 * @ngdoc service
	 * @name basicsCompanySurchargeService
	 * @function
	 *
	 * @description
	 * basicsCompanySurchargeService is the data service for all Company related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	companyModule.factory('basicsCompanySurchargeService', ['globals', 'basicsCompanyMainService', 'platformDataServiceFactory','platformDataServiceProcessDatesBySchemeExtension',

		function (globals, basicsCompanyMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

			var basicsCompanyServiceOption = {
				flatLeafItem: {
					module: companyModule,
					serviceName: 'basicsCompanySurchargeService',
					entityNameTranslationID: 'basics.company.listSurchargeTitle',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/company/surcharge/' },
					httpRead: { route: globals.webApiBaseUrl + 'basics/company/surcharge/' },
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({ typeName: 'Company2CostCodeDto', moduleSubModule: 'Basics.Company'})],
					actions: { delete: true, create: 'flat' },
					entityRole: { leaf: { itemName: 'Surcharge', parentService: basicsCompanyMainService  } }
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCompanyServiceOption);
			//serviceContainer.data.newEntityValidator = basicsCompanySurchargeValidationProcessor;

			return serviceContainer.service;

		}]);
})(angular);
