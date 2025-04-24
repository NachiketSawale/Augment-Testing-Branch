(function (angular) {
	'use strict';
	/* jshint -W072 */
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.invoice').value('procurementInvoiceImportWarningGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'WarningMessage',
						field: 'WarningMessage',
						formatter: 'remark',
						name: 'Warning Message',
						name$tr$: 'procurement.package.import.warningMessage',
						width: 400
					}
				]
			};
		}
	});

	// todo: change dataService
	angular.module('procurement.invoice').controller('procurementInvoiceImportWarningGridController',
		['$scope', '$timeout', 'platformGridAPI', 'procurementInvoiceImportWaringService', 'procurementInvoiceImportWarningGridColumns',
			function ($scope, $timeout, platformGridAPI, dataService, gridColumns) {
				if (angular.isUndefined($scope.gridId)) {
					$scope.gridId = $scope.getContainerUUID();
				}

				if (!platformGridAPI.grids.exist($scope.gridId)) {

					var grid = {
						columns: gridColumns.getStandardConfigForListView().columns,
						data: [],
						id: $scope.gridId,
						options: {
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};

					platformGridAPI.grids.config(grid);
				}

				$scope.gridData = {
					state: $scope.gridId
				};

				function updateItemList() {
					dataService.getList().then(function (data) {
						platformGridAPI.items.data($scope.gridId, data);
					});
				}

				var gridListener = $scope.$watch(function () {
					return $scope.gridCtrl !== undefined;
				}, function () {
					$timeout(function () {
						updateItemList();
						gridListener();
					}, 10);
				});

				dataService.refreshGrid.register(updateItemList);

				$scope.$on('$destroy', function () {
					// platformGridAPI.grids.unregister($scope.gridId);
					dataService.refreshGrid.unregister(updateItemList);
				});
			}
		]);

	angular.module('procurement.invoice').factory('procurementInvoiceImportWaringService',
		['$q', '$http', 'procurementInvoiceImportResultService', 'PlatformMessenger',
			function ($q, $http, parentService, PlatformMessenger) {

				var service = {};

				service.refreshGrid = new PlatformMessenger();

				service.getList = function () {
					var defer = $q.defer();
					var parentItem = parentService.getSelected();
					if (parentItem) {
						$http.get(globals.webApiBaseUrl + 'procurement/invoice/warn?mainItemId=' + parentItem.Id).then(function (response) {
							if (response && response.data && response.data.length) {
								var res = [],
									index = 0;
								angular.forEach(response.data, function (item) {
									res.push({
										Id: index,
										WarningMessage: item
									});
									index++;
								});
								defer.resolve(res);
							}
						});
					} else {
						defer.resolve([]);
					}
					return defer.promise;
				};
				function onParentItemChanged() {
					service.refreshGrid.fire();
				}

				parentService.registerSelectionChanged(onParentItemChanged);

				return service;
			}]);
})(angular);