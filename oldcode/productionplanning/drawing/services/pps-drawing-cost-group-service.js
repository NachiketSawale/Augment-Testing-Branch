/**
 * Created by lav on 8/19/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).factory('ppsDrawingCostGroupService', ['$injector',
		'productionplanningDrawingMainService',
		function ($injector,
				  mainService) {

			var createOptions = {
				dataLookupType: 'Drawing2CostGroups',
				identityGetter: function () {
					return {
						MainItemId: mainService.getSelected().Id
					};
				},
				costGroupCatGetter:function (entity) {
					return entity.Id;
				}
			};

			var service = $injector.get('basicsCostGroupDataServiceFactory').createService('ppsDrawing', mainService, createOptions);

			service.getDataLookupType = function () {
				return createOptions.dataLookupType;
			};

			service.initReadData = function (readData) {
				var selected = mainService.getSelected();
				readData.PKey1 = selected.PrjProjectFk;
				readData.PKey2 = selected.Id;
			};

			service.getRoute = function () {
				return 'productionplanning/drawing/';
			};

			return service;
		}]);
})(angular);