(function () {
	/*global globals*/
	'use strict';
	var companyModule = angular.module('basics.company');
	/**
	 * @ngdoc service
	 * @name basicsCompanyDeferaltypeService
	 * @function
	 *
	 * @description
	 * basicsCompanyDeferaltypeService is the data service for all Company related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	companyModule.factory('basicsCompanyDeferaltypeService', ['_', 'basicsCompanyMainService', 'platformDataServiceFactory','basicsCompanyDeferaltypeValidationProcessor',

		function (_, basicsCompanyMainService, platformDataServiceFactory, basicsCompanyDeferaltypeValidationProcessor) {

			var basicsDeferaltypeServiceOption = {
				flatLeafItem: {
					module: companyModule,
					serviceName: 'basicsCompanyDeferaltypeService',
					entityNameTranslationID: 'basics.company.entityDeferalType',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/company/deferaltype/'
					},
					translation: {
						uid: 'basicsCompanyMainService',
						title: 'basics.company.listDeferaltypeTitle',
						columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
						dtoScheme: { typeName: 'CompanyDeferaltypeDto', moduleSubModule: 'Basics.Company' }
					},
					actions: {delete: true, create: 'flat'},
					// presenter: {
					// 	list: {
					// 		initCreationData: function initCreationData(creationData) {
					// 			var comp = basicsCompanyMainService.getSelected();
					// 			creationData.mainItemId = comp.Id;
					// 										}
					// 	}
					// },
					entityRole: {leaf: {itemName: 'Deferaltype', parentService: basicsCompanyMainService}}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsDeferaltypeServiceOption);
			serviceContainer.data.newEntityValidator = basicsCompanyDeferaltypeValidationProcessor;



			return serviceContainer.service;
		}]);
})(angular);
