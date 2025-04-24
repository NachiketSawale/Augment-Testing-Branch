/**
 * Created by xia on 7/24/2019.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainWicRelateAssemblyCostGroupService', ['$injector', '$q', 'estimateMainWicRelateAssemblyService',
		function ($injector, $q, estimateMainWicRelateAssemblyService) {

			let createOptions = {
				dataLookupType: 'WicAssembly2CostGroups',
				identityGetter: function (entity) {
					return {
						RootItemId: entity.EstHeaderFk,
						MainItemId: entity.EstLineItemFk
					};
				}
			};

			return $injector.get('basicsCostGroupDataServiceFactory').createService('WicAssembly', estimateMainWicRelateAssemblyService, createOptions);
		}]);
})(angular);

