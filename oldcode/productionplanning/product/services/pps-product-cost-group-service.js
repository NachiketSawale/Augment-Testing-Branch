/**
 * Created by lav on 8/19/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.product';

	angular.module(moduleName).factory('ppsProductCostGroupService', ['$injector',
		'productionplanningCommonEventMainServiceFactory',
		'productionplanningCommonProductItemDataService',
		function ($injector,
				  dataServiceFactory,
				  productionplanningCommonProductItemDataService) {

			var parentService = dataServiceFactory.getService('ProductFk', 'productionplanning.common.item.product.event', productionplanningCommonProductItemDataService);

			var createOptions = {
				dataLookupType: 'PpsProduct2CostGroups',
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

			var service = $injector.get('basicsCostGroupDataServiceFactory').createService('PpsProduct', parentService, createOptions);

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
				return 'productionplanning/common/product/';
			};

			return service;
		}]);
})(angular);