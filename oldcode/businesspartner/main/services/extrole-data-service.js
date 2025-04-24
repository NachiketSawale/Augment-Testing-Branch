
(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainExtRoleDataService',
		['platformDataServiceFactory', 'businesspartnerMainHeaderDataService',
			'globals','basicsCommonMandatoryProcessor','businesspartnerStatusRightService',
			function (platformDataServiceFactory, businesspartnerMainHeaderDataService,
				globals,basicsCommonMandatoryProcessor,businesspartnerStatusRightService
			){

				let serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businessPartnerMainExtRoleDataService',
						entityRole: {leaf: {itemName: 'BusinessPartnerExtRole', parentService: businesspartnerMainHeaderDataService}},
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/main/extrole/', endCreate: 'create'},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/extrole/', endRead: 'list'},
						presenter: {list: { incorporateDataRead: incorporateDataRead,initCreationData: initCreationData}}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'BusinessPartner2ExtRoleDto',
					moduleSubModule: 'BusinessPartner.Main',
					validationService: 'businessPartnerMainExtRoleValidationService',
					mustValidateFields: ['ExternalRoleFk']
				});
				let canCreate = serviceContainer.service.canCreate;
				serviceContainer.service.canCreate = function () {
					return canCreate() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};

				let canDelete = serviceContainer.service.canDelete;
				serviceContainer.service.canDelete = function () {
					return canDelete() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};
				return serviceContainer.service;
				function initCreationData(creationData) {
					let selected = businesspartnerMainHeaderDataService.getSelected();
					creationData.PKey1 = selected.Id;
				}
				function incorporateDataRead(readData, data) {
					let status = businesspartnerMainHeaderDataService.getItemStatus();
					if (status.IsReadonly === true) {
						businesspartnerStatusRightService.setListDataReadonly(readData, true);
					}
					return data.handleReadSucceeded(readData, data);
				}
			}]
	);
})(angular);