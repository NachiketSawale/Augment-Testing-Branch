/**
 * Created by hzh on 5/27/2020.
 */
/* global */
(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'defect.main';

	angular.module(moduleName).value('defectMainBim360BPGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'IsCheck',
						field: 'Selected',
						name: 'Selected',
						name$tr$: 'defect.main.bim360Issues.isSelectedTitle',
						formatter: 'boolean',
						editor: 'boolean',
						width: 80,
						headerChkbox: true,
					},
					{
						id: 'StatusDisplay',
						field: 'StatusDisplay',
						name: 'StatusDisplay',
						name$tr$: 'defect.main.bim360Issues.columns.status',
						width: 80
					},
					{
						id: 'Title',
						field: 'Title',
						name: 'Title',
						name$tr$: 'defect.main.bim360Issues.columns.title',
						width: 100
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'defect.main.bim360Issues.columns.description',
						width: 130
					},
					{
						id: 'DueDate',
						field: 'DueDate',
						name: 'DueDate',
						name$tr$: 'defect.main.bim360Issues.columns.dueDate',
						width: 80
					},
					{
						id: 'AssignedTo',
						field: 'AssignToName',
						name: 'AssignedTo',
						name$tr$: 'defect.main.bim360Issues.columns.assignedTo',
						width: 80
					}
				]
			};
		}
	});

	angular.module(moduleName).controller('defectMainBim360Controller',
		['$rootScope', '_','$scope', '$translate', '$http', 'platformGridAPI', 'defectMainBim360Service',
			'platformGridControllerService', 'defectMainBim360BPGridColumns', '$timeout', 'cloudDeskBim360Service',
			'defectMainHeaderDataService',
			function ($rootScope,_, $scope, $translate, $http, platformGridAPI, defectMainBim360Service,
				gridControllerService, gridColumns, $timeout, cloudDeskBim360Service, defectMainHeaderDataService) {
				$scope.options = $scope.$parent.modalOptions;
				$scope.selectedItem = defectMainBim360Service.getSelectedPrjInfo();
				$scope.dlgOptions = defectMainBim360Service.getDlgOptions();
				$scope.dlgOptions.filterStatus = '(all)';
				$scope.dlgOptions.searchText = '';
				$scope.dlgOptions.importDocument = true;
				$scope.dlgOptions.showImported = false;
				$scope.dlgOptions.OKBtnDisabled = 'disabled';
				$scope.dlgOptions.searchBtnDisabled = 'disabled';
				$scope.dlgOptions.DefectList = null;

				$scope.modalOptions = {
					header: {
						title: $translate.instant('defect.main.bim360Issues.syncIssueToDefectTitle')
					},
					body: {
						chooseDefectText: $translate.instant('defect.main.bim360Issues.chooseDefectText'),
						projectNameText: $translate.instant('defect.main.bim360Issues.projectNameText'),
						filterStatusText: $translate.instant('defect.main.bim360Issues.filterStatusText'),
						filterTypeText: $translate.instant('defect.main.bim360Issues.filterTypeText'),
						cbImportDocumentText: $translate.instant('defect.main.bim360Issues.importDocumentText'),
						cbShowImportedText: $translate.instant('defect.main.bim360Issues.filterShowImportedText')
					},
					footer: {
						btnLoadDefects: $translate.instant('defect.main.bim360Issues.btnLoadDefects'),
						btnOk: $translate.instant('basics.common.button.ok'),
						btnCancel: $translate.instant('basics.common.button.cancel')
					}
				};

				// set data to grid
				var setDataSource = function (data) {
					defectMainBim360Service.setDataList(data);
					defectMainBim360Service.refreshGrid();
					$scope.onContentResized();
				};
				$scope.modalOptions.loadDefects = function loadDefects() {
					$scope.isLoading = true;
					defectMainBim360Service.loadIssueFormBim360($scope.selectedItem, $scope.dlgOptions)
						.then(function (response) {
							$scope.isLoading = false;
							if (response) {
								if (response.StateCode === 'OK') {
									var issuesData = JSON.parse(response.ResultMsg);
									issuesData.forEach(function (v) {
										if (v.Status === 'open') {
											v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_open');
										} else if (v.Status === 'closed') {
											v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_closed');
										} else if (v.Status === 'answered') {
											v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_answered');
										} else if (v.Status === 'draft') {
											v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_draft');
										} else if (v.Status === 'work_completed') {
											v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_work_completed');
										} else if (v.Status === 'ready_to_inspect') {
											v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_ready_to_inspect');
										} else if (v.Status === 'not_approved') {
											v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_not_approved');
										} else if (v.Status === 'in_dispute') {
											v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_in_dispute');
										} else if (v.Status === 'void') {
											v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_void');
										} else {
											v.StatusDisplay = v.Status;
										}

									});
									setDataSource(issuesData);
								}
							}
						}, function () {
							$scope.isLoading = false;
						});
				};

				$scope.modalOptions.ok = function ok() {
					$scope.isLoading = true;
					defectMainBim360Service.saveIssue($scope.selectedItem, $scope.dlgOptions).then(function (response) {
						$scope.isLoading = false;
						if (response.StateCode === 'OK') {
							cloudDeskBim360Service.showMsgDialog($translate.instant('defect.main.bim360Issues.syncIssueToDefectTitle'), $translate.instant('defect.main.bim360Issues.issuesSaved'), 'ico-info');
							$scope.$close(true);
							defectMainHeaderDataService.refresh().then(function () {
								$timeout(function () {
									let myDefect = $scope.dlgOptions.DefectList;
									if (myDefect.IssuesSaved.length > 0) {
										let idFirst = myDefect.IssuesSaved[0].ItwoDefectId;
										let defectList = defectMainHeaderDataService.getList();
										if (defectList.length > 0) {
											let itemTobeSelected = _.find(defectList, {Id: idFirst});
											if (!_.isNull(itemTobeSelected)) {
												defectMainHeaderDataService.setSelected(itemTobeSelected);
											}
										}
									}
								});
							});
						} else {
							cloudDeskBim360Service.showMsgDialog($translate.instant('defect.main.bim360Issues.syncIssueToDefectTitle'), $translate.instant('defect.main.bim360Issues.issuesNotSaved') + response.Message, 'ico-error');
							$scope.$close(true);
							defectMainHeaderDataService.refresh();
						}
					}, function () {
						$scope.isLoading = false;
						$scope.$close(true);
						defectMainHeaderDataService.refresh();
					});
				};

				$scope.modalOptions.cancel = function onCancel() {
					$scope.$close(false);
				};

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				$scope.data = [];
				$scope.gridId = '1fa8b5bca98c4c8b9411ce4bc1e2f719';

				$scope.onContentResized = function () {
					resizeGrid();
				};

				function resizeGrid() {
					$timeout(function(){
						platformGridAPI.grids.resize($scope.gridId);
					});
				}

				$scope.setTools = function () {
				};



				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onGridCheckboxClickedFuc);
				// platformGridAPI.events.register($scope.gridId, 'onHeaderToggled', onGridCheckboxClickedFuc);
				// platformGridAPI.events.register($scope.gridId, 'onHeaderClick', onGridCheckboxClickedFuc);
				platformGridAPI.events.register($scope.gridId, 'onCellChange', onGridCheckboxClickedFuc);
				gridControllerService.initListController($scope, gridColumns, defectMainBim360Service, null, gridConfig);

				function onGridCheckboxClickedFuc() {
					defectMainBim360Service.okDisabled();
					refresh($scope);
				}

				function refresh(scope) {
					var curScope = scope || $scope;
					if (!$rootScope.$$phase) {
						curScope.$digest();
					} else {
						curScope.$evalAsync();
					}
				}

				// resize the grid
				$timeout(function () { // use timeout to do after the grid instance is finished
					platformGridAPI.grids.resize($scope.gridId);
				});

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister($scope.gridId);
				});

				defectMainBim360Service.setSelectedPrjInfo(null);
				setDataSource([]);

			}]);
})(angular);
