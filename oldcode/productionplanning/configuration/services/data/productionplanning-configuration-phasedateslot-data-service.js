(function (angular) {
	/* globals globals */
	'use strict';
	const moduleName = 'productionplanning.configuration';
	let angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationPhaseDateSlotDataService', DataService);
	DataService.$inject = ['platformDataServiceFactory', 'basicsCommonMandatoryProcessor'];

	function DataService(platformDataServiceFactory, basicsCommonMandatoryProcessor) {
		let serviceInfo = {
			flatRootItem: {
				module: moduleName + '.phasedateslot',
				serviceName: 'productionplanningConfigurationPhaseDateSlotDataService',
				entityNameTranslationID: 'productionplanning.configuration.entityPhaseDateSlot',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/configuration/phasedateslot/',
					endRead: 'filtered',
					usePostForRead: true
				},
				entityRole: {
					root: {
						itemName: 'PpsPhaseDateSlot',
						moduleName: 'productionplanning.configuration.entityPhaseDateSlot',
						descField: 'ColumnTitle.Translated'
					}
				},
				presenter: {
					list: {},
				}
			},
			translation: {
				uid: 'productionplanningConfigurationPhaseDateSlotService',
				title: 'productionplanning.configuration.entityPhaseDateSlot',
				columns: [{header: 'cloud.common.entityDescription', field: 'ColumnTitle'}],
				dtoScheme: {
					typeName: 'PpsPhaseDateSlotDto',
					moduleSubModule: 'ProductionPlanning.Configuration',
				},
			}
		};

		let container = platformDataServiceFactory.createNewComplete(serviceInfo);
		let service = container.service;

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PpsPhaseDateSlotDto',
			moduleSubModule: 'ProductionPlanning.Configuration',
			validationService: 'productionplanningConfigurationPhaseDateSlotValidationService'
		});

		return service;
	}
})(angular);
