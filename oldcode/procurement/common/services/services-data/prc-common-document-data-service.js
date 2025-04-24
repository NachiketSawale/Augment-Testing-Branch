// / <reference path="../_references.js" />

(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc service

	 * @name procurementCommonDocumentDataService
	 * @function
	 * @requireds basicsLookupdataLookupDescriptorService
	 *
	 * @description Provide procurement document data service
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonDocumentCoreDataService',
		['procurementCommonDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'procurementContextService', 'basicsCommonServiceUploadExtension',
			'_', 'platformRuntimeDataService', '$http', 'PlatformMessenger', 'platformModalService', '$translate','documentsProjectFileSizeProcessor',
			function (dataServiceFactory, basicsLookupdataLookupDescriptorService, moduleContext, basicsCommonServiceUploadExtension,
				_, platformRuntimeDataService, $http, PlatformMessenger, platformModalService, $translate,documentsProjectFileSizeProcessor) {

				// create a new data service object
				function constructorFn(parentService) {
					var serviceContainer;
					var service;
					var setReadonlyor;
					// service configuration
					var tmpServiceInfo = {
						flatLeafItem: {
							httpCRUD: {
								route: globals.webApiBaseUrl + 'procurement/common/prcdocument/',
								endRead: 'listbyparent',
								usePostForRead: true,
								initReadData: initReadData
							},
							serviceName: 'procurementCommonDocumentDataService',
							dataProcessor: [documentsProjectFileSizeProcessor],
							presenter: {
								list: {
									initCreationData: function initCreationData(creationData) {
										var prcHeader = parentService.getSelected().PrcHeaderEntity;
										creationData.PKey1 = prcHeader.Id;
									},
									incorporateDataRead: function incorporateDataRead(readItems, data) {
										var Isreadonly = !setReadonlyor();
										var list = [];
										if (angular.isArray(readItems)) {
											list = readItems;
										} else if (readItems.Main) {
											list = readItems.Main;
										}
										var dataRead = serviceContainer.data.handleReadSucceeded(list, data, true);
										if (Isreadonly) {
											service.setFieldReadonly(list);
										}
										return dataRead;
									}
								}
							},
							actions: {
								delete: true, create: 'flat',
								canCreateCallBackFunc: function () {
									return true;
								}

							},
							entityRole: {leaf: {itemName: 'PrcDocument', parentService: parentService}},
							entitySelection: {supportsMultiSelection: true}
						}
					};
					serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo, {
						readonly: ['DocumentTypeFk'],
						date: ['DocumentDate'],
						overview: {
							key: moduleContext.overview.keys.attachment,
							mapper: function (item) {
								return {
									Id: item.Id,
									Description: item.OriginFileName
								};
							}
						}
					}, parentService.isGivenParentService ? parentService : null); // quote has two document containers, should distinguish them.

					// read service from serviceContainer
					service = serviceContainer.service;
					// set for readonly Document Container
					var readonlyFields = [{field: 'DocumentTypeFk', readonly: true}, {field: 'PrcDocumentTypeFk', readonly: true},
						{field: 'Description', readonly: true}, {field: 'DocumentDate', readonly: true}, {field: 'OriginFileName', readonly: true}];
					service.setFieldReadonly = function (items) {
						if (_.isArray(items)) {
							_.forEach(items, function (item) {
								platformRuntimeDataService.readonly(item, readonlyFields);
							});
						}
					};
					var uploadOptions = {
						uploadServiceKey: parentService.name + '.common.document', // TODO chi: right??
						uploadConfigs: {
							SectionType: 'Procurement',
							createForUploadFileRoute: 'procurement/common/prcdocument/createforuploadfile',
							checkDuplicateByFileNameRoute: 'procurement/common/prcdocument/checkduplicatebyfilename'
						},
						canPreview: true
					};
					basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);
					service.isAllowuploaddocumentstoreadonlentity = false;

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
					/**
					 * @ngdoc function
					 * @name registerMessenger
					 * @function
					 *
					 * @methodOf procurementCommonDocumentCoreDataService
					 * @description register messengers.
					 */
					service.registerMessenger = function registerMessenger() {
					};

					/**
					 * @ngdoc function
					 * @name unregisterMessenger
					 * @function
					 *
					 * @methodOf procurementCommonDocumentCoreDataService
					 * @description unregister messengers.
					 */
					service.unregisterMessenger = function () {
					};

					serviceContainer.data.clearEntireCache = function clearEntireCache(data) {
						if (data && data.usesCache) {
							for (var prop in data.cache) {
								if (Object.prototype.hasOwnProperty.call(data.cache,prop)) {

									var changes = data.cache[prop];

									changes.loadedItems.length = 0;
									changes.selectedItems.length = 0;
									changes.modifiedItems.length = 0;
									changes.deletedItems.length = 0;

									delete data.cache[prop];
								}
							}

							delete data.cache;
							data.cache = {};
						}
					};

					serviceContainer.service.clearCache = function clearCache() {
						serviceContainer.data.clearEntireCache(serviceContainer.data);
					};

					// Overwrite this method to provide document's parent fk.
					service.getSelectedParentId = function () {
						let selectParentItem = service.parentService().getSelected();
						if (selectParentItem) {
							return selectParentItem.PrcHeaderFk;
						}
						return null;
					};

					// Overwrite this method to provide entity role service which has updateAndExecute function.
					service.parentEntityRoleService = function () {
						var parentSev = service.parentService();
						var serviceName = parentSev.getServiceName();
						if (serviceName === 'procurementQuoteRequisitionDataService' || serviceName === 'procurementRfqRequisitionService') {
							parentSev = service.parentService().parentService();
						}
						return parentSev;
					};

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

					setReadonlyor = function () {
						var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
						if (getModuleStatusFn) {
							var status = getModuleStatusFn();
							if (status) {
								return !(status.IsReadOnly || status.IsReadonly);
							}
						}
						return false;
					};

					service.canMultipleUploadFiles = function () {
						var parentSelected = parentService.getSelected();
						if (parentService.canMultipleUploadFiles) {
							return parentService.canMultipleUploadFiles();
						}
						if (parentSelected) {
							var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
							if (getModuleStatusFn && _.isFunction(getModuleStatusFn)) {
								var status = getModuleStatusFn();
								if (status && (status.IsReadOnly || status.IsReadonly) && !service.isAllowuploaddocumentstoreadonlentity) {
									return false;
								}
							}
						}
						else {
							return false;
						}
						return true;
						// return setReadonlyor();
					};

					service.canUploadFiles = function () {
						var parentSelected = parentService.getSelected();
						if (parentService.canUploadFiles) {
							return parentService.canUploadFiles();
						}
						if (parentSelected) {
							var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
							if (getModuleStatusFn && _.isFunction(getModuleStatusFn)) {
								var status = getModuleStatusFn();
								if (status && (status.IsReadOnly || status.IsReadonly) && !service.isAllowuploaddocumentstoreadonlentity) {
									return false;
								}
							}
						}
						else {
							return false;
						}
						var currentItem = serviceContainer.service.getSelected();
						// fixed issue: #111094,Be capable to upload document for readonly entities
						if (currentItem && currentItem.FileArchiveDocFk === null) {
							return service.basicCanUploadFiles();
						} else {
							return setReadonlyor() && service.basicCanUploadFiles();
						}

					};
					// after change status need to refresh the procurement container
					service.refreshFunction = function(){
						return serviceContainer.service.read;
					};

					var canDelete = serviceContainer.service.canDelete;
					serviceContainer.service.canDelete = function () {
						var currentItem = serviceContainer.service.getSelected();
						if (currentItem && currentItem.Version === 0) {
							return true;
						}
						var parentSelected = parentService.getSelected();
						if (parentSelected) {
							var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
							if (getModuleStatusFn && _.isFunction(getModuleStatusFn)) {
								var status = getModuleStatusFn();
								if (status && (status.IsReadOnly || status.IsReadonly) && !service.isAllowuploaddocumentstoreadonlentity) {
									return false;
								}
							}
						}
						else {
							return false;
						}
						return canDelete();
					};

					var canCreate = serviceContainer.service.canCreate;
					serviceContainer.service.canCreate = function () {
						var parentSelected = parentService.getSelected();
						if (parentSelected) {
							var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
							if (getModuleStatusFn && _.isFunction(getModuleStatusFn)) {
								var status = getModuleStatusFn();
								if (status && (status.IsReadOnly || status.IsReadonly) && !service.isAllowuploaddocumentstoreadonlentity) {
									return false;
								}
							}
						}
						else {
							return false;
						}
						return canCreate();
					};

					function initReadData(readData) {
						const selectedItem = parentService.getSelected();
						if(selectedItem) {
							let prcHeader = selectedItem.PrcHeaderEntity;
							readData.PKey1 = prcHeader ? prcHeader.Id : null;
						}
					}

					// update uploaded file info to selected document item.
					service.uploadFileInfoToCurDocWithDuplicateCheck = function (currItem, data) {
						// check file duplicate
						var dataList = serviceContainer.data.itemList;
						var duplicateFileDatas = [];
						for (var i = 0; i < dataList.length; ++i) {
							var fileData = dataList[i];
							var fileName = fileData.OriginFileName;
							if (fileName !== undefined && fileName !== null && fileName !== '') {
								if (data.fileName.toUpperCase() === fileName.toUpperCase()) {
									var item = {Id: i, Info: data.fileName};
									duplicateFileDatas.push(item);
									break;
								}
							}
						}
						if (duplicateFileDatas.length > 0) {
							service.showInfoDialog(duplicateFileDatas).then(function (result) {
								if (result.yes) {
									service.uploadFileInfoToCurrentDocument(currItem, data);
								}
							});
						} else {
							// upload file to select document item
							service.uploadFileInfoToCurrentDocument(currItem, data);
						}
					};

					function syncGetAllowUploadDocumentsToReadonlEntity() {
						$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/allowuploaddocumentstoreadonlentity')
							.then(function (response) {
								service.isAllowuploaddocumentstoreadonlentity = response.data;
							});
					}
					syncGetAllowUploadDocumentsToReadonlEntity();

					return service;
				}

				return dataServiceFactory.createService(constructorFn, 'procurementCommonDocumentCoreDataService');
			}
		]
	);
})(angular);
