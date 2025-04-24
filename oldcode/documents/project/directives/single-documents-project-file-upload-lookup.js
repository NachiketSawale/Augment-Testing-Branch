/**
 * Created by pel on 6/7/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'documents.project';

	angular.module(moduleName).directive('singleDocumentsProjectFileUploadLookup',
		[
			'globals',
			'basicsLookupdataLookupDescriptorService',
			'documentsProjectDocumentFileUploadDataService',
			function (globals,basicsLookupdataLookupDescriptorService,
				documentsProjectDocumentFileUploadDataService) {
				return {
					restrict: 'EA',
					scope: {
						filearchivedocid: '=?',
						documentfiletype: '@?'
					},
					templateUrl: globals.appBaseUrl + moduleName + '/partials/file-upload.html',
					link: function (scope, element) {
						scope.chooseFile = function () {
							var uploadService = documentsProjectDocumentFileUploadDataService.getUploadService();
							var documentFileType = null;
							if (typeof scope.documentfiletype !== 'string') {
								documentFileType = documentsProjectDocumentFileUploadDataService.getDocumentFileType();
							}
							var fileType = uploadService.
								getExtension(basicsLookupdataLookupDescriptorService.getData('DocumentType'), documentFileType);
							if (!fileType) {
								basicsLookupdataLookupDescriptorService.loadData('DocumentType').then(function (docTypes) {
									fileType = scope.documentfiletype !== undefined ? scope.documentfiletype : uploadService.getExtension(docTypes, documentFileType);
								});
								setTimeout(function() {
									uploadService.uploadFiles({}, fileType).then(function (data) {
										scope.filearchivedocid = data.FileArchiveDocId;
										element.find('#fileName').val(data.fileName);
										scope.$emit('fileChosen', data);
									});
								}, 100);
							}
							else {
								fileType = scope.documentfiletype !== undefined ? scope.documentfiletype : fileType;
								uploadService.uploadFiles({}, fileType).then(function (data) {
									scope.filearchivedocid = data.FileArchiveDocId;
									element.find('#fileName').val(data.fileName);
									scope.$emit('fileChosen', data);
								});
							}
						};
					}
				};
			}]);

})(angular);