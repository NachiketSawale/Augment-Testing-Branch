(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var serviceName = 'ppsEngDetailerPlanningBoardSupplierService';

	angular.module(moduleName).factory(serviceName, SupplierService);

	SupplierService.$inject = ['platformPlanningBoardServiceFactoryProviderService', 'ServiceDataProcessDatesExtension'];

	function SupplierService(planningBoardServiceFactoryProviderService, ProcessDatesExtension) {
		var factoryOptions = planningBoardServiceFactoryProviderService.createSupplierCompleteOptions({
			baseSettings: {
				moduleName: moduleName,
				serviceName: serviceName
			},
			module: moduleName + '.DetailerPlanningBoardSupplier',
			translationId: 'productionplanning.engineering.entityItemClerk',
			http: planningBoardServiceFactoryProviderService.createHttpOptions({
				routePostFix: 'productionplanning/item/clerk/',
				endRead: 'detailers'
			}),
			translation: {
				uid: 'productionplanningEngineeringMainService',
				title: 'productionplanning.engineering.entityItemClerk',
				columns: [{
					header: 'cloud.common.entityDescription',
					field: 'DescriptionInfo'
				}]
			},
			role: {
				itemName: 'PPSItemClerk',
				moduleName: 'cloud.desktop.moduleDisplayNameEngineering',
				descField: 'DescriptionInfo.Translated',
				useIdentification: true
			},
			processor: [new ProcessDatesExtension(['ValidFrom', 'ValidTo'])]
		});

		return planningBoardServiceFactoryProviderService.createFactory(factoryOptions).service;
	}
})();