/**
 * Created by baf on 16.05.2019
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('basics.company');

	/**
	 * @ngdoc service
	 * @name basicsCompanyCreditorDataService
	 * @description pprovides methods to access, create and update basics company creditor entities
	 */
	myModule.service('basicsCompanyCreditorDataService', BasicsCompanyCreditorDataService);

	BasicsCompanyCreditorDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'basicsCompanyConstantValues', 'basicsCompanyMainService'];

	function BasicsCompanyCreditorDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                          basicsCommonMandatoryProcessor, basicsCompanyConstantValues, basicsCompanyMainService) {
		var self = this;
		var basicsCompanyCreditorServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'basicsCompanyCreditorDataService',
				entityNameTranslationID: 'basics.company.creditorEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/company/creditor/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = basicsCompanyMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					basicsCompanyConstantValues.schemes.companyCreditor)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = basicsCompanyMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Creditors', parentService: basicsCompanyMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(basicsCompanyCreditorServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'basicsCompanyCreditorValidationService'
		}, basicsCompanyConstantValues.schemes.companyCreditor));
	}
})(angular);
