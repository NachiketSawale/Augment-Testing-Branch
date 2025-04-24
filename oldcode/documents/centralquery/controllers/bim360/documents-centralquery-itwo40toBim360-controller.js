/**
 * Created by hzh on 5/27/2020.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'documents.centralquery';

	angular.module(moduleName).value('documentsCentralqueryITwo40toBim360BPGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'IsCheck',
						field: 'Selected',
						name: 'Selected',
						name$tr$: 'documents.centralquery.bim360Documents.isSelectedTitle',
						formatter: 'boolean',
						editor: 'boolean',
						width: 80,
						headerChkbox: true,
					},
					{
						id: 'StatusDisplay',
						field: 'StatusDisplay',
						name: 'StatusDisplay',
						name$tr$: 'documents.centralquery.bim360Documents.columns.status',
						width: 80
					},
					{
						id: 'DocumentId',
						field: 'Id',
						name: 'Id',
						name$tr$: 'documents.centralquery.bim360Documents.columns.documentId',
						width: 80
					},
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'documents.centralquery.bim360Documents.columns.code',
						width: 80
					},
					{
						id: 'DocumentName',
						field: 'DocumentName',
						name: 'DocumentName',
						name$tr$: 'documents.centralquery.bim360Documents.columns.description',
						width: 150
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'documents.centralquery.bim360Documents.columns.originalFileName',
						width: 150
					},
					{
						id: 'DocumentSizeDisplay',
						field: 'DocumentSizeDisplay',
						name: 'DocumentSizeDisplay',
						name$tr$: 'documents.centralquery.bim360Documents.columns.size',
						width: 80
					},
					{
						id: 'ProjectCode',
						field: 'ProjectCode',
						name: 'ProjectCode',
						name$tr$: 'documents.centralquery.bim360Documents.columns.projectCode',
						width: 80
					},
					{
						id: 'ProjectName',
						field: 'ProjectName',
						name: 'ProjectName',
						name$tr$: 'documents.centralquery.bim360Documents.columns.projectName',
						width: 150
					}
				]
			};
		}
	});

	angular.module(moduleName).controller('documentsCentralqueryITwo40toBim360Controller',
		['$rootScope', '$scope', '$translate', '$http', 'platformGridAPI', 'documentsCentralqueryITwo40toBim360Service','documentCentralQueryDataService', 'documentsProjectDocumentModuleContext',
			'platformGridControllerService', 'documentsCentralqueryITwo40toBim360BPGridColumns', '$timeout', 'cloudDeskBim360Service', '$injector', 'cloudDesktopPinningContextService',

			function ($rootScope, $scope, $translate, $http, platformGridAPI, documentsCentralqueryITwo40toBim360Service,documentCentralQueryDataService, documentsProjectDocumentModuleContext,
				gridControllerService, gridColumns, $timeout, cloudDeskBim360Service, $injector, cloudDesktopPinningContextService) {
				$scope.options = $scope.$parent.modalOptions;
				$scope.selectedItem = documentsCentralqueryITwo40toBim360Service.getSelectedPrjInfo();
				$scope.selectedFolder = documentsCentralqueryITwo40toBim360Service.getSelectedFolderInfo();
				$scope.dlgOptions = documentsCentralqueryITwo40toBim360Service.getDlgOptions();
				$scope.dlgOptions.filterStatus = '(all)';
				$scope.dlgOptions.searchText = '';
				$scope.dlgOptions.importDocument = true;
				$scope.dlgOptions.showImported = false;
				$scope.dlgOptions.OKBtnDisabled = 'disabled';
				$scope.dlgOptions.searchBtnDisabled = 'disabled';

				$scope.modalOptions = {
					header: {
						title: $translate.instant('documents.centralquery.bim360Documents.syncDocumentToBim360Title')
					},
					body: {
						projectNameText: $translate.instant('documents.centralquery.bim360Documents.itwo40Project'), // "iTWO 4.0 Project", //
						folderText: $translate.instant('documents.centralquery.bim360Documents.destineFolder'), // "Destine Folder", //
						btnSearchText: $translate.instant('documents.centralquery.bim360Documents.btnSearchText'),  // "Search",// btnLoadDocumentText')  //"Load Documents",//
						keywordText: $translate.instant('documents.centralquery.bim360Documents.keyWord')  // "Keyword"
					},
					footer: {
						btnOk: $translate.instant('basics.common.button.ok'),
						btnCancel: $translate.instant('basics.common.button.cancel')
					}
				};
				// set data to grid
				var setDataSource = function (data) {
					documentsCentralqueryITwo40toBim360Service.setDataList(data);
					documentsCentralqueryITwo40toBim360Service.refreshGrid();
					$scope.onContentResized();
				};
				$scope.modalOptions.loadDocuments = function loadDocuments() {
					$scope.isLoading = true;
					documentsCentralqueryITwo40toBim360Service.loadDocumentFromItwo40($scope.selectedItem, $scope.dlgOptions)
						.then(function (response) {
							$scope.isLoading = false;
							if (response) {
								if (response.StateCode === 'OK') {
									var issuesData = JSON.parse(response.ResultMsg);
									issuesData.forEach(function () {
										/* if (v.Status === "open") {
                                            v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_open');
                                        } else if (v.Status === "closed") {
                                            v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_closed');
                                        } else if (v.Status === "answered") {
                                            v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_answered');
                                        } else if (v.Status === "draft") {
                                            v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_draft');
                                        } else if (v.Status === "work_completed") {
                                            v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_work_completed');
                                        } else if (v.Status === "ready_to_inspect") {
                                            v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_ready_to_inspect');
                                        } else if (v.Status === "not_approved") {
                                            v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_not_approved');
                                        } else if (v.Status === "in_dispute") {
                                            v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_in_dispute');
                                        } else if (v.Status === "void") {
                                            v.StatusDisplay = $translate.instant('defect.main.bim360Issues.status_void');
                                        } else {
                                            v.StatusDisplay = v.Status;
                                        }; */
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
					documentsCentralqueryITwo40toBim360Service.saveDocument($scope.dlgOptions)
						.then(function (response) {
							$scope.isLoading = false;
							if (response.StateCode === 'OK') {
								cloudDeskBim360Service.showMsgDialog($translate.instant('documents.centralquery.bim360Documents.syncDocumentToBim360Title'), $translate.instant('documents.centralquery.bim360Documents.documentsSavedToBim360'), 'ico-info');
								$scope.$close(true);
								selectNewDocItem(documentsCentralqueryITwo40toBim360Service.getSelectedPrjInfo().prjId);
							} else {
								cloudDeskBim360Service.showMsgDialog($translate.instant('documents.centralquery.bim360Documents.syncDocumentToBim360Title'), $translate.instant('documents.centralquery.bim360Documents.documentsNotSaved') + response.Message, 'ico-error');
							}
						}, function () {
							$scope.isLoading = false;
							$scope.$close(true);
							selectNewDocItem(documentsCentralqueryITwo40toBim360Service.getSelectedPrjInfo().prjId);
						});
				};

				let selectNewDocItem = function (projectId) {
					let config = documentsProjectDocumentModuleContext.getConfig();
					let documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');
					let documentsDataService = documentsProjectDocumentDataService.getService(config);

					if (config.moduleName === 'project.main') {                                                      // refresh only when pin project is selected project for "project.main" module.
						let pinProjectItem = cloudDesktopPinningContextService.getPinningItem('project.main');
						if (pinProjectItem.id !== projectId) {
							return;
						}
					}

					documentsDataService.refresh().then(function () {
						$timeout(function () {
							let myDocs = $scope.dlgOptions.DocList;
							if (myDocs.length > 0) {
								let docList = documentsDataService.getList();
								if (docList.length > 0) {
									let firstDocId = myDocs[0].ItwoDocId;
									let itemTobeSelected =  _.find(docList, {Id: firstDocId});
									if (!_.isNull(itemTobeSelected)) {
										documentsDataService.setSelected(itemTobeSelected);
									}
								}
							}
						});
					});
				};

				$scope.modalOptions.cancel = function onCancel() {
					$scope.$close(false);
				};

				$scope.modalOptions.clearKeyword = function clearKeyword(){
					$scope.dlgOptions.searchText = '';
				};

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				$scope.data = [];
				$scope.gridId = 'ef3a3423c0bc467094e0b986522ebe9c';

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
				gridControllerService.initListController($scope, gridColumns, documentsCentralqueryITwo40toBim360Service, null, gridConfig);

				function onGridCheckboxClickedFuc() {
					documentsCentralqueryITwo40toBim360Service.okDisabled();
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

				documentsCentralqueryITwo40toBim360Service.setSelectedPrjInfo(null);
				documentsCentralqueryITwo40toBim360Service.setSelectedFolderInfo(null);
				setDataSource([]);
				documentsCentralqueryITwo40toBim360Service.okDisabled();

			}]);
})(angular);
