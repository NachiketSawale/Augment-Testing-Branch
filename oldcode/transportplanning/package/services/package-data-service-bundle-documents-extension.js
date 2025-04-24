/**
 * Created by zwz on 2020/1/15.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.package';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name transportplanningPackageDataServiceBundleDocumentsExtension
	 * @function
	 * @requires transportplanningBundleDocumentDataProviderFactory
	 * @description
	 * transportplanningPackageDataServiceBundleDocumentsExtension provides bundle documents preview functionality for package data service
	 */
	module.service('transportplanningPackageDataServiceBundleDocumentsExtension', Extension);
	Extension.$inject = ['transportplanningBundleDocumentDataProviderFactory'];

	function Extension(documentDataProviderFactory) {

		this.addBundleDocumentsFunction = function (dataService) {
			var documentDataProvider = documentDataProviderFactory.createPreviewProvider({
				getDocument: function (ppsDocumentType) {
					var entity = dataService.getSelected();
					return entity ? entity[ppsDocumentType.model] : null;
				}
			});

			dataService.isDocumentReadOnly = true;
			dataService.canPreviewDocument = documentDataProvider.canPreviewDocument;
			dataService.previewDocument = documentDataProvider.previewDocument;
			dataService.canDownloadDocument = documentDataProvider.canDownloadDocument;
			dataService.downloadDocument = documentDataProvider.downloadDocument;
		};

	}
})(angular);