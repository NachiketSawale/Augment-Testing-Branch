/**
 * Created by jhe on 11/21/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.accountingjournals';
	var module = angular.module(moduleName);

	module.factory('basicsAccountingJournalsTransactionService', ['_', 'basicsAccountingJournalsMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'platformRuntimeDataService',

		function (_, basicsAccountingJournalsMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
			mandatoryProcessor, platformRuntimeDataService) {

			var basicsAccountingJournalsServiceOption = {
				flatLeafItem: {
					module: module,
					serviceName: 'basicsAccountingJournalsTransactionService',
					entityNameTranslationID: 'basics.accountingJournals.listTransactionTitle',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/company/transaction/'
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'CompanyTransactionDto',
						moduleSubModule: 'Basics.Company'
					}), {
						processItem: function processItem(txn) {
							var hdr = basicsAccountingJournalsMainService.getItemById(txn.CompanyTransheaderFk);
							txn.IsSuccess = hdr.IsSuccess;
							platformRuntimeDataService.readonly(txn, txn.IsSuccess);
						}
					}],
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var accountingJournals = basicsAccountingJournalsMainService.getSelected();
								creationData.transheaderId = accountingJournals.Id;
							}
						}
					},
					entityRole: {leaf: {itemName: 'Transaction', parentService: basicsAccountingJournalsMainService}}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsAccountingJournalsServiceOption);
			var service = serviceContainer.service;

			service.getContainerUUID = function getContainerUUID() {
				var containerId = 'a47073dd69804cd2947d6a218433f6fb';
				return containerId;
			};

			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'CompanyTransactionDto',
				moduleSubModule: 'Basics.Company',
				validationService: 'basicsAccountingJournalsTransactionValidationService',
				mustValidateFields: ['DocumentType', 'Currency', 'VoucherNumber']
			});

			service.canCreate = function canCreate() {
				var hdr = basicsAccountingJournalsMainService.getSelected();

				return !!hdr && !hdr.IsSuccess;
			};

			service.canDelete = function canDelete() {
				var txn = service.getSelected();

				return !!txn && !txn.IsSuccess;
			};

			return service;
		}]);
})(angular);
