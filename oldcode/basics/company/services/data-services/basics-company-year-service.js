(function () {

	'use strict';
	var companyModule = angular.module('basics.company');
	/**
	 * @ngdoc service
	 * @name basicsCompanyYearService
	 * @function
	 *
	 * @description
	 * basicsCompanyYearService is the data service for all Company related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	companyModule.factory('basicsCompanyYearService', ['$http', 'globals', 'basicsCompanyMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCompanyYearValidationProcessor',

		function ($http, globals, basicsCompanyMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCompanyYearValidationProcessor) {
			var serviceContainer;

			var basicsCompanyServiceOption = {
				flatNodeItem: {
					module: companyModule,
					serviceName: 'basicsCompanyYearService',
					entityNameTranslationID: 'basics.company.entityBusinessYear',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/company/year/'},
					httpRead: {route: globals.webApiBaseUrl + 'basics/company/year/'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData, data) {

								var listYear = serviceContainer.data.itemList;
								if (!_.isEmpty(listYear)) {
									creationData.maxYearDto = _.maxBy(listYear, 'TradingYear');
									creationData.mainItemId = data.currentParentItem.Id;
								} else {
									creationData.maxYearDto = null;
									creationData.mainItemId = data.currentParentItem.Id;
								}
							}
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'CompanyYearDto',
						moduleSubModule: 'Basics.Company'
					})],
					actions: {delete: true, create: 'flat'},
					entityRole: {
						node: {itemName: 'Year', parentService: basicsCompanyMainService}
					}
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(basicsCompanyServiceOption);
			serviceContainer.data.newEntityValidator = basicsCompanyYearValidationProcessor;

			return serviceContainer.service;
		}]);
})(angular);
