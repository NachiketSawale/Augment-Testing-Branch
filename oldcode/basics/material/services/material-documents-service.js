(function (angular) {
	'use strict';
	/**
	 * @ngdoc service

	 * @name basicsMaterialDocumentsService
	 * @function
	 * @requireds basicsLookupdataLookupDescriptorService
	 *
	 * @description Provide procurement document data service
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* global globals */
	var moduleName = 'basics.material';
	angular.module(moduleName).factory('basicsMaterialDocumentsService',
		['$http','basicsMaterialRecordService', 'platformDataServiceFactory', 'platformRuntimeDataService',
			'basicsLookupdataLookupDescriptorService',
			'ServiceDataProcessDatesExtension',
			'basicsCommonServiceUploadExtension','$q','PlatformMessenger', 'basicsCommonReadOnlyProcessor',
			function ($http,parentService, dataServiceFactory, runtimeDataService, basicsLookupdataLookupDescriptorService,
				DatesProcessor,
				basicsCommonServiceUploadExtension,$q,PlatformMessenger, basicsCommonReadOnlyProcessor) {
				var service = {};
				var serviceContainer = null,
					tmpServiceInfo = {
						flatLeafItem: {
							module: angular.module(moduleName),
							httpCreate: { route: globals.webApiBaseUrl + 'basics/material/document/' },
							httpRead: {
								route: globals.webApiBaseUrl + 'basics/material/document/',
								endRead: 'listByParent',
								usePostForRead: true,
								initReadData: initReadData
							},
							presenter: {
								list: {
									incorporateDataRead: function (readData, data) {
										basicsLookupdataLookupDescriptorService.attachData(readData || {});
										let dataRead = serviceContainer.data.handleReadSucceeded(readData.Main, data);
										angular.forEach(readData.Main, function (item) {
											service.updateReadOnly(item);
										});

										return dataRead;
									},
									initCreationData: function initCreationData(creationData) {
										var header = parentService.getSelected();
										creationData.PKey1 = header.Id;
									}
								}
							},
							entityRole: {leaf: {itemName: 'MaterialDocument', parentService: parentService}},
							dataProcessor: [
								new DatesProcessor(['DocumentDate']),
								{processItem: readonlyProcessItem}
							],
							actions: {
								delete: {},
								create: 'flat',
								canCreateCallBackFunc: function () {
									return !parentService.isReadonlyMaterial();
								},
								canDeleteCallBackFunc: function () {
									return !parentService.isReadonlyMaterial();
								}
							}
						}
					};
				serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo);

				service = serviceContainer.service;

				let uploadOptions = {
					uploadServiceKey: 'basics-material-document',
					uploadConfigs: {
						SectionType: 'Material',
						createForUploadFileRoute: 'basics/material/document/createforuploadfile',
					},
					canPreview: true,
					canMultipleUpload: function canMultipleUpload() {
						return !parentService.isReadonlyMaterial();
					}
				};

				basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

				function initReadData(readData) {
					var header = parentService.getSelected();
					readData.PKey1 = header ? header.Id : null;
				}

				service.updateReadOnly = function updateReadOnly(entity) {
					runtimeDataService.readonly(entity, [{
						field: 'DocumentTypeFk',
						readonly: !!entity.FileArchiveDocFk
					}]);
				};

				service.canPreview=function canPreview(){
					var currentItem = service.getSelected();
					if(currentItem){
						return !!currentItem.OriginFileName||1000 === currentItem.DocumentTypeFk;
					}
				};

				service.getPreviewConfig = function getPreviewConfig(){
					var deffered = $q.defer();
					var currentItem = service.getSelected();
					var fileArchiveDocId = currentItem.FileArchiveDocFk;
					if(fileArchiveDocId) {
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

				var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
					uiStandardService: 'basicsMaterialDocumentStandardConfigurationService',
					readOnlyFields: []
				});
				function readonlyProcessItem(item) {
					if (!item) {
						return;
					}
					if (parentService.isReadonlyMaterial()) {
						readonlyProcessorService.setRowReadonlyFromLayout(item, true);
					}
				}


				return service;
			}
		]
	);
})(angular);
