/**
 * Created by henkel
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.master');

	/**
	 * @ngdoc service
	 * @name resourceMasterProvidedSkillDataService
	 * @description pprovides methods to access, create and update resource master providedSkill entities
	 */
	myModule.service('resourceMasterProvidedSkillDocumentDataService', ResourceMasterProvidedSkillDocumentDataService);

	ResourceMasterProvidedSkillDocumentDataService.$inject = ['$http', '_','$injector', 'moment', 'platformDataServiceFactory', 'platformDataServiceActionExtension', 'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService', 'basicsCommonServiceUploadExtension', 'resourceMasterProvidedSkillDataService','ServiceDataProcessDatesExtension','PlatformMessenger',];

	function ResourceMasterProvidedSkillDocumentDataService($http, _, $injector, moment, platformDataServiceFactory, platformDataServiceActionExtension, platformRuntimeDataService,
		basicsLookupdataLookupDescriptorService, basicsCommonServiceUploadExtension, resourceMasterProvidedSkillDataService, ServiceDataProcessDatesExtension, PlatformMessenger) {
		var self = this;
		function canCreateDocument()
		{
			var selected = resourceMasterProvidedSkillDataService.getSelected();

			return selected && selected.Version !== 0;
		}
		var resourceMasterProvidedSkillDocumentServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceMasterProvidedSkillDocumentDataService',
				entityNameTranslationID: 'resource.master.providedSkillDocumentEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/master/providedskilldocument/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceMasterProvidedSkillDataService.getSelected();
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
							var selected = resourceMasterProvidedSkillDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.ResourceFk;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'ProvidedSkillDocuments', parentService: resourceMasterProvidedSkillDataService}
				},
				dataProcessor: [
					new ServiceDataProcessDatesExtension(['Date']),
				]
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceMasterProvidedSkillDocumentServiceOption, self);

		var service = serviceContainer.service;


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
				uploadServiceKey: 'resource-master-provided-skill-document',
				uploadConfigs: {
					SectionType: 'ResourceMasterProvidedSkillDocument',
					appId: '1F45E2E0E33843B98DEB97DBD69FA218'
				},
				uploadFilesCallBack: uploadFilesCallBack,
				canPreview: true
			};

			basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);// important: dummy-function for input

			// start-region: upload files
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
				return $http.post(globals.webApiBaseUrl + 'resource/master/providedskilldocument/createforuploadfile', {
					ExtractZipOrNot: extractZipOrNot,
					UploadedFileDataList: uploadedFileDataArray,
					MainItemId: mainItemId,
				}).then(function (response) {
					// Item1 => error-list and Item2 => succeeded data response
					if(!_.isNil(response.data.Item2)){
						service.addDocumentToGrid(response.data.Item2);
					}
					// return always Item1 error-list to controller-service
					let finalResult  = response.data;
					finalResult.data = response.data.Item1;
					return finalResult;
				});

			};
			// end-region: upload files

			service.addDocumentToGrid = function (documents) {
				angular.forEach(documents, function (document) {
					document.Date = moment.utc(Date.now());
					serviceContainer.data.itemList.push(document);
					serviceContainer.data.listLoaded.fire();
					// service.markItemAsModified(document);

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

	}
})(angular);
