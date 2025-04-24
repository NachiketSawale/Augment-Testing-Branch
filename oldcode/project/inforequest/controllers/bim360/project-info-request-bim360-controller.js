/**
 * Created by deh on 6/10/2020.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	// var moduleName = 'project.inforequest';

	angular.module('project.inforequest').value('projectInfoRequestBim360BPGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'IsCheck',
						field: 'Selected',
						name: 'Selected',
						name$tr$: 'project.inforequest.bim360RFIs.isSelectedTitle',
						formatter: 'boolean',
						editor: 'boolean',
						width: 80,
						headerChkbox: true
					},
					{
						id: 'StatusDisplay',
						field: 'StatusDisplay',
						name: 'StatusDisplay',
						name$tr$: 'project.inforequest.bim360RFIs.columns.status',
						width: 80
					},
					{
						id: 'Title',
						field: 'Title',
						name: 'Title',
						name$tr$: 'project.inforequest.bim360RFIs.columns.title',
						width: 100
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'project.inforequest.bim360RFIs.columns.description',
						width: 130
					},
					{
						id: 'DueDate',
						field: 'DueDate',
						name: 'DueDate',
						name$tr$: 'project.inforequest.bim360RFIs.columns.dueDate',
						width: 80
					},
					{
						id: 'AssignedTo',
						field: 'AssignToName',
						name: 'AssignedTo',
						name$tr$: 'project.inforequest.bim360RFIs.columns.assignedTo',
						width: 80
					}
				]
			};
		}
	});

	angular.module('project.inforequest').controller('projectInfoRequestBim360Controller',
		['_', '$rootScope', '$scope', '$translate', '$http', 'platformGridAPI', 'projectInfoRequestBim360Service',
			'platformGridControllerService', 'projectInfoRequestBim360BPGridColumns', '$timeout', 'cloudDeskBim360Service',
			'projectInfoRequestDataService',
			function (_, $rootScope, $scope, $translate, $http, platformGridAPI, projectInfoRequestBim360Service,
				gridControllerService, gridColumns, $timeout, cloudDeskBim360Service, projectInfoRequestDataService) {
				$scope.options = $scope.$parent.modalOptions;
				$scope.selectedItem = projectInfoRequestBim360Service.getSelectedPrjInfo();
				$scope.dlgOptions = projectInfoRequestBim360Service.getDlgOptions();
				$scope.dlgOptions.filterStatus = '(all)';
				$scope.dlgOptions.searchText = '';
				$scope.dlgOptions.importDocument = true;
				$scope.dlgOptions.showImported = false;
				$scope.dlgOptions.OKBtnDisabled = 'disabled';
				$scope.dlgOptions.searchBtnDisabled = 'disabled';
				$scope.dlgOptions.RfiList = null;

				$scope.modalOptions = {
					header: {
						title: $translate.instant('project.inforequest.bim360RFIs.syncRFITitle')
					},
					body: {
						chooseDefectText: $translate.instant('project.inforequest.bim360RFIs.chooseRFIText'),
						projectNameText: $translate.instant('project.inforequest.bim360RFIs.projectNameText'),
						filterStatusText: $translate.instant('project.inforequest.bim360RFIs.filterStatusText'),
						filterTypeText: $translate.instant('project.inforequest.bim360RFIs.filterTypeText'),
						cbImportDocumentText: $translate.instant('project.inforequest.bim360RFIs.importDocumentText'),
						cbShowImportedText: $translate.instant('project.inforequest.bim360RFIs.filterShowImportedText')
					},
					footer: {
						btnLoadDefects: $translate.instant('project.inforequest.bim360RFIs.btnLoadRFIs'),
						btnOk: $translate.instant('basics.common.button.ok'),
						btnCancel: $translate.instant('basics.common.button.cancel')
					}
				};

				$scope.modalOptions.loadRFIs = function loadRFIs() {
					$scope.isLoading = true;
					projectInfoRequestBim360Service.loadRFIsFormBim360($scope.selectedItem, $scope.dlgOptions)
						.then(function (response) {
							$scope.isLoading = false;
							if (response) {
								if (response.StateCode === 'OK') {
									var rfiData = JSON.parse(response.ResultMsg);
									rfiData.forEach(function (v) {
										if (v.Status === 'draft') {
											v.StatusDisplay = $translate.instant('project.inforequest.bim360RFIs.status_draft');
										} else if (v.Status === 'submitted') {
											v.StatusDisplay = $translate.instant('project.inforequest.bim360RFIs.status_submitted');
										} else if (v.Status === 'open') {
											v.StatusDisplay = $translate.instant('project.inforequest.bim360RFIs.status_open');
										} else if (v.Status === 'answered') {
											v.StatusDisplay = $translate.instant('project.inforequest.bim360RFIs.status_answered');
										} else if (v.Status === 'rejected') {
											v.StatusDisplay = $translate.instant('project.inforequest.bim360RFIs.status_rejected');
										} else if (v.Status === 'closed') {
											v.StatusDisplay = $translate.instant('project.inforequest.bim360RFIs.status_closed');
										} else if (v.Status === 'void') {
											v.StatusDisplay = $translate.instant('project.inforequest.bim360RFIs.status_void');
										} else {
											v.StatusDisplay = v.Status;
										}
									});
									setDataSource(rfiData);
								}
							}
						}, function () {
							$scope.isLoading = false;
						});
				};

				$scope.modalOptions.ok = function ok() {
					$scope.isLoading = true;
					projectInfoRequestBim360Service.saveRFIs($scope.selectedItem, $scope.dlgOptions)
						.then(function (response) {
							$scope.isLoading = false;
							if (response.StateCode === 'OK') {
								cloudDeskBim360Service.showMsgDialog($translate.instant('project.inforequest.bim360RFIs.syncRFITitle'), $translate.instant('project.inforequest.bim360RFIs.RFIsSaved'), 'ico-info');
								$scope.$close(true);
								projectInfoRequestDataService.refresh().then(function () {
									$timeout(function () {
										let myRfi = $scope.dlgOptions.RfiList;
										if (myRfi.RFIsSaved.length > 0) {
											let idFirst = myRfi.RFIsSaved[0].ItwoRfiId;
											let rfiList = projectInfoRequestDataService.getList();
											if (rfiList.length > 0) {
												let itemTobeSelected = _.find(rfiList, {Id: idFirst});
												if (!_.isNull(itemTobeSelected)) {
													projectInfoRequestDataService.setSelected(itemTobeSelected);
												}
											}
										}
									});
								});
							} else {
								cloudDeskBim360Service.showMsgDialog($translate.instant('project.inforequest.bim360RFIs.syncRFITitle'), $translate.instant('project.inforequest.bim360RFIs.RFIsNotSaved') + response.Message, 'ico-error');
								$scope.$close(true);
								projectInfoRequestDataService.refresh();
							}
						}, function () {
							$scope.isLoading = false;
							$scope.$close(true);
							projectInfoRequestDataService.refresh();
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
				$scope.gridId = '4c34b28a088342cf975bb87002c47734';

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

				// set data to grid
				var setDataSource = function (data) {
					projectInfoRequestBim360Service.setDataList(data);
					projectInfoRequestBim360Service.refreshGrid();
					$scope.onContentResized();
				};

				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onGridCheckboxClickedFuc);
				// platformGridAPI.events.register($scope.gridId, 'onHeaderToggled', onGridCheckboxClickedFuc);
				// platformGridAPI.events.register($scope.gridId, 'onHeaderClick', onGridCheckboxClickedFuc);
				platformGridAPI.events.register($scope.gridId, 'onCellChange', onGridCheckboxClickedFuc);
				gridControllerService.initListController($scope, gridColumns, projectInfoRequestBim360Service, null, gridConfig);

				function onGridCheckboxClickedFuc(/* e, arg */) {
					projectInfoRequestBim360Service.okDisabled();
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

				projectInfoRequestBim360Service.setSelectedPrjInfo(null);
				setDataSource([]);

			}]);
})(angular);
