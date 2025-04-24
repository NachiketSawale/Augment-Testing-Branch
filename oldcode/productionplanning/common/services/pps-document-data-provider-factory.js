(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.common';
	const module = angular.module(moduleName);

	module.factory('ppsDocumentDataProviderFactory', DocumentDataProviderFactory);

	DocumentDataProviderFactory.$inject = [
		'basicsCommonFileDownloadService',
		'basicsCommonServiceUploadExtension',
		'productionplanningCommonDocumentDataServiceFactory'];

	function DocumentDataProviderFactory(basicsCommonFileDownloadService,
		basicsCommonServiceUploadExtension,
		documentDataServiceFactory) {

		function create(options, ppsDocumentTypes) {
			const documentDataService = documentDataServiceFactory.getService({
				containerId: options.parentService.getServiceName() + 'PpsDocumentDataService',
				parentService: options.parentService,
				foreignKey: options.foreignKey,
			});

			documentDataService.registerEntityDeleted(function (e, items) {
				_.forEach(ppsDocumentTypes, function (ppsDocumentType) {
					// mean the document is a special document
					if (ppsDocumentType.id > 1) {
						const document =  _.find(items, {PpsDocumentTypeFk: ppsDocumentType.id});
						if (document) {
							const bundleService = documentDataService.parentService();
							bundleService.getSelected()[ppsDocumentType.model] = null;
							bundleService.updateToolbar();
						}
					}
				});
			});

			const parentService = options.parentService;

			function uploadDocument(ppsDocumentType) {
				if (!parentService.getSelected()[ppsDocumentType.model]) {
					return documentDataService.uploadAndCreateItem().then(function (document) {
						document.PpsDocumentTypeFk = ppsDocumentType.id;
						parentService.getSelected()[ppsDocumentType.model] = document;
						documentDataService.gridRefresh();
					});
				} else {
					return documentDataService.setSelected(parentService.getSelected()[ppsDocumentType.model]).then(function () {
						return documentDataService.uploadFiles();
					});
				}
			}

			function downloadDocument(ppsDocumentType) {
				const selectedDocument = parentService.getSelected()[ppsDocumentType.model];
				documentDataService.setSelected(selectedDocument).then(function () {
					documentDataService.downloadFiles(selectedDocument);
				});
			}

			function previewDocument(scope, flag, ppsDocumentType) {
				const selectedDocument = parentService.getSelected()[ppsDocumentType.model];
				documentDataService.setSelected(selectedDocument).then(function () {
					documentDataService.previewDocument(scope, flag, selectedDocument);
				});
			}

			function canUploadDocument() {
				return parentService.hasSelection();
			}

			function canPreviewOrDownloadDocument(ppsDocumentType) {
				const documentItem = _.get(parentService.getSelected(), ppsDocumentType.model);
				return documentItem && (documentItem.OriginFileName || documentItem.Url);
			}

			return {
				uploadDocument: uploadDocument,
				downloadDocument: downloadDocument,
				previewDocument: previewDocument,
				canUploadDocument: canUploadDocument,
				canDownloadDocument: canPreviewOrDownloadDocument,
				canPreviewDocument: canPreviewOrDownloadDocument
			};
		}

		function createPreviewProvider(options) {
			const dataProvider = {};
			basicsCommonServiceUploadExtension.extendWidthPreview(dataProvider, {canPreview: true, previewExtension: 'PpsCommonDocumentPreviewServiceExtension'});
			const previewDocument = dataProvider.previewDocument;
			dataProvider.previewDocument = function(scope, flag, ppsDocumentType) {
				dataProvider.getSelected = function () {
					return options.getDocument(ppsDocumentType);
				};
				previewDocument(scope, flag, options.getDocument(ppsDocumentType));
			};

			dataProvider.canPreviewDocument = function(ppsDocumentType) {
				const documentItem = options.getDocument(ppsDocumentType);
				return documentItem && (documentItem.OriginFileName || documentItem.Url);
			};

			dataProvider.canDownloadDocument = dataProvider.canPreviewDocument;

			dataProvider.downloadDocument = function(ppsDocumentType) {
				if (dataProvider.canDownloadDocument(ppsDocumentType)) {
					const documentItem = options.getDocument(ppsDocumentType);
					basicsCommonFileDownloadService.download(documentItem.FileArchiveDocFk);
				}
			};

			dataProvider.gridRefresh = () => {}; // add an "empty" method gridRefresh, just for fixing console error when click document-preview button in bundle lookup dialog

			return dataProvider;
		}

		return {
			create: create,
			createPreviewProvider: createPreviewProvider
		};
	}
})(angular);