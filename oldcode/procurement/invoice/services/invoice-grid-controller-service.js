/**
 * Created by wuj on 5/4/2015.
 */

(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').factory('procurementInvoiceGridControllerService',
		['platformGridControllerService', 'procurementContextService', 'platformToolbarService', 'platformGridAPI', '$timeout',
			function (gridControllerService, moduleContext, platformToolbarService, platformGridAPI, $timeout) {
				var service = {};

				service.initListController = function initListController($scope, uiStandardService, itemService, validationService, gridConfig) {
					function updateTools() {
						var tools = platformToolbarService.getTools($scope.getContainerUUID());
						for (var i = 0; i < tools.length; i++) {
							// t4:taskBarNewRecord
							if (tools[i].id === 'create') {
								tools[i].disabled = !itemService.canCreate();
							}

							// t3:taskBarDeleteRecord
							if (tools[i].id === 'delete') {
								tools[i].disabled = !itemService.canDelete();
							}
						}
						$scope.tools.update();
						$timeout(function () {
							$scope.$parent.$digest();
						}, 0, false);
					}

					function onReadOnlyStatusChange(key) {
						if (key !== moduleContext.moduleStatusKey) {
							return;
						}
						$scope.tools.update();
					}

					moduleContext.moduleValueChanged.register(onReadOnlyStatusChange);

					gridConfig.rowChangeCallBack = function () {
						updateTools();
					};

					gridControllerService.initListController($scope, uiStandardService, itemService, validationService, gridConfig);

					// do not forget to unregister your subscription
					$scope.$on('$destroy', function () {
						moduleContext.moduleValueChanged.unregister(onReadOnlyStatusChange);
					});

					service.addTools = gridControllerService.addTools;

				};

				return service;
			}
		]);
})();
