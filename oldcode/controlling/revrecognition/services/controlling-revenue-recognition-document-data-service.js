
(function (angular) {

	'use strict';
	var moduleName = 'controlling.revrecognition';

	/**
     * @ngdoc service
     * @name controllingRevenueRecognitionDocumentDataService
     * @function
     *
     * @description
     * Provides some information on all containers in the module.
     */
	angular.module(moduleName).factory('controllingRevenueRecognitionDocumentDataService', ['$injector', '_', 'globals', '$http', '$q', '$translate','PlatformMessenger','platformDataServiceFactory', 'controllingRevenueRecognitionHeaderDataService','ServiceDataProcessDatesExtension','basicsCommonServiceUploadExtension','basicsLookupdataLookupDescriptorService','platformRuntimeDataService','platformModalService',
		function ($injector, _, globals, $http, $q, $translate, PlatformMessenger, dataServiceFactory, parentService,ServiceDataProcessDatesExtension,basicsCommonServiceUploadExtension,basicsLookupdataLookupDescriptorService,runtimeDataService,platformModalService) {
			var serviceOption = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'RevenueRecognitionDocumentDataService',
					httpCreate: {route: globals.webApiBaseUrl + 'controlling/RevenueRecognition/document/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'controlling/RevenueRecognition/document/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: initReadData
					},
					dataProcessor: [
						new ServiceDataProcessDatesExtension(['DocumentDate'])
					],
					entityRole: {
						leaf: {itemName: 'PrrDocument', parentService: parentService}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = parentService.getSelected();
								creationData.PKey1 = selected.Id;
							},
							incorporateDataRead: function (readData, data) {
								// process dtos for supporting upload
								_.forEach(readData, function (dto) {
									if(dto.FileArchiveDocFk === null)
										dto.CanUpload = true;
								});
								return data.handleReadSucceeded(readData, data);
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
			var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;
			service.filesHaveBeenUploaded = new PlatformMessenger();
			var uploadOptions = {
				uploadServiceKey: 'prr-document',
				uploadConfigs: {
					action: 'UploadWithCompress',
					SectionType: 'prr',
					createForUploadFileRoute: 'controlling/RevenueRecognition/document/createforuploadfile',
				},
				canPreview: true
			};

			function initReadData(readData) {
				var header = parentService.getSelected();
				readData.PKey1 = header ? header.Id : null;
			}

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

			return service;
		}
	]);
})(angular);
