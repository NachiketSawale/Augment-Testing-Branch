(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterItemDocumentPreviewController', [
		'$scope',
		'materialDocumentPreviewConfigService',
		function (
			$scope,
			materialDocumentPreviewConfigService
		) {
			const documentOptions = $scope.dialog.modalOptions.documentOptions;
			$scope.previewDocuments = documentOptions.previewDocuments;
			$scope.previewDocumentTypes = documentOptions.previewDocumentTypes;
			materialDocumentPreviewConfigService.onDocumentPreview($scope, documentOptions.documentId, 0, '100%');
	}]);

})();