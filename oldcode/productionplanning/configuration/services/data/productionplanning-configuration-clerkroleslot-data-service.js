(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationClerkRoleSlotDataService', DataService);
	DataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor'];

	function DataService($injector, platformDataServiceFactory, basicsCommonMandatoryProcessor) {

		var serviceInfo = {
			flatRootItem: {
				module: moduleName + '.clerkroleslot',
				serviceName: 'productionplanningConfigurationClerkRoleSlotDataService',
				entityNameTranslationID: 'productionplanning.configuration.entityClerkRoleSlot',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/configuration/clerkroleslot/',
					endRead: 'filtered',
					usePostForRead: true
				},
				entityRole: {
					root: {
						itemName: 'ClerkRoleSlot',
						moduleName: 'productionplanning.configuration.moduleDisplayNameClerkRoleSlot',
						descField: 'DescriptionInfo.Translated'
					}
				},
				presenter: {
					list: { }
				},
				translation: {
					uid: 'productionplanningConfigurationClerkRoleSlotService',
					title: 'productionplanning.configuration.entityClerkRoleSlot',
					columns: [{header: 'cloud.common.entityDescription', field: 'ColumnTitle'}],
					dtoScheme: {
						typeName: 'ClerkRoleSlotDto',
						moduleSubModule: 'ProductionPlanning.Configuration',
					},
				}
			}
		};

		/*jshint-W003*/
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'ClerkRoleSlotDto',
			moduleSubModule: 'ProductionPlanning.Configuration',
			validationService: 'productionplanningConfigurationClerkRoleSlotValidationService'
		});

		return container.service;
	}
})(angular);
