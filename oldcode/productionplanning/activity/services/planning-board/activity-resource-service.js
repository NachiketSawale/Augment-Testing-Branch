/**
 * Created by anl on 3/12/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).factory('activityResourceService', ActivityResourceService);
	ActivityResourceService.$inject = ['resourceMasterPlanningBoardServiceFactory', 'productionplanningCommonDispatcherDataServiceFactory'];

	function ActivityResourceService(resourceMasterPlanningBoardServiceFactory, productionplanningCommonDispatcherDataServiceFactory) {

		var dispatcherService = productionplanningCommonDispatcherDataServiceFactory.createDispatcherDataService(moduleName);

		var service = resourceMasterPlanningBoardServiceFactory.createResourceService({
			initReadData: function initReadData(readData) {
				// readData.TypeFk = 59;
				readData.ModuleName = moduleName;
				var selected = dispatcherService? dispatcherService.getSelected() : null;
				readData.DispatcherGroupFk = selected ? selected.Id : null;
				readData.ExpectsDispatcherGroupFilter = selected ? true : false;
			},
			moduleName: moduleName,
			// this service will be overridden with the created instance
			serviceName: 'activityResourceService',
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