/**
 * Created by lnt on 28.10.2019.
 */

/* global  globals */

(function () {
	'use strict';
	var moduleName = 'qto.main';
	var qtoMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name qtoDetailDocumentService
	 * @function
	 *
	 * @description
	 * qtoDetailDocumentService is the data service for qto detail document functionality.
	 */
	qtoMainModule.factory('qtoDetailDocumentService',
		['_', '$q', '$injector', '$http', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'platformDataServiceActionExtension',
			'basicsLookupdataLookupDescriptorService', 'basicsCommonServiceUploadExtension', 'qtoMainDetailService','moment',
			function (_, $q, $injector, $http, platformDataServiceFactory, platformRuntimeDataService, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, platformDataServiceActionExtension,
				basicsLookupdataLookupDescriptorService, basicsCommonServiceUploadExtension, qtoMainDetailService,moment) {
				let serviceContainer = {};
				let docService ={};
				let serviceOptions = {
					flatLeafItem: {
						module: qtoMainModule,
						serviceName: 'qtoDetailDocumentService',
						entityNameTranslationID: 'qto.detail.QtoDetailDocumentEntity',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'qto/detail/document/',
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: function initReadData(readData) {

								let detailIds = _.map(qtoMainDetailService.getSelectedEntities(), 'Id');
								if(detailIds && detailIds.length > 0){
									readData.QtoDetailIds = detailIds;
								}else {
									readData.QtoDetailIds = _.map(qtoMainDetailService.getList(), 'Id');
								}

							}
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'QtoDetailDocumentDto',
							moduleSubModule: 'Qto.Main'
						})],
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () {
								return !docService.isReadonly();
							},
							canDeleteCallBackFunc: function () {
								return !docService.isReadonly();
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.PKey1 = _.get(qtoMainDetailService.getSelected(), 'Id');
								},
								incorporateDataRead: function (readData, data) {
									_.each(readData, function (item) {
										platformRuntimeDataService.readonly(item, docService.isReadonly());
									});
									return serviceContainer.data.handleReadSucceeded(readData, data);
								}
							}
						},
						entityRole: {
							leaf: {itemName: 'QtoDetailDocuments', parentService: qtoMainDetailService}
						}
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

				// validation processor for new entities
				serviceContainer.data.newEntityValidator = getNewEntityValidator('Qto.Main');
				serviceContainer.data.usesCache = false;
				function getNewEntityValidator(moduleSubModule) {
					let module2ValidationService = {
						'Qto.Main': 'qtoDetailDocumentValidationService'
					};

					return basicsCommonMandatoryProcessor.create({
						typeName: 'QtoDetailDocumentDto',
						moduleSubModule: moduleSubModule,
						validationService: module2ValidationService[moduleSubModule],
						mustValidateFields: ['QtoDetailDocumentTypeFk', 'FileArchiveDocFk', 'OriginFileName']
					});
				}

				serviceContainer.data.filterParent = function filterParent() {
					let parent = qtoMainDetailService.getSelected();
					if(parent){
						return parent.Id;
					}
					let parents = qtoMainDetailService.getList();
					if(parents && parents.length>0){
						return _.map(parents, 'Id')[0];
					}
				};

				let DocumentServiceProvider = function (serviceContainer) {
					let self = serviceContainer.service;

					// Fixme: (Remark) createItem causes a selection event which the file upload service tries to handle
					// this behaviour causes problems so we have here a create item function without the selection process
					self.createItemWithoutSelection = function createItemWithoutSelection() {
						let data = serviceContainer.data;
						return $http.post(data.httpCreateRoute + data.endCreate, data.doPrepareCreate(data)).then(function (resp) {
							let newItem = resp.data;
							if(data.addEntityToCache){
								data.addEntityToCache(newItem, data);
							}
							data.itemList.push(newItem);
							platformDataServiceActionExtension.fireEntityCreated(data, newItem);
							return newItem;
						});
					};

					self.fileUploaded = function fileUploaded(currItem, fileInfo) {
						let promise = !_.isEmpty(currItem) ? $q.when(currItem) : self.createItemWithoutSelection();
						promise.then(function (docItem) {
							let documentType = serviceContainer.service.getDocumentType(fileInfo.fileName);
							if (!_.isNull(documentType) && _.has(documentType, 'Id')) {
								docItem.DocumentTypeFk = documentType.Id;
							}
							docItem.DocumentDate = moment.utc(Date.now());
							docItem.FileArchiveDocFk = fileInfo.FileArchiveDocId;
							docItem.OriginFileName = angular.isString(fileInfo.fileName) ? fileInfo.fileName.substring(0, 42) : '';

							// re-validate
							let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
							let validationServ = $injector.get('platformValidationByDataService').getValidationServiceByDataService(self);
							_.each(['FileArchiveDocFk', 'QtoDetailDocumentTypeFk', 'OriginFileName'], function (fieldName) {
								platformRuntimeDataService.applyValidationResult(validationServ['validate'+fieldName](docItem, docItem[fieldName], fieldName), docItem, fieldName);
							});
							self.markItemAsModified(docItem);
						});
					};

					self.deleteEntities = function deleteEntities(items) {
						let collectionIds = _.map(_.filter(items, function (item) {
							return item.Version === 0 && item.FileArchiveDocFk !== 0;
						}), 'FileArchiveDocFk');

						let url = globals.webApiBaseUrl + 'basics/common/document/deletefilearchivedoc';
						let promise = _.size(collectionIds) > 0 ? $http.post(url, collectionIds) : $q.when();
						return promise.then(function () {
							return serviceContainer.data.deleteEntities(items, serviceContainer.data);
						});
					};

					self.initialize = function initialize(uploadOptions) {
						uploadOptions.uploadFilesCallBack = function uploadFilesCallBack(currItem, data) {
							self.fileUploaded(currItem, data);
						};
						// important: dummy-function for input
						basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);
					};
				};

				docService = new DocumentServiceProvider(serviceContainer);

				docService = serviceContainer.service;

				docService.initialize({
					uploadServiceKey: 'qto-detail-document',
					uploadConfigs: {
						SectionType: 'QtoDetailDocument',
						appId: '1F45E2E0E33843B98DEB97DBD69FA218'
					},
					canPreview: true
				});

				docService.isReadonly = function isReadonly() { // needed for bulk editor (enabled/disabled)
					return _.get(qtoMainDetailService.getSelected(), 'IsReadonlyStatus');
				};

				docService.setCurrentParentItem = function (parentItem) {
					serviceContainer.data.currentParentItem = parentItem;
				};

				docService.getGridId = function () {
					return '886f9059992f46d3864d2cbe173bd251';
				};
				return docService;
			}]);
})();