/**
 * @author: chd
 * @date: 3/31/2021 9:30 AM
 * @description:
 */
(function (angular) {
	'use strict';
	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).factory('mtwoAIConfigurationModelVersionValidationService', ['_',
		function (_) {
			return function (dataService) {
				let service = {};

				function updateIsLive(entity, value, model) {
					_.forEach(dataService.getList(), function (item) {
						if (item !== entity && value && item[model]) {
							item[model] = false;
							dataService.markItemAsModified(item);
							dataService.gridRefresh();
						}
						if (item === entity) {
							item[model] = value;
							dataService.markItemAsModified(item);
							dataService.gridRefresh();
						}
					});
				}

				service.validateIsLive = function (entity, value, model) {
					updateIsLive(entity, value, model);
					return {apply: value, valid: true};
				};

				return service;
			};
		}
	]);
})(angular);
