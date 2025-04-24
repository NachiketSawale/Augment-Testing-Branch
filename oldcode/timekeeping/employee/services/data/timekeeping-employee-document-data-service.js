/**
 * Created by Sudarshan on 13.03.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.employee');

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeDocumentDataService
	 * @description provides methods to access, create and update employees document entities
	 */
	myModule.service('timekeepingEmployeeDocumentDataService', TimekeepingEmployeeDocumentDataService);

	TimekeepingEmployeeDocumentDataService.$inject = ['_', '$http','$injector', 'moment', 'platformRuntimeDataService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeDataService', 'platformDataServiceActionExtension',
		'basicsCommonServiceUploadExtension', 'basicsLookupdataLookupDescriptorService','PlatformMessenger'];

	function TimekeepingEmployeeDocumentDataService(_, $http,$injector, moment, platformRuntimeDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, timekeepingEmployeeConstantValues, timekeepingEmployeeDataService, platformDataServiceActionExtension,
		basicsCommonServiceUploadExtension, basicsLookupdataLookupDescriptorService, PlatformMessenger) {
		let self = this;
		function canCreateDocument()
		{
			let selected = timekeepingEmployeeDataService.getSelected();

			return selected && selected.Version !== 0;
		}
		let timekeepingEmployeeDocumentServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingEmployeeDocumentDataService',
				entityNameTranslationID: 'timekeeping.employee.employeeDocumentEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/employees/document/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingEmployeeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {
					delete: true,
					create: 'flat',
					canCreateCallBackFunc: canCreateDocument
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingEmployeeConstantValues.schemes.employeeDoc)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingEmployeeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Documents', parentService: timekeepingEmployeeDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingEmployeeDocumentServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingEmployeeDocumentValidationService'
		}, timekeepingEmployeeConstantValues.schemes.certificateDoc));

		let service = serviceContainer.service;

		let data = serviceContainer.data;

		// Button "upload plus" set visible true
		service.uploadCreateVisible = true;

		// Button "upload"
		service.registerSelectionChanged(function () {
			service.canUploadVisible = canCreateDocument() && service.hasSelection();
		});

		service.deleteEntities = function deleteEntities(items) {
			let collectionIds = [];

			_.forEach(items, function (item) {
				if (item.Version === 0 && item.FileArchiveDocFk !== null) {
					collectionIds.push(item.FileArchiveDocFk);
				}
			});

			if (collectionIds.length > 0) {
				return $http.post(globals.webApiBaseUrl + 'basics/common/document/deletefilearchivedoc', collectionIds)
					.then(function (/* response */) {  // jshint ignore:line
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

			let uploadOptions = {
				uploadServiceKey: 'timekeeping-employee-document',
				uploadConfigs: {
					SectionType: 'TimekeepingEmployeeDocument',
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
					let args = {
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
				return $http.post(globals.webApiBaseUrl + 'timekeeping/employees/document/createforuploadfile', {
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
			let documentType = _.find(basicsLookupdataLookupDescriptorService.getData('DocumentType'), {MimeType: data.fileType});
			if (documentType && currItem.DocumentTypeFk) {
				currItem.DocumentTypeFk = documentType.Id;
			}
			currItem.Date = moment.utc(Date.now());
			currItem.FileArchiveDocFk = data.FileArchiveDocId;
			let fileName = data.fileName;
			if (angular.isString(fileName) && fileName.length > 42) {
				currItem.OriginFileName = fileName.substr(0, 42);
			} else {
				currItem.OriginFileName = fileName;
			}

			onSetReadonly();
			serviceContainer.service.gridRefresh();
		}

		function onSetReadonly() {
			let service = serviceContainer.service;
			let currentItem = service.getSelected();
			if (!currentItem || !currentItem.Id) {
				return;
			}

			let fields = _.map(service.canReadonlyModels, function (model) {
				let editable = true;
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
