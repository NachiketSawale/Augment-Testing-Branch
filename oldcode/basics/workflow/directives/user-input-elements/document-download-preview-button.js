/**
 * Created by lvy on 10/23/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.workflow';

	function basicsWorkflowDocumentDownloadPreviewDirective(basicsCommonFileDownloadService, basicsCommonServiceUploadExtension, documentDownloadPreviewButtonService) {
		return {
			restrict: 'A',
			scope: {
				option: '='
			},
			replace: true,
			template: '<span><a data-ng-click="downloadDocument()" class="cursor-pointer">{{option.displayText || option.fileName}}</a>&nbsp;&nbsp;<a data-ng-click="previewDocument()" class="cursor-pointer" data-ng-if="option.canPreview || false"><i class="block-image control-icons ico-preview"></i></a></span>',
			link: function (scope) {
				var canPreview = scope.option.canPreview || false;
				var previewOption = {canPreview: canPreview};
				if (canPreview) {
					var currentService = Object.create(documentDownloadPreviewButtonService);
					basicsCommonServiceUploadExtension.extendWidthPreview(currentService, previewOption);
					currentService.getSelected = function () {
						return {
							FileArchiveDocFk: scope.option.fileArchiveDocFk,
							DocumentTypeFk: scope.option.documentTypeFk,
							OriginFileName: scope.option.fileName
						};
					};
					scope.previewDocument = function openDocument() {
						currentService.previewDocument(currentService.viewWindow, true, {OriginFileName: scope.option.fileName});
					};
				}
				scope.downloadDocument = function openDocument() {
					basicsCommonFileDownloadService.download(scope.option.fileArchiveDocFk);
				};
			}
		};
	}

	basicsWorkflowDocumentDownloadPreviewDirective.$inject = ['basicsCommonFileDownloadService', 'basicsCommonServiceUploadExtension', 'documentDownloadPreviewButtonService'];

	angular.module(moduleName).directive('basicsWorkflowDocumentDownloadPreviewDirective', basicsWorkflowDocumentDownloadPreviewDirective);
})(angular);
