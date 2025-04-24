(function () {
	/*global angular*/
	'use strict';
	const moduleName = 'project.main';

	angular.module(moduleName).controller('projectMainPictureViewController', ProjectMainPictureViewController);

	ProjectMainPictureViewController.$inject = ['$scope', 'platformFileUtilControllerFactory', 'projectMainPictureDataService', 'projectMainPictureSettingService'];

	function ProjectMainPictureViewController($scope, platformFileUtilControllerFactory, projectMainPictureDataService, projectMainPictureSettingService) {
		platformFileUtilControllerFactory.initFileController($scope, projectMainPictureDataService, projectMainPictureSettingService);
		$scope.allowedFiles = ['image/jpeg'];

		if (projectMainPictureDataService.addUsingContainer) {
			projectMainPictureDataService.addUsingContainer('428870a65a7a4e48b753387259c6acfa');
		}

		$scope.$on('$destroy', function () {
			if (projectMainPictureDataService.removeUsingContainer) {
				projectMainPictureDataService.removeUsingContainer('428870a65a7a4e48b753387259c6acfa');
			}
		});
	}
})();