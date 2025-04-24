
(function (angular) {
	/* global globals, _, $q */

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
	 * @ngdoc service
	 * @name hsqeCheckListDocumentDataService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	angular.module(moduleName).factory('hsqeCheckListDocumentDataService', ['$injector', '$http', '$translate', 'platformDataServiceFactory', 'platformRuntimeDataService',
		'basicsCommonServiceUploadExtension', 'hsqeCheckListDataService', 'ServiceDataProcessDatesExtension',
		'PlatformMessenger', 'basicsLookupdataLookupDescriptorService', 'platformModalService','hsqeCheckListDocumentReadonlyProcessor',
		function ($injector, $http, $translate, dataServiceFactory, runtimeDataService,
			basicsCommonServiceUploadExtension, parentService, ServiceDataProcessDatesExtension,
			PlatformMessenger, basicsLookupdataLookupDescriptorService, platformModalService,readonlyProcessor) {

			var service = {};
			var factoryOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'hsqeCheckListDocumentDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'hsqe/checklist/document/',
						endRead: 'listbyparent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selectedParent = parentService.getSelected();
							readData.PKey1 = selectedParent.Id;
						}
					},
					dataProcessor: [
						new ServiceDataProcessDatesExtension(['DocumentDate']),
						readonlyProcessor
					],
					entityRole: {
						leaf: {itemName: 'Document', parentService: parentService}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData || {});
								let dataRead = serviceContainer.data.handleReadSucceeded(readData, data);
								angular.forEach(readData, function (item) {
									service.updateReadOnly(item);
								});
								return dataRead;
							},
							initCreationData: function initCreationData(creationData) {
								let selectedParent = parentService.getSelected();
								creationData.PKey1 = selectedParent.Id;
							}
						}
					},
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							return parentService.getHeaderEditAble();
						},
						canDeleteCallBackFunc: function () {
							return parentService.getHeaderEditAble();
						}
					}
				}
			};

			var serviceContainer = dataServiceFactory.createNewComplete(factoryOptions);
			service = serviceContainer.service;

			let uploadOptions = {
				uploadServiceKey: 'hsqe-checklist-document',
				uploadConfigs: {
					action: 'UploadWithCompress',
					SectionType: 'hsqe',
					createForUploadFileRoute:'hsqe/checklist/document/createforuploadfile',
					checkDuplicateByFileNameRoute:'hsqe/checklist/document/checkduplicatebyfilename',
				},
				canPreview: true
			};
			basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

			service.updateReadOnly = function updateReadOnly(entity) {
				runtimeDataService.readonly(entity, [{
					field: 'DocumentTypeFk',
					readonly: !!entity.FileArchiveDocFk
				}]);
			};

			service.uploadFileInfoToCurDocWithDuplicateCheck = function (currItem, data){
				// check file duplicate
				let dataList = serviceContainer.data.itemList;
				let duplicateFileDatas = [];
				for (let i = 0; i < dataList.length; ++i) {
					let fileData = dataList[i];
					let fileName = fileData.OriginFileName;
					if (fileName !== undefined && fileName !== null && fileName !== '') {
						if (data.fileName.toUpperCase() === fileName.toUpperCase()) {
							let item = {Id: i, Info: data.fileName};
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

			service.getPreviewConfig = function getPreviewConfig() {
				var deffered = $q.defer();
				var currentItem = service.getSelected();
				var fileArchiveDocId = currentItem.FileArchiveDocFk;
				if (fileArchiveDocId) {
					$http.get(globals.webApiBaseUrl + 'basics/common/document/preview?fileArchiveDocId=' + fileArchiveDocId).then(function (result) {
						deffered.resolve({
							src: result.data,
							documentType: currentItem.DocumentTypeFk,
							title: currentItem.OriginFileName
						});
					});
				}
				return deffered.promise;
			};

			function canEditByParentSelected() {
				var parentSelected = parentService.getSelected();
				if (parentSelected && parentSelected.IsSameContextProjectsByCompany) {
					return false;
				}
				return true;
			}
			let canMultipleUploadFiles = serviceContainer.service.canMultipleUploadFiles;
			service.canMultipleUploadFiles = function () {
				if (!canEditByParentSelected()) {
					return false;
				}
				return canMultipleUploadFiles();
			};
			let canUploadFiles = serviceContainer.service.canUploadFiles;
			service.canUploadFiles = function(){
				if (!canEditByParentSelected()) {
					return false;
				}
				return canUploadFiles();
			};
			return service;
		}
	]);
})(angular);
