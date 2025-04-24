/**
 * Created by nitsche on 19.02.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let module = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainActivityDataService
	 * @description provides methods to access, create and update Project Main Activity entities
	 */
	module.service('projectMainActivityDataService', ProjectMainActivityDataService);

	ProjectMainActivityDataService.$inject = [
		'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',
		'projectMainConstantValues', 'projectMainService', 'basicsCommonServiceUploadExtension', 'PlatformMessenger', '$injector', 'basicsLookupdataLookupDescriptorService'
	];

	function ProjectMainActivityDataService(
		platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor,
		projectMainConstantValues, projectMainService, basicsCommonServiceUploadExtension, PlatformMessenger, $injector,
		basicsLookupdataLookupDescriptorService
	) {
		let self = this;
		let serviceName = 'projectMainActivityDataService'
		let projectMainServiceOption = {
			flatNodeItem: {
				module: module,
				serviceName: serviceName,
				entityNameTranslationID: 'project.main.projectMainEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/main/activity/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData)
					{
						let selected = projectMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(projectMainConstantValues.schemes.activity)
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData)
						{
							let selected = projectMainService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.Pkey2 = selected.ClerkFk;
						}
					}
				},
				entityRole: {
					node: {
						itemName: 'Activitys',
						parentService: projectMainService
					}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(projectMainServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectMainActivityValidationService'
		}, projectMainConstantValues.schemes.activity));

		let service = serviceContainer.service;
		function initialize() {
			var uploadOptions = {
				uploadServiceKey: 'project-main-activity',
				uploadConfigs: {
					SectionType: 'ProjectMainActivity',
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

			service.createForUploadFile = function (mainItemId, uploadedFileDataArray, extractZipOrNot) {
				return $http.post(globals.webApiBaseUrl + 'project/main/activity/createforuploadfile', {
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
		initialize();


	}
})(angular);