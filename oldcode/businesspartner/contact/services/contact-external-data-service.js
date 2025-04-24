
(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).factory('businessPartnerContact2ExternalDataService',
		['platformDataServiceFactory', 'businesspartnerContactDataService',
			'globals','basicsCommonMandatoryProcessor',
			function (platformDataServiceFactory, businesspartnerContactDataService,
				globals,basicsCommonMandatoryProcessor
			){

				let serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businessPartnerContact2ExternalDataService',
						entityRole: {leaf: {itemName: 'Contact2External', parentService: businesspartnerContactDataService}},
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/contact/contact2external/', endCreate: 'createnew'},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/contact/contact2external/', endRead: 'list'},
						presenter: {list: { initCreationData: initCreationData}}
					}
				};
				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'Contact2ExternalDto',
					moduleSubModule: 'BusinessPartner.Contact',
					validationService: 'businessPartnerContact2ExternalValidationService',
					mustValidateFields: ['ExternalSourceFk']
				});
				return serviceContainer.service;
				function initCreationData(creationData) {
					let selected = businesspartnerContactDataService.getSelected();
					creationData.mainItemId = selected.Id;
				}

			}]
	);
})(angular);