/**
 * Created by chd on 12/22/2021.
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	/**
	 * @ngdoc service

	 * @name basicsMeetingDocumentsService
	 * @function
	 * @requireds basicsLookupdataLookupDescriptorService
	 *
	 * @description Provide meeting document data service
	 */

	let moduleName = 'basics.meeting';
	angular.module(moduleName).factory('basicsMeetingDocumentsService',
		['$http', 'basicsMeetingMainService', 'platformDataServiceFactory', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService',
			'ServiceDataProcessDatesExtension', 'basicsCommonServiceUploadExtension', '$q', 'PlatformMessenger', 'basicsMeetingDocumentReadonlyProcessor',
			function ($http, parentService, dataServiceFactory, runtimeDataService, basicsLookupdataLookupDescriptorService,
				DatesProcessor, basicsCommonServiceUploadExtension, $q, PlatformMessenger, readonlyProcessor) {
				let service = {};
				let serviceContainer = null,
					tmpServiceInfo = {
						flatLeafItem: {
							module: angular.module(moduleName),
							httpCreate: { route: globals.webApiBaseUrl + 'basics/meeting/document/' },
							httpRead: {
								route: globals.webApiBaseUrl + 'basics/meeting/document/',
								endRead: 'listByParent',
								usePostForRead: true,
								initReadData: initReadData
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
										let header = parentService.getSelected();
										creationData.PKey1 = header.Id;
									}
								}
							},
							entityRole: {leaf: {itemName: 'MtgDocument', parentService: parentService}},
							dataProcessor: [
								new DatesProcessor(['DocumentDate']),
								readonlyProcessor
							],
							actions: {
								delete: {}, create: 'flat',
								canCreateCallBackFunc: function () {
									return parentService.getHeaderEditAble();
								},
								canDeleteCallBackFunc: function () {
									return parentService.getHeaderEditAble();
								}
							}
						}
					};
				serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo);

				service = serviceContainer.service;

				let uploadOptions = {
					uploadServiceKey: 'basics-meeting-document',
					uploadConfigs: {
						SectionType: 'Meeting',
						createForUploadFileRoute: 'basics/meeting/document/createforuploadfile',
					},
					canPreview: true
				};

				basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

				function initReadData(readData) {
					let header = parentService.getSelected();
					readData.PKey1 = header ? header.Id : null;
				}

				service.updateReadOnly = function updateReadOnly(entity) {
					runtimeDataService.readonly(entity, [{
						field: 'DocumentTypeFk',
						readonly: !!entity.FileArchiveDocFk
					}]);
				};

				service.canPreview=function canPreview(){
					let currentItem = service.getSelected();
					if(currentItem) {
						return !!currentItem.OriginFileName || 1000 === currentItem.DocumentTypeFk;
					}
				};

				service.getPreviewConfig = function getPreviewConfig(){
					let deferred = $q.defer();
					let currentItem = service.getSelected();
					let fileArchiveDocId = currentItem.FileArchiveDocFk;
					if (fileArchiveDocId) {
						$http.get(globals.webApiBaseUrl + 'basics/common/document/preview?fileArchiveDocId=' + fileArchiveDocId).then(function (result) {
							deferred.resolve({
								src: result.data,
								documentType: currentItem.DocumentTypeFk,
								title: currentItem.OriginFileName
							});
						});
					}
					return deferred.promise;
				};

				return service;
			}
		]
	);
})(angular);
