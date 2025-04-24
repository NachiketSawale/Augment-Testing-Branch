(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).factory('businesspartnerContact2BpAssignmentDataService', [
		'platformDataServiceFactory', 'businesspartnerContactDataService', 'platformModalService', '$translate', '$injector',
		'platformRuntimeDataService', 'PlatformMessenger',
		function (platformDataServiceFactory, businesspartnerContactDataService, platformModalService, $translate, $injector,
			platformRuntimeDataService, PlatformMessenger) {
			// ////////////////////////////////////////////////////////////
			/*
		 * Note: Due to the requirement of BP assignment isn't confirmed yet,
		 * for saving the code change and assure no impact on original function,
		 * add a switch named 'isSwitchOn' to enable/disable bp assignment service
			 */
			let isSwitchOn = true;
			// ////////////////////////////////////////////////////////////

			let serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'businesspartnerContact2BpAssignmentDataService',
					//dataProcessor: [{processItem: processItem}],
					httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/contact/businesspartnerassignment/'},
					httpRead: {route: globals.webApiBaseUrl + 'businesspartner/contact/businesspartnerassignment/'},
					entityRole: {
						leaf: {
							itemName: 'BusinessPartnerAssignment',
							parentService: businesspartnerContactDataService,
							doesRequireLoadAlways: true
						}
					}
				}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOptions);
			let service = container.service;
			container.data.newEntityValidator = {
				validate: processItem
			};
			let loadFunction = service.load;
			service.load = function () {
				if (isSwitchOn === true)
					loadFunction();
			};

			service.deleteEntities = function () {
				let entities = service.getSelectedEntities(container.data);
				if (entities.length > 0) {
					for (let i = 0; i < entities.length; ++i) {
						if (entities[i].IsMain === true) {
							let errMsg = $translate.instant('businesspartner.contact.businessPartnerAssignment.deleteError');
							platformModalService.showErrorBox(errMsg, 'cloud.common.errorMessage');
							return;
						}
					}

					container.data.deleteEntities(entities, container.data);
				}
			};

			service.subsidiaryChanged = new PlatformMessenger();
			service.contactRoleChanged = new PlatformMessenger();
			service.subsidiaryChanged.register(syncContactField);
			service.contactRoleChanged.register(syncContactField);

			function syncContactField(args) {
				if (args.isMain !== true)
					return;

				let contact = businesspartnerContactDataService.getSelected();
				if (contact && contact[args.field] !== args.value) {
					contact[args.field] = args.value;
					businesspartnerContactDataService.markItemAsModified(contact);
					businesspartnerContactDataService.gridRefresh();
				}
			}

			function processItem(item) {
				if (item) {
					let validationService = $injector.get('businessPartnerContact2BpAssignmentValidationService');
					validationService.validateBusinessPartnerFk(item, item.BusinessPartnerFk, 'BusinessPartnerFk');

					if (item.IsMain === true) {
						platformRuntimeDataService.readonly(item, [{field: 'BusinessPartnerFk', readonly: true}]);
					}
				}
			}

			return service;
		}
	]);
})(angular);
