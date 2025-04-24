(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantDocumentDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantDocumentDataService is the data service for all plants related functionality.
	 */
	const moduleName = 'resource.equipmentgroup';
	const resourceModule = angular.module(moduleName);

	resourceModule.factory('resourceEquipmentGroupDocumentDataService', ['$http','$injector','_', 'resourceEquipmentGroupDataService',
		'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'basicsCommonServiceUploadExtension', 'moment',
		'platformRuntimeDataService', 'platformDataServiceActionExtension', 'PlatformMessenger','ServiceDataProcessDatesExtension',
		'basicsCommonMandatoryProcessor','resourceEquipmentGroupConstantValues',
		function ($http, $injector, _, resourceEquipmentGroupDataService,
				  platformDataServiceFactory, basicsLookupdataLookupDescriptorService, basicsCommonServiceUploadExtension, moment,
		          platformRuntimeDataService, platformDataServiceActionExtension, PlatformMessenger, ServiceDataProcessDatesExtension,
				  basicsCommonMandatoryProcessor, resourceEquipmentGroupConstantValues) {

			function canCreateDocument()
			{
				var selected = resourceEquipmentGroupDataService.getSelected();

				return selected && selected.Version !== 0;
			}

			var factoryOptions = {
				flatLeafItem: {
					module: resourceModule,
					serviceName: 'resourceEquipmentPlantDocumentDataService',
					entityNameTranslationID: 'resource.equipment.entityResourceEquipmentPlantDocument',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/equipmentgroup/document/',
						endRead: 'listbyparent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = resourceEquipmentGroupDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {
						delete: true,
						create: 'flat',
						canCreateCallBackFunc: canCreateDocument
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = resourceEquipmentGroupDataService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'PlantGroupDocuments', parentService: resourceEquipmentGroupDataService}},
					dataProcessor: [
						new ServiceDataProcessDatesExtension(['Date']),
					]
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			var service = serviceContainer.service;

			var data = serviceContainer.data;


			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: 'resourceEquipmentGroupDocumentValidationService'
			}, resourceEquipmentGroupConstantValues.schemes.document));

			// Button "upload plus" set visible false
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
						.then(function (response) {  // jshint ignore:line

							return serviceContainer.data.deleteEntities(items, serviceContainer.data);
						},
						function (/* error */) {
						});
				} else {
					return serviceContainer.data.deleteEntities(items, serviceContainer.data);
				}
			};

			initialize();
			return service;
			function initialize() {

				var uploadOptions = {
					uploadServiceKey: 'resource-equipment-group-document',
					uploadConfigs: {
						SectionType: 'ResourceEquipmentGroupDocument',
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
					return $http.post(globals.webApiBaseUrl + 'resource/equipmentgroup/document/createforuploadfile', {
						ExtractZipOrNot: extractZipOrNot,
						UploadedFileDataList: uploadedFileDataArray,
						MainItemId: mainItemId,
					});
				};
				// end-region: upload files by drag and drop from Explorer

				service.addDocumentToGrid = function (documents) {
					$injector.get('platformDataServiceDataProcessorExtension').doProcessData(documents, data);
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
				currItem.Date = moment.utc(Date.now());
				currItem.FileArchiveDocFk = data.FileArchiveDocId;
				var fileName = data.fileName;
				if (angular.isString(fileName) && fileName.length > 42) {
					currItem.OriginFileName = fileName.substr(0, 42);
				} else {
					currItem.OriginFileName = fileName;
				}
				currItem.Description = currItem.OriginFileName;

				onSetReadonly();
				$injector.get('resourceEquipmentGroupDocumentValidationService').validateUrl(currItem,null,'Url');

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
		}]);
})(angular);
