(angular => {
	'use strict';
	/* global globals,_ */
	var moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).factory('ppsProductionPlaceDataService', dataService);

	dataService.$inject = ['$injector', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor',
		'ppsProductionPlaceProcessor', 'productionplanningCommonStructureFilterService', 'ppsVirtualDateshiftDataServiceFactory'];

	function dataService($injector, platformDataServiceFactory, basicsCommonMandatoryProcessor,
		dataProcessor, ppsCommonStructureFilterService, ppsVirtualDateshiftDataServiceFactory) {
		var lastFilter = null;
		const serviceOptions = {
			flatRootItem: {
				module: moduleName,
				serviceName: 'ppsProductionPlaceDataService',
				dataProcessor: [dataProcessor],
				entityNameTranslationID: 'productionplanning.productionplace.entityProductionPlace',
				addValidationAutomatically: true,
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/productionplace/',
					endRead: 'filtered',
					usePostForRead: true,
					extendSearchFilter: function extendSearchFilter(readData) {

						readData.orderBy = [{ Field: 'Code' }];

						if (service.isSearchByNavigation) {
							service.isSearchByNavigation = false;
						} else {
							ppsCommonStructureFilterService.extendSearchFilterAssign('ppsProductionPlaceDataService', readData);
							ppsCommonStructureFilterService.setFilterRequest('ppsProductionPlaceDataService', readData);
						}
						lastFilter = readData;
					}
				},
				entityRole: {
					root: {
						itemName: 'ProductionPlace',
						moduleName: 'cloud.desktop.moduleDisplayNameProductionPlace',
						descField: 'Description'
					}
				},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: null,
						withExecutionHints: false,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0'
					}
				}
			}
		};

		const container = platformDataServiceFactory.createNewComplete(serviceOptions);
		const service = container.service;

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'PpsProductionPlaceDto',
			moduleSubModule: 'ProductionPlanning.ProductionPlace',
			validationService: $injector.get('ppsProductionPlaceValidationServiceFactory').getValidationService(service)
		});

		container.service.getLastFilter = function () {
			if (_.isNil(lastFilter)) {
				lastFilter = {};
				ppsCommonStructureFilterService.extendSearchFilterAssign('ppsProductionPlaceDataService', lastFilter);
			}
			return lastFilter;
		};

		container.service.getCalendarIdByFiltered = () => {
			let calendarId = 0;
			let filteredObjects = Array.from(Object.values(ppsCommonStructureFilterService.getFilterObjects(container.service.getServiceName())));
			if (filteredObjects.length > 0) {
				let resourceFkOfSite = filteredObjects[0].filterService.getSelected() && filteredObjects[0].filterService.getSelected().ResourceFk;
				if (resourceFkOfSite) {
					let lookupService = $injector.get('basicsLookupdataLookupDescriptorService');
					let resource = lookupService.getLookupItem('ResourceMasterResource', resourceFkOfSite);
					if (!_.isNil(resource) && resource.CalendarFk && resource.CalendarFk > 0) {
						calendarId = resource.CalendarFk;
					}
				}
			}

			return calendarId;
		};

		container.service.nevigateBySite = function (site) {
			var sites = ppsCommonStructureFilterService.collectItems(site, 'ChildItems');
			var filtes = _.filter(sites, function (item) {
				return item.SiteTypeFk === 8;
			});
			var filteIds = _.map(filtes, 'Id');
			ppsCommonStructureFilterService.setFilterIds('ppsProductionPlaceDataService', 'SITE', filteIds, true);
			var siteDataService = $injector.get('ppsProductionplaceSiteFilterDataService');
			siteDataService.markedItems = [site];
			siteDataService.addDelayMarkedItems(site);
		};

		service.getContainerData = () => container.data;

		const refVirtualDataService = ppsVirtualDateshiftDataServiceFactory.createNewVirtualDateshiftDataService(moduleName, service);



		return service;
	}
})(angular);