/**
 * Created by chi on 2/14/2016.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name basicsCommonUploadDownloadControllerService
	 * @factory
	 *
	 * @description
	 * The basicsCommonUploadDownloadControllerService provides uploading, canceling to upload and downloading file functionality
	 * and the progress bar functionality for controllers
	 */
	angular.module('basics.common').factory('basicsCommonUploadDownloadControllerService', basicsCommonUploadDownloadControllerService);
	basicsCommonUploadDownloadControllerService.$inject = ['$window', 'platformGridAPI', 'platformModalService', '$translate', '_', '$injector', '$timeout', '$', 'platformPermissionService'];

	function basicsCommonUploadDownloadControllerService($window, platformGridAPI, platformModalService, $translate, _, $injector, $timeout, $, platformPermissionService) {

		const defaultOptions = {
			enableProgressBar: true,
			enableDragAndDrop: true
		};

		const service = {};
		/**
		 * @ngdoc function
		 * @name initGrid
		 * @function
		 * @methodOf basicsCommonUploadDownloadControllerService
		 * @description provide uploading, canceling to upload and downloading file functionality for grid controller
		 * @param $scope {object} the scope of the grid controller
		 * @param dataService {object} the data service responding to the grid controller
		 * @param options {object} options for supporting  progress bar and drag and drop.
		 */
		service.initGrid = initGrid;

		/**
		 * @ngdoc function
		 * @name initDetail
		 * @function
		 * @methodOf basicsCommonUploadDownloadControllerService
		 * @description provide uploading, canceling to upload and downloading file functionality for form/detail controller
		 * @param $scope {object} the scope of the form/detail controller
		 * @param dataService {object} the data service responding to the form/detail controller
		 * @param options {object} options for supporting  progress bar and drag and drop.
		 */
		service.initDetail = initDetail;

		/**
		 * @ngdoc function
		 * @name initDialog
		 * @function
		 * @methodOf basicsCommonUploadDownloadControllerService
		 * @description only provide progress bar and drag and drop functionality for dialog controller.
		 * @param $scope {object} the scope of the dialog controller
		 * @param dataService {object} the data service responding to the dialog controller
		 * @param options {object} options for supporting  progress bar and drag and drop.
		 */
		service.initDialog = initDialog;

		return service;

		// //////////////////
		function initGrid($scope, dataService, options) {
			$scope.addUploadDownloadTools = $scope.addTools;
			initialUploadController($scope, dataService);
			$injector.get('basicsCommonDocumentPreview3DViewerService').addModelStatusInGrid($scope, dataService);
			options = angular.extend({}, defaultOptions, options);
			if (options.enableProgressBar) {
				initialUploadProgress($scope, dataService);
			}
			if (options.enableDragAndDrop) {
				const getTargetItem = angular.isFunction(options.enableDragAndDrop.getTargetItem) || getTargetItemForDrop;
				initialUploadDragAndDrop($scope, dataService, getTargetItem);
			}

			function getTargetItemForDrop() {
				const entities = dataService.getList();
				const position = platformGridAPI.grids.element('id', $scope.gridId).instance.getCellFromEvent($window.event);
				return entities && position && entities[position.row];
			}
		}

		function initDetail($scope, dataService, options) {
			$scope.addUploadDownloadTools = addUploadDownloadTools;
			$scope.updateTools = updateFormTools;
			initialUploadController($scope, dataService);
			options = angular.extend({}, defaultOptions, options);

			if (options.enableProgressBar) {
				initialUploadProgress($scope, dataService);
			}
			if (options.enableDragAndDrop) {
				initialUploadDragAndDrop($scope, dataService);
			}

			function addUploadDownloadTools(tools) {
				$scope.formContainerOptions.customButtons = tools;
			}

			function updateFormTools() {
				let containerScope = $scope.$parent;
				while (containerScope && !Object.prototype.hasOwnProperty.call(containerScope, 'setTools')) {
					containerScope = containerScope.$parent;
				}
				if (containerScope && containerScope.tools) {
					containerScope.tools.update();
				}
			}
		}

		function initDialog($scope, dataService, options) {
			options = angular.extend({}, defaultOptions, options);

			if (options.enableProgressBar) {
				initialUploadProgress($scope, dataService);
			}
			if (options.enableDragAndDrop) {
				initialUploadDragAndDrop($scope, dataService);
			}
		}

		function initialUploadProgress($scope, dataService) {
			$scope.uploadServiceKey = dataService.getUploadServiceKey();

			$scope.progressBarOptions = provideProgressBar();

			function provideProgressBar() {
				if ($scope.progressBarOptions) {
					return $scope.progressBarOptions;
				} else {
					return {
						fileNameVisible: true,
						cancelButtonVisible: true,
						selectionStatusVisible: true,
						useFixedWidth: true
					};
				}
			}
		}

		function initialUploadDragAndDrop($scope, dataService, getTargetItem) {
			getTargetItem = getTargetItem || dataService.getSelected;
			$scope.canDrop = canDrop;
			$scope.fileDropped = fileDropped;

			dataService.getAllowedFiles().then(function (allowedFiles) {
				$scope.allowedFiles = allowedFiles;
			});

			function canDrop() {
				if(!canCreate($scope)){
					return false;
				}
				// if the parent status is readonly, then can not upload documents
				const parentService = dataService.parentService();
				if (parentService) {
					const parentSelectItem = parentService.getSelected();
					// if the header has not been save, then show the warning message
					if (!!parentSelectItem && parentSelectItem.Version === 0 && (!angular.isFunction(parentService.saveSubDocumentBySelf) || parentService.saveSubDocumentBySelf())) {
						$('#docsaveerror').show();
						return false;
					}
					if (!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus) {
						return false;
					}
				}
				const entity = getTargetItem();
				const files = $window.event.dataTransfer && $window.event.dataTransfer.items && $window.event.dataTransfer.items;
				const file = files[0];
				if (entity !== null) {
					return !entity || dataService.canUploadFiles(entity, [file]);
				} else {
					return dataService.canMultipleUploadFiles(files);

				}
			}

			function fileDropped(files) {
				dataService.isDragOrSelect = 'drag';
				const entity = getTargetItem();
				if (entity && dataService.canUploadFiles(entity)) {
					dataService.uploadFiles(files[0], entity);
				} else {
					if (validationFiles(files)) {
						let extractZipOrNot = false;
						if ($scope.containerHeaderInfo !== undefined) {
							extractZipOrNot = $scope.containerHeaderInfo.checkBoxChecked;
						}
						dataService.onFileSelected($scope, files, null, extractZipOrNot);
					}
				}

			}

			function validationFiles(files) {
				if (!(files && files.length && files.length > 0)) {
					platformModalService.showMsgBox($translate.instant('documents.project.FileUpload.validation.FileUnValid'),
						$translate.instant('documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle'), 'ico-error');
					return false;
				} else {
					let result;
					if (dataService.getSelected() === null && !!dataService) {
						result = true;
					} else {
						result = !!dataService.getSelected() || dataService.parentService().getSelected();
					}
					if (result === false) {
						const errMsg = $translate.instant('documents.project.FileUpload.validation.NoHeaderEntitySelectedTip');
						platformModalService.showMsgBox(errMsg,
							$translate.instant('documents.project.FileUpload.validation.NoHeaderSelected'), 'ico-error');
					}
					return result;
				}
			}
		}

		function initialUploadController($scope, dataService) {
			// upload-cancel-download buttons

			const tools = [];
			const btnConfig = {};
			const previewDataService = $injector.get('basicsCommonDrawingPreviewDataService');

			if (dataService.canUploadFiles) {
				if (dataService.singleUploadVisible !== false) {
					btnConfig.uploadBtn = {
						id: 'upload',
						caption: 'basics.common.upload.button.uploadCaption',
						type: 'item',
						iconClass: 'tlb-icons ico-upload',
						fn: function upload() {
							let parentService;
							if (angular.isFunction(dataService.parentService)) {
								parentService = dataService.parentService();
							} else {
								parentService = dataService.parentService;
							}
							if (parentService) {
								// if the header has not been save, then show the warning message
								const parentSelectItem = parentService.getSelected();
								if (!!parentSelectItem && parentSelectItem.Version === 0 && (!angular.isFunction(parentService.saveSubDocumentBySelf) || parentService.saveSubDocumentBySelf())) {
									$('#docsaveerror').show();
									return true;
								}
							}

							let extractZipOrNot = false;
							if ($scope.containerHeaderInfo) {
								extractZipOrNot = $scope.containerHeaderInfo.checkBoxChecked;
							}
							dataService.uploadFiles(null, null, {extractZip: extractZipOrNot});
						},
						disabled: function canUpload() {
							if(!canCreate($scope)){
								return true;
							}
							if (dataService.canUploadVisible === true) {
								return false;
							} else {
								return !dataService.canUploadFiles();
							}
						}
					};
					tools.push(btnConfig.uploadBtn);
				}

				if (dataService.uploadCreateVisible !== false) {
					btnConfig.multipleUploadBtn = {
						id: 'multipleupload',
						caption: 'basics.common.upload.button.uploadAndCreateDocument',
						type: 'item',
						iconClass: 'tlb-icons ico-upload-create',
						fn: function upload() {
							let parentService;
							if (angular.isFunction(dataService.parentService)) {
								parentService = dataService.parentService();
							} else {
								parentService = dataService.parentService;
							}
							if (parentService) {
								// if the header has not been save, then show the warning message
								const parentSelectItem = parentService.getSelected();
								if (!!parentSelectItem && parentSelectItem.Version === 0 && (!angular.isFunction(parentService.saveSubDocumentBySelf) || parentService.saveSubDocumentBySelf())) {
									$('#docsaveerror').show();
									return true;
								}
							}
							dataService.isUploadCreateDocument = 'uploadcreate';
							let extractZipOrNot = false;
							if ($scope.containerHeaderInfo) {
								extractZipOrNot = $scope.containerHeaderInfo.checkBoxChecked;
							}
							dataService.uploadMultipleFiles(null, null, {extractZip: extractZipOrNot});
						},
						disabled: function canUpload() {
							if(!canCreate($scope)){
								return true;
							}
							return !dataService.canMultipleUploadFiles();
						}
					};
					tools.push(btnConfig.multipleUploadBtn);
				}
			}

			if (dataService.canDownloadFiles) {
				btnConfig.downloadBtn = {
					id: 'download',
					caption: 'basics.common.upload.button.downloadCaption',
					type: 'item',
					iconClass: 'tlb-icons ico-download',
					fn: function download() {
						dataService.downloadFiles();
					},
					disabled: function canDownload() {
						return !dataService.canDownloadFiles();
					}
				};
				tools.push(btnConfig.downloadBtn);
				btnConfig.downloadPdfBtn = {
					id: 'downloadPdf',
					caption: 'basics.common.upload.button.downloadPdfCaption',
					type: 'item',
					iconClass: 'tlb-icons ico-download-markers',
					fn: function download() {
						let sel = dataService.getSelected();
						if (!$injector.get('modelWdeViewerSelectionService').selected) {
							platformModalService.showMsgBox($translate.instant('documents.project.waitPdfLoad'),
								$translate.instant('basics.common.upload.button.downloadPdfCaption'), 'ico-error');
							return;
						}
						let modelFk = sel.PreviewModelFk ? sel.PreviewModelFk : (sel.ModelFk ? sel.ModelFk : sel.MdlModelFk);
						let annoService = $injector.get('modelWdeViewerAnnotationService');
						annoService.saveDrawingFileName = sel.OriginFileName;
						annoService.savePdfWithAnnMarker(modelFk);
					},
					disabled: function canDownload() {
						let doc = dataService.getSelected();
						let extensionName = '';
						if (doc && doc.OriginFileName) {
							extensionName = doc.OriginFileName.substr(doc.OriginFileName.lastIndexOf('.')).replace('*', '').replace('.', '').replace(' ', '').toLowerCase();
						}
						let isDownload = extensionName === 'pdf';
						if (extensionName.length <= 0 && doc && (doc.DocumentTypeFk === 1 || doc.BasDocumentTypeFk === 1)) {
							isDownload = true;
						}
						return !dataService.canDownloadFiles() || !isDownload;
					}
				};
				tools.push(btnConfig.downloadPdfBtn);
			}

			if (dataService.canCancelUploadFiles) {
				btnConfig.cancelUploadBtn = {
					id: 'cancelUpload',
					caption: 'basics.common.upload.button.cancelUploadCaption',
					type: 'item',
					iconClass: 'tlb-icons ico-upload-cancel',
					fn: function cancelUpload() {
						dataService.cancelUploadFiles();
					},
					disabled: function canCancelUpload() {
						return !dataService.canCancelUploadFiles();
					}
				};
				tools.push(btnConfig.cancelUploadBtn);
			}

			if (dataService.canPreviewDocument) {
				btnConfig.canPreviewButton = {
					id: 'preview',
					caption: 'basics.common.preview.button.previewBrowser',
					type: 'item',
					iconClass: 'tlb-icons ico-preview-form',
					fn: function () {
						let sel = dataService.getSelected();
						dataService.previewDocument($scope, true, sel);
					},
					disabled: function () {
						return (!dataService.canPreviewDocument) || (!dataService.canPreviewDocument());
					}
				};
				tools.push(btnConfig.canPreviewButton);
				btnConfig.preViewProgram = {
					id: 'previewProgram',
					caption: 'basics.common.preview.button.option',
					type: 'dropdown-btn',
					iconClass: 'tlb-icons ico-container-config',
					list: {
						showImages: false,
						cssClass: 'dropdown-menu-right',
						items: [{
							id: 'previewInTab',
							type: 'check',
							caption: 'basics.common.preview.button.autoPreviewBrowser',
							value: !!previewDataService.openPreviewInSameTab,
							fn: function (id, btn) {
								previewDataService.setPreviewSameTab(btn.value);
							},
							disabled: function(){
								previewDataService.updateToolForPreviewInTab($scope);
								return false;
							}
						}]
					}
				};
				tools.push(btnConfig.preViewProgram);
			}

			if (dataService.enableOnlineEdit && dataService.enableOnlineEdit() && dataService.canPreviewEditOfficeDocument) {
				// online edit office document button
				btnConfig.previewEditOfficeDocumentButton = {
					id: 'edit',
					caption: 'basics.common.previewEidtOfficeDocument',
					type: 'item',
					// hideItem: true,
					iconClass: 'tlb-icons ico-draw',
					fn: function () {
						dataService.onlineEditOfficeDocument($scope, true);
					},
					disabled: function () {
						if (dataService.canUploadVisible === true) {
							return false;
						} else {
							return !(dataService.canMultipleUploadFiles() || dataService.canUploadFiles()) || !dataService.canOnlineEditOfficeDocument || !dataService.canOnlineEditOfficeDocument();
						}
					}
				};
				tools.push(btnConfig.previewEditOfficeDocumentButton);

				// synchronize office document from one drive button
				btnConfig.synchronizeOfficeDocumentBtn = {
					id: 'synchronize',
					caption: 'basics.common.synchronize.button.synchronizeCaption',
					type: 'item',
					iconClass: 'tlb-icons ico-reset',
					fn: function () {
						dataService.synchronizeOfficeDocument($scope, true).then(function (result) {
							if (result.Success) {
								let sel = dataService.getSelected();
								dataService.read().then(function (data) {
									$timeout(function () {
										let item = _.find(data, {Id: sel.Id});
										dataService.setSelected(item);
									});
								});
							}
						});
					},
					disabled: function canSync() {
						return !(dataService.canMultipleUploadFiles() || dataService.canUploadFiles()) || !dataService.canOnlineEditOfficeDocument || !dataService.canOnlineEditOfficeDocument();
						//return !dataService.canDownloadFiles() || !dataService.canOnlineEditOfficeDocument || !dataService.canOnlineEditOfficeDocument();
					}
				};
				tools.push(btnConfig.synchronizeOfficeDocumentBtn);
			}
			if (dataService.enableContextConfig) {
				btnConfig.configContextButton = {
					id: 'config',
					caption: 'basics.common.configContext',
					type: 'item',
					iconClass: 'type-icons ico-facilities-07',
					fn: function () {
						dataService.contextConfig();
					}
				};
				tools.push(btnConfig.configContextButton);
			}

			if (tools.length > 0) {
				$scope.addUploadDownloadTools(tools);
				if (!dataService.enableContextConfig && $scope.tools) {
					_.remove($scope.tools.items, function (item) {
						return item.id === 'config';
					});
				}
			}
			var uploadService = dataService.getUploadService();
			dataService.registerListLoaded(onDocumentRefresh);
			if (dataService.filesClear) {
				dataService.filesClear.register(checkInProgressJobState);
			}
			// register upload events
			dataService.registerUpdateTools($scope.updateTools);
			dataService.registerSelectionChanged(onSelectionChanged);

			// clear up
			$scope.$on('$destroy', function () {
				dataService.unregisterUpdateTools($scope.updateTools);
				if (dataService.filesClear) {
					dataService.filesClear.unregister(checkInProgressJobState);
				}
				dataService.unregisterSelectionChanged(onSelectionChanged);
				dataService.unregisterListLoaded(onDocumentRefresh);
			});

			const preview3DViewerService = $injector.get('basicsCommonDocumentPreview3DViewerService');
			function onSelectionChanged(e, entity) {
				if (entity && dataService.previewDocument) {
					preview3DViewerService.clearPreviewWork(entity);
					dataService.previewDocument($scope, false);
				}
				// update downloadPdf isDisabled when preview in pdfViewer
				$timeout(function () {
					$scope.updateTools();
				}, 1000);
			}

			function checkInProgressJobState() {
				preview3DViewerService.doRefreshWhenInProgress(dataService);
			}
			function onDocumentRefresh() {
				preview3DViewerService.getModelJobStates(dataService);
			}

			dataService.provideUpdateData = function (updateData) {
				preview3DViewerService.isAutoConvertModel().then(function (result) {
					if (result) preview3DViewerService.updateDataToCreateModel($scope, dataService, updateData);
				});
				return updateData;
			};

			if (dataService.canPreviewDocument) {
				previewDataService.getPreviewSameTab($scope);
			}

		}

		function canCreate($scope){
			return platformPermissionService.hasCreate($injector.get('mainViewService').getPermission($scope.gridId));
		}

	}
})(angular);