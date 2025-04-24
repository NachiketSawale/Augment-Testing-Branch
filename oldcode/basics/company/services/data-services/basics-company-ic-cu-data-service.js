/**
 * Created by leo on 18.02.2021
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('basics.company');

	/**
	 * @ngdoc service
	 * @name basicsCompanyICCuDataService
	 * @description pprovides methods to access, create and update basics company IC controllingunit entities
	 */
	myModule.service('basicsCompanyICCuDataService', BasicsCompanyICCuDataService);

	BasicsCompanyICCuDataService.$inject = ['platformDataServiceFactory', 'basicsCompanyMainService', 'basicsCommonMandatoryProcessor'];

	function BasicsCompanyICCuDataService(platformDataServiceFactory, basicsCompanyMainService, mandatoryProcessor) {
		var self = this;
		var basicsCompanyServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'basicsCompanyICCuDataService',
				entityNameTranslationID: 'basics.company.companyICCuEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/company/ICCu/',
					endRead: 'listbyparent',
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
				entityRole: {
					leaf: {itemName: 'ICControllingUnits', parentService: basicsCompanyMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(basicsCompanyServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'CompanyICCuDto',
			moduleSubModule: 'Basics.Company',
			validationService: 'basicsCompanyICCuValidationService'
		});
	}
})(angular);
