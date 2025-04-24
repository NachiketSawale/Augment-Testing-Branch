(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainRegionDataService',
		['platformDataServiceFactory', 'businesspartnerMainSubsidiaryDataService', 'globals','basicsCommonMandatoryProcessor',
			function (platformDataServiceFactory, businesspartnerMainSubsidiaryDataService, globals,basicsCommonMandatoryProcessor
			) {

				let serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businessPartnerMainRegionDataService',
						entityRole: {leaf: {itemName: 'Region', parentService: businesspartnerMainSubsidiaryDataService}},
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/main/region/', endCreate: 'create'},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/region/', endRead: 'list'},
						presenter: {list: {initCreationData: initCreationData}}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'RegionDto',
					moduleSubModule: 'BusinessPartner.Main',
					validationService: 'businessPartnerMainRegionValidationService',
					mustValidateFields: ['Code']
				});

				function initCreationData(creationData) {
					let selected = businesspartnerMainSubsidiaryDataService.getSelected();
					creationData.PKey1 = selected.Id;
				}

				return serviceContainer.service;
			}]
	);
})(angular);