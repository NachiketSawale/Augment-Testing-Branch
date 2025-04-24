/**
 * Created by wui on 8/16/2019.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcCommonPrcItemCostGroupService', ['$injector', '$q', 'platformGridAPI', 'procurementCommonDataServiceFactory',
		function ($injector, $q, platformGridAPI, procurementCommonDataServiceFactory) {

			function constructor(parentService) {
				var createOptions = {
					dataLookupType: 'PrcItem2CostGroups',
					identityGetter: function (entity) {
						return {
							MainItemId64: entity.Id
						};
					}
				};

				return $injector.get('basicsCostGroupDataServiceFactory').createService('Procurement', parentService, createOptions);
			}

			return procurementCommonDataServiceFactory.createService(constructor, 'prcCommonPrcItemCostGroupService');
		}]);
})(angular);
