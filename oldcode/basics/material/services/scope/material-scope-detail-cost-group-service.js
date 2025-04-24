/**
 * Created by wui on 8/29/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialScopeDetailCostGroupService', ['$injector', 'basicsMaterialScopeDetailDataService',
		function ($injector, basicsMaterialScopeDetailDataService) {

			var createOptions = {
				dataLookupType: 'ScopeDetailCostGroups',
				identityGetter: function (entity) {
					return {
						MainItemId: entity.Id
					};
				}
			};

			return $injector.get('basicsCostGroupDataServiceFactory').createService('Material', basicsMaterialScopeDetailDataService, createOptions);

		}]);
})(angular);