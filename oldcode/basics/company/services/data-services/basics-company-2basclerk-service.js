(function () {

	'use strict';
	var companyModule = angular.module('basics.company');
	/**
	 * @ngdoc service
	 * @name basicsCompany2BasClerkService
	 * @function
	 *
	 * @description
	 * basicsCompany2BasClerkService is the data service for all Company related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	companyModule.factory('basicsCompany2BasClerkService', ['globals', 'basicsCompanyMainService', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',

		function (globals, basicsCompanyMainService, platformDataServiceFactory,
		          platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor) {
			var basicsCompanyServiceOption = {
				flatLeafItem: {
					module: companyModule,
					serviceName: 'basicsCompany2BasClerkService',
					entityNameTranslationID: 'basics.company.basListClerksTitle',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/company/basclerk/' },
					httpRead: { route: globals.webApiBaseUrl + 'basics/company/basclerk/' },
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({ typeName: 'Company2BasClerkDto', moduleSubModule: 'Basics.Company'})],
					actions: { delete: true, create: 'flat' },
					entityRole: { leaf: { itemName: 'BasClerk', parentService: basicsCompanyMainService  }}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCompanyServiceOption);
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'Company2BasClerkDto',
				moduleSubModule: 'Basics.Company',
				validationService: 'basicsCompany2BasClerkValidationService'
			});

			return serviceContainer.service;
		}]);
})(angular);
