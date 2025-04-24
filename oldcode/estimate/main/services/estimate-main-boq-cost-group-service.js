/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainBoqCostGroupService', ['$injector', '$q', 'estimateMainBoqService',
		function ($injector, $q, estimateMainBoqService) {

			let createOptions = {
				dataLookupType: 'ProjectBoQ2CostGroups',
				identityGetter: function identityGetter(entity){
					return {
						RootItemId: entity.BoqHeaderFk,
						MainItemId: entity.Id
					};
				}
			};

			return $injector.get('basicsCostGroupDataServiceFactory').createService('EstimateMain', estimateMainBoqService, createOptions);
		}]);
})(angular);
