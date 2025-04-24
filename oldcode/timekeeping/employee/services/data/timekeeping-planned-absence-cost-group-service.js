(function(angular){
	'use strict';
	
	var moduleName = 'timekeeping.employee';
	var employeeModule = angular.module(moduleName);

	employeeModule.factory('timekeepingPlannedAbsenceCostGroupService', ['_', 'basicsCostGroupDataServiceFactory','timekeepingPlannedAbsenceDataService',
		function(_, basicsCostGroupDataServiceFactory, timekeepingPlannedAbsenceDataService){
		
			var createOptions = {
				dataLookupType: 'PlannedAbsence2CostGroups',
				identityGetter: function (entity) {
					return {
						MainItemId: entity.Id
					};
				}
			};
			
			var service = basicsCostGroupDataServiceFactory.createService('PlannedAbsence2CostGroups', timekeepingPlannedAbsenceDataService, createOptions);
			timekeepingPlannedAbsenceDataService.costGroupService = service;

			service.init = _.noop;

			return service;
		}]);
})(angular);
