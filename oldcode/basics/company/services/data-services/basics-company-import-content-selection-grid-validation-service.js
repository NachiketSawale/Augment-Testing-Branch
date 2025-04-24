/**
 * Created by lst on 5/30/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	angular.module(moduleName).factory('basicsCompanyImportContentSelectionGridValidationService', [
		'$injector',
		function ($injector) {

			var service = {};

			service.validateoperation = function (entity, value) {

				var dataService = $injector.get('basicsCompanyImportContentSelectionGridDataService');

				if (entity.children && entity.children.length > 0) {
					angular.forEach(entity.children, function (item) {
						item.operation = value;
					});
				}

				if (entity.pid) {

					var dataList = dataService.getList();
					var rootNode = _.find(dataList, {id: entity.pid});
					if (rootNode) {
						rootNode.operation = value;
						if (rootNode.children && rootNode.children.length > 0) {
							angular.forEach(rootNode.children, function (item) {
								item.operation = value;
							});
						}
					}
				}

				dataService.gridRefresh();

			};

			return service;
		}
	]);
})(angular);