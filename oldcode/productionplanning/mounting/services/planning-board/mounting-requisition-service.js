((angular) => {
	'use strict';

	let moduleName = 'productionplanning.mounting';
	let masterModule = angular.module(moduleName);
	let serviceName = 'mountingRequisitionService';
	masterModule.factory(serviceName, MountingRequisitionService);
	MountingRequisitionService.$inject = ['resourceRequisitionPlanningBoardServiceFactory', 'mountingResourceService', 'ppsVirtualDataServiceFactory'];

	function MountingRequisitionService(resourceRequisitionPlanningBoardServiceFactory, mountingResourceService, ppsVirtualDataServiceFactory) {

		let container = resourceRequisitionPlanningBoardServiceFactory.createRequisitionService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				readData.ResourceIdList = mountingResourceService.getIdList();
				readData.ModuleName = moduleName;
			},
			moduleName: moduleName,
			// this service will be overridden with the created instance
			serviceName: serviceName
		});

		// new virtual dateshift registration!
		if (moduleName === 'productionplanning.mounting') {
			let vdsConfig = {match: 'Id'};
			ppsVirtualDataServiceFactory.registerToVirtualDataService(moduleName, 'ResRequisition', container, vdsConfig);
		}

		return container.service;

	}

})(angular);
