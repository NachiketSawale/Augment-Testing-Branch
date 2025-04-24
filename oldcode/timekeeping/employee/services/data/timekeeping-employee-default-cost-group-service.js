(function(angular){
	'use strict';
	
	var moduleName = 'timekeeping.employee';
	var employeeModule = angular.module(moduleName);

	employeeModule.factory('timekeepingEmployeeDefaultCostGroupService', ['_', 'basicsCostGroupDataServiceFactory','timekeepingEmployeeDefaultDataService',
		function(_, basicsCostGroupDataServiceFactory, timekeepingEmployeeDefaultDataService){
		
			var createOptions = {
				dataLookupType: 'EmployeeDefault2CostGroups',
				identityGetter: function (entity) {
					return {
						MainItemId: entity.Id
					};
				}
			};
			
			var service = basicsCostGroupDataServiceFactory.createService('EmployeeDefault2CostGroups', timekeepingEmployeeDefaultDataService, createOptions);
			timekeepingEmployeeDefaultDataService.costGroupService = service;

			service.init = _.noop;

			return service;
		}]);
})(angular);
