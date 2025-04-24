(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationEventTypeSlotDataService', DataService);
	DataService.$inject = ['$injector', 'platformDataServiceFactory'];

	function DataService($injector, platformDataServiceFactory) {

		var serviceInfo = {
			flatRootItem: {
				module: moduleName + '.eventtypeslot',
				serviceName: 'productionplanningConfigurationEventTypeSlotDataService',
				entityNameTranslationID: 'productionplanning.configuration.entityEventTypeDateSlot',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/configuration/eventtypeslot/',
					endRead: 'filtered',
					initReadData: function (readData) {
						readData.FurtherFilters = [{'Token':'ColumnSelection', Value: 'datetime'}];
					},
					usePostForRead: true
				},
				entityRole: {
					root: {
						itemName: 'EventTypeSlot',
						moduleName: 'productionplanning.configuration.moduleDisplayNameEventTypeDateSlot',
						descField: 'DescriptionInfo.Translated'
					}
				},
				presenter: {
					list: { }
				},
				translation: {
					uid: 'productionplanningConfigurationEventTypeSlotService',
					title: 'productionplanning.configuration.entityEventTypeDateSlot',
					columns: [{header: 'cloud.common.entityDescription', field: 'ColumnTitle'}],
					dtoScheme: {
						typeName: 'EventTypeSlotDto',
						moduleSubModule: 'ProductionPlanning.Configuration',
					},
				}

			}
		};

		/*jshint-W003*/
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		//container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			//typeName: 'EventTypeSlotDto',
			//moduleSubModule: 'ProductionPlanning.Configuration',
			//validationService: 'productionplanningConfigurationEventTypeSlotValidationService'
		//});

		return container.service;
	}
})(angular);
