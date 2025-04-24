(function (angular) {
	'use strict';
   /* global globals */
	var moduleName = 'productionplanning.common';
	var masterModule = angular.module(moduleName);

	masterModule.factory('ppsCommonDocumentCombineDataServiceFactory', PpsDocumentDataServiceFactory);

	PpsDocumentDataServiceFactory.$inject = [
		'$injector',
		'PlatformMessenger',
		'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonBaseDataServiceBasicExtension',
		'basicsCommonServiceUploadExtension',
		'documentsProjectDocumentFileUploadDataService',
		'productionplanningCommonDocumentDataProcessor',
		'$q',
		'$http',
		'productionplanningCommonDocumentDataServiceSyncManager',
		'platformDataValidationService',
	'ppsCommonDocumentCombineConfig',
	'$translate'];

	function PpsDocumentDataServiceFactory($injector,
		PlatformMessenger,
		platformDataServiceFactory,
		basicsLookupdataLookupDescriptorService,
		basicsCommonBaseDataServiceBasicExtension,
		basicsCommonServiceUploadExtension,
		documentsProjectDocumentFileUploadDataService,
		dataProcessor,
		$q,
		$http,
		DataServiceSyncManager,
		platformDataValidationService,
		ppsCommonDocumentCombineConfig,
		$translate) {
		var serviceFactroy = {};
		var serviceCache = {};
		var ONGRIDCLICK = 'OnGridClick';

		serviceFactroy.createNewComplete = function createNewComplete(serviceOptions) {
			var uploadDone = new PlatformMessenger();
			var config = ppsCommonDocumentCombineConfig[serviceOptions.containerId];
			var parentSrv = $injector.get(config.parentService);
			var curParentName = config.parentService;
			var idProperty = config.columnConfig.dataField;
			var foreignKey = config.columnConfig.documentField;
			var customHandleCreateSucceedCallback = config.handleCreateSucceedCallback;
			var lastClickItemCaches = {};
			var clickItem = {};
			var fromClick = false;

			var serviceOption = {
				flatNodeItem: {
					module: masterModule,
					dataProcessor: [dataProcessor],
					entityNameTranslationID: 'productionplanning.common.document.documentTitle',
					serviceName: parentSrv.getServiceName() + 'PpsDocumentDataService',
					httpCRUD:{
						route: globals.webApiBaseUrl + 'productionplanning/common/ppsdocument/',
						endRead: 'list',
						initReadData: function initReadData(readData) {
							if(service.curParent){
								var mainItemId = fromClick? (clickItem[idProperty] || -1) : (service.curParent.getSelected()[idProperty] || -1);
								if(fromClick){
									fromClick = false;
								}
								readData.filter = '?foreignKey=' + foreignKey + '&mainItemId=' + mainItemId;
							}
						}
					},
					actions: {
						delete: true,
						create: 'flat',
						canCreateCallBackFunc: function (entity, data) {
							if(!service.curParent){
								return false;
							}
							var canCreate = !!_.get(service.curParent.getSelected(), idProperty);
							if (canCreate && service.curParent.canDocCreateCallBackFunc) {
								canCreate = service.curParent.canDocCreateCallBackFunc(entity, data);
							}
							return canCreate;
						}
					},
					entityRole: {
						node: {
							itemName: 'PpsDocument',
							parentService: parentSrv
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								var result = readData.Main ? assembleHttpResult(readData) : readData;
								return serviceContainer.data.handleReadSucceeded(result, data);
							},
							initCreationData: function initCreationData(creationData, data) {
								if(!service.curParent){
									return;
								}
								creationData.mainItemId = service.curParent.getSelected()[idProperty];
								creationData.foreignKey = foreignKey;
							},
							handleCreateSucceeded: function (newData, data) {
								if(service.curParent){
									let parentSelected = service.curParent.getSelected();
									newData[foreignKey] = parentSelected[idProperty];
									if(_.isFunction(customHandleCreateSucceedCallback)){
										customHandleCreateSucceedCallback(newData, parentSelected);
									}
								}
								return newData;
							}
						}
					}
				}
			};

			function assembleHttpResult(readData) {
				var result = {
					FilterResult: readData.FilterResult,
					dtos: readData.Main || []
				};
				basicsLookupdataLookupDescriptorService.attachData(readData);
				_.forEach(readData.Main, function (dto) {
					dto.CanUpload = true;
				});
				return result;
			}

			/* jshint -W003 */
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption); // jshint ignore:line

			var service = serviceContainer.service;

			service.curParent = parentSrv;

			serviceContainer.data.newEntityValidator = newEntityValidator();

			function newEntityValidator() {
				return {
					validate: function validate(entity) {
						if (entity.Version === 0) {
							var validService = $injector.get('productionplanningCommonDocumentValidationService').getValidationService(service, serviceOptions.containerId);
							validService.validateDocumentTypeFk(entity, (entity.DocumentTypeFk === 0) ? null : entity.DocumentTypeFk, 'DocumentTypeFk');
						}
					}
				};
			}

			var uploadOptions = {
				uploadServiceKey: parentSrv.getServiceName() + '.ppsdocument',
				uploadConfigs: {SectionType: 'PpsDocument', appId: '1F45E2E0E33843B98DEB97DBD69FA218'},
				uploadFilesCallBack: uploadFilesCallBack,
				canPreview: true,
				previewExtension: 'PpsCommonDocumentPreviewServiceExtension'
			};

			service.fileHasBeenUploadedBeforeCreatingDocument = new PlatformMessenger();
			service.multiCreateByUploadedFiles = function (fileInfoArray) {
				var creationDataArray = [];
				_.each(fileInfoArray, function (fileInfo) {
					var item = {mainItemId: service.curParent.getSelected().Id, foreignKey: foreignKey};
					var documentType =	documentsProjectDocumentFileUploadDataService.getDocumentType(fileInfo);
					if (!_.isNull(documentType) && _.has(documentType, 'Id')) {
						item.DocumentTypeFk = documentType.Id;
					}
					item.FileArchiveDocFk = fileInfo.FileArchiveDocId;
					var fileName = fileInfo.fileName;
					if (angular.isString(fileName) && fileName.length > 42) {
						item.OriginFileName = fileName.substr(0, 42);
					} else {
						item.OriginFileName = fileName;
					}
					item.CanUpload = true;
					creationDataArray.push(item);
				});

				$http.post(globals.webApiBaseUrl + 'productionplanning/common/ppsdocument/multicreate', creationDataArray).then(function (response) {
					if (response.data) {
						_.each(response.data, function (item) {
							serviceContainer.data.onCreateSucceeded(item, serviceContainer.data);
						});
					}
				});
			};

			basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);
			basicsCommonBaseDataServiceBasicExtension.addBasics(serviceContainer);
			service.updateLoadedDocument = updateLoadedDocument;
			service.uploadAndCreateItem = uploadAndCreateItem;
			service.uploadMultipleFiles = uploadAndCreateItem;
			service.canMultipleUploadFiles = function () {
				return serviceOption.flatNodeItem.actions.canCreateCallBackFunc(service.curParent.getSelected(), serviceContainer.data);
			};

			/**
			 * @ngdoc function
			 * @name getCellEditable
			 * @function
			 * @methodOf procurement.common.procurementCommonDocumentCoreDataService
			 * @description get editable of model
			 * @returns boolean
			 */
			service.getCellEditable = function (item, model) {
				var editable = true;

				if (model === 'DocumentTypeFk') {
					editable = !item.FileArchiveDocFk;
				}

				return editable;
			};

			service.registerUploadDone = function (callback) {
				uploadDone.register(callback);
			};

			function uploadAndCreateItem() {
				var deferred = $q.defer();
				service.uploadFiles(null, {})
					.then(function (file) {
						file.isCreatingDocumentByFuncUploadAndCreateItem = true;
						return service.createItem().then(function (document) {
							let documentType = documentsProjectDocumentFileUploadDataService.getDocumentType(file);
							document.DocumentTypeFk = documentType.Id;
							serviceContainer.data.newEntityValidator.validate(document);

							document.FileArchiveDocFk = file.FileArchiveDocId;
							document.OriginFileName = file.fileName;
							deferred.resolve(document);
							uploadDone.fire(null, file);
						});
					});
				return deferred.promise;
			}

			function uploadFilesCallBack(currItem, data) {
				if(service.isDragOrSelect==='drag')
				{
					var args = {currItem: currItem, data: data};
					service.fileHasBeenUploadedBeforeCreatingDocument.fire(null, args);
					return;
				}
				// remark: because at the moment, we only drap&drop file to create&upload document,
				// so here we use flag service.isDragOrSelect for checking if it's in create&upload.

				if (_.isNil(currItem) || _.isEmpty(currItem)) {
					if (!data.isCreatingDocumentByFuncUploadAndCreateItem) { // HACK: use flag isCreatingDocumentByFuncUploadAndCreateItem for being compatible with case about creating document in own callback (like upload&create stacklist document in bundle container) by zwz 2020/1/10.
						//if it upload multiple files and create documents or drap to create documents
						var args = {currItem: currItem, data: data};
						service.fileHasBeenUploadedBeforeCreatingDocument.fire(null, args);
					}
				} else {
					updateLoadedDocument(currItem, data);
					dataProcessor.processItem(currItem);
					uploadDone.fire(null, data);
				}
			}

			function updateLoadedDocument(item, data) {
				let documentType = documentsProjectDocumentFileUploadDataService.getDocumentType(data);
				// if (documentType && !item.DocumentTypeFk) {
				item.DocumentTypeFk = documentType.Id;
				serviceContainer.data.newEntityValidator.validate(item);
				// }
				item.FileArchiveDocFk = data.FileArchiveDocId;
				var fileName = data.fileName;
				if (angular.isString(fileName) && fileName.length > 42) {
					item.OriginFileName = fileName.substr(0, 42);
				} else {
					item.OriginFileName = fileName;
				}
				item.CanUpload = true;
				service.updateLoadedItem(item);
				service.markItemAsModified(item);
			}

			service.getService = function () {
				return service.curParent;
			};

			service.createItemByTypeId = function (typeId, produceDescription, file) {
				var deffered = $q.defer();
				if (produceDescription) {
					var description = file.fileName.substr(0, 42);
					var shownItem = _.find(serviceContainer.service.getList(), {Description: description});//find in ui
					if (!shownItem) {
						serviceContainer.service.loadSubItemList().then(function (items) {//find in db
							var existingItem = _.find(items, {Description: description});
							if (!existingItem) {
								$http.post(globals.webApiBaseUrl + 'productionplanning/common/ppsdocument/create', {
									mainItemId: produceDescription.Id, foreignKey: foreignKey
								}).then(function (response) {
									var newItem = response.data;
									newItem.DocumentTypeFk = typeId;
									newItem.OriginFileName = newItem.Description = description;
									newItem.FileArchiveDocFk = file.FileArchiveDocId;
									serviceContainer.data.unloadSubEntities(serviceContainer.data);
									serviceContainer.data.storeCacheFor(produceDescription, serviceContainer.data);
									serviceContainer.data.selectedItem = newItem;
									serviceContainer.data.onCreateSucceeded(newItem, serviceContainer.data);
									deffered.resolve(newItem);
								});
							} else {
								serviceContainer.data.unloadSubEntities(serviceContainer.data);
								serviceContainer.data.selectedItem = existingItem;
								serviceContainer.data.selectionChanged.fire(null, existingItem);
								deffered.resolve(existingItem);
							}
						});
					} else {
						serviceContainer.data.selectedItem = shownItem;
						deffered.resolve(shownItem);
					}
				}
				return deffered.promise;
			};

			var syncManager = new DataServiceSyncManager(serviceOptions, service);
			syncManager.syncDocumentAndRevision();

			service.onUpdateToolsEvent = new PlatformMessenger();

			service.clearModifications = function () {
				service.clearCache();
				var flattened = service.getList();
				platformDataValidationService.removeDeletedEntitiesFromErrorList(flattened, service);
				serviceContainer.data.doClearModifications(flattened, serviceContainer.data);
			};

			var originAssertTypeEntries = service.assertTypeEntries;
			service.assertTypeEntries = function (modStorage) {
				originAssertTypeEntries(modStorage);
				var parentSelected = service.curParent.getSelected();
				if (parentSelected) {
					modStorage.DocEntityId = parentSelected[idProperty];
				}
			};

		service.setConfig = function (moduleName, parentSrvName, selectedItem)
		{
			if(curParentName !==  parentSrvName){
				var columnCfg = {};
				if(parentSrvName === config.parentService){
					columnCfg = config.columnConfig;
					customHandleCreateSucceedCallback = config.handleCreateSucceedCallback;
				} else{
					var modulecfg = _.find(config.subModules, function (module){
						return module.service === parentSrvName;
					});
					if(modulecfg){
						columnCfg = modulecfg.columnConfig;
						customHandleCreateSucceedCallback = modulecfg.handleCreateSucceedCallback;
					}
				}
				curParentName = parentSrvName;
				service.curParent = $injector.get(parentSrvName);
				idProperty = columnCfg.dataField;
				foreignKey = columnCfg.documentField;

				if(lastClickItemCaches[curParentName] === selectedItem.Id){
					fromClick = true;
					clickItem = selectedItem;
					serviceContainer.data.doReadData(serviceContainer.data);
				}
			}
			lastClickItemCaches[curParentName] = selectedItem.Id;
		};
			return service;
		};

		//get service or create service by module name
		serviceFactroy.getService = function getService(serviceOptions) {
			var containerId = serviceOptions.containerId;
			if (!serviceCache[containerId]) {
				serviceCache[containerId] = serviceFactroy.createNewComplete(serviceOptions);
			}
			return serviceCache[containerId];
		};

		serviceFactroy.setConfig = function (containerId, parentSrvName, selectedItem){
			var documentSrv = serviceFactroy.getService({containerId: containerId});
			if(documentSrv){
				documentSrv.setConfig(containerId, parentSrvName, selectedItem);
			}
		};
		return serviceFactroy;
	}
})(angular);

