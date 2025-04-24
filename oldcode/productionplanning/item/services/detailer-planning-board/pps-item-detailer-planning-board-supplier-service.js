(function () {
	'use strict';

	var moduleName = 'productionplanning.item';
	var serviceName = 'ppsItemDetailerPlanningBoardSupplierService';

	angular.module(moduleName).factory(serviceName, SupplierService);

	SupplierService.$inject = ['platformPlanningBoardServiceFactoryProviderService', 'ServiceDataProcessDatesExtension'];

	function SupplierService(planningBoardServiceFactoryProviderService, ProcessDatesExtension) {
		var factoryOptions = planningBoardServiceFactoryProviderService.createSupplierCompleteOptions({
			baseSettings: {
				moduleName: moduleName,
				serviceName: serviceName
			},
			module: moduleName,
			translationId: 'productionplanning.item.entityItemClerk',
			http: planningBoardServiceFactoryProviderService.createHttpOptions({
				routePostFix: 'productionplanning/item/clerk/',
				endRead: 'detailers'
			}),
			translation: {
				uid: 'productionplanningItemDataService',
				title: 'productionplanning.item.entityItemClerk',
				columns: [{
					header: 'cloud.common.entityDescription',
					field: 'DescriptionInfo'
				}]
			},
			role: {
				itemName: 'PPSItemClerk',
				moduleName: 'cloud.desktop.moduleDisplayNamePPSItem',
				descField: 'DescriptionInfo.Translated',
				useIdentification: true,
				rootForModule: moduleName + '.detailerSupplier' //no real root!
			},
			processor: [new ProcessDatesExtension(['ValidFrom', 'ValidTo'])]
		});

		return planningBoardServiceFactoryProviderService.createFactory(factoryOptions).service;
	}
})();