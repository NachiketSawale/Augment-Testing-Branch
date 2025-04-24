// eslint-disable-next-line func-names
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var serviceName = 'productionplanningEngineeringResourceService';
	angular.module(moduleName).factory(serviceName, ResourceService);
	ResourceService.$inject = ['resourceMasterPlanningBoardServiceFactory', 'productionplanningCommonDispatcherDataServiceFactory'];

	function ResourceService(resourceMasterPlanningBoardServiceFactory, productionplanningCommonDispatcherDataServiceFactory) {

		var dispatcherService = productionplanningCommonDispatcherDataServiceFactory.createDispatcherDataService(moduleName);

		var service = resourceMasterPlanningBoardServiceFactory.createResourceService({
			initReadData: function initReadData(readData) {
				readData.ModuleName = moduleName;
				var selected = dispatcherService? dispatcherService.getSelected() : null;
				readData.DispatcherGroupFk = selected ? selected.Id : null;
				readData.ExpectsDispatcherGroupFilter = selected ? true : false;
			},
			moduleName: moduleName,
			// this service will be overridden with the created instance
			serviceName: serviceName,
			parentService: dispatcherService
		});

		service.getIdList = function getIdList() {
			// eslint-disable-next-line func-names
			return _.map(service.getList(), function (resource) {
				return resource.Id;
			});
		};

		return service;

	}

})(angular);