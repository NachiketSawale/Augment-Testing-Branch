(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name LogisticCardDocumentDataService
	 * @function
	 *
	 * @description
	 * LogisticCardDocumentDataService is the data service for all entities related functionality.
	 */
	var moduleName = 'logistic.card';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('logisticCardDocumentDataService', ['_', '$http', 'logisticCardDataService', 'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService', 'basicsCommonServiceUploadExtension', 'moment',
		'platformRuntimeDataService', 'platformDataServiceActionExtension','platformDataServiceProcessDatesBySchemeExtension',
		'logisticCardConstantValues', 'basicsCommonMandatoryProcessor', '$injector', 'PlatformMessenger',
		function (_, $http, logisticCardDataService, platformDataServiceFactory,
			basicsLookupdataLookupDescriptorService, basicsCommonServiceUploadExtension, moment,
			platformRuntimeDataService, platformDataServiceActionExtension, platformDataServiceProcessDatesBySchemeExtension,
			logisticCardConstantValues, basicsCommonMandatoryProcessor, $injector, PlatformMessenger) {

			function canCreateDocument()
			{
				var selected = logisticCardDataService.getSelected();

				return selected && selected.Version !== 0 && logisticCardDataService.canCreateOrDelete();
			}

			var factoryOptions = {
				flatLeafItem: {
					module: resourceModule,
					serviceName: 'logisticCardDocumentDataService',
					entityNameTranslationID: 'logistic.card.entityLogisticCardDataServiceDocument',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'logistic/card/jobcarddocument/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = logisticCardDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat',canDeleteCallBackFunc: logisticCardDataService.canCreateOrDelete, canCreateCallBackFunc: canCreateDocument},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = logisticCardDataService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'JobCardDocument', parentService: logisticCardDataService}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
						logisticCardConstantValues.schemes.carddocument), {
						processItem: function (documentItem) {platformRuntimeDataService.readonly(documentItem, []);
							logisticCardDataService.setEntityToReadonlyIfRootEntityIs(documentItem);
						}
					}],
				}
			};

			const serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			const service = serviceContainer.service;

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: 'logisticCardDocumentValidationService'
			}, logisticCardConstantValues.schemes.carddocument));

			// Button "upload plus" set visible true
			service.uploadCreateVisible = true;

			// Button "upload"
			service.registerSelectionChanged(function () {
				service.canUploadVisible = canCreateDocument() && service.hasSelection();
			});

			service.deleteEntities = function deleteEntities(items) {
				var collectionIds = [];

				_.forEach(items, function (item) {
					if (item.Version === 0) {
						collectionIds.push(item.FileArchiveDocFk);
					}
				});

				if (collectionIds.length > 0) {
					return $http.post(globals.webApiBaseUrl + 'basics/common/document/deletefilearchivedoc', collectionIds)
						.then(function (/* response */) {
							return serviceContainer.data.deleteEntities(items, serviceContainer.data);
						},
						function (/* error */) {
						});
				} else {
					return serviceContainer.data.deleteEntities(items, serviceContainer.data);
				}
			};

			function initialize() {
				var uploadOptions = {
					uploadServiceKey: 'logistic-job-card-document',
					uploadConfigs: {
						SectionType: 'LogisticCardJobCardDocument',
						appId: '1F45E2E0E33843B98DEB97DBD69FA218'
					},
					uploadFilesCallBack: uploadFilesCallBack,
					canPreview: true
				};

				basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);// important: dummy-function for input

				// start-region: upload files by drag and drop from Explorer
				service.gridFlag = null;
				service.isDragOrSelect = null;
				service.isUploadCreateDocument = null;
				service.dragDropFileTargetGridId = null;
				service.filesHaveBeenUploaded = new PlatformMessenger();

				function uploadFilesCallBack(currItem, data) {
					if (currItem === null || angular.isUndefined(currItem.Id)) {
						// if it upload multiple files and create documents or drop to create document
						var args = {
							currItem: currItem,
							data: data
						};
						service.filesHaveBeenUploaded.fire(null, args);
					} else {
						// upload file to select document item
						uploadFileForCurrentDocument(currItem, data);
					}
				}

				service.createForUploadFile = function (mainItemId, uploadedFileDataArray, extractZipOrNot) {
					return $http.post(globals.webApiBaseUrl + 'logistic/card/jobcarddocument/createforuploadfile', {
						ExtractZipOrNot: extractZipOrNot,
						UploadedFileDataList: uploadedFileDataArray,
						MainItemId: mainItemId,
					});
				};
				// end-region: upload files by drag and drop from Explorer

				service.addDocumentToGrid = function (documents) {
					$injector.get('platformDataServiceDataProcessorExtension').doProcessData(documents, serviceContainer.data);
					angular.forEach(documents, function (document) {
						serviceContainer.data.itemList.push(document);
						serviceContainer.data.listLoaded.fire();
						service.markItemAsModified(document);
					});
				};
			}

			function uploadFileForCurrentDocument(currItem, data) {
				var documentType = _.find(basicsLookupdataLookupDescriptorService.getData('DocumentType'), {MimeType: data.fileType});
				if (documentType && currItem.DocumentTypeFk) {
					currItem.DocumentTypeFk = documentType.Id;
				}
				currItem.DocumentDate = moment.utc(Date.now());
				currItem.FileArchiveDocFk = data.FileArchiveDocId;
				var fileName = data.fileName;
				if (angular.isString(fileName) && fileName.length > 42) {
					currItem.OriginFileName = fileName.substr(0, 42);
				} else {
					currItem.OriginFileName = fileName;
				}

				onSetReadonly();
				serviceContainer.service.gridRefresh();
			}

			function onSetReadonly() {
				var service = serviceContainer.service;
				var currentItem = service.getSelected();
				if (!currentItem || !currentItem.Id) {
					return;
				}

				var fields = _.map(service.canReadonlyModels, function (model) {
					var editable = true;
					if (model === 'UpdatedAt' || model === 'InsertedAt' || model.indexOf('__rt$data.history') >= 0) {
						editable = false;
					} else if (model === 'DocumentTypeFk') {
						editable = getCellEditable(currentItem, model);
					}

					return {
						field: model,
						readonly: !editable
					};
				});
				platformRuntimeDataService.readonly(currentItem, fields);
			}

			function getCellEditable(currentItem, field) {
				switch (field) {
					case 'DocumentTypeFk':
						return currentItem.FileArchiveDocFk === null;
					default:
						return true;
				}
			}

			initialize();
			return service;
		}
	]);
})(angular);
