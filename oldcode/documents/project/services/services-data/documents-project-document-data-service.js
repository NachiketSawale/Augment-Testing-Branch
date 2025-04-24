/**
 * Created by frank baedeker on 21.08.2014.
 */
(function () {
	/* global globals , Platform , $, _ */
	'use strict';
	var moduleName = 'documents.project';

	/**
	 * @ngdoc service
	 * @name documentsProjectDocumentDataService
	 * @function
	 *
	 * @description
	 * projectMainService is the data service for all project related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('documentsProjectDocumentDataService',
		[
			'platformDataServiceFactory',
			'documentsProjectDocumentModuleContext',
			'documentProjectDocumentFilterService',
			'platformModuleDataExtensionService',
			'documentsProjectDocumentReadonlyProcessor',
			'$injector',
			'documentsProjectDocumentRelationReadonlyProcessorFactory',
			'basicsCommonFileDownloadService',
			'platformModalService',
			'$q',
			'$http',
			'documentProjectType',
			'platformDataServiceSelectionExtension',
			'basicsCommonMandatoryProcessor', '_', 'cxService', 'PlatformMessenger', 'moment', 'platformPermissionService',
			'$translate', 'cloudDesktopSidebarService', 'initApp', 'basicsLookupdataLookupDescriptorService', 'ServiceDataProcessDatesExtension',
			'basicsLookupdataLookupFilterService', 'platformDataServiceDataProcessorExtension', 'cloudDesktopPinningContextService',
			'projectDocumentNumberGenerationSettingsService', 'platformRuntimeDataService',
			'basicsCommonServiceUploadExtension', '$timeout', 'documentsProjectFileSizeProcessor',
			'platformModuleEntityCreationConfigurationService', 'platformDataServiceActionExtension', 'basicsPermissionServiceFactory','platformModuleStateService','platformDataServiceConfiguredCreateExtension',
			'platformGridAPI',
			function (platformDataServiceFactory,
				moduleContext,
				documentProjectDocumentFilterService,
				platformModuleDataExtensionService,
				documentsProjectDocumentReadonlyProcessor,
				$injector,
				relationReadonlyProcessorFactory,
				basicsCommonFileDownloadService,
				platformModalService,
				$q,
				$http,
				documentProjectType,
				platformDataServiceSelectionExtension,
				mandatoryProcessor, _, cxService, PlatformMessenger, moment, platformPermissionService, $translate,
				cloudDesktopSidebarService, initAppService, basicsLookupdataLookupDescriptorService, DatesProcessor,
				basicsLookupdataLookupFilterService,
				platformDataServiceDataProcessorExtension, cloudDesktopPinningContextService,
				projectDocumentNumberGenerationSettingsService, platformRuntimeDataService,
				basicsCommonServiceUploadExtension, $timeout, documentsProjectFileSizeProcessor,
				platformModuleEntityCreationConfigurationService, platformDataServiceActionExtension, basicsPermissionServiceFactory,platformModuleStateService,platformDataServiceConfiguredCreateExtension,
				platformGridAPI
			) {

				var documentProjectPermissionService = basicsPermissionServiceFactory.getService('documentProjectPermissionDescriptor');
				var serviceCache = {},
					dataCaches = {},// store using data in cur module(data:serviceContainer.data;)
					curUsingServiceCaches = {},// store using service in cur module(for getSelected..)
					curUsingColumnConfigCaches = {},// store using column config in cur module
					usingModuleChangedMessage = new Platform.Messenger(),// tell controller to change title
					selectionChangedFns = {},// store each sub modules 'moduleSelectionChanged' function
					SELECTIONCHANGED = 'SelectionChanged',// key, hard code
					subModules = [],// sub modules config
					titleCaches = {},
					filterKey = [];// filter key for back side server

				var preloadPermissions = ['f86aa473785b4625adcabc18dfde57ac'];
				var permissionCache = {};

				var isContainerConnected = false;
				var lastMainItemIdCaches = {};
				var containerConnectedCount = 0;

				var DocumentsMainName = 'documents.main';
				var IsFromDocumentsMain = false;
				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					useCurrentClient: null,
					includeNonActiveItems: null,
					includeChainedItems: true,
					showOptions: false,
					showProjectContext: false,
					withExecutionHints: false
				};
				var invoiceId;
				var billingId;
				// var createHistory = false;
				let lastClickedItem;
				let selectionChangedTimer;

				function loadPermissions() {
					// todo: this is only a workround to fixed change lookup add permision checked, it should be implement by using better solution to handle all lookup permisions.
					var requiredLoadPermissions = _.filter(preloadPermissions, function (p) {
						return !permissionCache[p];
					});
					return requiredLoadPermissions.length > 0 ? platformPermissionService.loadPermissions(requiredLoadPermissions) : $q.when([]);
				}

				// create new complete service
				function createNewComplete(options) {
					let initialDialogService = $injector.get('documentProjectCreationInitialDialogService');
					var parentService = options.parentService,
						serviceContainer,
						baseAddUsingContainer = null,
						service,
						serviceOptions = {
							flatRootItem: {
								module: angular.module(moduleName),
								serviceName: 'documentsProjectDocumentDataService',
								entityNameTranslationID: 'documents.project.title.headerTitle',
								entityInformation: {module: 'Documents.Project', entity: 'Document', specialTreatmentService: initialDialogService},
								httpCRUD: {
									route: globals.webApiBaseUrl + 'documents/projectdocument/final/',
									endCreate: 'createDocument',
									endDelete: 'deleteComplete',
									initReadData: initReadData,
									endRead: 'listDocuments',
									usePostForRead: true,
									extendSearchFilter: function (filterRequest) {
										var selectedItem;
										if (angular.isDefined(curUsingServiceCaches[moduleContext.getConfig().moduleName])) {
											selectedItem = curUsingServiceCaches[moduleContext.getConfig().moduleName].getSelected() || {Id: -1};
										} else {
											selectedItem = parentService.getSelected();
										}

										if (selectedItem && selectedItem.IsBidderDeniedRequest) {
											return;
										}

										if (selectedItem.EstHeader) {
											filterRequest.Pattern = 'EstHeaderFk' + '=' + selectedItem.EstHeader.Id;
										} else {
											if (filterKey.length > 0) {
												var filter = '';
												filterKey.forEach(function (item) {
													if (Object.prototype.hasOwnProperty.call(selectedItem, item.dataField)) {
														filter += item.documentField;
														filter += '=' + selectedItem[item.dataField];
														filter += ':';
													}
												});
												filterRequest.Pattern = _.trim(filter, ':');
											}
										}

									}
								},
								dataProcessor: [documentsProjectDocumentReadonlyProcessor, documentsProjectFileSizeProcessor,
									new DatesProcessor(['DocumentDate', 'ExpirationDate']),
									{
										processItem: processDocument,
										revertProcessItem: revertProcessDocument
									}
								],
								actions: {
									delete: true,
									create: 'flat',
									canCreateCallBackFunc: function () {
										if (IsFromDocumentsMain) {
											return false;
										}
										if (parentService !== undefined) {
											var selectedParentItem = parentService.getSelected();
											if (selectedParentItem && selectedParentItem.IsBidderDeniedRequest) {
												return false;
											}

											return !!parentService.getSelected();
										} else {
											return true;
										}

									},
									canDeleteCallBackFunc: function () {
										if (IsFromDocumentsMain) {
											return false;
										}
										var currentItem = service.getSelected();
										if(currentItem && currentItem.Version === 0){
											return true;
										}
										if (currentItem && currentItem.IsReadonly || !currentItem.CanDeleteStatus) {
											return false;
										}

										var selectedParentItem = parentService.getSelected();
										if (selectedParentItem && selectedParentItem.IsBidderDeniedRequest) {
											return false;
										}
										return true;
									}
								},
								presenter: {
									list: {
										handleCreateSucceeded: handleCreateSucceeded
									}
								},
								entityRole: {
									root: {
										itemName: 'Document',
										lastObjectModuleName: moduleName,
										handleUpdateDone: function (updateData, response) {
											serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
											service.onUpdateSucceeded.fire({
												updateData: updateData,
												response: response
											});
											service.refreshSelectedEntities();
										}
									}
								},
								sidebarSearch: {options: sidebarSearchOptions},
								sidebarWatchList: {active: true},
								entitySelection: {supportsMultiSelection: true},
								sidebarInquiry: {
									options: {
										active: true,
										moduleName: moduleName
									}

								},
								filterByViewer: true
							}
						};

					function create() {

						if (options.fromModuleName === DocumentsMainName) {
							IsFromDocumentsMain = true;
						}
						if (parentService !== undefined) {
							parentService.registerSelectionChanged(onParentItemSelectedChange);
						}

						serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

						var doCallHTTPCreate = serviceContainer.data.doCallHTTPCreate;
						serviceContainer.data.doCallHTTPCreate = function (creationData, data, onCreateSucceeded) {
							if (angular.isFunction(parentService.update)) {
								parentService.update().then(function () {
									doCallHTTPCreate(creationData, data, onCreateSucceeded);
								});
							} else {
								doCallHTTPCreate(creationData, data, onCreateSucceeded);
							}
						};

						serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
							typeName: 'DocumentDto',
							moduleSubModule: 'Documents.Project',
							validationService: 'documentProjectHeaderValidationService',
							mustValidateFields: ['PrjDocumentCategoryFk', 'PrjDocumentTypeFk', 'DocumentTypeFk']
						});
						if (!IsFromDocumentsMain) {
							serviceContainer.data.sidebarSearch = false;
						}
						dataCaches[options.moduleName] = serviceContainer.data;

						// fix module info error
						dataCaches[options.moduleName].showHeaderAfterSelectionChanged = null;
						baseAddUsingContainer = serviceContainer.data.addUsingContainer;
						lastMainItemIdCaches[options.moduleName] = {};

						// first load, fix load documents bug
						initDocuments();
					}

					function initReadData(readData) {
						// cause by filterbyviewer have this params
						var params = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(null);
						angular.extend(readData, params);
						var selectedItem;
						if (angular.isDefined(curUsingServiceCaches[moduleContext.getConfig().moduleName])) {
							selectedItem = curUsingServiceCaches[moduleContext.getConfig().moduleName].getSelected() || {Id: -1};
						} else {
							selectedItem = {Id: -1};
						}

						if (!selectedItem.Id) {
							selectedItem.Id = -1;
						}

						if (selectedItem.EstHeader) {
							readData.Pattern = 'EstHeaderFk' + '=' + selectedItem.EstHeader.Id;
							// readData.filter = '?mainItemId=' + selectedItem.EstHeader.Id + '&filterKey=' + filterKey;
						} else {
							if (filterKey.length > 0) {
								var filter = '';
								filterKey.forEach(function (item) {
									if (Object.prototype.hasOwnProperty.call(selectedItem, item.dataField)) {
										filter += item.documentField;
										filter += '=' + selectedItem[item.dataField];
										filter += ':';
									}
								});
								readData.Pattern = _.trim(filter, ':');
							}
						}
						if (IsFromDocumentsMain) {
							if (invoiceId) {
								readData.Pattern = 'InvHeaderFk=' + invoiceId;
							} else if (billingId) {
								readData.Pattern = 'BilHeaderFk=' + billingId;
							}
						}

						var selectedParentItem = parentService.getSelected();
						if (selectedParentItem && selectedParentItem.IsBidderDeniedRequest) {
							readData.Pattern = 'QtnHeaderFk' + '=' + 0;
						}

						if(service.parentService().getServiceName() === 'controllingGeneralcontractorCostControlDataService'){
							readData.ModuleName = service.parentService().getModule().name;
							let gccInvoice = $injector.get('controllingGeneralPrcInvoicesDataService').getSelected();
							if(!gccInvoice){
								readData.PinningContext = cloudDesktopPinningContextService.getContext();
								let dueDate = service.parentService().getSelectedDueDate() ? service.parentService().getSelectedDueDate():null;
								readData.FilterKeys = parentService.getMdcIds();
								if(!_.isNull(dueDate)){
									readData.FilterKeyName = 'dueDate =';
									readData.filter = dueDate;
								}
							} else {
								readData.Pattern = 'InvHeaderFk=' + gccInvoice.Id;
							}

						}
					}

					function onParentItemSelectedChange(e, entity) {
						if (selectionChangedTimer) {
							$timeout.cancel(selectionChangedTimer);
							selectionChangedTimer = null;
						}

						lastClickedItem = entity;
						$('#prjdocsaveerror').hide(); // fixed issue: #102608,confusing warning message of deleting contract
						if (!entity) {
							var moduleName = moduleContext.getConfig().moduleName;
							var data = dataCaches[moduleName];
							if (platformDataServiceSelectionExtension.supportSelection(data)) {
								platformDataServiceSelectionExtension.deselect(data);
							}
							lastMainItemIdCaches[moduleName] = {};
							data.clearContent(data);
							return;
						}

						var selectedItem = parentService.getSelected();
						if (!selectedItem) {
							return;
						}

						initDocuments();
					}

					function initDocuments() {

						// set filter Key
						var config = moduleContext.getConfig();

						setFilterKey(config);

						curUsingColumnConfigCaches[options.moduleName] = config.columnConfig;
						documentsProjectDocumentReadonlyProcessor.readonlyHandler(config.columnConfig);

						curUsingServiceCaches[options.moduleName] = parentService;
						var title = $translate.instant(config.title);
						usingModuleChangedMessage.fire(title);
						if (options.moduleName === config.moduleName) {
							titleCaches[options.moduleName] = title;
						}
						if (isContainerConnected) {
							doReadDocumentsData();
						}
						if (IsFromDocumentsMain) {
							doGetDocumentsData();
						}

					}

					create();

					documentProjectDocumentFilterService.registerFilters();
					service = serviceContainer.service;
					service.documentCreatedHandler = documentCreatedHandler;
					service.showInfoDialog = function showInfoDialog(infoData) {
						var modalOptions = {
							templateUrl: globals.appBaseUrl + 'procurement.common/partials/create-prcdocument-existinfo-dialog.html',
							backDrop: false,
							windowClass: 'form-modal-dialog',
							resizeable: true,
							headerTextKey: $translate.instant('basics.common.taskBar.info'),
							infoList: infoData,
							showYesButton: true,
							showNoButton: true
						};
						return platformModalService.showDialog(modalOptions);
					};

					function uploadFilesCallBack(currItem, data) {
						if (currItem === null || angular.isUndefined(currItem.Id)) {
							var args = {
								currItem: currItem,
								data: data
							};
							service.isSingle = false;
							service.filesHaveBeenUploaded.fire(null, args);
						} else {
							var arg = {
								currItem: currItem,
								data: data
							};
							service.dataList = serviceContainer.data.itemList;
							service.isSingle = true;
							service.filesHaveBeenUploaded.fire(null, arg);
						}
					}

					function handleCreateSucceeded(newData) {
						var curUsingService = curUsingServiceCaches[moduleContext.getConfig().moduleName];
						if (_.isEmpty(service.uploadCreateItem)) {
							if(platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data)){
								newData.IsFromDialog = true;
							}
							projectDocumentNumberGenerationSettingsService.assertLoaded().then(function () {
								platformRuntimeDataService.readonly(newData, [{
									field: 'Code',
									readonly: projectDocumentNumberGenerationSettingsService.hasToGenerateForRubricCategory(newData.RubricCategoryFk)
								}]);
								newData.Code = projectDocumentNumberGenerationSettingsService.provideNumberDefaultText(newData.RubricCategoryFk, newData.Code);
								var currentItem = service.getSelected();
								service.fireItemModified(currentItem);
							});

							var parentItem = curUsingService.getSelected();
							if (!parentItem) {
								return newData;
							}

							// set header item's value to document item
							documentCreatedHandler(newData, parentItem);

							// trigger header service modify, for save button
							// if (parentItem.Version === 0 && curUsingService.markCurrentItemAsModified) {
							// curUsingService.markCurrentItemAsModified();
							// }
							return newData;
						} else {
							service.uploadCreateItem.forEach(e => {
								serviceContainer.data.itemList.push(e);
							});
							service.markEntitiesAsModified(serviceContainer.data.itemList);
							serviceContainer.data.doUpdate(serviceContainer.data).then((res) => {
								if (res && res.Document) {
									let readData = {
										dtos: res.Document,
										FilterResult: null
									};
									serviceContainer.data.onReadSucceeded(readData, serviceContainer.data);
								}
							}).finally(() => {
								var parentState = platformModuleStateService.state(service.getModule());
								if (parentState && parentState.modifications) {
									parentState.modifications.EntitiesCount = 0;
								}
								service.isConfigurationDialog = true;
								service.uploadCreateItem = {};
							});
							return [];
						}
					}


					service.handleCreateSucceeded = handleCreateSucceeded;

					service.getColumnConfig = function () {
						if (curUsingColumnConfigCaches[options.moduleName]) {
							return curUsingColumnConfigCaches[options.moduleName];
						} else {
							var config = moduleContext.getConfig();
							return config.columnConfig;
						}
					};

					service.parentService = () => {
						return parentService;
					};
					service.isNeedUpdateSelf = true;
					service.filesHaveBeenUploaded = new PlatformMessenger();
					service.filesClear = new PlatformMessenger();
					service.registerListLoaded(function () {
						var documentList = service.getList();
						if (documentList.length > 0) {
							documentProjectType.getDocumentType().then(function (types) {
								if (types && types.length) {
									var selectList = _.filter(documentList, function (item) {
										if (item.DocumentTypeFk) {
											return _.find(types, {
												Id: item.DocumentTypeFk,
												support: true
											});
										}
									});
									if (selectList.length > 0) {
										service.updatePreviewDocument.fire(selectList[0]);
										service.updatePdfMarkerContainer.fire(null, selectList[0]);
									} else {
										service.updatePdfMarkerContainer.fire(null, null);
									}
								}
							});

						} else {
							service.updatePdfMarkerContainer.fire(null, null);
						}
					});

					service.addUsingContainer = addUsingContainer;

					service.createItemCx = function createProjectDocument(DocmentData) {
						var description = DocmentData.Name;
						if (description.length > 252) {
							description = description.substr(0, 252);
						}
						var creationData = {
							documentEntity:{
								DocumentTypeFk: 1000,
								Url: DocmentData.DocmentLink,
								Description: description
							}
						};
						$http.post(globals.webApiBaseUrl + 'documents/projectdocument/create', creationData).then(function (response) {
							if (serviceContainer.data.onCreateSucceeded) {
								return serviceContainer.data.onCreateSucceeded(response.data, serviceContainer.data, creationData);
							}
							return response.data;
						});
					};

					service.isReadOnly = function isReadOnly() {
						return documentsProjectDocumentReadonlyProcessor.isReadOnly();
					};

					service.updateReadOnly = function updateReadOnly(entity, readOnlyField, value, editField) {
						if (!entity) {
							return;
						}
						if (editField) {
							entity[editField] = value;
						}
						var readOnly = !service.getCellEditable(entity, readOnlyField);
						platformRuntimeDataService.readonly(entity, [{field: readOnlyField, readonly: readOnly}]);
					};

					service.getCellEditable = function (item, model) {
						var editable = true;

						if (model === 'DocumentTypeFk') {
							editable = !item.FileArchiveDocFk;
						}

						return editable;
					};
					let serverModuName;
					if (parentService !== undefined) {
						serverModuName = parentService.getModule().name;
					} else {
						serverModuName = moduleName + '-' + Math.random().toString().substr(2, 10);
					}
					let uploadOptions = {
						uploadFilesCallBack: uploadFilesCallBack,
						uploadServiceKey: serverModuName + '-' + 'documents-project-file-upload',
						canPreview: canPreview,
						uploadConfigs: {action: 'UploadWithCompress', SectionType: 'DocumentsProject'}
					};
					let prefixName = serverModuName.substring(0, serverModuName.indexOf('.'));
					if(prefixName === 'productionplanning' || prefixName === 'transportplanning'){
						uploadOptions.previewExtension = 'PpsCommonDocumentPreviewServiceExtension';
					}
					basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

					service.uploadFiles = upload;
					// service.showUploadFilesProgress = showUploadFilesProgress;
					service.uploadSingleFile = uploadSingleFile;
					service.downloadFiles = downloadFiles;
					service.getPreviewConfig = getPreviewConfig;
					service.canMultipleUploadFiles = canUploadFiles;
					service.canUploadFileForSelectedPrjDocument = canUploadFileForSelectedPrjDocument;
					service.canUploadFiles = canUploadFileForSelectedPrjDocument;
					service.canDownloadFiles = canDownloadFiles;
					service.canPreviewDocument = canPreview;

					service.uploadCreateItem = {};
					service.uploadedFileData = [];
					service.IsFromDataConfig = false;

					var createItem = angular.copy(service.createItem);
					service.createItem = function () {
						if (parentService) {
							// if the header has not been save, then show the warning message
							var parentSelectItem = parentService.getSelected();
							if (!!parentSelectItem && parentSelectItem.Version === 0) {
								$('#prjdocsaveerror').show();
								return;
							}
						}
						if (createItem) {
							platformModuleEntityCreationConfigurationService.load('documents.centralquery').then(() => {
								if (serviceContainer.data.hasOwnProperty('getModuleOfService')) {
									serviceContainer.data.getModuleOfService().name = 'documents.centralquery';
									createItem(null, serviceContainer.data);
								}
							});
						}
					};

					var onReadSucceeded = serviceContainer.data.onReadSucceeded;
					serviceContainer.data.onReadSucceeded = function incorporateDataRead(readData, data) {

						var dataRead = onReadSucceeded({
								dtos: readData.dtos,
								FilterResult: readData.FilterResult
							},
							data);

						// set readonly by main entity
						if (options.setReadOnlyByMainEntity && _.isFunction(options.setReadOnlyByMainEntity)) {
							let mainEntity = parentService.getSelected();
							options.setReadOnlyByMainEntity(mainEntity);
						}

						return dataRead;
					};

					const originalOnDeleteDone = serviceContainer.data.onDeleteDone;
					serviceContainer.data.onDeleteDone = function (deleteParams) {
						if (deleteParams.entities && deleteParams.entities.length > 0) {
							const selectionModelService = $injector.get('modelWdeViewerSelectionService');
							selectionModelService.deleteModels = selectionModelService.deleteModels ?? [];
							_.forEach(deleteParams.entities, function (entity) {
								selectionModelService.deleteModels.push(entity.PreviewModelFk);
							});
						}
						return originalOnDeleteDone.apply(this, arguments);
					};

					service.uploadMsgDialogId = $injector.get('platformCreateUuid')();
					var checkSameContextDialogService = $injector.get('documentProjectDocumentUploadCheckSameContextDialogService');
					serviceContainer.data.onCreateSucceeded = function onCreateSucceeded(newData, data) {
						if(platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data)){
							service.IsFromDataConfig = true;
						}
						 const deffered = $q.defer();
						if(service.uploadedFileData.length === 0){
							deffered.resolve(createFunction(newData, data));
						}else {
							var fileUploadDataService = $injector.get('documentsProjectDocumentFileUploadDataService');
							let parentEntity = service.getCurrentSelectedItem();
							let columnConfig = service.getColumnConfig();
							let parentEntityInfo = fileUploadDataService.setParentInfo(parentEntity);

							fileUploadDataService.asyncCreateDocumentOrUpdateRevision(service.uploadedFileData, service.extractZipOrNot, newData, parentEntityInfo,columnConfig,service.IsFromDataConfig).then(function (res) {
								if (!!res && !!res.data && !!res.data.dtos) {
									const resData = res.data.dtos;

									const docItemList = service.getList();
									let refreshItem = [];
									_.forEach(resData, function (docDto) {
										const docItem = docItemList.find(e => e.Id === docDto.Id);
										if (!docItem) {
											serviceContainer.data.itemList.push(docDto);
											serviceContainer.data.selectedItem = docDto;
										}
										refreshItem.push(docDto);
									});
									service.markEntitiesAsModified(serviceContainer.data.itemList);
									service.setSelectedEntities(refreshItem);
									service.refreshSelectedEntities().then(function () {
										service.gridRefresh();
										if(resData.length === 1) {
											service.setSelected(resData[0]);
										}
									});
									service.resetUploadData();
									service.filesClear.fire();
								}
							}, function () {
								service.filesClear.fire();
							});
						}
						return deffered.promise;
					};

					service.resetUploadData = function resetUploadData() {
						service.uploadCreateItem = {};
						service.uploadedFileData = [];
						service.IsFromDataConfig = false;
					}

					function createFunction(newData, data) {
						var newItem;
						if (checkSameContextDialogService.hasGroupingFilterFieldKey) {
							checkSameContextDialogService.hasGroupingFilterFieldKey = false;
						} else if ($injector.get('mainViewService').getCurrentModuleName() === 'documents.centralquery') {
							checkSameContextDialogService.getGroupingFilterFieldKey(newData);
						}
						if (service.handleCreateSucceeded) {
							newItem = service.handleCreateSucceeded(newData, data);// In case more data is send back from server it can be stripped down to the new item here.
							if (!newItem) {// Fall back, if no value is returned by handleCreateSucceeded
								newItem = newData;
							}
						} else {
							newItem = newData;
						}
						if (data.addEntityToCache) {
							data.addEntityToCache(newItem, data);
						}
						return data.handleOnCreateSucceeded(newItem, data);
					}

					function canUploadFiles() {
						if (parentService !== undefined) {
							var selectedProject = parentService.getSelected();
							if (selectedProject && selectedProject.IsBidderDeniedRequest) {
								return false;
							}
							return !!selectedProject && platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e');
						} else {
							return platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e');
						}

					}

					function canDownloadFiles() {
						var selectedEntities = service.getSelectedEntities();
						if(selectedEntities.length >= 2){
							return _.filter(selectedEntities, function(item) {
								return item.FileArchiveDocFk !== null;
							}).length > 0;
						}
						var currentItem = service.getSelected();
						if (currentItem) {
							return ($injector.get('basicsCommonDrawingPreviewDataService').checkDocumentCanPreview(service, currentItem, true) && 1000 !== currentItem.DocumentTypeFk) && platformPermissionService.hasRead('4eaa47c530984b87853c6f2e4e4fc67e');
						}
						return false;
					}

					function canPreview() {
						var currentItem = service.getSelected();
						if (currentItem) {
							return ($injector.get('basicsCommonDrawingPreviewDataService').checkDocumentCanPreview(service, currentItem) || 1000 === currentItem.DocumentTypeFk || currentItem.Url) && platformPermissionService.hasRead('4eaa47c530984b87853c6f2e4e4fc67e');
						}
						return false;
					}

					function canUploadFileForSelectedPrjDocument() {
						if (IsFromDocumentsMain) {
							return false;
						}
						var documentstatuss = basicsLookupdataLookupDescriptorService.getData('documentstatus');

						var currentItem = service.getSelected();
						if (_.isObject(currentItem)) {
							if (!currentItem.CanWriteStatus) {
								return false;
							}
							var hasCreatePermission = true;
							if (currentItem.PermissionObjectInfo === '') {
								hasCreatePermission = platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e');
							} else {
								hasCreatePermission = documentProjectPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e');
							}
							var currentStatus = _.find(documentstatuss, {Id: currentItem.PrjDocumentStatusFk});
							if (currentStatus !== undefined) {
								return !!currentItem && !currentStatus.IsReadonly && hasCreatePermission;
							} else {
								return !!currentItem && hasCreatePermission;
							}
						} else {
							return !!currentItem && hasCreatePermission;
						}
					}

					function getPreviewConfig(defaultEntity) {
						// Fixed #101548,defaultEntity, when select parent entity, it will load the documents and use the first one to preview
						var deffered = $q.defer();
						var currentItem = service.getSelected();
						if (defaultEntity !== undefined) {
							currentItem = defaultEntity;
						}
						var fileArchiveDocId = currentItem.FileArchiveDocFk;

						if (currentItem.Url) {
							if (currentItem.Url.indexOf('itwocx') > -1) {
								cxService.LoginCx().then(function (backdata) {
									var key = backdata.key;
									var url = currentItem.Url + '?k=' + key;
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
							if (currentItem.ArchiveElementId) {
								$http.get(globals.webApiBaseUrl + 'basics/common/document/previewdatengutfile?archiveElementId=' + currentItem.ArchiveElementId).then(function (result) {
									deffered.resolve({
										src: result.data,
										documentType: currentItem.DocumentTypeFk,
										title: currentItem.OriginFileName
									});
								});
							} else if (fileArchiveDocId) {
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

					/* function uploadFiles(scope) {
						if (angular.isFunction(parentService.update)) {
							parentService.update().then(function () {
								upload(scope);
							});
						} else {
							upload(scope);
						}

						function upload(scope) {
							var documentsProjectDocumentFileUploadDataService = $injector.get('documentsProjectDocumentFileUploadDataService');
							documentsProjectDocumentFileUploadDataService.gridFlag = '4EAA47C530984B87853C6F2E4E4FC67E';
							platformModalService.showDialog({
								templateUrl: globals.appBaseUrl + moduleName + '/partials/file-handler-lookup.html',
								scope: scope,
								backdrop: false
							});
						}
					} */

					function upload(option) {
						var fileUploadDataService = $injector.get('documentsProjectDocumentFileUploadDataService');
						fileUploadDataService.gridFlag = '4EAA47C530984B87853C6F2E4E4FC67E';
						var uploadService = service.getUploadService();
						let currItem = service.getSelected();
						const documentTypeItems = basicsLookupdataLookupDescriptorService.getData('DocumentType');
						let value = service.getExtension(documentTypeItems, currItem.DocumentTypeFk);
						uploadService.uploadFiles(currItem, value, option);
					}

					function uploadSingleFile(scope) {
						if (angular.isFunction(parentService.update)) {
							parentService.update().then(function () {
								upload(scope);
							});
						} else {
							upload(scope);
						}

						function upload(scope) {
							platformModalService.showDialog({
								templateUrl: globals.appBaseUrl + moduleName + '/partials/single-file-handler-lookup.html',
								scope: scope,
								backdrop: false
							});
						}
					}

					/* function showUploadFilesProgress(scope) {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + moduleName + '/partials/files-upload-progress.html',
							scope: scope,
							backdrop: false
						});
					} */

					function downloadFiles() {
						const entities = service.getSelectedEntities();
						basicsCommonFileDownloadService.canDownload(service, entities);
					}

					function addUsingContainer(guid) {
						baseAddUsingContainer(guid);
						doReadDocumentsData();
					}

					service.needToLockOrUnlockDocumentRevisionGrid = function (oldReferencedDocumentId, newReferencedDocumentId) {
						if (((oldReferencedDocumentId === 0 || oldReferencedDocumentId === null) && (newReferencedDocumentId !== 0 && newReferencedDocumentId !== null)) ||
							((oldReferencedDocumentId !== 0 && oldReferencedDocumentId !== null) && (newReferencedDocumentId === 0 || newReferencedDocumentId === null))) {
							if ((oldReferencedDocumentId === 0 || oldReferencedDocumentId === null) && (newReferencedDocumentId !== 0 && newReferencedDocumentId !== null)) {
								return {needToLockOrUnlock: true, lockOrUnlock: 'lock'};
							} else {
								return {needToLockOrUnlock: true, lockOrUnlock: 'unlock'};
							}
						} else {
							return {needToLockOrUnlock: false};
						}
					};

					service.lockOrUnlockUploadBtnAndGrid = new PlatformMessenger();

					service.updatePreviewDocument = new PlatformMessenger();
					service.updatePdfMarkerContainer = new PlatformMessenger();

					service.getServiceContainer = function () {
						return serviceContainer;
					};

					service.getSelectedProjectId = function () {
						var prjId = -1;
						var selectedItem;
						var project = cloudDesktopPinningContextService.getPinningItem('project.main');
						if (null !== project) {
							prjId = project.id;
						}
						var moduleName = moduleContext.getConfig().moduleName;
						if (angular.isDefined(curUsingServiceCaches[moduleContext.getConfig().moduleName])) {
							selectedItem = curUsingServiceCaches[moduleContext.getConfig().moduleName].getSelected() || {Id: -1};
						}
						var documentProject = service.getSelected();
						if (null !== selectedItem && moduleName === 'project.main') {
							prjId = selectedItem.Id;
						}
						if (documentProject && !_.isNull(documentProject.PrjProjectFk)) {
							prjId = documentProject.PrjProjectFk;
						}
						return prjId;
					};
					service.takeOver = function takeOver(entity) {
						var data = serviceContainer.data;
						var dataEntity = data.getItemById(entity.Id, data);
						if(dataEntity){
							entity.CanDeleteStatus = dataEntity.CanDeleteStatus;
							entity.CanWriteStatus = dataEntity.CanWriteStatus;
							data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
							data.markItemAsModified(dataEntity, data);
						}
					};

					service.getCurrentSelectedItem = getCurrentSelectedItem;
					service.onUpdateSucceeded = new PlatformMessenger();
					service.onUpdateDocCreateHistory = new PlatformMessenger();
					service.onPreviewDocCreateHistory = new PlatformMessenger();
					service.onDownloadDocCreateHistory = new PlatformMessenger();

					service.triggerParentClick = function (parentInfo) {
						if (lastClickedItem === parentInfo.clickedItem) {
							return;
						}
						lastClickedItem = parentInfo.clickedItem;

						if (moduleContext.getConfig().title === parentInfo.title) {
							selectionChangedTimer = $timeout(function () {
								onParentItemSelectedChange(null, parentInfo.clickedItem); // hope SelectionChanged event will response within 500ms
							}, 500);
						} else {
							let selChangedFn = selectionChangedFns[parentInfo.title + SELECTIONCHANGED];
							if (selChangedFn) {
								selectionChangedTimer = $timeout(function () {
									selChangedFn(null, parentInfo.clickedItem); // hope SelectionChanged event will response within 500ms
								}, 500);
							}
						}
					};

					service.tryGetTypeEntries = function doTryGetTypeEntries(modStorage) {
						return modStorage[serviceContainer.data.itemName + 'ToSave'];
					};
					return service;

					// ///////////////////
					function getCurrentSelectedItem() {
						var curModuleName = moduleContext.getConfig().moduleName;

						if (!curModuleName || !curUsingServiceCaches[curModuleName]) {
							return {};
						}

						var selected = curUsingServiceCaches[curModuleName].getSelected();
						return selected || {};
					}
				}

				// read documents data
				function doReadDocumentsData() {

					var curModuleName = moduleContext.getConfig().moduleName;

					if (!curModuleName || !curUsingServiceCaches[curModuleName]) {
						return;
					}

					var currentParentItem = curUsingServiceCaches[curModuleName].getSelected();
					var parentItemId,
						data = dataCaches[curModuleName];

					if (currentParentItem) {
						parentItemId = currentParentItem.Id;
					}

					if (parentItemId === undefined) {
						if (data.clearContent) {
							data.clearContent(data);
						}
						return;
					}

					if (!needToReadData(curModuleName, currentParentItem, data)) {
						return;
					}

					if (data) {// Data may be undefined, in this case just do nothing
						// If this check is not there, in project it is not possible to create any sub entity like schedule, location, cost code ...
						data.setFilter('mainItemId=' + parentItemId);
						// data.doReadData(data);
						loadPermissions().then(function () {
							data.doReadData(data);
						});
					}

					// ////////////////////////////////
					function needToReadData(curModuleName, currentParentItem, data) {
						var lastMainItemIdObj = lastMainItemIdCaches[curModuleName];
						var lastMainItemId = null;

						if (!currentParentItem || !data || currentParentItem.Id === undefined) {
							if (titleCaches[curModuleName] === lastMainItemIdObj.title) {
								lastMainItemIdObj.title = titleCaches[curModuleName];
							}
							lastMainItemIdObj.mainItemId = null;
							return false;
						}

						if (titleCaches[curModuleName] === lastMainItemIdObj.title) {
							lastMainItemId = lastMainItemIdObj.mainItemId;
							if (currentParentItem.EstHeader) {
								if (currentParentItem.EstHeader.Id === lastMainItemId) {
									return false;
								} else {
									lastMainItemIdObj.mainItemId = currentParentItem.EstHeader.Id;
								}
							} else {
								lastMainItemIdObj.mainItemId = currentParentItem.Id;
							}
						} else {
							lastMainItemIdObj.title = titleCaches[curModuleName];
							if (currentParentItem.EstHeader) {
								lastMainItemIdObj.mainItemId = currentParentItem.EstHeader.Id;
							} else {
								lastMainItemIdObj.mainItemId = currentParentItem.Id;
							}
						}

						if (currentParentItem && currentParentItem.IsBidderDeniedRequest) {
							return false;
						}

						return true;
					}
				}

				function doGetDocumentsData() {
					var Cdata;
					var curModuleName = moduleContext.getConfig().moduleName;

					if (!curModuleName || !curUsingServiceCaches[curModuleName]) {
						return;
					}
					Cdata = dataCaches[curModuleName];
					var errMsg = $translate.instant('documents.project.errorText', {ModuleName: curModuleName});
					if (IsFromDocumentsMain) {
						var appStartupInfo = initAppService.getStartupInfo();
						if (appStartupInfo && appStartupInfo.navInfo) {
							/** @namespace appStartupInfo.navInfo.invoiceid */
							invoiceId = appStartupInfo.navInfo.invoiceid;
							/** @namespace appStartupInfo.navInfo.billingid */
							billingId = appStartupInfo.navInfo.billingid;
						}
						if (invoiceId) {
							$http.get(globals.webApiBaseUrl + 'procurement/invoice/header/hasInvoice?id=' + invoiceId + '&company=' + appStartupInfo.navInfo.company).then(function (val) {
								if (val.data) {
									// Cdata.doReadData(Cdata);
									loadPermissions().then(function () {
										Cdata.doReadData(Cdata);
									});
								} else {
									platformModalService.showMsgBox(errMsg, 'error', 'ico-error');
								}

							});
						} else if (billingId) {
							$http.get(globals.webApiBaseUrl + 'sales/billing/getBilByIdandComany?id=' + billingId + '&company=' + appStartupInfo.navInfo.company).then(function (val) {
								if (val.data) {
									// Cdata.doReadData(Cdata);
									loadPermissions().then(function () {
										Cdata.doReadData(Cdata);
									});
								} else {
									platformModalService.showMsgBox(errMsg, 'error', 'ico-error');
								}

							});

						}
					}

				}

				/**
				 * document created, set header's key value to new document item
				 * @param document
				 * @param parentItem
				 */
				function documentCreatedHandler(document, parentItem) {
					(curUsingColumnConfigCaches[moduleContext.getConfig().moduleName] || []).forEach(function (column) {
						if (column.dataField && _.isNil(document[column.documentField])) {
							document[column.documentField] = dataFieldHandler(column.dataField, parentItem);
						}

						if (column.projectFkField && _.isNil(document.PrjProjectFk)) {
							document.PrjProjectFk = dataFieldHandler(column.projectFkField, parentItem);
						}

						if (column.lgmJobFkField && _.isNil(document.LgmJobFk)) {
							document.LgmJobFk = dataFieldHandler(column.lgmJobFkField, parentItem);
						}
					});
					if (document.MdcControllingUnitFk === null && parentItem.ControllingUnitFk !== null) {
						document.MdcControllingUnitFk = parentItem.ControllingUnitFk;
					}
					if(!_.isNil(parentItem.ConHeaderFk) && _.isNil(document.ConHeaderFk)){
						document.ConHeaderFk = parentItem.ConHeaderFk;
					}
					setProjectFk(document, parentItem);
				}

				// in case of prcHeaderEntity.StructureFk
				function dataFieldHandler(dataField, parentItem) {
					var fields = dataField.split('.'),
						len = fields.length,
						i = 0,
						field;
					if (len === 1) {
						var fieldValue = parentItem[dataField];
						if (fieldValue === 0) {
							fieldValue = null;
						}
						return fieldValue;
					}

					var result = angular.copy(parentItem);

					for (; i < len; i++) {
						field = fields[i];
						// in case of undefined
						if (result[field] === void (0)) {
							return null;
						}

						result = result[field];
					}

					return result;
				}

				function setProjectFk(document, parentItem) {
					if (parentItem.ModelFk !== null && document.PrjProjectFk === null && parentItem.ModelFk !== undefined) {
						let modelUrl = $injector.get('modelWdeViewerIgeService').getModelInfoUrl('model/project/model/getbyid?id=');
						$http.get(globals.webApiBaseUrl + modelUrl + parentItem.ModelFk).then(function (res) {
							let resData = (res && res.data) ? res.data : res;
							if (resData) {
								document.PrjProjectFk = resData.ProjectFk ? resData.ProjectFk : resData.PrjProjectFk;
								if (document.PrjLocationFk === null) {
									document.PrjLocationFk = parentItem.LocationFk;
								}
							}

						});
					}
				}

				// register sub module selection changed event
				function registerSubModuleSelectionChanged() {
					subModules.forEach(function (subModule) {

						var leadingService = _.isString(subModule.service) ? $injector.get(subModule.service) : subModule.service;

						if (leadingService) {

							selectionChangedFns[subModule.title + SELECTIONCHANGED] = function (e, entity) {
								if (selectionChangedTimer) {
									$timeout.cancel(selectionChangedTimer);
									selectionChangedTimer = null;
								}

								// this will stop capture
								if (!entity) {
									return;
								}

								setFilterKey(subModule);

								curUsingColumnConfigCaches[moduleContext.getConfig().moduleName] = subModule.columnConfig;
								documentsProjectDocumentReadonlyProcessor.readonlyHandler(subModule.columnConfig);

								curUsingServiceCaches[moduleContext.getConfig().moduleName] = leadingService;

								usingModuleChangedMessage.fire(subModule.title);
								titleCaches[moduleContext.getConfig().moduleName] = subModule.title;

								if (isContainerConnected) {
									doReadDocumentsData();
								}
							};

							leadingService.registerSelectionChanged(selectionChangedFns[subModule.title + SELECTIONCHANGED]);
						}
					});
				}

				// unRegister sub module selection changed event
				function unRegisterSubModuleSelectionChanged() {
					subModules.forEach(function (subModule) {
						var leadingService = _.isString(subModule.service) ? $injector.get(subModule.service) : subModule.service;
						if (leadingService) {
							leadingService.unregisterSelectionChanged(selectionChangedFns[subModule.title + SELECTIONCHANGED]);
						}
					});
				}

				// register from here
				function register(options) {
					if (!options.moduleName || !options.parentService || !options.columnConfig) {
						throw new Error('Please Set The Document Project Configuration.');
					}

					moduleContext.setConfig(options);

					if (options.subModules) {
						subModules.length = 0;
						subModules = options.subModules;
					}

					registerSubModuleSelectionChanged();

					setFilterKey(options);

					$injector.get('platformTranslateService').registerModule(moduleName);
				}

				// if sub module exist, please unRegister it
				function unRegister() {
					unRegisterSubModuleSelectionChanged();
					subModules.length = 0;
					selectionChangedFns = {};
				}

				// filterKey is for back side server's filterString
				function setFilterKey(config) {
					filterKey = [];
					if (config.columnConfig) {
						config.columnConfig.forEach(function (column) {
							if (column.dataField) {
								if (column.dataField === 'Id' || column.dataField.search('.Id') !== -1) {
									filterKey.push({documentField: column.documentField, dataField: column.dataField});
								}
							}
						});
					}
					if (config.otherFilter && _.isArray(config.otherFilter)) {
						config.otherFilter.forEach(function (item) {
							filterKey.push(item);
						});
					}
				}

				// get service or create service by module name
				function getService(serviceOptions) {
					if (serviceOptions.moduleName === 'documents.centralquery') {
						return $injector.get('documentCentralQueryDataService');
					}
					if (!serviceCache[serviceOptions.moduleName]) {
						serviceCache[serviceOptions.moduleName] = createNewComplete(serviceOptions);
					}
					return serviceCache[serviceOptions.moduleName];
				}

				// module change, tell controller to change title
				function registerModuleChangedMessage(fn) {
					usingModuleChangedMessage.register(fn);
				}

				function unRegisterModuleChangedMessage(fn) {
					usingModuleChangedMessage.unregister(fn);
				}

				function setIsContainerConnected(flag) {
					if (flag) {
						if (containerConnectedCount === 0) {
							isContainerConnected = flag;
						}
						containerConnectedCount += 1;
					} else {
						if (containerConnectedCount === 1) {
							isContainerConnected = flag;
						}
						containerConnectedCount -= 1;
					}
				}

				function revertProcessDocument(item) {
					if (item.Version === 0 && projectDocumentNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
						item.Code = '';
					}
				}

				function processDocument(item) {
					if (moduleContext.getConfig().processors && moduleContext.getConfig().processors.length > 0) {
						_.forEach(moduleContext.getConfig().processors, function (proc) {
							proc.processItem(item);
						});
					}
					var fields = [];
					if (projectDocumentNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
						fields.push({field: 'Code', readonly: true});
					}
					if (fields.length > 0) {
						platformRuntimeDataService.readonly(item, fields);
					}
					// readOnly when the ribArchive file send/callback to itwoSite
					platformRuntimeDataService.readonly(item, [
						{field: 'PrjDocumentCategoryFk', readonly: item.IsLockedType === true},
						{field: 'PrjDocumentTypeFk', readonly: item.IsLockedType === true}]);
				}

				var filters = [
					{
						key: 'documents-project-rubriccategory-by-rubric-filter',
						fn: function (context) {
							return context.RubricFk === 40 || (!_.isNil(context.RubricCategoryFk) && context.RubricCategoryFk === 40); // 40 is for documents project
						}
					},
					{
						key: 'basics-document-category-type-filter',
						fn: function (context, item) {
							return context.RubricCategoryFk === item.RubricCategoryFk || (!_.isNil(context.PrjDocumentCategoryFk) && context.PrjDocumentCategoryFk === item.RubricCategoryFk);
						}
					}];
				basicsLookupdataLookupFilterService.registerFilter(filters);
				return {
					getService: getService,
					registerModuleChangedMessage: registerModuleChangedMessage,
					unRegisterModuleChangedMessage: unRegisterModuleChangedMessage,
					getCurTitle: function (moduleName) {
						return titleCaches[moduleName];
					},
					register: register,
					unRegister: unRegister,
					setIsContainerConnected: setIsContainerConnected
				};
			}]);
})();
