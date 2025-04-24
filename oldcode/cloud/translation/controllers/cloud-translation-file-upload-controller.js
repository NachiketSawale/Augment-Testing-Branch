(function () {

	'use strict';
	const moduleName = 'cloud.translation';
	angular.module(moduleName).controller('cloudTranslationFileUploadController', CloudTranslationFileUploadController);

	CloudTranslationFileUploadController.$inject = ['$scope', 'platformFileUtilControllerFactory', 'cloudTranslationResourceDataService', 'cloudTranslationFileUploadService'];
	function CloudTranslationFileUploadController($scope, platformFileUtilControllerFactory, resourceDataService, cloudTranslationFileUploadService) {

		$scope.setClick = function () {
			// Later Added by PlatformClickEvent Directive to scope
			$scope.addClick();
		};

		$scope.allowedFiles = [''];
		$scope.buttons = [
			{
				id: 't1',
				caption: 'cloud.translation.uploadTranslationFile',
				type: 'item',
				iconClass: 'tlb-icons ico-new',
				fn: $scope.setClick,
				disabled: false
			}];
		platformFileUtilControllerFactory.initFileController($scope, resourceDataService, cloudTranslationFileUploadService);
	}
})();