(function (angular) {
	'use strict';
	/* global globals, _ ,$ */
	var moduleName='documents.project';
	angular.module(moduleName).factory('documentProjectType', ['$q', '$http',function ($q, $http) {
		var service = {}, documentTypes = [];

		service.getDocumentType = function () {
			var defer = $q.defer();
			if (documentTypes.length) {
				return $q.when(documentTypes);
			} else {
				$http.get(globals.webApiBaseUrl + 'documents/projectdocument/getdocumenttype').then(function (res) {
					if (res && res.data) {
						documentTypes = _.map(res.data, function (item) {
							var type = _.trim(item.Extention, '*. ');
							var noSupport = ['xls','xlsx','docx','doc'];
							var documentExtensions = [];
							if (_.includes(type, ';')) {
								_.forEach(type.split(';'), function (item) {
									documentExtensions.push(_.trim(item,'*. '));
								});
							} else {
								documentExtensions.push(type);
							}
							return {
								Id: item.Id,
								type: documentExtensions,
								support: _.difference(noSupport,documentExtensions).length === noSupport.length
							};
						}
						);
						defer.resolve(documentTypes);
					} else {
						defer.resolve([]);
					}

				});
				return defer.promise;
			}
		};
		return service;
	}
	]);
	angular.module(moduleName).factory('documentProjectCommonConfigControllerService',
		['basicsCommonServiceUploadExtension', 'documentsProjectDocumentReadonlyProcessor', '$translate','_', 'platformModalService',
			'projectDocumentNumberGenerationSettingsService', '$injector','$timeout',
			function (basicsCommonServiceUploadExtension,documentsProjectDocumentReadonlyProcessor, $translate,_,platformModalService,
				projectDocumentNumberGenerationSettingsService, $injector,$timeout) {
				var service = {};
				service.initialUploadController = initialUploadController;
				service.previewDocument = function ($scope,dataService,flg,defaultEntity) {
					if (!dataService.previewDocument) {
						basicsCommonServiceUploadExtension.extendWidthPreview(dataService, {});
					}
					dataService.previewDocument($scope, flg, defaultEntity);
				};

				function initialUploadController($scope, dataService) {

					if(!dataService.isServiceExtended){
						basicsCommonServiceUploadExtension.extendWidthPreviewEditOfficeDocument(dataService,{});
					}

					if(!dataService.synchronizeOfficeDocument){
						basicsCommonServiceUploadExtension.extendWidthOnLineEditOfficeDocument(dataService,{});
					}

					const previewDataService = $injector.get('basicsCommonDrawingPreviewDataService');
					var tools = [];
					var btnConfig = {};
					btnConfig.singleUploadBtn = {
						id: 'upload',
						caption: 'documents.project.FileUpload.singleUploadButtonCaption',
						type: 'item',
						iconClass: 'tlb-icons ico-upload',
						fn: function upload() {
							let extractZipOrNot = false;
							if ($scope.containerHeaderInfo) {
								extractZipOrNot = $scope.containerHeaderInfo.checkBoxChecked;
							}
							dataService.uploadSingleFile($scope, {extractZip: extractZipOrNot});
						},
						disabled: function canUpload() {
							return !dataService.canUploadFileForSelectedPrjDocument();
						}
					};
					// in documents revision page not need this button ALM(94701)
					if(dataService.getServiceName() !== 'documentsProjectDocumentRevisionDataService'){
						btnConfig.uploadBtn = {
							id: 'upload',
							caption: 'documents.project.FileUpload.uploadButtonCaption',
							type: 'item',
							iconClass: 'tlb-icons ico-upload-create',
							fn: function upload() {
								var parentService = dataService || dataService.documentParentService;
								if(parentService){
								// if the header has not been save, then show the warning message
									var parentSelectItem = parentService.getSelected();
									if(!!parentSelectItem && parentSelectItem.Version === 0){
										$('#prjdocsaveerror').show();
										return;
									}
								}
								dataService.uploadFiles($scope);
							},
							disabled: function canUpload() {
								return !dataService.canUploadFiles();
							}
						};
					}

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
							let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
							if (sel && modelWdeViewerMarkupService && modelWdeViewerMarkupService.igeCtrl) {
								let modelFk = sel.PreviewModelFk ? sel.PreviewModelFk : (sel.ModelFk ? sel.ModelFk : sel.MdlModelFk);
								let annoService = $injector.get('modelWdeViewerAnnotationService');
								annoService.saveDrawingFileName = sel.OriginFileName;
								annoService.savePdfWithAnnMarker(modelFk);
							} else {
								window.console.log('IGE not in use!');
							}
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
							return (!dataService.canDownloadFiles) || (!dataService.canDownloadFiles()) || !isDownload;
						}
					};
					btnConfig.downloadBtn = {
						id: 'download',
						caption: 'basics.common.upload.button.downloadCaption',
						type: 'item',
						iconClass: 'tlb-icons ico-download',
						fn: function download() {
							dataService.downloadFiles();
						},
						disabled: function canDownload() {
							return (!dataService.canDownloadFiles)||(!dataService.canDownloadFiles());
						}
					};
					btnConfig.preViewBtn = {
						id: 'preview',
						caption: 'basics.common.preview.button.previewBrowser',
						type: 'item',
						iconClass: 'tlb-icons ico-preview-form',
						fn: function () {
							var entity = dataService.getSelected();
							service.previewDocument($scope, dataService, true, entity);
						},
						disabled: function () {
							if(dataService.canPreview === undefined || dataService.canPreview === null || dataService.canPreview() === false){
								return true;
							}
							const currentItem = dataService.parentService().getSelected();
							return !previewDataService.checkDocumentCanPreview(dataService, currentItem);
						}
					};
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
					btnConfig.previewEditOfficeDocumentButton = {
						id: 'edit',
						caption: 'basics.common.previewEidtOfficeDocument',
						type: 'item',
						// hideItem: true,
						iconClass: 'tlb-icons ico-draw',
						fn: function () {
							dataService.onlineEditOfficeDocument($scope,true);
						},
						disabled: function () {
							if (dataService.isReadOnly && dataService.isReadOnly()) {
								return true;
							}
							return !dataService.canUploadFileForSelectedPrjDocument() || !dataService.canOnlineEditOfficeDocument || !dataService.canOnlineEditOfficeDocument();
						}
					};
					btnConfig.synchronizeOfficeDocumentBtn = {
						id: 'synchronize',
						caption: 'basics.common.synchronize.button.synchronizeCaption',
						type: 'item',
						iconClass: 'tlb-icons ico-reset',
						fn: function () {
							dataService.synchronizeOfficeDocument($scope,true).then(function(result){
								if(result.Success) {
									let sel = dataService.getSelected();
									dataService.read().then(function (data) {
										$timeout(function(){
											let item = _.find(data, {Id: sel.Id});
											dataService.setSelected(item);
										});
									});
								}
							});
						},
						disabled: function canSync() {
							if (dataService.isReadOnly && dataService.isReadOnly()) {
								return true;
							}
							return !dataService.canUploadFileForSelectedPrjDocument() || !dataService.canOnlineEditOfficeDocument || !dataService.canOnlineEditOfficeDocument();
							// return !dataService.canDownloadFiles || !dataService.canDownloadFiles() || !dataService.canOnlineEditOfficeDocument || !dataService.canOnlineEditOfficeDocument();
						}
					};

					tools.push(btnConfig.singleUploadBtn);
					if(btnConfig.uploadBtn !== undefined && btnConfig.uploadBtn !== null){
						tools.push(btnConfig.uploadBtn);
					}
					tools.push(btnConfig.downloadBtn);
					tools.push(btnConfig.downloadPdfBtn);
					tools.push(btnConfig.preViewBtn);
					tools.push(btnConfig.preViewProgram);

					if(dataService.enableOnlineEdit && dataService.enableOnlineEdit()){
						tools.push(btnConfig.previewEditOfficeDocumentButton);
						tools.push(btnConfig.synchronizeOfficeDocumentBtn);
					}

					previewDataService.getPreviewSameTab($scope);
					return tools;
				}
				projectDocumentNumberGenerationSettingsService.assertLoaded();
				return service;
			}]);
})(angular);