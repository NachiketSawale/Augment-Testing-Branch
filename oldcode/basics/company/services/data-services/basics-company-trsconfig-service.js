/**
 * Created by anl on 10/10/2018.
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'basics.company';
	var companyModule = angular.module(moduleName);
	companyModule.factory('basicsCompanyTrsConfigService', TrsConfigService);
	TrsConfigService.$inject = ['basicsCompanyMainService', 'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor'];

	function TrsConfigService(basicsCompanyMainService, platformDataServiceFactory,
							  basicsCommonMandatoryProcessor) {

		var factoryOptions = {
			flatLeafItem: {
				module: companyModule,
				entityNameTranslationID: 'basics.company.entityTrsConfig',
				serviceName: 'basicsCompanyTrsConfigService',
				httpCreate: {route: globals.webApiBaseUrl + 'basics/company/trsconfig/'},
				httpRead: {route: globals.webApiBaseUrl + 'basics/company/trsconfig/'},
				actions: {
					delete: true, create: 'flat',
					canCreateCallBackFunc: canCreate
				},
				entityRole: {
					leaf: {itemName: 'TrsConfig', parentService: basicsCompanyMainService}
				}
			}
		};


		function canCreate() {
			var selectedCompany = basicsCompanyMainService.getSelected();
			return selectedCompany.CompanyTypeFk !== 2;
		}

		var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'TrsConfigDto',
			moduleSubModule: 'Basics.Company',
			validationService: 'basicsCompanyTrsConfigValidationService'
		});

		return serviceContainer.service;

	}
})(angular);