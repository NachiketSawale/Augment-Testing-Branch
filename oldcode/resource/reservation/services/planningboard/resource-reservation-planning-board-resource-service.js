(function (angular) {
	'use strict';

	var moduleName = 'resource.reservation';
	var requisitionModule = angular.module(moduleName);
	var serviceName = 'resourceReservationPlanningBoardResourceService';
	requisitionModule.factory(serviceName, resourceReservationPlanningBoardResourceService);
	resourceReservationPlanningBoardResourceService.$inject = ['$injector','moment', 'resourceMasterPlanningBoardServiceFactory', 'resourceReservationDataService'];

	function resourceReservationPlanningBoardResourceService($injector, moment, resourceMasterPlanningBoardServiceFactory, resourceReservationDataService) {

		let complete = resourceMasterPlanningBoardServiceFactory.createResourceComplete({
			initReadData: function initReadData(readData) {
				readData.ModuleName = moduleName;
			},
			moduleName: moduleName,
			serviceName: serviceName,
			parentService: resourceReservationDataService
		});
		let service = complete.service;

		complete.data.onReadSucceeded = function inReadResourcesSucceeded(result, data) {
			complete.data.doNotUnloadOwnOnSelectionChange = true;
			complete.data.doNotLoadOnSelectionChange = true;

			let helperTools = $injector.get('resourceMasterPlanningBoardCustomConfigFactory').getService();
			if(helperTools.hasToFilterByValidOnDueDate()){
				result = helperTools.filterResourcesValidOnDueDate(result);
			}

			complete.data.handleReadSucceeded(result, data);
		};

		service.getIdList = function getIdList() {
			if (service.getList() && service.getList().length) {
				return _.map(service.getList(), function (resource) {
					return resource.Id;
				});
			}

			return [];
		};

		return service;
	}

})(angular);

