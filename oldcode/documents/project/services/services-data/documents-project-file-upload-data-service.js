/**
 * Created by lja on 2016-2-4.
 */
(function (angular) {
	'use strict';

	var moduleName = 'documents.project';

	angular.module(moduleName).factory('documentsProjectDocumentFileUploadDataService',
		[
			'globals',
			'platformModalService',
			'documentsProjectDocumentModuleContext',
			'documentsProjectDocumentDataService',
			'documentsProjectDocumentRevisionDataService',
			'$q',
			'basicsCommonServiceUploadExtension',
			'$http', 'PlatformMessenger', 'basicsLookupdataLookupDescriptorService',
			'projectMainService',
			'$translate', '_', 'cloudDesktopPinningContextService','basicsCommonFileUploadServiceLocator', '$injector',
			/* jshint -W072 */
			function (globals,platformModalService,
				documentsProjectDocumentModuleContext,
				documentsProjectDocumentDataService,
				documentsProjectDocumentRevisionDataService, $q, basicsCommonServiceUploadExtension,
				$http, PlatformMessenger, basicsLookupdataLookupDescriptorService,
				projectMainService,
				$translate, _, cloudDesktopPinningContextService,basicsCommonFileUploadServiceLocator, $injector) {

				var service = {};

				service.getProjectDataService = function () {
					return projectMainService;
				};

				service.getDocumentDataService = function () {
					return documentsProjectDocumentDataService.getService({
						moduleName: documentsProjectDocumentModuleContext.getConfig().moduleName
					});
				};

				service.getDocumentRevisionDataService = function () {
					return documentsProjectDocumentRevisionDataService.getService({
						moduleName: documentsProjectDocumentModuleContext.getConfig().moduleName,
						parentService: service.getDocumentDataService()
					});
				};

				service.createNewDocument = function () {
					var currentModuleName = documentsProjectDocumentModuleContext.getConfig().moduleName;
					var documentDataService = documentsProjectDocumentDataService.getService({
						moduleName: currentModuleName
					});
					var defer = $q.defer();

					documentDataService.createItem().then(function (data) {
						defer.resolve(data);
					}, function (err) {
						defer.reject(err);
					});

					return defer.promise;
				};

				service.createNewDocuments = function (documentCount) {
					return $http.post(globals.webApiBaseUrl + 'documents/projectdocument/createDocuments', {DocumentCount: documentCount});
				};

				service.createNewRevision = function (documentProjectEntity) {
					var currentModuleName = documentsProjectDocumentModuleContext.getConfig().moduleName;

					// in case of documentDataService missing
					var documentDataService = documentsProjectDocumentDataService.getService({
						moduleName: currentModuleName
					});
					if (!documentProjectEntity) {
						documentProjectEntity = documentDataService.getSelected();
					}
					var revisionDataService = documentsProjectDocumentRevisionDataService.getService({
						documentProjectEntity: documentProjectEntity,
						moduleName: currentModuleName,
						parentService: documentDataService
					});

					var defer = $q.defer();

					revisionDataService.createItem().then(function (data) {
						defer.resolve(data);
					}, function (err) {
						defer.reject(err);
					});

					return defer.promise;
				};

				service.createNewRevisions = function (documentProjectIds) {
					return $http.post(globals.webApiBaseUrl + 'documentsproject/revision/createDocumentRevisions', {DocumentProjectIdList: documentProjectIds});
				};

				service.asynCreateDocumentProjectAndDocumentRevisionForUploadFile = function (uploadedFileDataArray, extractZipOrNot,documentEntity) {
					var dragDrogWebApi = 'documents/projectdocument/createDocumentProjectAndDocumentRevisionForUploadFile';
					return service.asynCreateDocumentProjectAndDocumentRevisionForUploadFileNew(uploadedFileDataArray, extractZipOrNot, documentEntity,dragDrogWebApi, true);
				};

				service.asynCreateDocumentProjectAndDocumentRevisionForUploadFileNew = function (uploadedFileDataArray, extractZipOrNot,documentEntity, webApi, isNoCreateConfig) {
					if (!webApi) {
						webApi = 'documents/projectdocument/createDocumentProjectAndDocumentRevisionForUploadFileNew';
					}
					let postDocumentData = {
						ExtractZipOrNot: extractZipOrNot,
						UploadedFileDataList: uploadedFileDataArray,
						ParentEntityInfo: {},
						ModuleName: documentsProjectDocumentModuleContext.getConfig().moduleName,
						referEntity:documentEntity
					};
					let projectPromise = $q.when(true);
					const deffered = $q.defer();
					let dataService = service.getDocumentDataService();
					if (dataService.getServiceName() !== 'documentCentralQueryDataService') {
						let parentEntity = dataService.getCurrentSelectedItem();
						postDocumentData.ColumnConfig = dataService.getColumnConfig();
						postDocumentData.ParentEntityInfo = setParentInfo(parentEntity);
						if (parentEntity.ModelFk !== undefined) {
							postDocumentData.ParentEntityInfo.ModelFk = parentEntity.ModelFk;
							if (parentEntity.ProjectFk === undefined) {
								projectPromise = getProjectFk(parentEntity.ModelFk).then(function (res) {
									let model = (res && res.data) ? res.data : res;
									if (model !== null) {
										postDocumentData.ParentEntityInfo.ProjectFk = model.ProjectFk ? model.ProjectFk : model.PrjProjectFk;
									}
								}, function () {
								});
							}
						}
					} else {
						// set project id from pin context
						var item = cloudDesktopPinningContextService.getPinningItem('project.main');
						if (item) {
							postDocumentData.ParentEntityInfo.ProjectFk = item.id;
						}
					}
					$q.all([projectPromise]).then(
						function () {
							if (isNoCreateConfig) {
								var checkSameContextDialogService = $injector.get('documentProjectDocumentUploadCheckSameContextDialogService');
								checkSameContextDialogService.getDuplicateContextDocs(postDocumentData).then(function (res) {
									var resData = (res && res.data) ? res.data : res;
									if (resData && resData.UploadedFileDataList) {
										checkSameContextDialogService.fillColumnConfigByStructureFilter(postDocumentData);
										$http.post(globals.webApiBaseUrl + webApi, postDocumentData).then(function (res) {
											deffered.resolve(res);
										});
									} else {
										deffered.resolve(null);
									}
								});
							} else {
								$http.post(globals.webApiBaseUrl + webApi, postDocumentData).then(function (res) {
									deffered.resolve(res);
								});
							}
						});
					return deffered.promise;
				};

				service.asyncCreateDocumentOrUpdateRevision = function (uploadedFileDataArray, extractZipOrNot,documentEntity,parentEntityInfo,columnConfig,isFromDataConfig, webApi) {
					if (!webApi) {
						webApi = 'documents/projectdocument/createDocumentOrUpdateRevision';
					}
					let postDocumentData = {
						ExtractZipOrNot: extractZipOrNot,
						UploadedFileDataList: uploadedFileDataArray,
						ParentEntityInfo: parentEntityInfo ?? {},
						ColumnConfig:columnConfig ?? [],
						ModuleName: documentsProjectDocumentModuleContext.getConfig().moduleName,
						referEntity:documentEntity,
						IsFromDataConfig:isFromDataConfig
					};
					let dataService = service.getDocumentDataService();
					if (dataService.getServiceName() === 'documentCentralQueryDataService') {
						let item = cloudDesktopPinningContextService.getPinningItem('project.main');
						if (item) {
							postDocumentData.ParentEntityInfo.ProjectFk = item.id;
						}
					}
					return $http.post(globals.webApiBaseUrl + webApi, postDocumentData);
				};


				service.storeReportAsProjectDocument = function (reportValue) {
					var defer = $q.defer();
					if (!_.isNil(reportValue) && !_.isNil(reportValue.report) && !_.isNil(reportValue.report.result) && !_.isNil(reportValue.report.result.FileExtension)&& reportValue.report.report.storeInDocsState) {
						var extension = reportValue.report.result.FileExtension;
						if(extension.toLocaleString().toUpperCase() === 'PDF'){
							var dataService = service.getDocumentDataService();
							var parentEntityInfoObject = {};
							var parentEntity = dataService.getCurrentSelectedItem();
							var columnConfig = dataService.getColumnConfig();
							var formattedColumnConfigArray = _.map(columnConfig, function (item) {
								return {
									DocumentField: item.documentField,
									DataField: item.dataField ? (item.dataField === 'PrcHeaderEntity.StructureFk' ? 'StructureFk' : item.dataField) : '',
									ReadOnly: item.ReadOnly ? item.ReadOnly : false
								};
							});
							parentEntityInfoObject = setParentInfo(parentEntity);
							if (reportValue.moduleName === 'estimate.main') {
								parentEntityInfoObject.ProjectFk = reportValue.projectFk;
							}
							var pattern = /[\/*?:.""<>]/g;
							var reportName = reportValue.report.report.name.replace(pattern,'') + '.' + reportValue.report.result.FileExtension;
							$http.post(globals.webApiBaseUrl + 'documents/projectdocument/final/storereport', {
								DocumentTypeFk: reportValue.report.report.documentType,
								RubricCategoryFk: reportValue.report.report.rubricCategory,
								DocumentCategoryFk: reportValue.report.report.documentCategory,
								ReportName:reportName,
								ReportFileName:reportValue.report.result.Name + '.' + reportValue.report.result.FileExtension,
								ColumnConfig: formattedColumnConfigArray,
								ParentEntityInfo: parentEntityInfoObject,
								ModuleName: documentsProjectDocumentModuleContext.getConfig().moduleName
							}).then(function (res) {
								if (res.data) {
									dataService.refresh();
								} else {
									defer.resolve([]);
								}
							});
						}
					}
					return defer.promise;
				};

				service.asynCreateDocumentRevisionForUploadFile = function (uploadedFileDataArray, extractZipOrNot) {
					var defer = $q.defer();
					$injector.get('documentProjectDocumentUploadCheckSameContextDialogService').revisionDuplicateContext(uploadedFileDataArray).then(function (res) {
						if (res) {
							const selectItem = service.getDocumentSelectedItem();
							$http.post(globals.webApiBaseUrl + 'documents/projectdocument/createDocument', [{
								ExtractZipOrNot: extractZipOrNot,
								UploadedFileDataList: uploadedFileDataArray,
								DocumentDto: selectItem
							}]).then(function (response) {
								defer.resolve(response);
								// TODO yew: it can not preview model after upload new revision
								$injector.get('$timeout')(function () {
									$injector.get('modelWdeViewerSelectionService').clearSelection();
								}, 500);
							}, function failed(response) {
								let docDataService = service.getDocumentDataService();
								docDataService.setSelected(selectItem);
								docDataService.refresh();
								defer.resolve(null);
							});
						} else {
							defer.resolve(null);
						}
					});
					return defer.promise;
				};

				service.getAllSelectedDocuments = function () {
					var dataService = documentsProjectDocumentDataService.getService({
						moduleName: documentsProjectDocumentModuleContext.getConfig().moduleName
					});

					return dataService.getSelectedEntities();
				};

				service.getSelectedParentItem = function () {
					var dataService = service.getDocumentDataService();
					var parentEntity;
					if (!_.isNil(dataService.documentParentService)) {
						parentEntity = dataService.documentParentService.getSelected();
					} else {
						parentEntity = dataService.parentService().getSelected();
					}
					return (!!parentEntity) && (parentEntity.Id !== -1);
				};

				service.getDocumentSelectedItem = function () {
					var dataService = documentsProjectDocumentDataService.getService({
						moduleName: documentsProjectDocumentModuleContext.getConfig().moduleName
					});

					return dataService.getSelected();
				};

				service.getDocumentFileType = function () {
					var selectedDocument = service.getDocumentSelectedItem();
					if (selectedDocument) {
						var fileTypeFk = selectedDocument.DocumentTypeFk;
						return fileTypeFk === 0 ? null : fileTypeFk;
					} else {
						return null;
					}
				};

				service.getAllSelectedDocumentFileTypeIds = function () {
					var allSelectedDocuments = service.getAllSelectedDocuments();
					return _.map(allSelectedDocuments, function (documentItem) {
						return !documentItem.DocumentTypeFk ? null : documentItem.DocumentTypeFk;
					});

				};

				service.supportedMimeTypeMapping = null;
				service.getSupportedMimeTypeMapping = function () {
					var defer = $q.defer();
					if (service.supportedMimeTypeMapping) {
						return $q.when(service.supportedMimeTypeMapping);
					} else {
						$http.get(globals.webApiBaseUrl + 'basics/common/mimeType/getAllSupportedMimeTypes')
							.then(function (res) {
								if (res && res.data) {
									service.supportedMimeTypeMapping = res.data;
									defer.resolve(service.supportedMimeTypeMapping);
								} else {
									defer.resolve([]);
								}
							});
					}
					return defer.promise;
				};

				service.documentSingleDoUpdate = function (item) {
					var dataService = service.getDocumentDataService();
					dataService.markItemAsModified(item);
					dataService.isNeedUpdateSelf = false;
					return dataService.update().then(function () {
						dataService.isNeedUpdateSelf = true;
						service.refreshDocumentRevisionGrid(item);
					});
				};

				service.documentDoUpdate = function (item) {
					var dataService = service.getDocumentDataService();
					dataService.markItemAsModified(item);
					dataService.isNeedUpdateSelf = false;
					return dataService.documentParentService.update().then(function () {
						dataService.update().then(function () {
							dataService.isNeedUpdateSelf = true;
						});
					});
				};

				service.documentsDoUpdate = function () {
					var defer = $q.defer();
					var dataService = service.getDocumentDataService();
					dataService.isNeedUpdateSelf = false;
					dataService.documentParentService.update().then(function () {
						dataService.update().then(function () {
							dataService.isNeedUpdateSelf = true;
							defer.resolve([]);
						}, function () {
							defer.reject();
						});
					}, function () {
						defer.reject();
					});
					return defer.promise;
				};

				service.refreshDocumentGrid = function () {
					var documentDataService = service.getDocumentDataService();
					if (!!documentDataService && !!documentDataService.gridRefresh && _.isFunction(documentDataService.gridRefresh)) {
						documentDataService.gridRefresh();
					}
				};

				service.refreshDocumentRevisionGrid = function () {
					var documentRevisionDataService = service.getDocumentRevisionDataService();
					if (!!documentRevisionDataService && !!documentRevisionDataService.gridRefresh && _.isFunction(documentRevisionDataService.gridRefresh)) {
						documentRevisionDataService.gridRefresh();
					}
				};

				service.execute = function () {
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + moduleName + '/partials/file-handler-lookup.html',
						backdrop: false
					});
				};

				service.fileExtensionArray = null;

				service.getFileExtension = function (fileName) {
					return fileName.substr(fileName.lastIndexOf('.') + 1);
				};

				service.onFileSelected = function ($scope, files, basDocumentTypeId, extractZipOrNot) {
					if (!!files && !!files.length && files.length > 0) {
						var allSupportedFileExtensionArray = service.getAllSupportedFileExtensionArray();
						var fileExtension = null;
						var invalidFileExtension = [];
						if (basDocumentTypeId) {
							var targetFileExtensions = [];
							for (var j = 0; j < allSupportedFileExtensionArray.length; j++) {
								if (allSupportedFileExtensionArray[j].id === basDocumentTypeId) {
									var targetFileExtension = allSupportedFileExtensionArray[j].fileExtension.toLowerCase();
									targetFileExtensions.push(targetFileExtension);
									// break;
								}
							}
							var p = null;
							if (targetFileExtensions.indexOf('zip') !== -1) {
								for (p in files) {
									if (Object.prototype.hasOwnProperty.call(files, p)  && !!(files[p].name)) {
										fileExtension = service.getFileExtension(files[p].name).toLowerCase();
										if (targetFileExtensions.indexOf(fileExtension) === -1) {
											invalidFileExtension.push(files[p].name);
										}
									}
								}
							} else {
								if (extractZipOrNot === true) {
									for (p in files) {
										if (Object.prototype.hasOwnProperty.call(files, p)  && !!(files[p].name)) {
											fileExtension = service.getFileExtension(files[p].name).toLowerCase();
											if (targetFileExtensions.indexOf(fileExtension) === -1 && fileExtension !== 'zip') {
												invalidFileExtension.push(files[p].name);
											}
										}
									}
								} else {
									for (p in files) {
										if (Object.prototype.hasOwnProperty.call(files, p)  && !!(files[p].name)) {
											fileExtension = service.getFileExtension(files[p].name).toLowerCase();
											if (targetFileExtensions.indexOf(fileExtension) === -1) {
												invalidFileExtension.push(files[p].name);
											}
										}
									}
								}
							}
						} else {
							for (var prop in files) {
								if (Object.prototype.hasOwnProperty.call(files, prop)  && !!(files[prop].name)) {
									fileExtension = service.getFileExtension(files[prop].name).toLowerCase();
									var findResult = false;
									for (var i = 0; i < allSupportedFileExtensionArray.length; i++) {
										if (allSupportedFileExtensionArray[i].fileExtension.toLowerCase() === fileExtension) {
											findResult = true;
											break;
										}
									}
									if (!findResult) {
										invalidFileExtension.push(files[prop].name);
									}
								}
							}
						}
						let revisionDataService = service.getDocumentRevisionDataService();
						let uploadService = basicsCommonFileUploadServiceLocator.getService(revisionDataService.uploadOptions.uploadServiceKey);
						if (invalidFileExtension.length > 0) {
							platformModalService.showDialog({
								headerText: $translate.instant('documents.project.FileUpload.FileUpload'),
								bodyText: $translate.instant('documents.project.FileUpload.validation.FileUploadRevisionInfo'),
								showYesButton: true,
								showNoButton: true,
								iconClass: 'ico-question',
								backdrop: false
							}).then(function(res){
								if (res.yes){
									uploadService.startUploadFiles(files);
								}
							});
						} else {
							uploadService.startUploadFiles(files);
							// var documentDataService = service.getDocumentDataService();
							// if (!!service.isDragOrSelect && service.isDragOrSelect === 'drag') {
							// documentDataService.showUploadFilesProgress($scope);
							// }
						}
					}
				};

				service.validateFileExtension = function ($scope, files, basDocumentTypeId, extractZipOrNot) {
					if (!!files && !!files.length && files.length > 0) {
						var supportExtensions = service.getAllSupportedFileExtensionArray();
						var invalidFiles = [];
						if (basDocumentTypeId) {
							var targetFileExtensions = [], targetAllowZip = false;
							angular.forEach(supportExtensions, function (supportExtension) {
								if (supportExtension.id === basDocumentTypeId) {
									var ext = supportExtension.fileExtension.toLowerCase();
									if (ext === 'zip') {
										targetAllowZip = true;
									}
									targetFileExtensions.push(ext);
								}
							});
							if (targetAllowZip) {
								angular.forEach(files, function (file) {
									var fileExtension = service.getFileExtension(file.name).toLowerCase();
									var found = _.find(targetFileExtensions, function (item) {
										return item === fileExtension;
									});
									if (!found) {
										invalidFiles.push(file.name);
									}
								});
							} else {
								if (extractZipOrNot === true) {
									angular.forEach(files, function (file) {
										var fileExtension = service.getFileExtension(file.name).toLowerCase();
										var found = _.find(targetFileExtensions, function (item) {
											return item === fileExtension;
										});
										if (!found && fileExtension !== 'zip') {
											invalidFiles.push(file.name);
										}
									});
								} else {
									angular.forEach(files, function (file) {
										var fileExtension = service.getFileExtension(file.name).toLowerCase();
										var found = _.find(targetFileExtensions, function (item) {
											return item === fileExtension;
										});
										if (!found) {
											invalidFiles.push(file.name);
										}
									});
								}
							}
						} else {
							angular.forEach(files, function (file) {
								var fileExtension = service.getFileExtension(file.name).toLowerCase();
								var found = _.find(supportExtensions, function (item) {
									return item.fileExtension.toLowerCase() === fileExtension;
								});
								if (!found) {
									invalidFiles.push(file.name);
								}
							});
						}
						return invalidFiles.length <= 0;
					}
					return false;
				};

				service.validateFileExtensionAndShowMsg = function ($scope, files, basDocumentTypeId, extractZipOrNot) {
					if (!!files && !!files.length && files.length > 0) {
						var supportExtensions = service.getAllSupportedFileExtensionArray();
						var invalidFiles = [];
						if (basDocumentTypeId) {
							var targetFileExtensions = [], targetAllowZip = false;
							angular.forEach(supportExtensions, function (supportExtension) {
								if (supportExtension.id === basDocumentTypeId) {
									var ext = supportExtension.fileExtension.toLowerCase();
									if (ext === 'zip') {
										targetAllowZip = true;
									}
									targetFileExtensions.push(ext);
								}
							});
							if (targetAllowZip) {
								angular.forEach(files, function (file) {
									var fileExtension = service.getFileExtension(file.name).toLowerCase();
									var found = _.find(targetFileExtensions, function (item) {
										return item === fileExtension;
									});
									if (!found) {
										invalidFiles.push(file.name);
									}
								});
							} else {
								if (extractZipOrNot === true) {
									angular.forEach(files, function (file) {
										var fileExtension = service.getFileExtension(file.name).toLowerCase();
										var found = _.find(targetFileExtensions, function (item) {
											return item === fileExtension;
										});
										if (!found && fileExtension !== 'zip') {
											invalidFiles.push(file.name);
										}
									});
								} else {
									angular.forEach(files, function (file) {
										var fileExtension = service.getFileExtension(file.name).toLowerCase();
										var found = _.find(targetFileExtensions, function (item) {
											return item === fileExtension;
										});
										if (!found) {
											invalidFiles.push(file.name);
										}
									});
								}
							}
						} else {
							angular.forEach(files, function (file) {
								var fileExtension = service.getFileExtension(file.name).toLowerCase();
								var found = _.find(supportExtensions, function (item) {
									return item.fileExtension.toLowerCase() === fileExtension;
								});
								if (!found) {
									invalidFiles.push(file.name);
								}
							});
						}

						if (invalidFiles.length > 0) {
							var errMsg = $translate.instant('documents.project.FileUpload.validation.FileExtensionErrorInfo');
							if (invalidFiles.length > 1) {
								var fileNames = invalidFiles.join(',<br/>');
								errMsg = $translate.instant('documents.project.FileUpload.validation.FileExtensionsErrorInfo') + ':<br/>' + fileNames;
							} else {
								errMsg = $translate.instant('documents.project.FileUpload.validation.FileExtensionErrorInfo') + ':' + invalidFiles[0];
							}

							platformModalService.showDialog({
								templateUrl: globals.appBaseUrl + moduleName + '/partials/invalid-files-list.html',
								headerText: $translate.instant('documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle'),
								content: errMsg,
								scope: $scope,
								backdrop: false
							});
						} else {
							return true;
						}
					}
					return false;
				};

				service.basDocumentTypeArray = basicsLookupdataLookupDescriptorService.getData('DocumentType');
				service.getBasDocumentTypeArray = function () {
					if (!service.basDocumentTypeArray) {
						service.basDocumentTypeArray = basicsLookupdataLookupDescriptorService.getData('DocumentType');
					}
					return service.basDocumentTypeArray;
				};

				service.getAllSupportedFileExtensionArray = function () {
					if (service.fileExtensionArray) {
						return service.fileExtensionArray;
					} else {
						var basDocumentTypeArray = service.getBasDocumentTypeArray();
						var fileExtensionArray = [];
						var j = 0;
						for (var i in basDocumentTypeArray) {
							if (Object.prototype.hasOwnProperty.call(basDocumentTypeArray, i)) {
								var basDocumentTypeId = basDocumentTypeArray[i].Id;
								var fileExtention = basDocumentTypeArray[i].Extention;

								var tempArray = [];
								if (fileExtention) {
									if (fileExtention.indexOf(';') !== -1) {
										tempArray = fileExtention.split(';');
										for (j = 0; j < tempArray.length; j++) {
											fileExtensionArray.push({
												id: basDocumentTypeId,
												fileExtension: tempArray[j].replace(/[*.\s]/g, '')
											});
										}
									} else if (fileExtention.indexOf(',') !== -1) {
										tempArray = fileExtention.split(',');
										for (j = 0; j < tempArray.length; j++) {
											fileExtensionArray.push({
												id: basDocumentTypeId,
												fileExtension: tempArray[j].replace(/[*.\s]/g, '')
											});
										}
									} else {
										fileExtensionArray.push({
											id: basDocumentTypeId,
											fileExtension: fileExtention.replace(/[*.\s]/g, '')
										});
									}
								}
							}
						}
						service.fileExtensionArray = fileExtensionArray;
						return service.fileExtensionArray;
					}
				};

				service.getDocumentType = function (uploaData) {
					var fileName = uploaData.fileName;
					var suffix = fileName.substr(fileName.lastIndexOf('.'), fileName.length - 1);
					var lowercaseSuffix = _.toLower(suffix);
					var documentTypes = basicsLookupdataLookupDescriptorService.getData('DocumentType');
					var foundDocType = _.find(documentTypes, function (item) {
						return uploaData.fileType !== '' && item.MimeType.indexOf(uploaData.fileType) !== -1;
					});
					// it can not use the MimeType when the 'rtf' file type
					if (!foundDocType || (foundDocType && foundDocType.Extention && foundDocType.Extention.indexOf(lowercaseSuffix) === -1)) {
						foundDocType = _.find(documentTypes, function (o) {
							return o.Extention !== null && (o.Extention.indexOf(lowercaseSuffix) !== -1 || lowercaseSuffix.indexOf(o.Extention) !== -1);
						});
					}
					return foundDocType;
				};

				service.getDocumentCategory = function (documentInfo) {
					return $http.post(globals.webApiBaseUrl + 'documents/projectdocument/mtwoai/getdocumentcategory', {documentInfo: documentInfo}).then(function (result) {
						return result.data;
					});
				};

				service.gridFlag = null;
				service.isDragOrSelect = null;
				service.dragDropFileTargetGridId = null;
				service.filesHaveBeenUploaded = new PlatformMessenger();

				service.dragedFilesHaveBeenUploaded = new PlatformMessenger();

				function getProjectFk(modelFk) {
					var defer = $q.defer();
					let modelUrl = $injector.get('modelWdeViewerIgeService').getModelInfoUrl('model/project/model/getbyid?id=');
					$http.get(globals.webApiBaseUrl + modelUrl + modelFk).then(function (data) {
						defer.resolve(data);
					}, function (err) {
						defer.reject(err);
					});
					return defer.promise;
				}

				function uploadFilesCallBack(currItem, data) {
					var args = {
						currItem: currItem,
						data: data
					};
					service.filesHaveBeenUploaded.fire(null, args);
				}
				service.setParentInfo = setParentInfo;
				function setParentInfo(parentEntity){
					var parentEntityInfoObject = {};
					if (parentEntity.Id !== undefined) {
						parentEntityInfoObject.Id = parentEntity.Id;
					}
					if (parentEntity.BusinessPartnerFk !== undefined) {
						parentEntityInfoObject.BusinessPartnerFk = parentEntity.BusinessPartnerFk;
					}
					if (parentEntity.SubsidiaryFk !== undefined) {
						parentEntityInfoObject.SubsidiaryFk = parentEntity.SubsidiaryFk;
					}
					if (parentEntity.ContactFk !== undefined) {
						parentEntityInfoObject.ContactFk = parentEntity.ContactFk;
					}
					if (parentEntity.ProjectFk !== undefined) {
						parentEntityInfoObject.ProjectFk = parentEntity.ProjectFk;
						var currentModuleName = documentsProjectDocumentModuleContext.getConfig().moduleName;
						if (currentModuleName === 'transportplanning.transport') {
							parentEntityInfoObject.ProjectFk = parentEntity.ProjectDefFk;
						}
					}
					if (parentEntity.JobDefFk !== undefined) {
						parentEntityInfoObject.JobFk = parentEntity.JobDefFk;
					} else if(parentEntity.LgmJobFk !== undefined) { //making sure to JobFk is not null.
						parentEntityInfoObject.JobFk = parentEntity.LgmJobFk;
					}
					// handle(#116718) for Engineering Planning module
					if (parentEntityInfoObject.ProjectFk === undefined && parentEntity.ProjectId !== undefined && parentEntity.ProjectId !== null) {
						parentEntityInfoObject.ProjectFk = parentEntity.ProjectId;
					}
					if (parentEntity.PrcStructureFk !== undefined) {
						parentEntityInfoObject.PrcStructureFk = parentEntity.PrcStructureFk;
					} else if (parentEntity.StructureFk !== undefined) {
						parentEntityInfoObject.StructureFk = parentEntity.StructureFk;
					} else if ((!!parentEntity.PrcHeaderEntity) && (parentEntity.PrcHeaderEntity.StructureFk !== undefined)) {
						parentEntityInfoObject.StructureFk = parentEntity.PrcHeaderEntity.StructureFk;
					}
					if (parentEntity.ConHeaderFk !== undefined) {
						parentEntityInfoObject.ConHeaderFk = parentEntity.ConHeaderFk;
					}
					if (parentEntity.ControllingUnitFk !== undefined) {
						parentEntityInfoObject.ControllingUnitFk = parentEntity.ControllingUnitFk;
					}
					if (parentEntity.PrcPackageFk !== undefined) {
						parentEntityInfoObject.PrcPackageFk = parentEntity.PrcPackageFk;
					} else if (parentEntity.PackageFk !== undefined) {
						parentEntityInfoObject.PackageFk = parentEntity.PackageFk;
					}
					if (parentEntity.ActivityFk !== undefined) {
						parentEntityInfoObject.ActivityFk = parentEntity.ActivityFk;
					}
					if (parentEntity.MaterialCatalogFk !== undefined) {
						parentEntityInfoObject.MaterialCatalogFk = parentEntity.MaterialCatalogFk;
					}

					if (parentEntity.RfqHeaderFk !== undefined) {
						parentEntityInfoObject.RfqHeaderFk = parentEntity.RfqHeaderFk;
					}
					if (parentEntity.ScheduleFk !== undefined) {
						parentEntityInfoObject.ScheduleFk = parentEntity.ScheduleFk;
					}
					if (parentEntity.PesHeaderFk !== undefined) {
						parentEntityInfoObject.PesHeaderFk = parentEntity.PesHeaderFk;
					}

					if (parentEntity.LocationFk !== undefined) {
						parentEntityInfoObject.PrjLocationFk = parentEntity.LocationFk;
					}

					if (parentEntity.PpsItemUpstreamFk !== undefined) {
						parentEntityInfoObject.PpsItemUpstreamFk = parentEntity.PpsItemUpstreamFk;
					}

					if (parentEntity.ReqHeaderFk !== undefined) {
						parentEntityInfoObject.ReqHeaderFk = parentEntity.ReqHeaderFk;
					}
					if (parentEntity.OrdHeaderFk !== undefined) {
						parentEntityInfoObject.OrdHeaderFk = parentEntity.OrdHeaderFk;
					}
					if (parentEntity.WipHeaderFk !== undefined) {
						parentEntityInfoObject.WipHeaderFk = parentEntity.WipHeaderFk;
					}
					if (parentEntity.LgmSettlementFk !== undefined) {
						parentEntityInfoObject.LgmSettlementFk = parentEntity.LgmSettlementFk;
					}
					if (parentEntity.QtnHeaderFk !== undefined) {
						parentEntityInfoObject.QtnHeaderFk = parentEntity.QtnHeaderFk;
					}
					if (parentEntity.InvHeaderFk !== undefined) {
						parentEntityInfoObject.InvHeaderFk = parentEntity.InvHeaderFk;
					}
					if (parentEntity.EstHeaderFk !== undefined) {
						parentEntityInfoObject.EstHeaderFk = parentEntity.EstHeaderFk;
					}
					if (parentEntity.BpdCertificateFk !== undefined) {
						parentEntityInfoObject.BpdCertificateFk = parentEntity.BpdCertificateFk;
					}
					if (parentEntity.BilHeaderFk !== undefined) {
						parentEntityInfoObject.BilHeaderFk = parentEntity.BilHeaderFk;
					}
					if (parentEntity.QtoHeaderFk !== undefined) {
						parentEntityInfoObject.QtoHeaderFk = parentEntity.QtoHeaderFk;
					}
					if (parentEntity.ModelFk !== undefined) {
						parentEntityInfoObject.ModelFk = parentEntity.ModelFk;
					}
					return parentEntityInfoObject;
				}

				function init() {

					var uploadOptions = {
						uploadFilesCallBack: uploadFilesCallBack,
						uploadServiceKey: 'documents-project-file-upload',
						uploadConfigs: {action: 'UploadWithCompress', SectionType: 'DocumentsProject'}
					};
					basicsCommonServiceUploadExtension.extendForCustom(service, uploadOptions);
				}

				init();

				return service;
			}]);
})(angular);
