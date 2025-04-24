(function (angular) {

	'use strict';
	/**
	 * @ngdoc service
	 * @name schedulingTemplateDocumentService
	 * @function
	 *
	 * @description
	 * schedulingTemplateDocumentService is the data service for all Document related functionality.
	 */
	var moduleName = 'scheduling.template';
	var schedulingTemplateDocumentModule = angular.module(moduleName);
	schedulingTemplateDocumentModule.factory('schedulingTemplateDocumentService', ['_', 'globals', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'platformModalService', 'schedulingTemplateActivityTemplateService', 'basicsCommonServiceUploadExtension', 'basicsLookupdataLookupDescriptorService', 'moment', 'platformRuntimeDataService',

		function (_, globals, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformModalService, schedulingTemplateActivityTemplateService, basicsCommonServiceUploadExtension, basicsLookupdataLookupDescriptorService, moment, platformRuntimeDataService) {
			var factoryOptions = {
				flatLeafItem: {
					module: schedulingTemplateDocumentModule,
					serviceName: 'schedulingTemplateDocumentService',
					entityNameTranslationID: 'scheduling.template.activityTemplateDocument',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'scheduling/template/activitytemplatedocument/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = schedulingTemplateActivityTemplateService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ActivityTemplateDocumentDto',
						moduleSubModule: 'Scheduling.Template'
					})],
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = schedulingTemplateActivityTemplateService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'Document', parentService: schedulingTemplateActivityTemplateService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			initialize();
			return serviceContainer.service;

			function initialize() {

				var uploadOptions = {
					uploadServiceKey: 'scheduling-template-document',
					uploadConfigs: {SectionType: 'ActivityTemplateDocument', appId: '1F45E2E0E33843B98DEB97DBD69FA218'},
					uploadFilesCallBack: uploadFilesCallBack,
					canPreview: true
				};

				basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

				function uploadFilesCallBack(currItem, data) {
					var documentType = _.find(basicsLookupdataLookupDescriptorService.getData('DocumentType'), {MimeType: data.fileType});
					if (documentType && !currItem.DocumentTypeFk) {
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
			}

		}]);
})(angular);
