(function (angular) {
	/* globals globals */
	'use strict';
	const moduleName = 'productionplanning.configuration';
	let angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationPlannedQuantitySlotDataService', DataService);
	DataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'ppsPlannedQuantityQuantityPropertiesProvider',
		'basicsLookupdataLookupFilterService',
		'productionplanningPlannedQuantitySlotProcessor',
		'basicsLookupdataLookupDescriptorService'];

	function DataService($injector, platformDataServiceFactory, basicsCommonMandatoryProcessor, propertiesProvider,
		basicsLookupdataLookupFilterService,
		plannedQuantitySlotProcessor,
		basicsLookupdataLookupDescriptorService) {
		let serviceInfo = {
			flatRootItem: {
				module: moduleName + '.plannedquantityslot',
				serviceName: 'productionplanningConfigurationPlannedQuantitySlotDataService',
				entityNameTranslationID: 'productionplanning.configuration.entityPlannedQuantitySlot',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/configuration/plannedquantityslot/',
					endRead: 'customfiltered',
					usePostForRead: true
				},
				entityRole: {
					root: {
						itemName: 'PpsPlannedQuantitySlot',
						moduleName: 'productionplanning.configuration.entityPlannedQuantitySlot',
						descField: 'DescriptionInfo.Translated'
					}
				},
				dataProcessor: [plannedQuantitySlotProcessor],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData.lookups);
							const result = {
								FilterResult: readData.FilterResult,
								dtos: readData.dtos || []
							};
							return container.data.handleReadSucceeded(result, data);
						},
					}
				},
				translation: {
					uid: 'productionplanningConfigurationPlannedQuantitySlotService',
					title: 'productionplanning.configuration.entityPlannedQuantitySlot',
					columns: [{header: 'productionplanning.configuration.columnName', field: 'ColumnNameInfo'},
						{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'PpsPlannedQuantitySlotDto',
						moduleSubModule: 'ProductionPlanning.Configuration',
					},
				}
			}
		};

		let container = platformDataServiceFactory.createNewComplete(serviceInfo);
		let service = container.service;

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PpsPlannedQuantitySlotDto',
			moduleSubModule: 'ProductionPlanning.Configuration',
			validationService: 'productionplanningConfigurationPlannedQuantitySlotValidationService'
		});

		propertiesProvider.getQuantityProperties(); // just for loading data of lookup "property" of field "result" of plannedquantityslot container in advance

		service.onPropertyChanged = (item, field) => {
			plannedQuantitySlotProcessor.processItem(item);
		};

		const filters = [
			{
				key: 'mdc-product-template-material-filter',
				fn: function (lookupItem, selected) {
					return lookupItem.MaterialFk === selected.MdcMaterialFk && lookupItem.IsLive;
				}
			}
		];

		service.registerFilters = function () {
			basicsLookupdataLookupFilterService.registerFilter(filters);
		};

		service.unregisterFilters = function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};
		service.registerFilters();

		return service;
	}
})(angular);
