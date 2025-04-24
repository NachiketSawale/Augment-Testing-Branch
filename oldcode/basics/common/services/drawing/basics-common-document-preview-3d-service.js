(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	angular.module(moduleName).factory('basicsCommonDocumentPreview3DViewerService',
		['$http', 'globals', '_', '$injector', 'platformGridAPI', '$timeout',
			'platformTranslateService', 'platformDialogService', '$translate', '$q', 'basicsCommonGridCellService', 'documentModelJobStateProgressService',
			function basicsCommonDocumentPreview3DViewerService($http, globals, _, $injector, platformGridAPI, $timeout,
				platformTranslateService, platformDialogService, $translate, $q, basicsCommonGridCellService, documentModelJobStateProgressService) {

				let service = {
					JobStateGetTimes: []
				};
				const statusEnum = {
					loading: '-2', // load preview model status
					noPreview: '-1', // no 2D/3D file
					wait: '0', // wait for frmJob done
					noConvert: '1', // is 2D/3D but no conversion data
					inProgress: '2', // converting
					failed: '3', // convert failed
					success: '4', // convert success
					delConvert: '5' // have previewModelFk but delete the conversion data
				};
				const converting = [statusEnum.loading, statusEnum.wait, statusEnum.inProgress];
				const unCheckStatus = [statusEnum.noPreview, statusEnum.failed, statusEnum.success];
				service.modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
				const modelSelectionService = $injector.get('modelWdeViewerSelectionService');

				service.addModelStatusInGrid = function addModelStatusInGrid(scope, dataService) {
					let findModelStatus = _.find(scope.gridData.config.columns, {id: 'modelstatus'});
					if (!findModelStatus) {
						scope.gridData.config.columns.push({
							id: 'modelstatus',
							field: 'ModelJobState',
							formatter: documentModelJobStateProgressService.formatter,
							name: 'Model State',
							name$tr$: 'basics.common.modelJobState',
							sortable: true,
							toolTip: '2D/3D Model State',
							toolTip$tr$: 'basics.common.modelJobState'
						});
						$timeout(function () {
							platformTranslateService.translateGridConfig(scope.gridData.config.columns);
							platformGridAPI.columns.configuration(scope.gridId, scope.gridData.config.columns, true);
							platformGridAPI.configuration.refresh(scope.gridId);
						});
						service.gridIds = service.gridIds || [];
						if (!service.gridIds.includes(scope.gridId)) {
							service.gridIds.push(scope.gridId);
						}
					}
				};

				function collectDocuments(updateData, testName) {
					let documents = [];
					Object.keys(updateData).forEach(field => {
						if (testName.test(field) && Array.isArray(updateData[field])) {
							updateData[field].forEach(item => {
								if (item.FileArchiveDocFk) {
									documents.push(item);
								} else if (item.MainItemId) {
									Object.keys(item).forEach(fieldItem => {
										if (fieldItem.includes('Document') && item[fieldItem]?.FileArchiveDocFk) {
											documents.push(item[fieldItem]);
										}
									});
								}
							});
						}
					});
					return documents;
				}

				function collectDocFks(data) {
					return (Array.isArray(data) ? data : [])
						.filter(item => item.FileArchiveDocFk)
						.map(item => item.FileArchiveDocFk);
				}

				service.updateCheckDeleteModel = function updateCheckDeleteModel(updateData) {
					const docs = collectDocuments(updateData, /DocumentsToDelete|DocumentToDelete/);
					let delDocIds = collectDocFks(docs);
					if (Array.isArray(updateData.BoqItemToSave)) {
						updateData.BoqItemToSave.forEach(boqItem => {
							delDocIds = delDocIds.concat(collectDocFks(boqItem.BoqItemDocumentToDelete));
						});
					}
					if (Array.isArray(updateData.SkillsToSave)) {
						updateData.SkillsToSave.forEach(skillItem => {
							delDocIds = delDocIds.concat(collectDocFks(skillItem.SkillDocumentsToDelete));
						});
					}
					if (Array.isArray(updateData.PrcPackage2HeaderToSave)) {
						updateData.PrcPackage2HeaderToSave.forEach(prcPackage => {
							if (prcPackage.PrcBoqCompleteToSave && Array.isArray(prcPackage.PrcBoqCompleteToSave.BoqItemCompleteToSave)) {
								prcPackage.PrcBoqCompleteToSave.BoqItemCompleteToSave.forEach(boqItem => {
									delDocIds = delDocIds.concat(collectDocFks(boqItem.BoqItemDocumentToDelete));
								});
							}
						});
					}
					if (delDocIds.length > 0 && !service.deleteModelFkPosting) {
						service.deleteModelFkPosting = true;
						service.deletePreviewModel(delDocIds).then(function () {
							service.deleteModelFkPosting = false;
						});
					}
				};

				service.updateDataToCreateModel = function updateDataToCreateModel(scope, dataService, updateData) {
					service.doRefreshWhenInProgress(dataService);
					if (!updateData) {
						return;
					}
					service.updateCheckDeleteModel(updateData);
					let documents = collectDocuments(updateData, /DocumentsToSave|DocumentToSave/);
					if (Array.isArray(updateData.BoqItemToSave) && updateData.BoqItemToSave.length > 0) {
						updateData.BoqItemToSave.forEach(item => {
							if (Array.isArray(item.BoqItemDocumentToSave)) {
								documents = documents.concat(item.BoqItemDocumentToSave);
							}
						});
					}
					if (Array.isArray(updateData.PrcPackage2HeaderToSave) && updateData.PrcPackage2HeaderToSave.length > 0) {
						updateData.PrcPackage2HeaderToSave.forEach(prcPackage => {
							if (prcPackage.PrcBoqCompleteToSave && Array.isArray(prcPackage.PrcBoqCompleteToSave.BoqItemCompleteToSave)) {
								prcPackage.PrcBoqCompleteToSave.BoqItemCompleteToSave.forEach(boqItem => {
									if (Array.isArray(boqItem.BoqItemDocumentToSave)) {
										documents = documents.concat(boqItem.BoqItemDocumentToSave);
									}
								});
							}
						});
					}
					if (documents && documents.length > 0) {
						let projectId = getProjectId(dataService);
						if (!service.createModelFkPosting) {
							documents.forEach(entity => {
								if (entity.FileArchiveDocFk) {
									service.createModelFkPosting = true;
									service.createPreviewModelFromDocument(entity.FileArchiveDocFk, projectId).then(function () {
										service.createModelFkPosting = false;
									});
								}
							});
						}
					}
				};

				function getProjectFk(selItem) {
					return selItem ? (selItem.PrjProjectFk || selItem.ProjectFk) : null;
				}

				function getProjectId(dataService) {
					let parentService = dataService?.parentService ? dataService.parentService() : null;
					let projectId = null;
					if (parentService) {
						const selItem = parentService.getSelected();
						projectId = getProjectFk(selItem);
						// If no project ID found and the service name is 'projectMainService', use 'selItem id'
						if (!projectId && parentService.getServiceName() === 'projectMainService') {
							projectId = selItem?.Id;
						}
					}
					if (!projectId) {
						projectId = getProjectFk(dataService.getSelected());
					}
					return projectId;
				}

				service.createPreviewModelFromDocument = function createPreviewModelFromDocument(fileArchiveDocId, projectId) {
					let webApi = globals.webApiBaseUrl + 'basics/common/document/createpreviewmodel?fileArchiveDocId=' + fileArchiveDocId;
					if (projectId) {
						webApi = webApi + '&projectId=' + projectId;
					}
					return $http.get(webApi);
				};
				service.createPreviewModelFromDocs = function createPreviewModelFromDocs(fileArchiveDocIds, projectId) {
					return $http.post(globals.webApiBaseUrl + 'basics/common/document/createpreviewmodels', {
						FileArchiveDocIds: fileArchiveDocIds,
						ProjectId: projectId
					});
				};

				service.deletePreviewModel = function deletePreviewModel(fileArchiveDocIds) {
					return $http.post(globals.webApiBaseUrl + 'documents/projectdocument/deletepreviewmodellist', fileArchiveDocIds);
				};

				function collectionFileArchiveDocFk(dataService) {
					let isRefresh = false;
					const collectionIds = dataService.getList()
						.filter(item => item.FileArchiveDocFk && (!item.ModelJobState || !unCheckStatus.includes(item.ModelJobState?.toString())))
						.map(item => {
							let docTypeItem = getDocTypeItem(item);
							if (docTypeItem?.Is2DModel || docTypeItem?.Is3DModel) {
								if (!item.ModelJobState) {
									item.ModelJobState = statusEnum.loading;
									isRefresh = true;
								}
								return item.FileArchiveDocFk;
							} else {
								if (!item.ModelJobState) {
									item.ModelJobState = statusEnum.noPreview;
									isRefresh = true;
								}
							}
							return null;
						}).filter(Boolean);
					if (isRefresh) {
						docDataGridRefresh(dataService);
					}
					return collectionIds;
				}

				// The same request is triggered multiple times
				function isShortTimeCall(id, time = 2000) {
					if (!(id?.toString().length > 0)) {
						return true;
					}
					service.callTimes = service.callTimes || [];
					const callTime = service.callTimes.find(j => j.id === id.toString());
					const now = Date.now();
					if (!callTime) {
						service.callTimes.push({id: id.toString(), time: now});
						return false;
					}
					const isShortTime = (now - callTime.time) < time;
					callTime.time = now;
					return isShortTime;
				}

				function debounce(func, delay) {
					let timer;
					return function (...args) {
						clearTimeout(timer);
						timer = setTimeout(() => func.apply(this, args), delay);
					};
				}
				const debouncedPreviewHandler = debounce(previewInViewer, 2000);

				function resetModelState(dataService) {
					const items = dataService.getList();
					_.forEach(items, function (item) {
						if (item.ModelJobState === statusEnum.inProgress || item.ModelJobState === statusEnum.loading) {
							item.ModelJobState = statusEnum.noConvert;
						}
					});
					docDataGridRefresh(dataService);
				}

				service.getModelJobStates = function getModelJobStates(dataService) {
					clearPinModel(dataService);
					let collectionIds = collectionFileArchiveDocFk(dataService);
					if (isShortTimeCall(collectionIds)) {
						return;
					}
					return $http.post(globals.webApiBaseUrl + 'basics/common/document/getmodeljobstates', collectionIds)
						.then(function (response) {
							const data = response.data || response;
							if (!(data?.length > 0)) {
								resetModelState(dataService);
								return;
							}
							const items = dataService.getList().filter(item => collectionIds.includes(item.FileArchiveDocFk));
							let isRefresh = false;
							let isCheckAgain = false;
							_.forEach(items, function (item) {
								let findItem = _.find(data, {FileArchiveDocId: item.FileArchiveDocFk});
								if (findItem) {
									item.PreviewModelFk = findItem.ModelFk;
									item.ModelJobState = findItem.ModelJobState;
									item.JobLoggingMessage = findItem.JobLoggingMessage;
									isRefresh = true;
									if (item.ModelJobState?.toString() === statusEnum.success && item.Id === dataService.getSelected()?.Id) {
										service.previewInViewerAgain(dataService);
									}
								} else if (collectionIds.includes(item.FileArchiveDocFk)) {
									item.ModelJobState = statusEnum.noConvert;
									isRefresh = true;
								} else if (item.ModelJobState?.toString() === statusEnum.loading) {
									item.ModelJobState = statusEnum.noPreview;
								}
								if (isInProgress(item)) {
									isCheckAgain = true;
								}
							});
							if (isRefresh) {
								docDataGridRefresh(dataService);
							}
							if (isCheckAgain) {
								service.doRefreshWhenInProgress(dataService);
							}
						});
				};

				function doRefreshRevision(docService) {
					// no refresh for revision record after the file is uploaded
					let config = $injector.get('documentsProjectDocumentModuleContext').getConfig();
					if (!config.moduleName) {
						return;
					}
					let revisionService = $injector.get('documentsProjectDocumentRevisionDataService').getService(config);
					if (revisionService && revisionService.getServiceName() !== docService.getServiceName()) {
						let revisions = revisionService.getList();
						let isRefreshRevision = false;
						if (revisions && revisions.length > 0) {
							let selDoc = docService.getSelected();
							revisions.forEach(revision => {
								if (selDoc && revision.FileArchiveDocFk === selDoc.FileArchiveDocFk) {
									isRefreshRevision = revision.ModelJobState !== selDoc.ModelJobState;
									revision.ModelJobState = selDoc.ModelJobState;
									revision.JobLoggingMessage = selDoc.JobLoggingMessage;
									revision.PreviewModelFk = selDoc.PreviewModelFk;
								}
							});
						}
						if (isRefreshRevision) {
							documentModelJobStateProgressService.refresh(revisions, revisionService.dragDropFileTargetGridId);
						}
					}
				}

				function docDataGridRefresh(docService) {
					doRefreshRevision(docService);
					service.gridIds.forEach(gridId => {
						documentModelJobStateProgressService.refresh(docService.getList(), gridId);
					});
				}

				let lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');

				function getLookupData(lookupName, lookupKey) {
					let lookupData = lookupDescriptorService.getData(lookupName);
					if (!lookupData) {
						if (lookupKey) {
							$injector.get('basicsLookupdataLookupDataService').getItemByKey(lookupName, lookupKey).then(function (data) {
								if (data) {
									lookupDescriptorService.updateData(lookupName, [data]);
								}
							});

						} else {
							$injector.get('basicsLookupdataLookupDataService').getList(lookupName).then(function (data) {
								if (data) {
									lookupDescriptorService.updateData(lookupName, [data]);
								}
							});
						}
					}
					return lookupData;
				}

				service.fileType2D3Ds = function () {
					let fileType = [];
					let documentTypes = getLookupData('DocumentType');
					_.forEach(documentTypes, item => {
						if ((item.Is2DModel || item.Is3DModel) && item.Extention) {
							let extensions = item.Extention.split(',').map(ext => ext.replace(/[*,. ]/g, ''));
							fileType = fileType.concat(extensions);
						}
					});
					return fileType;
				};

				function keepPinModel() {
					let context = $injector.get('cloudDesktopPinningContextService').getContext();
					let contextModelInfo = _.find(context, {token: 'model.main'});
					let contextProject = _.find(context, {token: 'project.main'});
					if (contextModelInfo && contextModelInfo.info.indexOf('(Preview)') === -1) {
						service.pinModel = contextModelInfo;
					}
					if (contextProject && (!contextModelInfo || contextModelInfo.info.indexOf('(Preview)') === -1)) {
						service.pinProject = contextProject;
					} else if (!contextProject) {
						service.pinProject = null;
					}
				}

				function setPreviewModelNull(dataService) {
					try {
						if (dataService.getServiceName() === 'documentsProjectDocumentRevisionDataService') {
							return;
						}
						modelSelectionService.clearSelection();
						let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
						let context = cloudDesktopPinningContextService.getContext();
						let contextModelInfo = _.find(context, {token: 'model.main'});
						if (contextModelInfo && contextModelInfo.info.indexOf('(Preview)') > -1) {
							if (service.pinModel) {
								const ids = {};
								$injector.get('modelProjectPinnableEntityService').appendId(ids, service.pinModel.id);
								$injector.get('modelProjectPinnableEntityService').pin(ids);
							} else {
								cloudDesktopPinningContextService.clearPinningItem('project.main');
							}
							if (service.pinProject) {
								const ids = {};
								$injector.get('projectMainPinnableEntityService').appendId(ids, service.pinProject.id);
								$injector.get('projectMainPinnableEntityService').pin(ids, dataService);
							}
						}
						service.currentPreviewModel = null;
					} catch (e) {
						console.log(e);
					}
				}

				function clearPinModel(dataService) {
					if (service.currentPreviewModel) {
						let doc = dataService.getSelected();
						if (!doc || (doc && service.currentPreviewModel !== doc.PreviewModelFk)) {
							setPreviewModelNull(dataService);
						}
					}
				}

				let tempTimeCheck = 0;

				function getDocumentTypeFk(doc, docService) {
					if (!doc && docService) {
						doc = docService.getSelected();
					}
					if (!doc) {
						return null;
					}
					if (doc.DocumentTypeFk) {
						return doc.DocumentTypeFk;
					}
					if (doc.PrjDocumentFk && docService && angular.isFunction(docService.parentService)) {
						let parentSelectItem = docService.parentService().getSelected();
						if (parentSelectItem && parentSelectItem.DocumentTypeFk) {
							return parentSelectItem.DocumentTypeFk;
						}
					}
					if (doc.PrjDocumentFk) {
						let config = $injector.get('documentsProjectDocumentModuleContext').getConfig();
						let parentService = $injector.get('documentsProjectDocumentDataService').getService(config);
						if (parentService && angular.isFunction(parentService.getList)) {
							let parentList = parentService.getList();
							let docEntity = _.find(parentList, {Id: doc.PrjDocumentFk});
							if (docEntity) {
								return docEntity.DocumentTypeFk;
							}
						}
					}
					return null;
				}

				function getFileExtension(doc) {
					if (doc && doc.OriginFileName) {
						return getExtension(doc.OriginFileName);
					}
					return '';
				}

				function getExtension(fileName) {
					return fileName ? (fileName.split('.').pop() || '').replace(/[*.\s]/g, '').toLowerCase() : '';
				}

				service.previewInViewerAgain = function (docService) {
					const doc = docService.getSelected();
					const extensionName = getFileExtension(doc);
					let docTypeItem = getDocTypeItem(doc, extensionName, docService);
					if (docTypeItem && !docTypeItem.Is2DModel) {
						return false;
					}
					if (doc.ModelJobState?.toString() === statusEnum.success) {
						debouncedPreviewHandler(doc.PreviewModelFk, docService);
					}
				};

				service.isPreview3DViewer = function preview3DViewer(doc, docService, $scope, flg) {
					let isPreviewBtn = flg === true;
					if (!doc) {
						isPreviewBtn = false;
						doc = docService.getSelected();
					}
					if (!doc || (service.currentPreviewModel && service.currentPreviewModel !== doc.PreviewModelFk)) {
						setPreviewModelNull(docService);
					}
					if (isPreviewBtn && flg) {
						return false;
					}
					const extensionName = getFileExtension(doc);
					let docTypeItem = getDocTypeItem(doc, extensionName, docService);
					if (docTypeItem && !(docTypeItem.Is2DModel || docTypeItem.Is3DModel)) {
						return false;
					}
					tempTimeCheck = 0;
					checkModelJobStatus(doc, docService);

					function checkModelJobStatus(doc, docService) {
						tempTimeCheck++;
						if (!doc || tempTimeCheck > 10 || isShortTimeCall(doc.Id)) {
							return;
						}
						const selDoc = docService.getSelected();
						if (selDoc?.Id !== doc.Id || (selDoc?.PreviewModelFk && unCheckStatus.includes(selDoc?.ModelJobState?.toString()))) {
							if (selDoc?.ModelJobState?.toString() === statusEnum.success) {
								debouncedPreviewHandler(selDoc.PreviewModelFk, docService);
							}
							return;
						}
						if (selDoc?.FileArchiveDocFk) {
							documentModelJobStateProgressService.getPreviewModelStatus(selDoc?.FileArchiveDocFk).then(handleJobStatusResponse);
						}
					}

					function handleJobStatusResponse(res) {
						const data = res.data || res;
						let sel = docService.getSelected();
						if (!data.JobState && !data.ModelFk) {
							return;
						}
						const jobState = data.JobState.toString();
						if (sel) {
							const needRefresh = sel.ModelJobState !== data.JobState || sel.PreviewModelFk !== data.ModelFk;
							sel.ModelJobState = data.JobState;
							sel.JobLoggingMessage = data.LoggingMessage;
							if (data.ModelFk) {
								sel.PreviewModelFk = data.ModelFk;
							}
							if (needRefresh) {
								docDataGridRefresh(docService);
							}
						}
						if (data.JobState.toString() === statusEnum.failed) {
							reConvertPreviewModel(doc, docService);
							tempTimeCheck = 0;
							return;
						}
						if (docTypeItem && sel) {
							keepPinModel();
							let toCheck = 0;
							if (docTypeItem.Is2DModel && doc.Id === sel.Id) {
								debouncedPreviewHandler(sel.PreviewModelFk, docService);
								if (isInProgress(sel || doc) || jobState === statusEnum.delConvert) {
									// check again when loading
									$timeout(() => checkModelJobStatus(doc, docService), 3500);
									toCheck = tempTimeCheck;
								}
							} else if (docTypeItem.Is3DModel) {
								$injector.get('modelViewerModelSelectionService').selectPreviewModel(sel.PreviewModelFk);
							}
							service.currentPreviewModel = sel.PreviewModelFk;
							tempTimeCheck = toCheck;
						} else if (tempTimeCheck < 10) {
							$timeout(() => checkModelJobStatus(doc, docService), 3000);
						}
					}

					return true;
				};

				service.clearPreviewWork = function (doc) {
					const previewModelId = modelSelectionService.getSelectedModelId();
					if (previewModelId && previewModelId !== doc.PreviewModelFk && modelSelectionService.isDocumentModeEnabled()) {
						modelSelectionService.clearSelection();
						service.currentPreviewModel = null;
					}
					$injector.get('modelWdeViewerAnnotationService').clearPreviewWorkState();
				};

				function reConvertPreviewModel(doc, docService) {
					if (doc && !isShortTimeCall(doc.Id, 3000)) {
						$http.post(globals.webApiBaseUrl + 'documents/projectdocument/reconvertpreviewmodel', doc).then(function (res) {
							const resData = res.data || res;
							let selDto = docService.getSelected();
							if (selDto) {
								selDto.ModelJobState = statusEnum.inProgress;
								selDto.PreviewModelFk = resData.PreviewModelFk;
								if (selDto.FileArchiveDocFk) {
									selDto.FileArchiveDocFk = resData.FileArchiveDocFk;
								}
								docDataGridRefresh(docService);
							}
							service.doRefreshWhenInProgress(docService);
						});
					}
				}

				function previewInViewer(previewModelFk, docService) {
					const modelId = modelSelectionService.getSelectedModelId();
					if ($injector.get('modelWdeViewerAnnotationService').getPreviewWorkState(previewModelFk) || (!!modelId && modelId === previewModelFk)) {
						return;
					}
					checkDocIsItwoSite(docService).then(function () {
						$injector.get('modelWdeViewerIgeService').isConverted(previewModelFk).then(function (res) {
							if (res.Converted || res.IsPdf) {
								modelSelectionService.previewDocument(previewModelFk);
								service.modelWdeViewerMarkupService.copyDataToAnnotation(previewModelFk, docService);
							} else {
								$http.get(globals.webApiBaseUrl + 'model/wdeviewer/info/checkdocumentconversion?modelId=' + previewModelFk).then(function (res) {
									let sel = docService.getSelected();
									if (sel && res) {
										sel.ModelJobState = res.data || res;
									}
								});
							}
						});
					});
				}

				function checkDocIsItwoSite(docService) {
					const deferred = $q.defer();
					const selDoc = docService.getSelected();
					const datengutFileId = selDoc.DatengutFileId || selDoc.ArchiveElementId;
					if (!selDoc || selDoc.ModelJobState?.toString() !== statusEnum.delConvert || !datengutFileId) {
						deferred.resolve(false);
						return deferred.promise;
					}
					$http.post(globals.webApiBaseUrl + 'documentsproject/revision/returnfilefromitwosite', {
						PreviewModelFk: selDoc.PreviewModelFk,
						DatengutFileId: datengutFileId,
						PrjDocumentFk: selDoc.PrjDocumentFk,
						FileArchiveDocFk: selDoc.FileArchiveDocFk,
						ModelJobState: selDoc.ModelJobState,
						Id: selDoc.Id,
					}).then(function () {
						deferred.resolve(true);
					});
					return deferred.promise;
				}

				function isValidPreviewModel(docTypeItem) {
					return docTypeItem && (docTypeItem.Is2DModel || docTypeItem.Is3DModel);
				}

				function getDocTypeItem(doc, extensionName, docService) {
					let docTypeItem = {};
					let documentTypes = getLookupData('DocumentType');
					if (!(extensionName?.length > 0) && doc) {
						extensionName = getFileExtension(doc);
					}
					const docTypeFk = getDocumentTypeFk(doc, docService);
					if (doc && docTypeFk && doc.FileArchiveDocFk) {
						docTypeItem = _.find(documentTypes, {Id: docTypeFk});
					} else if (doc && doc.OriginFileName && (extensionName?.length > 0)) {
						docTypeItem = _.find(documentTypes, function (item) {
							if (item.Extention && item.Extention.indexOf(extensionName) > -1) {
								return item;
							}
						});
					}
					return docTypeItem;
				}

				service.isRibArchive = function isRibArchive(prjDocumentTypeFk) {
					const loginCompanyFk = $injector.get('platformContextService').clientId;
					if (loginCompanyFk) {
						let companies = getLookupData('Company', loginCompanyFk);
						let company = _.find(companies, {Id: loginCompanyFk});
						if (company && company.IsRibArchive) {
							let prjDocumentTypes = getLookupData('ProjectDocumentTypeLookup');
							let prjDocumentType = _.find(prjDocumentTypes, {IsDefault: true});
							if (prjDocumentTypeFk) {
								prjDocumentType = _.find(prjDocumentTypes, {Id: prjDocumentTypeFk});
							}
							if (prjDocumentType && prjDocumentType.IsArchive) {
								return true;
							}
						}
					}
					return false;
				};

				function createPreviewModel(dataService, fileInfoArray) {
					let documentTypes = getLookupData('DocumentType');
					let supportedFileTypes = _.filter(documentTypes, docType => docType.Is2DModel || docType.Is3DModel)
						.flatMap(docType => docType.Extention || [])
						.map(ext => ext.toLowerCase());
					let fileIds = fileInfoArray
						.filter(item => supportedFileTypes.find(f => f.includes('*.' + getExtension(item.fileName))))
						.map(item => item.FileArchiveDocId);
					if (fileIds.length > 0) {
						let projectId = getProjectId(dataService);
						service.createPreviewModelFromDocs(fileIds, projectId).then(function () {
							let list = (dataService && dataService.getList) ? dataService.getList() : [];
							list.forEach(item => {
								if (fileIds.includes(item.FileArchiveDocFk)) {
									item.ModelJobState = statusEnum.inProgress;
								}
							});

							docDataGridRefresh(dataService);
							service.doRefreshWhenInProgress(dataService);
						});
					}
				}

				function isInProgress(entity) {
					if (service.isAutoConvert && entity && entity.ModelJobState === undefined) {
						const extensionName = getFileExtension(entity);
						let docTypeItem = getDocTypeItem(entity, extensionName);
						if (isValidPreviewModel(docTypeItem)) {
							return true;
						}
					}
					return entity && entity.ModelJobState !== null && entity.ModelJobState !== undefined
						&& converting.includes(entity.ModelJobState.toString());
				}

				service.doRefreshWhenInProgress = function doRefreshWhenInProgress(dataService) {
					if (!dataService) {
						return;
					}
					//callJobStateTime: Avoid repeated requests caused by the service being unturned
					service.callJobStateTime = service.callJobStateTime || 0;
					$timeout(function () {
						let items = dataService.getList();
						service.callJobStateTime++;
						if (items.some(i => isInProgress(i)) && service.callJobStateTime < 10) {
							service.getModelJobStates(dataService);
							service.doRefreshWhenInProgress(dataService);
						} else {
							service.callJobStateTime = 0;
						}
					}, 3000);
				}

				service.uploadPreviewModel = function uploadPreviewModel(dataService, fileInfoArray) {
					service.isAutoConvertModel().then(function (result) {
						if (result) {
							createPreviewModel(dataService, fileInfoArray);
						}
					});
				};

				service.isAutoConvertModel = function isAutoConvertModel() {
					const deferred = $q.defer();
					$injector.get('basicCustomizeSystemoptionLookupDataService').getParameterValueAsync(10130).then(function (result) {
						service.isAutoConvert = result && (result === '1' || result.toLowerCase() === 'true');
						deferred.resolve(service.isAutoConvert);
					});
					return deferred.promise;
				}

				return service;
			}
		]);
})(angular);