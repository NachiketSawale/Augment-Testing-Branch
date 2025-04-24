(function () {

	'use strict';
	var companyModule = angular.module('basics.company');
	/**
	 * @ngdoc service
	 * @name basicsCompanyCategoryService
	 * @function
	 * @description
	 * basicsCompanyCategoryService is the data service for all Company related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection

	companyModule.factory('basicsCompanyCategoryService', ['globals', 'basicsCompanyMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCompanyCategoryValidationProcessor',
		function (globals, basicsCompanyMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCompanyCategoryValidationProcessor) {

			var basicsCompanyServiceOption = {
				flatLeafItem: {
					module: companyModule,
					serviceName: 'basicsCompanyCategoryService',
					entityNameTranslationID: 'basics.company.listCategoryTitle',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/company/category/'},
					httpRead: {route: globals.webApiBaseUrl + 'basics/company/category/'},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'RubricCategory2CompanyDto',
						moduleSubModule: 'Basics.Company'
					})],
					actions: {delete: true, create: 'flat'},
					entityRole: {leaf: {itemName: 'Category', parentService: basicsCompanyMainService}}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCompanyServiceOption);
			serviceContainer.data.newEntityValidator = basicsCompanyCategoryValidationProcessor;

			return serviceContainer.service;
		}]);
})(angular);
