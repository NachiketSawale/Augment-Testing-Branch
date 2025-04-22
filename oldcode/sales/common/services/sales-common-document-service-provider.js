/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonDocumentServiceProvider
	 * @description provides common functionality for document container in sales
	 */
	angular.module(salesCommonModule).factory('salesCommonDocumentServiceProvider',
		['_', 'globals', '$q', '$http', '$injector', 'moment', 'platformDataValidationService', 'platformDataServiceActionExtension', 'basicsCommonServiceUploadExtension', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataConfigGenerator', 'basicsCommonMandatoryProcessor',
			function (_, globals, $q, $http, $injector, moment, platformDataValidationService, platformDataServiceActionExtension, basicsCommonServiceUploadExtension, basicsLookupdataLookupDescriptorService, basicsLookupdataConfigGenerator, basicsCommonMandatoryProcessor) {

				var DocumentServiceProvider = function (serviceContainer) {
					var self = serviceContainer.service;

					// Fixme: (Remark) createItem causes a selection event which the file upload service tries to handle
					// this behaviour causes problems so we have here a create item function without the selection process
					self.createItemWithoutSelection = function createItemWithoutSelection() {
						var data = serviceContainer.data;
						return $http.post(data.httpCreateRoute + data.endCreate, data.doPrepareCreate(data)).then(function (resp) {
							var newItem = resp.data;
							if(data.addEntityToCache){
								data.addEntityToCache(newItem, data);
							}
							data.itemList.push(newItem);
							platformDataServiceActionExtension.fireEntityCreated(data, newItem);
							return newItem;
						});
					};

					self.fileUploaded = function fileUploaded(currItem, fileInfo) {
						var promise = !_.isEmpty(currItem) ? $q.when(currItem) : self.createItemWithoutSelection();
						promise.then(function (docItem) {
							var fileName = fileInfo.fileName;
							var suffix = fileName.substr(fileName.lastIndexOf('.'), fileName.length - 1);
							var lowercaseSuffix = _.toLower(suffix);
							var documentTypes = basicsLookupdataLookupDescriptorService.getData('DocumentType');
							var foundDocType = _.find(documentTypes, function (item) {
								return fileInfo.fileType !== '' && item.MimeType.indexOf(fileInfo.fileType) !== -1;
							});
							if (!foundDocType) {
								foundDocType = _.find(documentTypes, function (o) {
									return o.Extention !== null && (o.Extention.indexOf(lowercaseSuffix) !== -1 || lowercaseSuffix.indexOf(o.Extention) !== -1);
								});
							}
							if (_.has(foundDocType, 'Id')) {
								docItem.DocumentTypeFk = foundDocType.Id;
							}
							docItem.DocumentDate = moment.utc(Date.now());
							docItem.FileArchiveDocFk = fileInfo.FileArchiveDocId;
							docItem.OriginFileName = angular.isString(fileInfo.fileName) ? fileInfo.fileName.substring(0, 42) : '';

							// re-validate
							var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
							var validationServ = $injector.get('platformValidationByDataService').getValidationServiceByDataService(self);
							_.each(['FileArchiveDocFk', 'SalesDocumentTypeFk', 'OriginFileName'], function (fieldName) {
								platformRuntimeDataService.applyValidationResult(validationServ['validate'+fieldName](docItem, docItem[fieldName], fieldName), docItem, fieldName);
							});
							self.markItemAsModified(docItem);
						});
					};

					self.deleteEntities = function deleteEntities(items) {
						var collectionIds = _.map(_.filter(items, function (item) {
							return item.Version === 0 && item.FileArchiveDocFk !== 0;
						}), 'FileArchiveDocFk');

						var url = globals.webApiBaseUrl + 'basics/common/document/deletefilearchivedoc';
						var promise = _.size(collectionIds) > 0 ? $http.post(url, collectionIds) : $q.when();
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


				// default document layout configuration
				function createDocumentDetailLayout(fid, version) {
					return {
						'fid': fid,
						'version': version,
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [{
							'gid': 'basicData',
							'attributes': ['description', 'documenttypefk', 'salesdocumenttypefk', 'documentdate', 'originfilename']
						}, {
							'gid': 'entityHistory',
							'isHistory': true
						}],
						'overloads': {
							documenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('documents.project.basDocumenttype'),
							salesdocumenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.salesdocumenttype'),
							originfilename: {readonly: true}
						}
					};
				}

				// common document validation service
				var ValidationServiceProvider = function (docService) {
					var service = {};

					service.validateFileArchiveDocFk = function validateFileArchiveDocFk(entity, value, model) {
						return platformDataValidationService.validateMandatory(entity, value, model, service, docService);
					};

					service.validateSalesDocumentTypeFk = function validateSalesDocumentTypeFk(entity, value, model) {
						return platformDataValidationService.validateMandatory(entity, value, model, service, docService);
					};

					service.validateOriginFileName = function validateOriginFileName(entity, value, model) {
						return platformDataValidationService.validateMandatory(entity, value, model, service, docService);
					};

					return service;
				};

				// NewEntityValidator
				function getNewEntityValidator(moduleSubModule) {
					var module2ValidationService = {
						'Sales.Bid': 'salesBidDocumentValidationService',
						'Sales.Contract': 'salesContractDocumentValidationService',
						'Sales.Wip': 'salesWipDocumentValidationService',
						'Sales.Billing': 'salesBillingDocumentValidationService'
					};

					return basicsCommonMandatoryProcessor.create({
						typeName: 'DocumentDto',
						moduleSubModule: moduleSubModule,
						validationService: module2ValidationService[moduleSubModule],
						mustValidateFields: ['SalesDocumentTypeFk', 'FileArchiveDocFk', 'OriginFileName']
					});
				}

				// service api
				return {
					getInstance: function getInstance(serviceContainer) {
						return new DocumentServiceProvider(serviceContainer);
					},
					getValidationInstance: function getValidationInstance(docService) {
						return new ValidationServiceProvider(docService);
					},
					getNewEntityValidator: getNewEntityValidator,
					createDocumentDetailLayout: createDocumentDetailLayout
				};
			}
		]);
})();
