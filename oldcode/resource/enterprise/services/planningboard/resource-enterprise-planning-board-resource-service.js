(function (angular) {
	'use strict';

	var moduleName = 'resource.enterprise';
	var resEnterpriseModule = angular.module(moduleName);
	var serviceName = 'resourceEnterprisePlanningBoardResourceService';

	resEnterpriseModule.factory(serviceName, resourceEnterprisePlanningBoardResourceService);
	resourceEnterprisePlanningBoardResourceService.$inject = ['_','$injector','moment', 'resourceMasterPlanningBoardServiceFactory', 'resourceEnterpriseDispatcherDataService'];

	function resourceEnterprisePlanningBoardResourceService(_,$injector,moment, resourceMasterPlanningBoardServiceFactory, resourceEnterpriseDispatcherDataService) {
		var complete = resourceMasterPlanningBoardServiceFactory.createResourceComplete({
			initReadData: function initReadData(readData) {
				readData.ModuleName = moduleName;
				var selected = resourceEnterpriseDispatcherDataService.getSelected();
				readData.DispatcherGroupFk = selected ? selected.Id : null;
				readData.ExpectsDispatcherGroupFilter = true;
			},
			moduleName: moduleName,
			serviceName: serviceName,
			parentService: resourceEnterpriseDispatcherDataService
		});
		let service = complete.service;

		complete.data.onReadSucceeded = function inReadResourcesSucceeded(result, data) {
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

