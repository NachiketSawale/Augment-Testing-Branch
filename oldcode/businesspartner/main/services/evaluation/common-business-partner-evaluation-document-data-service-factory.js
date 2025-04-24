/**
 * Created by wed on 12/13/2018.
 */

(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationDocumentDataServiceFactory', [
		'_',
		'$q',
		'platformDataServiceFactory',
		'platformDataServiceDataProcessorExtension',
		'platformRuntimeDataService',
		'ServiceDataProcessDatesExtension',
		'basicsCommonServiceUploadExtension',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonFileUploadServiceLocator',
		'$http',
		'PlatformMessenger',
		'commonBusinessPartnerEvaluationServiceCache',
		function (_,
			$q,
			platformDataServiceFactory,
			platformDataServiceDataProcessorExtension,
			platformRuntimeDataService,
			ServiceDataProcessDatesExtension,
			basicsCommonServiceUploadExtension,
			basicsLookupdataLookupDescriptorService,
			basicsCommonFileUploadServiceLocator,
			$http,
			PlatformMessenger,
			serviceCache) {

			function createService(serviceDescriptor, evaluationDetailService, options) {

				if (serviceCache.hasService(serviceCache.serviceTypes.DOCUMENT_DATA, serviceDescriptor)) {
					return serviceCache.getService(serviceCache.serviceTypes.DOCUMENT_DATA, serviceDescriptor);
				}
				var hasWrite = true;
				var createOptions = angular.merge({
						moduleName: moduleName
					}, options),
					serviceOption = {
						flatNodeItem: {
							module: angular.module(createOptions.moduleName),
							serviceName: serviceCache.getServiceName(serviceCache.serviceTypes.DOCUMENT_DATA, serviceDescriptor),
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/main/evaluationdocument/',
								endRead: 'listbyparent',
								usePostForRead: true,
								initReadData: function initReadData(readData) {
									let header = evaluationDetailService.getSelected();
									readData.PKey1 = header ? header.Id : null;
								}
							},
							httpCreate: {
								route: globals.webApiBaseUrl + 'businesspartner/main/evaluationdocument/',
							},
							actions: {
								create: 'flat',  // set status for the create button
								canCreateCallBackFunc: function canCreateCallBackFunc() {
									return checkReadOnly();
								},
								delete: {},  // set status for the delete button
								canDeleteCallBackFunc: function canDeleteCallBackFunc() {
									return checkReadOnly();
								}
							},
							presenter: {
								list: {
									incorporateDataRead: function incorporateDataRead(readItems, data) {
										data.itemList.length = 0;
										var items = readItems.Main;
										if (evaluationDetailService.view) {
											// var localEvaluationData = evaluationDetailService.collectLocalEvaluationData.fire();
											var localEvaluationData = evaluationDetailService.collectLocalEvaluationDataScreen.fire();
											if (localEvaluationData && localEvaluationData.EvaluationDocumentToSave) {
												_.forEach(localEvaluationData.EvaluationDocumentToSave, function (item) {
													var saveData = _.find(items, {Id: item.MainItemId});
													if (!saveData) {
														items.push(item.EvaluationDocument);
													}
												});
											}
										}
										var isCreate = !items || items.length <= 0;
										updateItemsSource(isCreate);
										_.each(items, function iterator(item) {
											data.itemList.push(item);
										});
										items.forEach(function (item) {
											processItemReadonly(item, data);
										});
										platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);
										data.listLoaded.fire(items);
										return data.itemList;
									},
									initCreationData: function initCreationData(creationData) {
										let header = evaluationDetailService.getSelected();
										creationData.PKey1 = header.Id;
									}
								}
							},
							entityRole: {
								node: {
									itemName: 'EvaluationDocument',
									parentService: evaluationDetailService
								}
							},
							dataProcessor: [new ServiceDataProcessDatesExtension(['DocumentDate'])]

						}
					};
				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;
				var data = serviceContainer.data;
				var uploadOptions = {
					uploadServiceKey: evaluationDetailService.getServiceName() + '.common.document',
					uploadConfigs: {
						SectionType: 'Evaluation',
						createForUploadFileRoute: 'businesspartner/main/evaluationdocument/createforuploadfile',
					},

					canPreview: true
				};

				Object.defineProperties(service, {
					'hasWrite': {
						get: function () {
							return hasWrite;
						},
						set: function (value) {
							hasWrite = value;
						},
						enumerable: true
					}
				});

				evaluationDetailService.evaluationSchemaChangedMessenger.register(evaluationSchemaChangedHandler);
				service.unregisterUploadFinishedHandler = null;

				function evaluationSchemaChangedHandler() {
					var parentService = serviceContainer.service.parentService();
					if (parentService.create) {
						updateItemsSource(true);
					} else if (parentService.view) {
						serviceContainer.service.loadSubItemList();
					}
				}

				function updateItemsSource(isCreate) {
					var uploadServiceKey = uploadOptions.uploadServiceKey;
					var uploadService = basicsCommonFileUploadServiceLocator.getService(uploadServiceKey);
					if (!isCreate) {
						var newValue = uploadService.getAllItemsSource();
						var evaluationSelected = evaluationDetailService.getSelected();
						if (evaluationSelected && evaluationSelected.Id) { // about the business partner evaluation dialog document upload
							var filterByEvaluationId = _.filter(newValue, function (item) {
								return item.entity.EvaluationFk === evaluationSelected.Id;
							});
							uploadService.setItemsSource(filterByEvaluationId);
						}
					} else {
						uploadService.setItemsSource([]);
					}
				}

				function processItemReadonly(newItem) {
					platformRuntimeDataService.readonly(newItem, !hasWrite);
					if (!newItem.__rt$data || !newItem.__rt$data.readonly) {
						newItem.__rt$data = newItem.__rt$data || {};
						newItem.__rt$data.readonly = [];
					} else {
						newItem.__rt$data.readonly = [];
					}
					if (!hasWrite) {
						return;
					}

					if (newItem.FileArchiveDocFk) {
						var fields = [{
							'field': 'DocumentTypeFk',
							'readonly': true
						}];
						platformRuntimeDataService.readonly(newItem, fields);
					}

					var parentSelected = evaluationDetailService ? evaluationDetailService.getSelected() : null;
					if (parentSelected) {
						var evaluationStatus = evaluationDetailService.getEvaluationStatus();
						var status = _.find(evaluationStatus, {'Id': parentSelected.EvalStatusFk});
						var allfields = [
							{
								'field': 'DocumentTypeFk',
								'readonly': true
							},
							{
								'field': 'Description',
								'readonly': true
							},
							{
								'field': 'DocumentDate',
								'readonly': true
							},
							{
								'field': 'OriginFileName',
								'readonly': true
							}];
						if (status && status.Readonly) {
							platformRuntimeDataService.readonly(newItem, allfields);
						}

						// set readonly by Evaluation IsReadonly
						if (parentSelected.IsReadonly) {
							platformRuntimeDataService.readonly(newItem, allfields);
						}
					}
				}

				function checkReadOnly() {
					var headerSelectedItem = evaluationDetailService.getSelected();
					var evaluationStatus = evaluationDetailService.getEvaluationStatus();
					var status = _.find(evaluationStatus, {'Id': headerSelectedItem.EvalStatusFk});
					var isReadonly = false;

					// set readonly by Evaluation IsReadonly
					if (headerSelectedItem && headerSelectedItem.IsReadonly) {

						isReadonly = true;
					}
					return !(status && status.Readonly || isReadonly);
				}

				basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

				service.clearAllData = clearAllData;
				var oldAddEntitiesToDeleted = service.addEntitiesToDeleted;
				var oldClearModifications = data.doClearModifications;

				angular.extend(service, {
					markCurrentItemAsModified: markCurrentItemAsModified,
					markItemAsModified: function doMarkItemAsModified(item) {
						markItemAsModified(item, data);
					},
					getModifiedDataCache: getModifiedDataCache,
					addEntitiesToDeleted: addEntitiesToDeleted
				});

				angular.extend(data, {
					markItemAsModified: markItemAsModified,
					doClearModifications: doClearModifications
				});

				service.getCellEditable = function (item, model) {
					var editable = true;
					if (model === 'DocumentTypeFk') {
						editable = !item.FileArchiveDocFk;
					}
					return editable;
				};

				// start-region: upload files
				service.addNewDocumentsToGrid = function (documents) {
					platformDataServiceDataProcessorExtension.doProcessData(documents, data);
					angular.forEach(documents, function (document) {
						serviceContainer.data.itemList.push(document);
						serviceContainer.data.listLoaded.fire();
						service.markItemAsModified(document);
					});
				};
				// end-region: upload files



				var baseCanUploadFiles = service.canUploadFiles;
				var baseCanMultipleUploadFiles = service.canMultipleUploadFiles;
				service.canUploadFiles = canUploadFiles;
				service.canMultipleUploadFiles = canMultipleUploadFiles;



				var updateFieldReadonly = function updateFieldReadonly(item, model) {
					var editable = !service.getCellEditable || service.getCellEditable(item, model);
					platformRuntimeDataService.readonly(item, [{field: model, readonly: !editable}]);
				};

				service.updateReadOnly = function (item) {
					updateFieldReadonly(item, 'DocumentTypeFk');
				};

				function doClearModifications(entity, data) {
					var modifiedData = getModifiedDataCache();
					if (modifiedData && modifiedData.EvaluationDocumentToSave && modifiedData.EvaluationDocumentToSave.length) {
						_.pullAll(modifiedData.EvaluationDocumentToSave, entity);
					}
					_.remove(modifiedData.EvaluationDocumentToSave, function (item) {
						return _.find(entity, {Id: item.MainItemId});
					});
					oldClearModifications(entity, data);
				}

				function addEntitiesToDeleted(elemState, entities, data, modState) {
					oldAddEntitiesToDeleted(elemState, entities, data, modState);
					_.forEach(entities, function (entity) {
						markEntitiesAsDeleted(entity, data);
					});
				}

				function markCurrentItemAsModified() {
					var item = service.getSelected();
					if (item) {
						markItemAsModified(item, data);
					}
				}

				function getModifiedDataCache() {
					return service.parentService().getModifiedDataCache();
				}

				function clearAllData() {
					data.itemList.length = 0;
					data.selectedItem = null;
				}

				function markItemAsModified(item, data) {
					var modifiedDataCache = evaluationDetailService.getModifiedDataCache();

					if (!modifiedDataCache[data.itemName + 'ToSave']) {
						modifiedDataCache[data.itemName + 'ToSave'] = [
							{
								MainItemId: item.Id,
								EvaluationDocument: item
							}
						];
						modifiedDataCache.EntitiesCount += 1;
					} else {
						var existed = _.find(modifiedDataCache[data.itemName + 'ToSave'], {MainItemId: item.Id});
						if (!existed) {
							modifiedDataCache[data.itemName + 'ToSave'].push(
								{
									MainItemId: item.Id,
									EvaluationDocument: item
								}
							);
							modifiedDataCache.EntitiesCount += 1;
						}
					}
					data.itemModified.fire(null, item);
				}

				function markEntitiesAsDeleted(item, data) {
					var modifiedDataCache = evaluationDetailService.getModifiedDataCache();

					if (!modifiedDataCache[data.itemName + 'ToDelete']) {
						modifiedDataCache[data.itemName + 'ToDelete'] = [item];
						modifiedDataCache.EntitiesCount += 1;
					} else {
						var existed = _.find(modifiedDataCache[data.itemName + 'ToDelete'], {Id: item.Id});
						if (!existed) {
							modifiedDataCache[data.itemName + 'ToDelete'].push(item);
							modifiedDataCache.EntitiesCount += 1;
						}
					}
					data.itemModified.fire(null, item);
				}

				serviceCache.setService(serviceCache.serviceTypes.DOCUMENT_DATA, serviceDescriptor, service);

				return service;

				// //////////////////////
				function canUploadFiles(currItem, files) {
					if (!hasWrite) {
						return false;
					}
					if (angular.isFunction(baseCanUploadFiles)) {
						return baseCanUploadFiles(currItem, files);
					}
					return baseCanUploadFiles;
				}

				function canMultipleUploadFiles(files) {
					if (!hasWrite) {
						return false;
					}
					if (angular.isFunction(baseCanMultipleUploadFiles)) {
						return baseCanMultipleUploadFiles(files);
					}
					return baseCanMultipleUploadFiles;
				}
			}

			return {
				createService: createService
			};
		}
	]);
})(angular);
