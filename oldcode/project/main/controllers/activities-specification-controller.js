
(function (angular) {
	'use strict';

	const moduleName = 'project.main';

	angular.module(moduleName).controller(
		'projectMainActivitySpecificationController',
		[
			'$scope','projectMainActivitySpecificationDataService','platformSpecificationContainerControllerService',
			function ($scope, projectMainActivitySpecificationDataService,platformSpecificationContainerControllerService) {
				platformSpecificationContainerControllerService.initSpecificationController($scope, projectMainActivitySpecificationDataService)
			}
		]
	);
})(angular);
