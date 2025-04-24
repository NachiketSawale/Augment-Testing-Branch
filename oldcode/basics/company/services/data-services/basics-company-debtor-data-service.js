/**
 * Created by baf on 16.05.2019
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('basics.company');

	/**
	 * @ngdoc service
	 * @name basicsCompanyDebtorDataService
	 * @description pprovides methods to access, create and update basics company debtor entities
	 */
	myModule.service('basicsCompanyDebtorDataService', BasicsCompanyDebtorDataService);

	BasicsCompanyDebtorDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'basicsCompanyConstantValues', 'basicsCompanyMainService'];

	function BasicsCompanyDebtorDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                        basicsCommonMandatoryProcessor, basicsCompanyConstantValues, basicsCompanyMainService) {
		var self = this;
		var basicsCompanyDebtorServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'basicsCompanyDebtorDataService',
				entityNameTranslationID: 'basics.company.debtorEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/company/debtor/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = basicsCompanyMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					basicsCompanyConstantValues.schemes.companyDebtor)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = basicsCompanyMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Debtors', parentService: basicsCompanyMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(basicsCompanyDebtorServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'basicsCompanyDebtorValidationService'
		}, basicsCompanyConstantValues.schemes.companyDebtor));
	}
})(angular);
