/**
 * Created by lnt on 8/12/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'qto.main';

	angular.module(moduleName).factory('qtoDetailCostGroupService', ['$injector', '$q', 'qtoMainDetailService',
		function ($injector, $q, qtoMainDetailService) {

			var createOptions = {
				dataLookupType: 'QtoDetail2CostGroups',
				identityGetter: function (entity) {
					return {
						MainItemId: entity.Id
					};
				}
			};

			return $injector.get('basicsCostGroupDataServiceFactory').createService('QuantityTakeOff', qtoMainDetailService, createOptions);
		}]);
})(angular);