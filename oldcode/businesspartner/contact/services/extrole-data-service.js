
(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).factory('businessPartnerContactExtRoleDataService',
		['platformDataServiceFactory', 'businesspartnerContactDataService',
			'globals','basicsCommonMandatoryProcessor',
			function (platformDataServiceFactory, businesspartnerContactDataService,
				globals,basicsCommonMandatoryProcessor
			){

				let serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businessPartnerContactExtRoleDataService',
						entityRole: {leaf: {itemName: 'ContactExtRole', parentService: businesspartnerContactDataService}},
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/contact/extrole/', endCreate: 'create'},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/contact/extrole/', endRead: 'list'},
						presenter: {list: { initCreationData: initCreationData}}
					}
				};
				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'Contact2ExtRoleDto',
					moduleSubModule: 'BusinessPartner.Contact',
					validationService: 'businessPartnerContactExtRoleValidationService',
					mustValidateFields: ['ExternalRoleFk']
				});
				return serviceContainer.service;
				function initCreationData(creationData) {
					let selected = businesspartnerContactDataService.getSelected();
					creationData.PKey1 = selected.Id;
				}

			}]
	);
})(angular);