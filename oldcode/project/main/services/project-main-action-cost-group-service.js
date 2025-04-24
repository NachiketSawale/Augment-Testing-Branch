(function(angular){
	'use strict';

	var moduleName = 'project.main';
	var templateModule = angular.module(moduleName);

	templateModule.factory('projectMainActionCostGroupService', ['_', 'basicsCostGroupDataServiceFactory','projectMainActionDataService',
		function(_, basicsCostGroupDataServiceFactory, projectMainActionDataService){

			var createOptions = {
				dataLookupType: 'ProjectAction2CostGroups',
				identityGetter: function (entity) {
					return {
						MainItemId: entity.Id
					};
				}
			};

			var service = basicsCostGroupDataServiceFactory.createService('ProjectAction2CostGroups', projectMainActionDataService, createOptions);
			projectMainActionDataService.costGroupService = service;

			service.init = _.noop;

			return service;
		}]);
})(angular);