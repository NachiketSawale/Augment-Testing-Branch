/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainLineItemCostGroupService', ['$injector', '$q', 'estimateMainService',
		function ($injector, $q, estimateMainService) {

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

			let service = $injector.get('basicsCostGroupDataServiceFactory').createService('Estimate', estimateMainService, createOptions);

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
