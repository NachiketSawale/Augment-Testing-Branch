/**
 * Created by xia on 9/2/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainWic2AssemblyCostGroupService', ['$injector', '$q', 'boqMainWic2AssemblyService',
		function ($injector, $q, boqMainWic2AssemblyService) {

			var createOptions = {
				dataLookupType: 'WicAssembly2CostGroups',
				identityGetter: function (entity) {
					return {
						RootItemId: entity.EstHeaderFk,
						MainItemId: entity.Id
					};
				}
			};

			return $injector.get('basicsCostGroupDataServiceFactory').createService(moduleName, boqMainWic2AssemblyService, createOptions);
		}]);
})(angular);