/**
 * Created by chi on 2/24/2016.
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCommonServiceUploadExtension
	 * @service
	 *
	 * @description
	 * The basicsCommonServiceUploadExtension provides uploading file functionality for data services
	 */
	angular.module('basics.common').service('basicsCommonServiceUploadExtension', basicsCommonServiceUploadExtension);
	/* jshint -W072 */
	basicsCommonServiceUploadExtension.$inject = [
		'globals', '_', '$q', '$http', 'basicsCommonFileUploadServiceFactory', 'basicsCommonFileUploadServiceLocator',
		'basicsLookupdataLookupDescriptorService', 'basicsCommonFileDownloadService', 'PlatformMessenger', 'documentProjectType', 'cxService', 'cloudDesktopOneDriveManagementService', 'basicsCommonDrawingPreviewService', 'basicsCommonDocumentPreviewService',
		'platformPermissionService', '$', '$injector', 'moment', 'basicsCommonDrawingPreviewDataService','$timeout','basicsCommonPreviewTabService'];

	function basicsCommonServiceUploadExtension(
		globals, _, $q, $http, basicsCommonFileUploadServiceFactory, basicsCommonFileUploadServiceLocator,
		basicsLookupdataLookupDescriptorService, basicsCommonFileDownloadService, PlatformMessenger, documentProjectType, cxService, cloudDesktopOneDriveManagementService, basicsCommonDrawingPreviewService, basicsCommonDocumentPreviewService,
		platformPermissionService, $, $injector, moment, basicsCommonDrawingPreviewDataService, $timeout, basicsCommonPreviewTabService) {
		return {
			/**
			 * @ngdoc function
			 * @name extendForCustom
			 * @function
			 * @methodOf basicsCommonServiceUploadExtension
			 * @description provide uploading file functionality for custom service.
			 *              This custom one only provides the common function which is necessary.
			 * @param service {object} custom service.
			 * @param options {object} contains fileUpload options, like object
			 *      {uploadServiceKey: 'businesspartner-main-activity',
			 *      uploadConfigs: {SectionType: 'BusinessPartnerActivity', appId:'17221f9d254d4304b2683915ab92c14a'},
			 *      uploadFilesCallBack: uploadFilesCallBack,
			 *      getExtension: getExtension}
			 */
			extendForCustom: extendForCustom,

			/**
			 * @ngdoc function
			 * @name extendForStandard
			 * @function
			 * @methodOf basicsCommonServiceUploadExtension
			 * @description provide uploading file functionality for standard data service.
			 *              This standard one provides not only the common functions which is necessary, but also basics functions and events to handle the grid and detail controller.
			 * @param service {object} entire service and its data;
			 * @param options {object} contains fileUpload options, like object
			 *      {uploadServiceKey: 'businesspartner-main-activity',
			 *      uploadConfigs: {SectionType: 'BusinessPartnerActivity', appId:'17221f9d254d4304b2683915ab92c14a',
			 *                         createForUploadFileRoute: 'basics/meeting/document/createforuploadfile',
			 *                         checkDuplicateByFileNameRoute: 'basics/meeting/document/checkduplicatebyfilename'},
			 *      uploadFilesCallBack: uploadFilesCallBack,
			 *      getExtension: getExtension}
			 */
			extendForStandard: extendForStandard,

			/**
			 * @ngdoc function
			 * @name extendWidthPreview
			 * @function
			 * @methodOf basicsCommonServiceUploadExtension
			 * @description provide preview document functionality for standard data service.
			 *              This standard one provides not only the common functions which is necessary, but also basics functions and events to handle the grid and detail controller.
			 * @param $scope {object} entire $scope
			 * @param dataService {object} entire service and its data;
			 */
			extendWidthPreview: extendWidthPreview,

			/**
			 * @ngdoc function
			 * @name extendWidthPreviewEditOfficeDocument
			 * @function
			 * @methodOf basicsCommonServiceUploadExtension
			 * @description provide preview document functionality for standard data service.
			 *              This standard one provides not only the common functions which is necessary, but also basics functions and events to handle the grid and detail controller.
			 * @param $scope {object} entire $scope
			 * @param dataService {object} entire service and its data;
			 */
			extendWidthPreviewEditOfficeDocument: extendWidthPreviewEditOfficeDocument,

			/**
			 * @ngdoc function
			 * @name extendWidthOnLineEditOfficeDocument
			 * @function
			 * @methodOf basicsCommonServiceUploadExtension
			 * @description provide preview document functionality for standard data service.
			 *              This standard one provides not only the common functions which is necessary, but also basics functions and events to handle the grid and detail controller.
			 * @param $scope {object} entire $scope
			 * @param dataService {object} entire service and its data;
			 */
			extendWidthOnLineEditOfficeDocument: extendWidthOnLineEditOfficeDocument
		};

		function createUploadService(options) {
			const key = options.uploadServiceKey;
			let uploadService = null;
			if (angular.isString(key) && key) {
				//uploadService = basicsCommonFileUploadServiceFactory.createService(options ? options : null);
				uploadService = basicsCommonFileUploadServiceLocator.getService(key);
				if(_.isNil(uploadService)){
					uploadService = basicsCommonFileUploadServiceFactory.createService(options ? options : null);
				}
				basicsCommonFileUploadServiceLocator.registerService(key, uploadService);
			}

			return uploadService;
		}

		function extendWithCommon(service, options) {
			const key = options.uploadServiceKey;
			if (angular.isString(key) && key) {
				/**
				 * @ngdoc function
				 * @name getUploadServiceKey
				 * @function
				 *
				 * @methodOf platformDataServiceFileUplaodExtension
				 * @description get the uploadServiceKey.
				 * @returns {String} key
				 */
				service.getUploadServiceKey = provideGetUploadServiceKey(key);

				/**
				 * @ngdoc function
				 * @name getUploadService
				 * @function
				 *
				 * @methodOf platformDataServiceFileUplaodExtension
				 * @description get the uploadService.
				 * @returns {Object} uploadService
				 */
				service.getUploadService = provideGetUploadService(key);
			}

			// /////////////////////////
			function provideGetUploadServiceKey(key) {
				return function getUploadServiceKey() {
					return key;
				};
			}

			function provideGetUploadService(key) {
				return function getUploadService() {
					return basicsCommonFileUploadServiceLocator.getService(key);
				};
			}
		}

		function extendForCustom(service, options) {
			extendWithCommon(service, options);
			createUploadService(options);
		}

		function extendForStandard(serviceContainer, options) {
			const service = serviceContainer.service;
			let uploadService = null;
			let oldDelete = null;

			oldDelete = serviceContainer.data.deleteItem;

			// override the function deleteItem to the upload item.
			serviceContainer.data.deleteItem = deleteItem;

			// clear all upload items before doing update job or doing refresh job
			serviceContainer.data.cleanUpLocalData = cleanUpLocalData;

			// for judging whether the service provides upload functionality or not

			service.canUploadFiles = provideCanUploadFiles();
			// this method will not be recoverd outside
			service.basicCanUploadFiles = provideCanUploadFiles();

			// for judging whether the service provides download functionality or not
			service.canDownloadFiles = provideCanDownloadFiles();
			// this method will not be recoverd outside
			service.basicCanDownloadFiles = provideCanDownloadFiles();

			// for judging whether the service provides cancel upload functionality or not
			service.canCancelUploadFiles = provideCanCancelUploadFiles();
			// this method will not be recoverd outside
			service.basicCanCancelUploadFiles = provideCanCancelUploadFiles();

			service.canMultipleUploadFiles = provideCanMultipleUploadFiles();
			// this method will not be recoverd outside
			service.basicCanMultipleUploadFiles = provideCanMultipleUploadFiles();

			// upload files
			service.uploadFiles = uploadFiles;

			// upload multiple files
			service.uploadMultipleFiles = uploadMultipleFiles;

			// download files
			service.downloadFiles = downloadFiles;

			// cancel to upload files
			service.cancelUploadFiles = cancelUploadFiles;

			extendWidthPreview(service, options);

			extendWidthPreviewEditOfficeDocument(service, options);

			extendWidthOnLineEditOfficeDocument(service, options);

			extendWidthUploadFiles(service, options);

			// get allowed files for drag and drop to upload files
			service.getAllowedFiles = getAllowedFiles;

			// for drap file to upload
			service.onFileSelected = onFileSelected;

			// get document type
			service.getExtension = options && angular.isFunction(options.getExtension) ? options.getExtension : getExtension;

			service.getDocumentType = getDocumentType;

			service.getDocumentTypeByFiletype = getDocumentTypeByFiletype;

			extendWithCommon(service, options);

			if (angular.isFunction(service.markItemAsModified)) {
				options.markItemAsModified = service.markItemAsModified;
			}

			const updateTools = new PlatformMessenger();
			service.registerUpdateTools = updateTools.register;
			service.unregisterUpdateTools = updateTools.unregister;
			service.registerSelectionChanged(updateTools.fire);
			service.registerItemModified(updateTools.fire);
			service.registerSelectionChanged(onSelectionChanged);

			uploadService = createUploadService(options);

			if (uploadService) {
				uploadService.registerUploadStarting(updateTools.fire);
				uploadService.registerUploadDone(updateTools.fire);
				uploadService.registerUploadCancelled(updateTools.fire);
				uploadService.registerUploadError(updateTools.fire);
			}

			return serviceContainer;

			// /////////////////////////////////////
			function deleteItem(entity, data) {
				oldDelete(entity, data);
				if (uploadService) {
					uploadService.deleteUploadItemByEntity(entity);
				}
			}

			function cleanUpLocalData() {
				if (uploadService) {
					uploadService.clear();
				}
			}

			function onFileSelected($scope, files) {
				if (!!files && !!files.length && files.length > 0) {
					const uploadService = service.getUploadService();
					uploadService.startUploadFiles(files);
				}
			}

			function provideCanUploadFiles() {
				if (options.canUpload === false || angular.isFunction(options.canUpload)) {
					return options.canUpload;
				} else {
					return function canUploadFiles(currItem, files) {
						currItem = currItem || service.getSelected();
						if (!currItem || !currItem.Id || (uploadService &&
							(uploadService.getUploadStatus(currItem) === 'uploading' ||
								uploadService.getUploadStatus(currItem) === 'pending'))) {
							return false;
						}

						let isCanDragFile = true;
						const documentType = currItem && basicsLookupdataLookupDescriptorService.getData('DocumentType')[currItem.DocumentTypeFk];
						if (documentType && files && files.length) {
							isCanDragFile = _.some(files, function (file) {
								return documentType.MimeType !== '' && documentType.MimeType.indexOf(file.type) !== -1;
							});
						}
						if (Object.prototype.hasOwnProperty.call(currItem, 'CanUpload')) {
							return currItem.CanUpload && isCanDragFile;
						} else {
							return !currItem.Version && isCanDragFile;
						}
					};
				}
			}

			function provideCanMultipleUploadFiles() {
				if (options.canMultipleUpload === false || angular.isFunction(options.canMultipleUpload)) {
					return options.canMultipleUpload;
				} else {
					return function canMultipleUploadFiles(files) {
						let parentSelectedItem = service.getSelected() || service.parentService().getSelected();
						if (parentSelectedItem !== null && parentSelectedItem !== undefined) {
							if ((parentSelectedItem.IsReadonlyStatus || parentSelectedItem.Version === 0)&&
							(service.parentService() && !angular.isFunction(service.parentService().saveSubDocumentBySelf) || service.parentService().saveSubDocumentBySelf())) {
								return false;
							}
						}
						let isCanDragFile = true;
						const documentTypes = basicsLookupdataLookupDescriptorService.getData('DocumentType');

						if (documentTypes && files && files.length) {
							_.forEach(files, function (file) {
								const supportMimeTypes = _.filter(documentTypes, function (item) {
									return item.MimeType.indexOf(file.type) !== -1;
								});
								if (supportMimeTypes === null || supportMimeTypes.length === 0) {
									isCanDragFile = false;

								}
							});
						}
						return isCanDragFile && parentSelectedItem !== null;
					};
				}
			}

			function provideCanDownloadFiles() {
				if (options.canDownload === false || angular.isFunction(options.canDownload)) {
					return options.canDownload;
				} else {
					return function canDownloadFiles(currItem) {
						currItem = currItem || service.getSelected();
						if (!currItem || angular.isUndefined(currItem.Id)) {
							return false;
						}
						if (Object.prototype.hasOwnProperty.call(currItem, 'CanDownload')) {
							return currItem.CanDownload;
						} else {
							var isFileArchive = currItem && ((currItem.FileArchiveDocFk !== null && angular.isDefined(currItem.FileArchiveDocFk)) || angular.isDefined(currItem.FullName));
							if (currItem && !isFileArchive) {
								isFileArchive = currItem.ArchiveElementId || currItem.DatengutFileId;
							}
							return currItem && currItem.Version > 0 && isFileArchive;
						}
					};
				}
			}

			function provideCanCancelUploadFiles() {
				if (options.canCancelUpload === false || angular.isFunction(options.canCancelUpload)) {
					return options.canCancelUpload;
				} else {
					return function canCancelUploadFiles(currItem) {
						currItem = currItem || service.getSelected();
						if (currItem) {
							if (uploadService) {
								return uploadService.getUploadStatus(currItem) === 'uploading';
							}
						}
						return false;
					};
				}
			}

			function uploadFiles(files, currItem,containSer) {
				currItem = currItem || service.getSelected();
				const documentTypeItems = basicsLookupdataLookupDescriptorService.getData('DocumentType');
				if (files && currItem && currItem.DocumentTypeFk) {
					const type = (documentTypeItems[currItem.DocumentTypeFk] || {}).MimeType;
					if (files.type === type) {
						files = [files];
					} else {
						files = _.filter(files, function (file) {
							return file.type === type;
						});
					}
				}
				if (currItem && uploadService.uploadFiles) {
					return uploadService.uploadFiles(currItem, files || service.getExtension(documentTypeItems, currItem.DocumentTypeFk));
				}
				if(containSer==='revision'){
					return uploadService.uploadFiles(null, null, null, 'multiple');
				}
			}

			function uploadMultipleFiles(entity, fileType, optionsNew) {
				return uploadService.uploadFiles(entity, fileType, optionsNew, 'multiple');
			}

			function downloadFiles() {
				const entities = service.getSelectedEntities();
				basicsCommonFileDownloadService.canDownload(service, entities);
			}

			function cancelUploadFiles(currItem) {
				currItem = currItem || service.getSelected();
				if (currItem) {
					if (uploadService) {
						uploadService.deleteItem(currItem);
					}
				}
			}

			function getAllowedFiles() {
				const defer = $q.defer();
				const documentTypes = basicsLookupdataLookupDescriptorService.getData('DocumentType');
				if (!documentTypes) {
					basicsLookupdataLookupDescriptorService.loadData('DocumentType').then(function () {
						defer.resolve(_.map(basicsLookupdataLookupDescriptorService.getData('DocumentType'), function (value) {
							return value.MimeType;
						}));
					});
				} else {
					defer.resolve(_.map(documentTypes, function (value) {
						return value.MimeType;
					}));
				}
				return defer.promise;
			}

			function onSelectionChanged(e, entity) {
				if (entity && uploadService) {
					$injector.get('basicsCommonDocumentPreview3DViewerService').clearPreviewWork(entity);
					uploadService.selectUploadItemByEntity(entity);
				}
			}

			function getExtension(documentTypeItems, documentTypeId) {
				if (documentTypeItems) {
					if (documentTypeId === null || angular.isUndefined(documentTypeId)) {
						return _.map(documentTypeItems,
							function (value) {
								if (value.Extention !== null && value.Extention !== undefined) {
									return '.' + value.Extention.replace('.', '').replace('*', '');
								} else {
									return '.';
								}

							}).join();
					} else {
						const docType = (documentTypeItems[documentTypeId] || {Extention: 'doc'}).Extention;
						if (docType) {
							let types = docType.split(',');
							for (let i = 0; i < types.length; i++) {
								types[i] = types[i].replace('*','');
							}
							return  types.toString();
							// return '.' + docType.replace('.', '').replace('*', '');
						} else {
							return '';
						}
					}
				}
				return '';
			}
		}

		function getDocumentType(fileName) {
			const suffix = fileName.substr(fileName.lastIndexOf('.'), fileName.length - 1).replace('.', '').replace('*', '');
			const lowercaseSuffix = _.toLower(suffix);
			const documentTypes = basicsLookupdataLookupDescriptorService.getData('DocumentType');
			return _.find(documentTypes, function (o) {
				return o.Extention !== null && o.Extention !== '' && (o.Extention.toLowerCase().indexOf(lowercaseSuffix) !== -1 || lowercaseSuffix.indexOf(o.Extention) !== -1);
			});
		}

		function getDocumentTypeByFiletype(fileType) {
			let documentTypes = basicsLookupdataLookupDescriptorService.getData('DocumentType');
			return _.find(documentTypes, function (item) {
				return item.MimeType.indexOf(fileType) !== -1;
			});
		}

		function extendWidthPreview(dataService, options) {
			dataService.previewDocument = onPreviewAsync;
			dataService.canPreviewDocument = dataService.canPreviewDocument || provideCanPreviewDocument();
			dataService.getPreviewConfig = dataService.getPreviewConfig || getPreviewConfig;
			if (options.previewExtension) {
				dataService.previewExtension = $injector.get(options.previewExtension);
			}

			const basicsCommonDocumentPreview3DViewerService = $injector.get('basicsCommonDocumentPreview3DViewerService');

			// can't preview document by default
			function provideCanPreviewDocument() {
				if (options.canPreview === false || angular.isFunction(options.canCancelUpload)) {
					return options.canPreview;
				} else {
					return function canPreviewDocument(currentItem) {
						if (options.canPreview === undefined) {
							return false;
						}
						currentItem = currentItem || dataService.getSelected();
						return basicsCommonDrawingPreviewDataService.checkDocumentCanPreview(dataService, currentItem);
					};
				}
			}

			// todo - currently just copy from platform/app/components/inputcontrols/url-handler.js for emergency, we should reuse the logic in future
			function openUrl(url) {
				if (!(['http', 'https', 'ftp', 'ftps', 'file'].some((word) => url.startsWith(word)) || url.startsWith('\\'))) {
					url = 'https://'+ url;
				}
				let win = window.open();

				win.opener = null;
				win.location = url;
				win.target = '_blank';
			}

			// call many times when project document container and project document revision container exist || updateToolBarAndPreview
			function onPreviewAsync($scope, flg, defaultEntity, instantPreview = false) {
				if (!!basicsCommonDocumentPreviewService.isRePreviw) {
					return;
				}
				basicsCommonDocumentPreviewService.isRePreviw = true;
				if (dataService.getSelected()) {
					basicsCommonPreviewTabService.parentService = dataService;
				}
				$timeout(function () {
					openPreview($scope, flg, defaultEntity, instantPreview);
					basicsCommonDocumentPreviewService.isRePreviw = false;
				}, 100);
			}
			function openPreview($scope, flg, defaultEntity, instantPreview) {
				basicsCommonDocumentPreviewService.isWfPreview = !options.canPreview;
				if (defaultEntity && defaultEntity.PreviewModelFk) {
					basicsCommonDocumentPreviewService.previewModelFk = defaultEntity.PreviewModelFk;
				}
				const hasOpenTab = basicsCommonPreviewTabService.hasTab();
				let isInTab = false;
				if (hasOpenTab && !!basicsCommonDrawingPreviewDataService.openPreviewInSameTab) {
					$scope.viewWindow3 = basicsCommonPreviewTabService.tabInUseWindow();
					isInTab = true;
				}
				if (defaultEntity?.Url && flg) {
					openUrl(defaultEntity.Url);
					return;
				}
				if (!flg && !isInTab) {
					if (basicsCommonDocumentPreview3DViewerService.isPreview3DViewer(defaultEntity, dataService, $scope, flg) && options.canPreview) {
						return;
					}
					if (!flg && defaultEntity === undefined) {
						return;
					}
				}
				if (flg || $scope.viewWindow1 || $scope.viewWindow2 || $scope.viewWindow3 || (!flg && $scope.viewWindow3) || hasOpenTab) {
					let currentPreviewEntity = defaultEntity || dataService.getSelected();
					if (currentPreviewEntity) {
						const docId = currentPreviewEntity.FileArchiveDocFk ? currentPreviewEntity.FileArchiveDocFk
							: (currentPreviewEntity.ArchiveElementId ? currentPreviewEntity.ArchiveElementId : currentPreviewEntity.DatengutFileId);

						if (docId) {
							$http.get(globals.webApiBaseUrl + 'basics/common/document/checkfilesize?docId=' + docId)
								.then(function (result) {
									if (result.data < (20 * 1024 * 1024)) {
										previewDocument($scope, flg, currentPreviewEntity, instantPreview);
									} else {
										var platformModalService = $injector.get('platformModalService');
										platformModalService.showMsgBox('basics.common.previewSize', 'basics.common.docPreview', 'warning');
									}
								});
						} else {
							previewDocument($scope, flg, currentPreviewEntity, instantPreview);
						}
					}
				}
			}

			function isClosed(window) {
				return !window || window.closed || window.closed === undefined;
			}

			function previewInTab ($scope, defaultEntity) {
				if (!defaultEntity.Url && !defaultEntity.FileArchiveDocFk) {
					return;
				}
				$scope.viewWindow3 = basicsCommonDrawingPreviewDataService.openPreviewInSameTab && basicsCommonPreviewTabService.hasTab()
					? basicsCommonPreviewTabService.openTab('', basicsCommonPreviewTabService.tabInUse().id)
					: basicsCommonPreviewTabService.openTab('');
			}
			function previewDocument($scope, flg, defaultEntity, instantPreview) {
				// flg true from press preview button,false by change
				if (!flg && defaultEntity === undefined && $scope.viewWindow3 && $scope.viewWindow3.closed) return;
				if (flg || $scope.viewWindow1 || $scope.viewWindow2 || $scope.viewWindow3) {
					if (defaultEntity === undefined && !dataService.getSelected()) {
						return;
					}
					if (defaultEntity && !isClosed($scope.viewWindow3) && dataService.getSelected() && !defaultEntity.Url) {
						previewInTab($scope, defaultEntity);
					} else if (!$scope.viewWindow3 && ((defaultEntity && !defaultEntity.Url) || !defaultEntity)){
						previewInTab($scope, defaultEntity);
					} else if (instantPreview && !isClosed($scope.viewWindow3) && defaultEntity && !defaultEntity.Url) {
						previewInTab($scope, defaultEntity);
					} else if (flg && isClosed($scope.viewWindow3) && !basicsCommonPreviewTabService.hasTab()) {
						previewInTab($scope, defaultEntity);
					}

					let selectUrl = null;
					let canPreview = false;
					let documentTypeFk = null;
					if (defaultEntity !== undefined) {
						selectUrl = defaultEntity.Url;
						canPreview = basicsCommonDrawingPreviewDataService.checkDocumentCanPreview(dataService, defaultEntity);
						documentTypeFk = defaultEntity.DocumentTypeFk;
					} else {
						const selectedEntity = dataService.getSelected();
						if (selectedEntity) {
							selectUrl = selectedEntity.Url;
							canPreview = basicsCommonDrawingPreviewDataService.checkDocumentCanPreview(dataService, selectedEntity);
							documentTypeFk = selectedEntity.DocumentTypeFk;
						}
					}
					if (selectUrl || canPreview) {
						if (selectUrl) {
							if (isUrl(selectUrl) && (documentTypeFk === 1000 || documentTypeFk === 1013)) {
								var urlTemp = new URL(selectUrl);
								cxService.getCxUrl().then(function (cxUrl) {
									if (cxUrl && cxUrl.length > 0) {
										var hostUrl = new URL(cxUrl);
										if (urlTemp.host === hostUrl.host) {
											if ((!$scope.viewWindow2 || $scope.viewWindow2.closed) && flg) {
												$scope.viewWindow2 = window.open(selectUrl, 'mywindow2');
											}
											if ($scope.viewWindow2) {
												$scope.viewWindow2.location.href = selectUrl;
												previewDocCreateHistory();
											}
										}
									}
								});
							} else {
								window.open(selectUrl, '_blank');
								previewDocCreateHistory();
							}
						} else if (flg) {
							let doc = dataService.getSelected();
							if (defaultEntity !== null && defaultEntity !== undefined) {
								doc = defaultEntity;
							}
							basicsCommonDocumentPreviewService.setOptionByDocSelect(doc, dataService);
							// ['docx','doc','rtf','xls','xlsx','pptx','ppt', 'pdf','dwg', 'jpg', 'png', 'jpeg', 'bmp', 'gif', 'tif', 'html','htm','xml','mp4', 'mp3', 'wav', 'ogg', 'webm', 'm4a']
							if (doc && (doc.FileArchiveDocFk || doc.FullName || doc.ArchiveElementId || doc.DatengutFileId)) {
								basicsCommonDocumentPreviewService.show(doc.FileArchiveDocFk, $scope.viewWindow3, previewDocCreateHistory).then(function (res) {
									$scope.viewWindow3 = res.viewWindow;
								});
							}
						}
					} else {
						showInfo();
					}
				}

				function isUrl(url) {
					try {
						new URL(url);
						return true;
					} catch (e) {
						window.console.log('[' + url + '] url address err: ' + e);
						return false;
					}
				}
				function previewDocCreateHistory() {
					if (dataService.onPreviewDocCreateHistory && flg) {
						const selected = dataService.getSelected();
						dataService.onPreviewDocCreateHistory.fire({data: {selectedProjectDocument: selected}});
					}
				}

				function showInfo() {
					if ((!$scope.viewWindow3 || $scope.viewWindow3.closed) && dataService.getSelected()) {
						$scope.viewWindow3 = window.open('', 'mywindow3');
					}
					if ($scope.viewWindow3 && $scope.viewWindow3.document && $scope.viewWindow3.document.body) {
						$scope.viewWindow3.document.body.innerHTML = '<p>No document for preview</p>';
					}
				}

				// wui@20190707: code above should be enhanced, it is too mixed, the following code exists for fit code above according to requirement
				if (!flg && $scope.viewWindow3) {
					if ($scope.viewWindow3.closed) {
						$scope.viewWindow3 = null;
					} else {
						let docSel = dataService.getSelected();
						if (defaultEntity !== null && defaultEntity !== undefined) {
							docSel = defaultEntity;
						}
						if (docSel && (docSel.FileArchiveDocFk || docSel.FullName || docSel.ArchiveElementId || docSel.DatengutFileId)) {
							basicsCommonDocumentPreviewService.setOptionByDocSelect(docSel);
							basicsCommonDocumentPreviewService.show(docSel.FileArchiveDocFk, $scope.viewWindow3).then(function (res) {
								$scope.viewWindow3 = res.viewWindow;
							});
						}
					}
				}
				// end
			}

			function getPreviewConfig() {
				const deffered = $q.defer();
				const currentItem = dataService.getSelected();
				let fileArchiveDocId = currentItem.FileArchiveDocFk;
				if (!fileArchiveDocId && currentItem.ArchiveElementId) {
					fileArchiveDocId = currentItem.ArchiveElementId;
				} else if (!fileArchiveDocId && currentItem.DatengutFileId) {
					fileArchiveDocId = currentItem.DatengutFileId;
				}
				if (currentItem.Url) {
					if (currentItem.DocumentTypeFk===1000) {
						cxService.LoginCx().then(function (backdata) {
							const key = backdata.key;
							const url = currentItem.Url + '?k=' + key;
							deffered.resolve({
								Url: url,
								title: ''
							});
						});
					} else {
						deffered.resolve({
							Url: currentItem.Url,
							title: ''
						});
					}
				} else {
					if (fileArchiveDocId) {
						$http.get(globals.webApiBaseUrl + 'basics/common/document/preview?fileArchiveDocId=' + fileArchiveDocId).then(function (result) {
							deffered.resolve({
								src: result.data,
								documentType: currentItem.DocumentTypeFk,
								title: currentItem.OriginFileName
							});
						});
					}
				}
				return deffered.promise;
			}
		}

		function extendWidthPreviewEditOfficeDocument(dataService, options) {
			dataService.isServiceExtended = true;
			dataService.canPreviewEditOfficeDocument = provideCanPreviewEditOfficeDocument();
			dataService.enableOneDrive = function () {
				return cloudDesktopOneDriveManagementService.enableOneDrive;
			};

			function provideCanPreviewEditOfficeDocument() {
				return function canPreviewEditOfficeDocument(currentItem) {
					currentItem = currentItem || dataService.getSelected();
					if (!currentItem || !currentItem.OriginFileName || !currentItem.FileArchiveDocFk || currentItem.Version === 0 || (currentItem !== null && currentItem.CanWriteStatus !== undefined && !currentItem.CanWriteStatus)) {
						return false;
					}

					const parentService = dataService.parentService();
					if (parentService) {
						const serviceName = parentService.getServiceName();
						if (serviceName === 'documentCentralQueryDataService' || serviceName === 'documentsProjectDocumentDataService') {
							if (!platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e')) {
								return false;
							}
						}
						const parentSelectItem = parentService.getSelected();
						if (!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus) {
							return false;
						}
					}
					// do not check file extension.
					// var fileName = currentItem.OriginFileName;
					// var extDotIndex = fileName.lastIndexOf('.');
					// var fileEXt = extDotIndex === -1 ? '' : fileName.substring(extDotIndex + 1);
					// var supportEditTypes = ['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt'];
					// return supportEditTypes.indexOf(fileEXt) !== -1;
					return true;
				};
			}

		}

		function extendWidthOnLineEditOfficeDocument(dataService, options) {
			dataService.onlineEditOfficeDocument = onlineEditOfficeDocument;
			dataService.canOnlineEditOfficeDocument = provideCanOnlineEditOfficeDocument();
			dataService.synchronizeOfficeDocument = synchronizeOfficeDocument;
			window.console.log(options);

			dataService.enableOnlineEdit = function () {
				return cloudDesktopOneDriveManagementService.enableOnlineEdit;
			};

			function provideCanOnlineEditOfficeDocument() {
				return function canOnlineEditOfficeDocument(currentItem) {
					currentItem = currentItem || dataService.getSelected();
					if (!currentItem || !currentItem.OriginFileName || !currentItem.FileArchiveDocFk || currentItem.Version === 0 || (currentItem !== null && currentItem.CanWriteStatus !== undefined && !currentItem.CanWriteStatus)) {
						return false;
					}
					if ($injector.get('basicsCommonDrawingPreviewDataService').checkDocumentCanPreview(dataService, currentItem) === false) {
						return false;
					}
					let parentService;
					if(angular.isFunction(dataService.parentService)){
						parentService = dataService.parentService();
					}else {
						parentService = dataService.parentService;
					}
					if (parentService) {
						let serviceName = parentService.getServiceName();
						if (serviceName === 'documentCentralQueryDataService' || serviceName === 'documentsProjectDocumentDataService') {
							if (!platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e')) {
								return false;
							}
						}
						let parentSelectItem = parentService.getSelected();
						if (!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus) {
							return false;
						}
					}

					let fileName = currentItem.OriginFileName;
					let extDotIndex = fileName.lastIndexOf('.');
					let fileEXt = extDotIndex === -1 ? '' : fileName.substring(extDotIndex + 1);
					let supportEditTypes = ['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt'];
					return supportEditTypes.indexOf(fileEXt) !== -1;
				};
			}

			function onlineEditOfficeDocument() {
				let currentItem = dataService.getSelected();
				if (!dataService.canOnlineEditOfficeDocument(currentItem)) {
					return;
				}
				let fileArchiveDocId = currentItem.FileArchiveDocFk;
				cloudDesktopOneDriveManagementService.onlineEditOfficeDocument(fileArchiveDocId);
			}

			function synchronizeOfficeDocument() {
				let currentItem = dataService.getSelected();
				if (!currentItem) {
					return;
				}

				let fileArchiveDocId = currentItem.FileArchiveDocFk;
				/*if (!fileArchiveDocId && currentItem.ArchiveElementId) {
					fileArchiveDocId = currentItem.ArchiveElementId;
				} else if (!fileArchiveDocId && currentItem.DatengutFileId) {
					fileArchiveDocId = currentItem.DatengutFileId;
				}*/

				if (!fileArchiveDocId) {
					return;
				}

				return cloudDesktopOneDriveManagementService.synchronizeOfficeDocument(fileArchiveDocId);
			}
		}

		// data service need have methods updateReadOnly, fireItemModified and gridRefresh
		function extendWidthUploadFiles(dataService, options) {
			// user can overwrite this method if it needs additional handling.
			dataService.createForUploadFilesSuccess = dataService.createForUploadFilesSuccess || createForUploadFilesSuccess;

			// user can overwrite this method to provide document's parent fk.
			dataService.getSelectedParentId = dataService.getSelectedParentId || getSelectedParentId;

			// user can overwrite this method to provide entity role service which has updateAndExecute function.
			dataService.parentEntityRoleService = dataService.parentEntityRoleService || parentEntityRoleService;

			// will be called from controller.
			dataService.createForUploadFiles = createForUploadFiles;

			// will be called only if uploadConfigs provides checkDuplicateByFileNameRoute.
			// will be called from controller.
			dataService.checkDuplicateFile = checkDuplicateFile;

			// data service need have methods updateReadOnly, fireItemModified and gridRefresh
			dataService.uploadFileInfoToCurrentDocument = uploadFileInfoToCurrentDocument;

			if (options) {
				if (!angular.isFunction(options.uploadFilesCallBack)) {
					options.uploadFilesCallBack = uploadFilesCallBack;
				}
			}

			dataService.gridFlag = null;
			dataService.isDragOrSelect = null;
			dataService.isUploadCreateDocument = null;
			dataService.dragDropFileTargetGridId = null;
			dataService.fileHasUploaded = new PlatformMessenger();

			function uploadFilesCallBack(currItem, data) {
				if (currItem === null || angular.isUndefined(currItem.Id)) {
					// if it uploads multiple files and create documents or drop to create document
					let args = {
						currItem: currItem,
						data: data
					};
					dataService.fileHasUploaded.fire(null, args);
				} else {
					// update uploaded file info to selected document item.
					if (angular.isFunction(dataService.uploadFileInfoToCurDocWithDuplicateCheck)) {
						dataService.uploadFileInfoToCurDocWithDuplicateCheck(currItem, data);
					} else {
						uploadFileInfoToCurrentDocument(currItem, data);
					}
				}
			}

			// update uploaded file info to selected document item.
			function uploadFileInfoToCurrentDocument(currItem, data) {
				setCurrentDocItemFileInfo(currItem, data);

				// Set your special Document field in method setCurrentDocItemFileInfoCustomize.
				if (angular.isFunction(dataService.setCurrentDocItemFileInfoCustomize)) {
					dataService.setCurrentDocItemFileInfoCustomize(currItem, data);
				}
				if (angular.isFunction(dataService.updateReadOnly)) {
					dataService.updateReadOnly(currItem);// onSetReadonly();
				}
				if (angular.isFunction(dataService.gridRefresh)) {
					dataService.gridRefresh();// serviceContainer.service.gridRefresh();
				}
				if (angular.isFunction(dataService.fireItemModified)) {
					dataService.fireItemModified(currItem);
				}
			}

			// set file info current document item.
			function setCurrentDocItemFileInfo(currItem, data) {
				if (Object.prototype.hasOwnProperty.call(currItem, 'DocumentTypeFk')) {
					let documentType = getDocumentType(data.fileName);   // find document type by file extension first, Because the mimetype maybe empty.
					if (!documentType) {
						documentType = getDocumentTypeByFiletype(data.fileType);    // find document type by file type.
					}
					if (documentType) {
						currItem.DocumentTypeFk = documentType.Id;
					}
				}
				if (Object.prototype.hasOwnProperty.call(currItem, 'FileArchiveDocFk')) {
					currItem.FileArchiveDocFk = data.FileArchiveDocId;
				}
				if (Object.prototype.hasOwnProperty.call(currItem, 'OriginFileName')) {
					currItem.OriginFileName = data.fileName;
				}
				if (Object.prototype.hasOwnProperty.call(currItem, 'Description')) {
					let fileName = data.fileName;
					if (angular.isString(fileName) && fileName.length > 42) {
						fileName = fileName.substr(0, 42);
					}
					currItem.Description = fileName;
				}
				if (Object.prototype.hasOwnProperty.call(currItem, 'DocumentDate')) {
					currItem.DocumentDate = moment.utc(Date.now());
				}
				if (Object.prototype.hasOwnProperty.call(currItem, 'Date')) {
					currItem.Date = moment.utc(Date.now());
				}
			}

			// call api, eg. 'businesspartner/main/evaluationdocument/createforuploadfile'
			function createForUploadFiles(identData, uploadedFileDataArray, extractZipOrNot, uploadConfigs) {
				return createForUploadFilesRequest(identData, uploadedFileDataArray, extractZipOrNot, uploadConfigs)
					.then(createForUploadFilesSuccess);
			}

			function createForUploadFilesRequest(identData, uploadedFileDataArray, extractZipOrNot, uploadConfigs) {
				const permissionGuid = dataService?.data?.usingContainer[0];
				return $http.post(globals.webApiBaseUrl + uploadConfigs.createForUploadFileRoute, {
					IdentData: identData,
					UploadedFileDataList: uploadedFileDataArray,
					ExtractZipOrNot: extractZipOrNot,
					SectionType: uploadConfigs.SectionType,
					PermissionGuid: permissionGuid
				});
			}

			function createForUploadFilesSuccess(response) {
				return response;
			}

			// call api, eg. 'hsqe/checklist/document/checkduplicatebyfilename'
			function checkDuplicateFile(mainItemId, uploadedFileDataArray, extractZipOrNot, uploadConfigs) {
				return $http.post(globals.webApiBaseUrl + uploadConfigs.checkDuplicateByFileNameRoute, {
					MainItemId: mainItemId,
					UploadedFileDataList: uploadedFileDataArray,
					ExtractZipOrNot: extractZipOrNot,
					SectionType: uploadConfigs.SectionType,
				});
			}

			function getSelectedParentId() {
				let selectParentItem = dataService.parentService().getSelected();
				if (selectParentItem) {
					return selectParentItem.Id;
				}
				return null;
			}

			function parentEntityRoleService() {
				return dataService.parentService();
			}

		} // end extend

	}
})(angular);
