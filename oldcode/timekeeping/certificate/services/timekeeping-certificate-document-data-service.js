/**
 * Created by Sudarshan on 27.03.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.certificate');

	/**
	 * @ngdoc service
	 * @name timekeepingCertificateDocumentDataService
	 * @description pprovides methods to access, create and update timekeeping certificate document entities
	 */
	myModule.service('timekeepingCertificateDocumentDataService', TimekeepingCertificateDocumentDataService);

	TimekeepingCertificateDocumentDataService.$inject = ['_', '$http','$injector', 'moment', 'platformRuntimeDataService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingCertificateConstantValues', 'timekeepingCertificateDataService', 'platformDataServiceActionExtension',
		'basicsCommonServiceUploadExtension', 'basicsLookupdataLookupDescriptorService','PlatformMessenger'];

	function TimekeepingCertificateDocumentDataService(_, $http,$injector, moment, platformRuntimeDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, timekeepingCertificateConstantValues, timekeepingCertificateDataService, platformDataServiceActionExtension,
		basicsCommonServiceUploadExtension, basicsLookupdataLookupDescriptorService, PlatformMessenger) {
		let self = this;
		function canCreateDocument()
		{
			let selected = timekeepingCertificateDataService.getSelected();

			return selected && selected.Version !== 0;
		}
		let certificateDocumentServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingCertificateDocumentDataService',
				entityNameTranslationID: 'timekeeping.certificate.certificatedocumententity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/certificate/document/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingCertificateDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {
					delete: true,
					create: 'flat',
					canCreateCallBackFunc: canCreateDocument
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingCertificateConstantValues.schemes.certificateDoc)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingCertificateDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Documents', parentService: timekeepingCertificateDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(certificateDocumentServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingCertificateDocumentValidationService'
		}, timekeepingCertificateConstantValues.schemes.certificateDoc));

		let service = serviceContainer.service;

		let data = serviceContainer.data;

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
				uploadServiceKey: 'timekeeping-certificate-document',
				uploadConfigs: {
					SectionType: 'TimekeepingCertificateDocument',
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
					let args = {
						currItem: currItem,
						data: data
					};
					service.filesHaveBeenUploaded.fire(null, args);
				} else {
					uploadFileForCurrentDocument(currItem, data);
				}
			}
			service.createForUploadFile = function (mainItemId, uploadedFileDataArray, extractZipOrNot) {
				return $http.post(globals.webApiBaseUrl + 'timekeeping/certificate/document/createforuploadfile', {
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
