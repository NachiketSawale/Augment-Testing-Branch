(function () {
	/*global globals*/
	'use strict';
	var companyModule = angular.module('basics.company');
	/**
	 * @ngdoc service
	 * @name basicsCompanyCreateRoleService
	 * @function
	 *
	 * @description
	 * basicsCompanyCreateRoleService is the data service for all Company related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	companyModule.factory('basicsCompanyCreateRoleService', ['_', 'basicsCompanyMainService', 'platformDataServiceFactory', 'basicsCompanyCreateRoleValidationProcessor',

		function (_, basicsCompanyMainService, platformDataServiceFactory, basicsCompanyCreateRoleValidationProcessor ) {

			var basicsCreateRoleServiceOption = {
				flatLeafItem: {
					module: companyModule,
					serviceName: 'basicsCompanyCreateRoleService',
					entityNameTranslationID: 'basics.company.listCreateRoleTitle',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/company/createrole/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = basicsCompanyMainService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = basicsCompanyMainService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {leaf: {itemName: 'CreateRole', parentService: basicsCompanyMainService}}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCreateRoleServiceOption);
			serviceContainer.data.newEntityValidator = basicsCompanyCreateRoleValidationProcessor;
			var service = serviceContainer.service;

			service.canCreate = function canCreate() {
				var createButton = true;
				var selectedCompany = basicsCompanyMainService.getSelected();

				if(selectedCompany !== undefined && selectedCompany !== null){
					if (selectedCompany.CompanyTypeFk === 2){
						createButton = false;
					}else{
						createButton = true;
					}
				}else{
					createButton = false;
				}

				return createButton;
			};

			return service;
		}]);
})(angular);
