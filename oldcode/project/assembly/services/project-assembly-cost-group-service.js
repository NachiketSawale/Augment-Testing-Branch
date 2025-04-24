/**
 * Created by lnt on 10/18/2021.
 */
/**
 * $Id: estimate-assemblies-cost-group-service.js 11512 2021-09-21 09:28:27Z joshi $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'project.assembly';

	angular.module(moduleName).factory('projectAssemblyCostGroupService', ['$injector', '$q', 'projectAssemblyMainService',
		function ($injector, $q, projectAssemblyMainService) {

			let createOptions = {
				dataLookupType: 'Assembly2CostGroups',
				identityGetter: function (entity) {
					return {
						RootItemId: entity.EstHeaderFk,
						MainItemId: entity.Id
					};
				}
			};

			return $injector.get('basicsCostGroupDataServiceFactory').createService('Assembly', projectAssemblyMainService, createOptions);
		}]);
})(angular);
