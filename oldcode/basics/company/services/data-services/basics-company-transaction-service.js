(function () {
	/*global globals*/
	'use strict';
	var companyModule = angular.module('basics.company');
	/**
	 * @ngdoc service
	 * @name basicsCompanyTransactionService
	 * @function
	 *
	 * @description
	 * basicsCompanyTransactionService is the data service for all Company related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	companyModule.factory('basicsCompanyTransactionService', ['_', 'platformRuntimeDataService', 'basicsCompanyTransheaderService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCompanyTransactionValidationProcessor',

		function (_, platformRuntimeDataService, basicsCompanyTransheaderService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCompanyTransactionValidationProcessor) {

			var basicsTransheaderServiceOption = {
				flatLeafItem: {
					module: companyModule,
					serviceName: 'basicsCompanyTransactionService',
					entityNameTranslationID: 'basics.company.entityTransaction',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/company/transaction/'
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'CompanyTransactionDto',
						moduleSubModule: 'Basics.Company'
					}),{
						processItem: function processItem(txn) {
							var hdr = basicsCompanyTransheaderService.getItemById(txn.CompanyTransheaderFk);
							txn.IsSuccess = hdr.IsSuccess;
							platformRuntimeDataService.readonly(txn, txn.IsSuccess);
						}
					}],
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var compTransheader = basicsCompanyTransheaderService.getSelected();
								creationData.transheaderId = compTransheader.Id;
								creationData.transheader = compTransheader;
							}
						}
					},
					entityRole: {leaf: {itemName: 'Transaction', parentService: basicsCompanyTransheaderService}}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsTransheaderServiceOption);
			serviceContainer.data.newEntityValidator = basicsCompanyTransactionValidationProcessor;
			var service = serviceContainer.service;

			service.getContainerUUID = function getContainerUUID() {
				return 'a47073dd69804cd2947d6a218433f6fb';
			};

			service.canCreate = function canCreate() {
				var hdr = basicsCompanyTransheaderService.getSelected();

				return !!hdr && !hdr.IsSuccess;
			};

			service.canDelete = function canDelete() {
				var txn = service.getSelected();

				return !!txn && !txn.IsSuccess;
			};

			return service;
		}]);
})(angular);
