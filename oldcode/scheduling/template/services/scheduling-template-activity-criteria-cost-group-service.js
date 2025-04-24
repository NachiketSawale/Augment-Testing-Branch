(function(angular){
	'use strict';
	
	var moduleName = 'scheduling.template';
	var templateModule = angular.module(moduleName);

	templateModule.factory('schedulingTemplateActivityCriteriaCostGroupService', ['_', 'basicsCostGroupDataServiceFactory','schedulingTemplateActivityCriteriaService',
		function(_, basicsCostGroupDataServiceFactory, schedulingTemplateActivityCriteriaService){
		
			var createOptions = {
				dataLookupType: 'ActivityCriteria2CostGroups',
				identityGetter: function (entity) {
					return {
						MainItemId: entity.Id
					};
				}
			};
			
			var service = basicsCostGroupDataServiceFactory.createService('ActivityCriteria2CostGroups', schedulingTemplateActivityCriteriaService, createOptions);
			schedulingTemplateActivityCriteriaService.costGroupService = service;

			service.init = _.noop;

			return service;
		}]);
})(angular);
