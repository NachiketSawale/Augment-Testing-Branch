/**
 * Created by wui on 8/16/2019.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcCommonPrcItemScopeDetailCostGroupService', ['$injector', '$q', 'qtoMainDetailService', 'platformGridAPI', 'procurementCommonDataServiceFactory',
		function ($injector, $q, qtoMainDetailService, platformGridAPI, procurementCommonDataServiceFactory) {

			function constructor(parentService) {
				var createOptions = {
					dataLookupType: 'ScopeDetailCostGroups',
					identityGetter: function (entity) {
						return {
							MainItemId: entity.Id
						};
					}
				};

				return $injector.get('basicsCostGroupDataServiceFactory').createService('Procurement', parentService, createOptions);
			}

			return procurementCommonDataServiceFactory.createService(constructor, 'prcCommonPrcItemScopeDetailCostGroupService');
		}]);
})(angular);