/**
 * Created by wui on 10/7/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('cosMainLineItemCostGroupService', ['$injector', '$q', 'constructionsystemMainLineItemService',
		function ($injector, $q, constructionsystemMainLineItemService) {

			var createOptions = {
				dataLookupType: 'LineItem2CostGroups',
				identityGetter: function (entity) {
					return {
						RootItemId: entity.EstHeaderFk,
						MainItemId: entity.Id
					};
				}
			};

			return $injector.get('basicsCostGroupDataServiceFactory').createService('Estimate', constructionsystemMainLineItemService, createOptions);
		}]);
})(angular);
