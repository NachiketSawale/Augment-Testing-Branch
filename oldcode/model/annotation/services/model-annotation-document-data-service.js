/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationDocumentDataService';

	myModule.service(svcName, ModelAnnotationDocumentDataService);

	ModelAnnotationDocumentDataService.$inject = ['_', '$q', 'platformDataServiceFactory',
		'modelAnnotationDataService', 'basicsCommonServiceUploadExtension',
		'basicsLookupdataLookupDescriptorService', 'moment',
		'platformDataServiceProcessDatesBySchemeExtension', '$http',
		'platformRuntimeDataService', 'platformValidationByDataService'];

	function ModelAnnotationDocumentDataService(_, $q, platformDataServiceFactory,
		modelAnnotationDataService, basicsCommonServiceUploadExtension,
		basicsLookupdataLookupDescriptorService, moment,
		platformDataServiceProcessDatesBySchemeExtension, $http,
		platformRuntimeDataService, platformValidationByDataService) {

		const self = this;
		const serviceOptions = {
			flatLeafItem: {
				module: myModule,
				serviceName: svcName,
				entityNameTranslationID: 'model.annotation.documentEntityName',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/annotation/doc/',
					endRead: 'list',
					initReadData: function initReadData(readData) {
						const selAnnotation = modelAnnotationDataService.getSelected();
						readData.filter = '?annotationId=' + (selAnnotation ? selAnnotation.Id : 0);
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'ModelAnnotationDocumentDto',
					moduleSubModule: 'Model.Annotation'
				})],
				actions: {
					delete: true,
					create: 'flat'
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selAnnotation = modelAnnotationDataService.getSelected();
							creationData.PKey1 = selAnnotation.Id;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'ModelAnnotationDocuments',
						parentService: modelAnnotationDataService
					}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(serviceOptions, self);

		basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, {
			uploadServiceKey: 'model-annotation-document',
			uploadConfigs: {
				SectionType: 'ModelAnnotationDocument',
				appId: '1F45E2E0E33843B98DEB97DBD69FA218'
			},
			canPreview: true,
			canUpload: true,
			canDownload: true,
			uploadFilesCallBack: function (currItem, fileInfo) {
				const itemReadyPromise = $q.when(_.isNil(_.get(currItem, 'Id')) ? serviceContainer.service.createItem() : currItem);

				return itemReadyPromise.then(function (docItem) {
					const documentType = _.find(basicsLookupdataLookupDescriptorService.getData('DocumentType'), {MimeType: fileInfo.fileType});
					if (_.has(documentType, 'Id')) {
						docItem.BasDocumentTypeFk = documentType.Id;
					}
					docItem.DocumentDate = moment.utc(Date.now());
					docItem.FileArchiveDocFk = fileInfo.FileArchiveDocId;
					docItem.OriginFileName = angular.isString(fileInfo.fileName) ? fileInfo.fileName.substring(0, 42) : '';

					// re-validate
					const validationServ = platformValidationByDataService.getValidationServiceByDataService(self);
					_.each(['FileArchiveDocFk', 'OriginFileName'], function (fieldName) {
						platformRuntimeDataService.applyValidationResult(validationServ['validate' + fieldName](docItem, docItem[fieldName], fieldName), docItem, fieldName);
					});
					self.markItemAsModified(docItem);
				});
			}
		});

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
	}
})(angular);
