/**
 * Created by ysl on 12/8/2017.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.company';

	angular.module(moduleName).controller('basicsCompanyImportContentResultController', [
		'_',
		'$scope',
		'$q',
		'$translate',
		'$interval',
		'platformGridAPI',
		'platformSchemaService',
		'platformUIConfigInitService',
		'platformTranslateService',
		'basicsCompanyImportContentResultService',
		'basicsCompanyImportContentAddSelectionService',
		'basicsCompanyImportContentTaskStatusService',
		'basicsCompanyImportContentJobStatus',
		'basicsCompanyImportContentTaskStatus',
		function (
			_,
			$scope,
			$q,
			$translate,
			$interval,
			platformGridAPI,
			platformSchemaService,
			platformUIConfigInitService,
			platformTranslateService,
			basicsCompanyImportContentResultService,
			basicsCompanyImportContentAddSelectionService,
			basicsCompanyImportContentTaskStatusService,
			basicsCompanyImportContentJobStatus,
			basicsCompanyImportContentTaskStatus
		) {

			$scope.gridId = '7dea3b9daf0e4f52b71a2082421de0ef';
			$scope.gridData = {
				state: $scope.gridId
			};
			$scope.data = [];

			var columns = [
				{
					id: 'taskName', field: 'TaskName', name$tr$: 'basics.company.importContent.columnContent',
					formatter: taskNameFormatter, sortable: false, resizable: false, width: 240
				},
				{
					id: 'status', field: 'Status', name$tr$: 'basics.company.importContent.columnStatus',
					formatter: statusFormatter, sortable: false, resizable: false, width: 160
				},
				{
					id: 'log', field: 'log', name$tr$: 'basics.company.importContent.columnLog',
					formatter: 'action', domain: 'action', sortable: false, resizable: false, width: 160
				}];

			function taskNameFormatter(row, cell, value, columnDef, dataContext) {
				if (dataContext && value) {

					var content = _.find(basicsCompanyImportContentAddSelectionService, {runtimeCode: value});
					if (content) {
						value = content.content;
					} else {
						_.forEach(basicsCompanyImportContentAddSelectionService, function (item) {
							var items = item.level1Data;
							if (items) {
								var content = _.find(items, {runtimeCode: value});
								if (content) {
									value = content.code;
									return false; // break foreach loop.
								}
							}
						});
					}

					var icon = '';
					return icon + '<span class="pane-r">' + value + '</span>';
				}
				return value;
			}

			function statusFormatter(row, cell, value, columnDef, dataContext) {
				if (dataContext && value) {

					var progress = '';
					if (value === basicsCompanyImportContentTaskStatus.InProgress) {
						if (dataContext.Progress > 0) {
							progress = '(' + dataContext.Progress.toFixed(0) + '%)';
						}
					}

					var status = _.find(basicsCompanyImportContentTaskStatusService, {value: value});
					if (status) {
						value = status.description;
					}

					var icon = '';
					return icon + '<span class="pane-r">' + value + progress + '</span>';
				}
				return value;
			}

			function setupGrid() {
				platformTranslateService.translateGridConfig(columns);

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var grid = {
						columns: angular.copy(columns), data: $scope.data, id: $scope.gridId, lazyInit: true,
						options: {indicator: false, idProperty: 'Id'}
					};
					platformGridAPI.grids.config(grid);
				} else {
					platformGridAPI.columns.configuration($scope.gridId, angular.copy(columns));
				}
			}

			$scope.$on('import:beforeRestart', function () {
				$scope.data.length = 0;
				platformGridAPI.grids.refresh($scope.gridId, true);
			});

			$scope.$on('import:restarted', function () {
				startRefresh();
			});

			var statusFreshTimer = null;
			$scope.isRefreshing = false;
			$scope.refresh = function refreshStatusData() {
				if (!$scope.importJob) {
					return false;
				}
				if ($scope.isRefreshing === true) {
					return false;
				}

				$scope.isRefreshing = true;
				basicsCompanyImportContentResultService.getStatus($scope.importJob.Id).then(function (response) {

					$scope.isRefreshing = false;

					var statusResponse = response.data;
					if (!statusResponse) {
						return false;
					}

					var jobIsFinished = false;

					if (statusResponse.ImportJobStatus === basicsCompanyImportContentJobStatus.Aborted ||
						statusResponse.ImportJobStatus === basicsCompanyImportContentJobStatus.Finish) {
						jobIsFinished = true;
						stopRefresh();
					}

					$scope.importJob.Status = statusResponse.ImportJobStatus;

					var statusList = statusResponse.TaskStatus;
					if ($scope.data.length === 0) {
						angular.forEach(statusList, function (item) {
							item.log = {
								actionList: [
									{
										toolTip: $translate.instant('basics.company.importContent.showLog'),
										icon: 'control-icons ico-filetype-log',
										callbackFn: function (entity) {
											basicsCompanyImportContentResultService.ShowLog(entity);
										}
									}
								]
							};
							if (jobIsFinished &&
								(item.Status === basicsCompanyImportContentTaskStatus.Waiting ||
									item.Status === basicsCompanyImportContentTaskStatus.InProgress)
							) {
								item.Status = basicsCompanyImportContentTaskStatus.Failed;
							}
							$scope.data.push(item);
						});
					} else {
						angular.forEach($scope.data, function (item) {
							var newItem = _.find(statusList, {Id: item.Id});
							if (newItem) {
								item.Status = newItem.Status;
								item.Progress = newItem.Progress;

								if (jobIsFinished &&
									(item.Status === basicsCompanyImportContentTaskStatus.Waiting ||
										item.Status === basicsCompanyImportContentTaskStatus.InProgress)
								) {
									item.Status = basicsCompanyImportContentTaskStatus.Failed;
								}
							}
						});
					}
					platformGridAPI.grids.refresh($scope.gridId, true);
				}).catch(function (/*e*/) {
					stopRefresh();
				});
			};

			$scope.downloadLog = function () {
				if ($scope.importJob) {
					basicsCompanyImportContentResultService.downloadLog($scope.importJob.Id);
				}
			};

			$scope.downloadEnabled = function () {
				return true;

			};

			function init() {
				setupGrid();
				startRefresh();
			}

			init();

			function startRefresh() {
				if (!_.isNil(statusFreshTimer)) {
					stopRefresh();
				}
				$scope.refresh();
				statusFreshTimer = $interval(function () {
					$scope.refresh();
				}, 5000);
			}

			function stopRefresh() {
				$interval.cancel(statusFreshTimer);
				statusFreshTimer = null;
			}

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				stopRefresh();
			});

		}
	]);

})(angular);
