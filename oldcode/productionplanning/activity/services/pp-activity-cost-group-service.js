/**
 * Created by lav on 8/19/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).factory('ppsActivityCostGroupService', ['$injector',
		'productionplanningActivityActivityDataService',
		function ($injector,
				  mainService) {

			var createOptions = {
				dataLookupType: 'Activity2CostGroups',
				identityGetter: function () {
					return {
						MainItemId: mainService.getSelected().PpsEventFk
					};
				},
				costGroupCatGetter:function (entity) {
					return entity.Id;
				}
			};

			var service = $injector.get('basicsCostGroupDataServiceFactory').createService('ppsActivity', mainService, createOptions);

			service.getDataLookupType = function () {
				return createOptions.dataLookupType;
			};

			service.initReadData = function (readData) {
				var selected = mainService.getSelected();
				readData.PKey1 = selected.ProjectId;
				readData.PKey2 = selected.PpsEventFk;
			};

			service.getRoute = function () {
				return 'productionplanning/activity/activity/';
			};

			return service;
		}]);
})(angular);