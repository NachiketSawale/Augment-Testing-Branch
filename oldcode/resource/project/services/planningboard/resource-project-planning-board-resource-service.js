(function (angular) {
	'use strict';

	var moduleName = 'resource.project';
	var resProjectModule = angular.module(moduleName);
	var serviceName = 'resourceProjectPlanningBoardResourceService';

	resProjectModule.factory(serviceName, resourceProjectPlanningBoardResourceService);
	resourceProjectPlanningBoardResourceService.$inject = ['_', '$injector','moment', 'resourceMasterPlanningBoardServiceFactory', 'resourceProjectDataService'];

	function resourceProjectPlanningBoardResourceService(_, $injector,moment, resourceMasterPlanningBoardServiceFactory, resourceProjectDataService) {
		var complete = resourceMasterPlanningBoardServiceFactory.createResourceComplete({
			initReadData: function initReadData(readData) {
				readData.ModuleName = moduleName;
				var sel = resourceProjectDataService.getSelected();
				if(sel)
				{
					readData.ProjectFk = sel.Id;
				}
				readData.ExpectsProjectFilter = true;
			},
			moduleName: moduleName,
			serviceName: serviceName,
			parentService: resourceProjectDataService
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
			if(service.getList() && service.getList().length){
				return _.map(service.getList(), function (resource) {
					return resource.Id;
				});
			}

			return [];
		};

		return service;
	}
})(angular);

