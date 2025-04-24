/**
 * Created by xia on 8/15/2019.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).factory('estimateAssembliesCostGroupService', ['$injector', '$q', 'estimateAssembliesService',
		function ($injector, $q, estimateAssembliesService) {

			let createOptions = {
				dataLookupType: 'Assembly2CostGroups',
				identityGetter: function (entity) {
					return {
						RootItemId: entity.EstHeaderFk,
						MainItemId: entity.Id
					};
				}
			};

			return $injector.get('basicsCostGroupDataServiceFactory').createService('Assembly', estimateAssembliesService, createOptions);
		}]);
})(angular);
