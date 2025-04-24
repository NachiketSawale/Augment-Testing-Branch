/**
 * Created by wui on 4/24/2015.
 */

(function (angular) {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopSidebarInfoControllerService', ['basicsCommonUtilities', '$timeout',

		function (basicsCommonUtilities, $timeout) {
			var service = {};

			service.init = function (scope, config) {
				var unregisters = [];

				config.forEach(function (itemConfig) {
					var selectionChangedHandler = handleSelectionChanged(itemConfig.dataService, itemConfig.selectedItem);

					selectionChangedHandler();

					itemConfig.dataService.registerSelectionChanged(selectionChangedHandler);

					unregisters.push(function () {
						itemConfig.dataService.unregisterSelectionChanged(selectionChangedHandler);
					});

					if (itemConfig.dataService.registerListLoaded && !itemConfig.dataService.isRoot) {
						var listHandler = handleListLoaded(itemConfig.dataService, itemConfig.selectedItem);
						listHandler();
						itemConfig.dataService.registerListLoaded(listHandler);
						unregisters.push(function () {
							itemConfig.dataService.unregisterListLoaded(listHandler);
						});
					}
				});

				scope.$on('$destroy', function () {
					unregisters.forEach(function (unregister) {
						unregister();
					});
				});

				return service;

				function handleSelectionChanged(dataService, selectedItemName) {
					return function () {
						$timeout(function () {
							scope[selectedItemName] = dataService.getSelected();
						});
					};
				}

				function handleListLoaded(dataService, selectedItemName) {
					return function () {
						$timeout(function () {
							if (angular.isFunction(dataService.getItemName)) {
								scope[dataService.getItemName()] = dataService.getList();
							} else {
								return;
							}
							scope[selectedItemName] = dataService.getSelected();
						});
					};
				}
			};

			return service;
		}

	]);

})(angular);