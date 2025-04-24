/**
 * Created by hzh on 5/27/2020.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'documents.centralquery';

	angular.module(moduleName).value('documentsCentralqueryBim360toITwo40BPGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'IsCheck',
						field: 'Selected',
						name: 'Selected',
						name$tr$: 'documents.centralquery.bim360Documents.columns.isSelectedTitle',
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
						id: 'DocumentName',
						field: 'DocumentName',
						name: 'DocumentName',
						name$tr$: 'documents.centralquery.bim360Documents.columns.name',
						width: 100
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'documents.centralquery.bim360Documents.columns.description',
						width: 130
					},
					{
						id: 'DocumentVersion',
						field: 'DocumentVersion',
						name: 'DocumentVersion',
						name$tr$: 'documents.centralquery.bim360Documents.columns.version',
						width: 80
					},
					{
						id: 'DocumentSizeDisplay',
						field: 'DocumentSizeDisplay',
						name: 'DocumentSizeDisplay',
						name$tr$: 'documents.centralquery.bim360Documents.columns.size',
						width: 80
					}
				]
			};
		}
	});

	angular.module(moduleName).controller('documentsCentralqueryBim360ToITwo40Controller',
		['_','$rootScope', '$scope', '$translate', '$http', 'platformGridAPI', 'documentsCentralqueryBim360toITwo40Service', 'documentsProjectDocumentModuleContext',
			'platformGridControllerService', 'documentsCentralqueryBim360toITwo40BPGridColumns', '$timeout', 'cloudDeskBim360Service', '$injector', 'cloudDesktopPinningContextService',

			function (_,$rootScope, $scope, $translate, $http, platformGridAPI, documentsCentralqueryBim360toITwo40Service, documentsProjectDocumentModuleContext,
				gridControllerService, gridColumns, $timeout, cloudDeskBim360Service,$injector, cloudDesktopPinningContextService) {
				$scope.options = $scope.$parent.modalOptions;
				$scope.selectedItem = documentsCentralqueryBim360toITwo40Service.getSelectedPrjInfo();
				$scope.selectedFolder = documentsCentralqueryBim360toITwo40Service.getSelectedFolderInfo();
				$scope.dlgOptions = documentsCentralqueryBim360toITwo40Service.getDlgOptions();
				$scope.dlgOptions.filterStatus = '(all)';
				$scope.dlgOptions.searchText = '';
				$scope.dlgOptions.OKBtnDisabled = 'disabled';
				$scope.dlgOptions.searchBtnDisabled = 'disabled';
				$scope.dlgOptions.msgDocumentSelected = '';
				$scope.dlgOptions.checkBoxCompressChecked = false;
				$scope.dlgOptions.zipFileName = '********';
				$scope.dlgOptions.DocList = null;

				$scope.modalOptions = {
					header: {
						title: $translate.instant('documents.centralquery.bim360Documents.syncDocumentToITwoTitle')
					},
					body: {
						projectNameText: $translate.instant('documents.centralquery.bim360Documents.bim360Project'), // "BIM 360 Project", //
						folderText: $translate.instant('documents.centralquery.bim360Documents.folder'),  // "Folder", //
						keywordText: $translate.instant('documents.centralquery.bim360Documents.keyWord'),  // "Keyword", //
						btnSearchText: $translate.instant('documents.centralquery.bim360Documents.btnSearchText'),  // "Search",//
						filterStatusText: $translate.instant('documents.centralquery.bim360Documents.columns.status'),  // "Status", //
						cbCreateReferenceText: $translate.instant('documents.centralquery.bim360Documents.createReferenceText'),
						compressDocumentsTip: $translate.instant('documents.centralquery.bim360Documents.compressDocumentsTip'),
						zipFileName: $translate.instant('documents.centralquery.bim360Documents.zipFileName')
					},
					footer: {
						btnSynchronize: $translate.instant('documents.centralquery.bim360Documents.btnSynchronizeText'),
						btnCancel: $translate.instant('basics.common.button.cancel')
					}
				};
				// set data to grid
				var setDataSource = function (data) {
					documentsCentralqueryBim360toITwo40Service.setDataList(data);
					documentsCentralqueryBim360toITwo40Service.refreshGrid();
					$scope.onContentResized();
				};
				$scope.modalOptions.loadDocuments = function loadDocuments() {
					$scope.isLoading = true;
					documentsCentralqueryBim360toITwo40Service.loadDocumentFormBim360($scope.selectedItem, $scope.dlgOptions)
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
					documentsCentralqueryBim360toITwo40Service.saveDocument($scope.dlgOptions)
						.then(function (response) {
							$scope.isLoading = false;
							if (response.StateCode === 'OK') {
								cloudDeskBim360Service.showMsgDialog($translate.instant('documents.centralquery.bim360Documents.syncDocumentToITwoTitle'), $translate.instant('documents.centralquery.bim360Documents.documentsSaved'), 'ico-info');
								$scope.$close(true);
								selectNewDocItem(documentsCentralqueryBim360toITwo40Service.getSelectedPrjInfo().prjId);
							} else {
								cloudDeskBim360Service.showMsgDialog($translate.instant('documents.centralquery.bim360Documents.syncDocumentToITwoTitle'), $translate.instant('documents.centralquery.bim360Documents.documentsNotSaved') + response.Message, 'ico-error');
							}
						}, function () {
							$scope.isLoading = false;
							$scope.$close(true);
							selectNewDocItem(documentsCentralqueryBim360toITwo40Service.getSelectedPrjInfo().prjId);
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

				$scope.modalOptions.checkBoxCompressClicked = function (){
					documentsCentralqueryBim360toITwo40Service.setZipFileName();
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
				$scope.gridId = '24c440e8357c4163b6c74e372f37a4a2';

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
				gridControllerService.initListController($scope, gridColumns, documentsCentralqueryBim360toITwo40Service, null, gridConfig);

				function onGridCheckboxClickedFuc() {
					documentsCentralqueryBim360toITwo40Service.setZipFileName();
					documentsCentralqueryBim360toITwo40Service.okDisabled();
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

				documentsCentralqueryBim360toITwo40Service.setSelectedPrjInfo(null);
				documentsCentralqueryBim360toITwo40Service.setSelectedFolderInfo(null);
				setDataSource([]);

			}]);
})(angular);
