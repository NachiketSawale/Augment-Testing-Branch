/**
 * Created by wuj on 5/4/2015.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/* jshint -W072 */
	angular.module('procurement.invoice').factory('procurementInvoiceDetailControllerService',
		['platformDetailControllerService', 'procurementContextService', 'platformToolbarService', '$timeout',
			function (platformDetailControllerService, moduleContext, platformToolbarService, $timeout) {

				var service = {};

				service.initDetailController = function ($scope, itemService, validationService, uiStandardService, translationService) {
					function onReadOnlyStatusChange(key) {
						if (key !== moduleContext.moduleStatusKey) {
							return;
						}

						updateToolBarDisableStatus();
					}

					function updateToolBarDisableStatus() {
						var tools = platformToolbarService.getTools($scope.getContainerUUID());
						if (!tools) {
							return;
						}
						for (var i = 0; i < tools.length; i++) {
							if (tools[i].id === 'create') {
								tools[i].disabled = !itemService.canCreate();
							} else if (tools[i].id === 'delete') {
								tools[i].disabled = !itemService.canDelete();
							}
						}
						if($scope.tools)
						{$scope.tools.update();
						/* $timeout(function () {
							$scope.$parent.$digest();
						}, 0, false); */}
					}

					moduleContext.moduleValueChanged.register(onReadOnlyStatusChange);
					itemService.registerSelectionChanged(updateToolBarDisableStatus);

					platformDetailControllerService.initDetailController($scope, itemService, validationService, uiStandardService, translationService);

					$timeout(function () {
						updateToolBarDisableStatus();
					}, 10);

					$scope.$on('$destroy', function () {
						moduleContext.moduleValueChanged.unregister(onReadOnlyStatusChange);
						itemService.unregisterSelectionChanged(updateToolBarDisableStatus);
					});
				};


				return service;

			}]);
})(angular);