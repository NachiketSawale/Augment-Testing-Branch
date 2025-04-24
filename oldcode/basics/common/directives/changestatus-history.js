(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	/**
	 * @ngdoc directive
	 * @name basicsCommomChangeStatusHistory
	 * @restrict A
	 * @description Status history grid in status change dialog
	 */
	angular.module(moduleName).directive('basicsCommomChangeStatusHistory',
		['$translate', 'basicsCommonChangeStatusService', 'platformGridAPI', '$timeout', '$q', 'platformDataProcessExtensionHistoryCreator', 'platformObjectHelper', '_',
			function ($translate, basicsCommonChangeStatusService, platformGridAPI, $timeout, $q, platformDataProcessExtensionHistoryCreator, platformObjectHelper, _) {
				function changeStatusHistoryController($scope) {
					$scope.getHistoryGridUUID = function () {
						return '64143db49edd4bb8a3e7e9c5cb098c1d';
					};

					const gridColumns = [
						{
							id: 'oldStatus',
							field: 'oldStatus.' + $scope.options.statusDisplayField,
							name: $translate.instant('basics.common.changeStatus.from'),
							editor: null,
							readonly: true,
							width: 70,
							domain: 'description',
							formatter: 'description'
						},
						{
							id: 'newStatus',
							field: 'newStatus.' + $scope.options.statusDisplayField,
							name: $translate.instant('basics.common.changeStatus.to'),
							editor: null,
							readonly: true,
							width: 70,
							domain: 'description',
							formatter: 'description'
						},
						{
							id: 'remark',
							field: 'Remark',
							name: $translate.instant('basics.common.changeStatus.remark'),
							editor: null,
							readonly: true,
							width: 180,
							domain: 'remark',
							formatter: 'remark'
						},
						{
							id: 'insertedAt',
							field: '__rt$data.history.insertedAt',
							name: $translate.instant('basics.common.changeStatus.changedAt'),
							editor: null,
							readonly: true,
							width: 150,
							domain: 'history',
							formatter: 'description'
						},
						{
							id: 'insertedBy',
							field: '__rt$data.history.insertedBy',
							name: $translate.instant('basics.common.changeStatus.changedBy'),
							domain: 'history',
							formatter: 'description',
							width: 70
						}
					];

					if (platformGridAPI.grids.exist($scope.getHistoryGridUUID())) {
						platformGridAPI.grids.unregister($scope.getHistoryGridUUID());
					}

					const gridConfig = {
						data: [], // todo aus instance data
						columns: angular.copy(gridColumns),
						id: $scope.getHistoryGridUUID(),
						lazyInit: true,
						options: {
							tree: false, indicator: true, allowRowDrag: false,
							editable: true,
							asyncEditorLoading: true,
							autoEdit: false,
							enableCellNavigation: true,
							enableColumnReorder: false,
							showItemCount: false
						}
					};

					platformGridAPI.grids.config(gridConfig);

					$q.all([
						basicsCommonChangeStatusService.getAllStatusList($scope.options),
						basicsCommonChangeStatusService.getStatusHistory($scope.options)
					]).then(
						function (values) {
							const status = values[0];
							const history = values[1];
							const promises = [];

							history.forEach(function (e) {
								e.oldStatus = _.find(status, {Id: e.StatusOldFk});
								e.newStatus = _.find(status, {Id: e.StatusNewFk});
								platformDataProcessExtensionHistoryCreator.processItem(e);
								if (platformObjectHelper.isPromise(e.__rt$data.history.insertedBy)) {
									promises.push(e.__rt$data.history.insertedBy);
								}
							});

							if (promises.length > 0) {
								$q.all(promises).then(function () {
									platformGridAPI.items.data($scope.getHistoryGridUUID(), history);
								});
							} else {
								platformGridAPI.items.data($scope.getHistoryGridUUID(), history);
							}
						}
					);

					$scope.gridData = {
						state: $scope.getHistoryGridUUID()
					};

				}

				return {
					restrict: 'A',
					scope: {
						options: '='
					},
					template: '<div data-platform-grid style="border: 1px solid #ABABAB;" data-data="gridData"></div>',
					controller: ['$scope', changeStatusHistoryController]
				};

			}]);
})(angular);