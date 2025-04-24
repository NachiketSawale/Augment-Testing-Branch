(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	var masterModule = angular.module(moduleName);
	var serviceName = 'mountingResourceService';
	masterModule.factory(serviceName, MountingResourceService);
	MountingResourceService.$inject = ['resourceMasterPlanningBoardServiceFactory','productionplanningCommonDispatcherDataServiceFactory'];

	function MountingResourceService(resourceMasterPlanningBoardServiceFactory, productionplanningCommonDispatcherDataServiceFactory) {

		var dispatcherService = productionplanningCommonDispatcherDataServiceFactory.createDispatcherDataService(moduleName);

		var service = resourceMasterPlanningBoardServiceFactory.createResourceService({
			initReadData: function initReadData(readData) {
				// readData.TypeFk = 59;
				readData.ModuleName = moduleName;
				var selected = dispatcherService ? dispatcherService.getSelected() : null;
				readData.DispatcherGroupFk = selected ? selected.Id : null;
				readData.ExpectsDispatcherGroupFilter = selected ? true : false;
			},
			moduleName: moduleName,
			// this service will be overridden with the created instance
			serviceName: serviceName,
			parentService: dispatcherService
		});

		service.getIdList = function getIdList() {
			return _.map(service.getList(), function (resource) {
				return resource.Id;
			});
		};

		return service;

	}

})(angular);

