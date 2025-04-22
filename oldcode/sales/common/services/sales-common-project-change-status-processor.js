/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);

	salesCommonModule.factory('salesCommonProjectChangeStatusProcessor', ['$injector', 'projectChangeLookupDataService', function ($injector, projectChangeLookupDataService) {
		var service = {};

		service.processItem = function processItem(item) {
			if (item && item.ProjectFk) {
				projectChangeLookupDataService.setFilter(item.ProjectFk);
				if (item.PrjChangeFk) {
					var options = {
						dataServiceName: 'projectChangeLookupDataService'
					};
					projectChangeLookupDataService.getItemByIdAsync(item.PrjChangeFk, options).then(function (projectChange) {
						if (projectChange && projectChange.ChangeStatusFk) {
							item.PrjChangeStatusFk = projectChange.ChangeStatusFk;
						}
					});
					// TODO: check if both requests can be merged
					projectChangeLookupDataService.getItemByIdAsync(item.ChangeOrderFk, options).then(function (changeOrder) {
						if (changeOrder && changeOrder.ChangeStatusFk) {
							item.ChangeOrderStatusFk = changeOrder.ChangeStatusFk;
						}
					});
				}
			}
		};

		return service;
	}]);

})();
