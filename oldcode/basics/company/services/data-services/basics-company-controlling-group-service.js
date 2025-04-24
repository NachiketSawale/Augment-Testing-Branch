(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCompanyControllingGroupService
	 * @function
	 *
	 * @description
	 * basicsCompanyControllingGroupService is the data service for all CompanyControllingGroup related functionality.
	 */
	var moduleName= 'basics.company';
	var companyModule = angular.module(moduleName);
	companyModule.factory('basicsCompanyControllingGroupService', ['basicsCompanyMainService', 'platformDataServiceFactory', 'basicsCompanyControllingGroupValidationProcessor',

		function ( basicsCompanyMainService, platformDataServiceFactory, basicsCompanyControllingGroupValidationProcessor) {
			var factoryOptions = {
				flatLeafItem: {
					module: companyModule,
					serviceName: 'basicsCompanyControllingGroupService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/company/controllinggroup/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = basicsCompanyMainService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: { delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = basicsCompanyMainService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: { itemName: 'CompanyControllingGroup', parentService: basicsCompanyMainService  }
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = basicsCompanyControllingGroupValidationProcessor;

			return serviceContainer.service;

		}]);
})(angular);
