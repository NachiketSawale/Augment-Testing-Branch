/**
 * @author: chd
 * @date: 10/27/2020 9:34 AM
 * @description:
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainAILineItemCostGroupService', ['$injector', '$q', 'estimateMainService', 'estimateMainLineItemsCostGroupAiMappingService',
		function ($injector, $q, estimateMainService, estimateMainLineItemsCostGroupAiMappingService) {

			let createOptions = {
				dataLookupType: 'LineItem2CostGroups',
				supportAssignmentContainer: true,
				identityGetter: function (entity) {
					return {
						RootItemId: entity.EstHeaderFk,
						MainItemId: entity.Id
					};
				}
			};

			let service = $injector.get('basicsAICostGroupDataServiceFactory').createService('Estimate', estimateMainLineItemsCostGroupAiMappingService, createOptions);

			service.getDataLookupType = function () {
				return createOptions.dataLookupType;
			};

			service.initReadData = function (readData) {
				let selected = estimateMainService.getSelected();
				let serviceT = service;
				while (serviceT !== null) {
					let selectedT = serviceT.getSelected();
					if (selectedT !== null && selectedT.ProjectFk) {
						readData.PKey1 = selectedT.ProjectFk;
						break;
					}
					serviceT = serviceT.parentService();
				}
				readData.PKey2 = selected.Id;
				readData.PKey3 = selected.EstHeaderFk;
			};

			service.getRoute = function () {
				return 'estimate/main/lineitem/';
			};

			return service;
		}]);
})(angular);

