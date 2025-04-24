/**
 * Created by lav on 8/19/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemCostGroupService', ['$injector',
		'productionplanningCommonEventMainServiceFactory',
		'productionplanningItemDataService',
		function ($injector,
				  dataServiceFactory,
				  productionplanningItemDataService) {

			var parentService = dataServiceFactory.getService('ItemFk', 'productionplanning.common.item.event', productionplanningItemDataService);

			var createOptions = {
				dataLookupType: 'PpsItem2CostGroups',
				identityGetter: function (entity) {
					return {
						//different entity different logic
						MainItemId: Object.prototype.hasOwnProperty.call(entity,'costgroup_') ? entity.MainItemId : entity.Id
					};
				},
				costGroupCatGetter: function (entity) {
					return entity.Id;
				}
			};

			var service = $injector.get('basicsCostGroupDataServiceFactory').createService('PpsItem', parentService, createOptions);

			service.getDataLookupType = function () {
				return createOptions.dataLookupType;
			};

			service.initReadData = function (readData) {
				var selected = parentService.getSelected();
				var serviceT = service;
				while (serviceT !== null) {
					var selectedT = serviceT.getSelected();
					if (selectedT !== null && selectedT.ProjectFk) {
						readData.PKey1 = selectedT.ProjectFk;
						break;
					}
					serviceT = serviceT.parentService();
				}
				readData.PKey2 = selected.Id;
			};

			service.getRoute = function () {
				return 'productionplanning/item/';
			};

			return service;
		}]);
})(angular);