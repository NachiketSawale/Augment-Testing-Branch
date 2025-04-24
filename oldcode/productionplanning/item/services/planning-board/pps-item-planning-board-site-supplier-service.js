(function (angular) {
	'use strict';
	/* global angular, _ */
	var moduleName = 'productionplanning.item';
	var masterModule = angular.module(moduleName);
	var serviceName = 'ppsItemPlanningBoardSiteSupplierService';
	masterModule.factory(serviceName, PpsItemPlanningBoardSiteSupplierService);
	PpsItemPlanningBoardSiteSupplierService.$inject = ['$injector', 'moment', 'platformPlanningBoardServiceFactoryProviderService','productionplanningItemDataService', 'platformPlanningBoardDataService'];
	function PpsItemPlanningBoardSiteSupplierService($injector, moment, platformPlanningBoardServiceFactoryProviderService, productionplanningItemDataService, platformPlanningBoardDataService) {


		var factoryOptions = platformPlanningBoardServiceFactoryProviderService.createSupplierCompleteOptions({
			baseSettings: {
				initReadData: function initReadData(readData) {
					var selected = productionplanningItemDataService ? productionplanningItemDataService.getSelected() : null;
					var id = (selected) ? selected.SiteFk : -1;

					// set initial datestart from planningboard data service with the selected production start date
					if (selected && selected.ProductionStart) {
						var planningboardDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceBySupplierServiceName(serviceName);
						var dateDiff = planningboardDataService.getDateEnd().diff(planningboardDataService.getDateStart(), 'day');
						var productionStart = moment(selected.ProductionStart).utc().startOf('day');
						planningboardDataService.getDateStart(moment(productionStart));
						planningboardDataService.getDateEnd(moment(productionStart).add(dateDiff, 'day'));
					}
					readData.PKeys = [{Id: id}];
				},
				moduleName: moduleName,
				// this service will be overridden with the created instance
				serviceName: serviceName,
				parentService: productionplanningItemDataService
			},
			module: moduleName,
			translationId: 'basics.site.entitySite',
			http: platformPlanningBoardServiceFactoryProviderService.createHttpOptions({
				routePostFix: 'basics/sitenew/',
				endRead: 'flatlist',
				usePostForRead: true
			}),
			translation: {
				uid: 'basicsSiteMainService',
				title: 'basics.site.entitySite',
				columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
			},
			role: {
				itemName: 'Site',
				moduleName: 'cloud.desktop.moduleDisplayNameSite',
				descField: 'DescriptionInfo.Translated',
				useIdentification: true
			}
		});

		var serviceContainer = platformPlanningBoardServiceFactoryProviderService.createFactory(factoryOptions);

		serviceContainer.data.doNotUnloadOwnOnSelectionChange = true;
		serviceContainer.data.doNotLoadOnSelectionChange = true;

		const loadSuppliers = (e, item) => {
			let lastSelectedItem = productionplanningItemDataService.getLastSelection();
			if ((!_.isNil(item) && _.isNil(lastSelectedItem)) || (!_.isNil(lastSelectedItem) && !_.isNil(item) &&
				(lastSelectedItem.ProductionStart !== item.ProductionStart || lastSelectedItem.SiteFk !== item.SiteFk))) {
				productionplanningItemDataService.setLastSelection(item);
				serviceContainer.service.load();
			}
		};

		productionplanningItemDataService.registerSelectionChanged(loadSuppliers);


		return serviceContainer.service;
	}

})(angular);