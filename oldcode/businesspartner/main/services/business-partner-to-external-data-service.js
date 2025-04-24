/**
 * Created by xai on 5/7/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartner2ExternalDataService',
		['_', '$timeout', 'platformDataServiceFactory', 'platformContextService', 'basicsLookupdataLookupDescriptorService', 'businesspartnerMainHeaderDataService',
			'basicsLookupdataLookupFilterService', 'businessPartner2ExternalValidationService', 'platformRuntimeDataService', 'PlatformMessenger',
			'globals', 'platformSchemaService', 'platformDataServiceSelectionExtension', 'businesspartnerStatusRightService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function (_, $timeout, platformDataServiceFactory, platformContextService, basicsLookupdataLookupDescriptorService, businesspartnerMainHeaderDataService,
				basicsLookupdataLookupFilterService, businessPartner2ExternalValidationService, platformRuntimeDataService, PlatformMessenger,
				globals, platformSchemaService, platformDataServiceSelectionExtension, businesspartnerStatusRightService) {

				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businessPartner2ExternalDataService',
						dataProcessor: [{processItem: processItem}],
						entityRole: {leaf: {itemName: 'BusinessPartner2External', parentService: businesspartnerMainHeaderDataService}},
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/main/businesspartner2external/', endCreate: 'create'},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/businesspartner2external/', endRead: 'list'},
						presenter: {list: {incorporateDataRead: incorporateDataRead, initCreationData: initCreationData}}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				var service = serviceContainer.service;
				var data = serviceContainer.data;
				data.newEntityValidator = newEntityValidator();
				var validationService = businessPartner2ExternalValidationService(serviceContainer.service);

				var canCreate = serviceContainer.service.canCreate;
				serviceContainer.service.canCreate = function () {
					return canCreate() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};

				var canDelete = serviceContainer.service.canDelete;
				serviceContainer.service.canDelete = function () {
					return canDelete() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};

				return service;

				function incorporateDataRead(readData, data) {
					if (readData) {
						var status = businesspartnerMainHeaderDataService.getItemStatus();
						if (status.IsReadonly === true) {
							businesspartnerStatusRightService.setListDataReadonly(readData, true);
						}
						basicsLookupdataLookupDescriptorService.attachData(readData);
						return serviceContainer.data.handleReadSucceeded(readData, data);
					}
					return serviceContainer.data.handleReadSucceeded(readData, data);
				}

				function newEntityValidator() {
					return {
						validate: function validate(newItem) {
							var result = validationService.validateExternalFk(newItem, newItem.BasExternalsourceFk, 'BasExternalsourceFk');
							platformRuntimeDataService.applyValidationResult(result, newItem, 'BasExternalsourceFk');
						}
					};
				}

				function processItem(item) {
					if (item) {
						var result = validationService.validateExternalFk(item, item.BasExternalsourceFk, 'BasExternalsourceFk');
						platformRuntimeDataService.applyValidationResult(result, item, 'BasExternalsourceFk');
					}
				}

				function initCreationData(creationData) {
					var selected = businesspartnerMainHeaderDataService.getSelected();
					creationData.PKey1 = selected.Id;
				}
			}]
	);
})(angular);