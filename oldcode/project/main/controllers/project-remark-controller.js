(function (angular) {
	'use strict';

	var moduleName = 'project.main';
	angular.module(moduleName).controller('projectMainRemarksController', ['$scope', 'platformLongtextFormControllerFactory', 'projectMainTranslationService',

		function ($scope, longTextControllerFactory, projectMainTranslationService) {

			longTextControllerFactory.initTextController($scope, projectMainTranslationService, moduleName);
		}
	]);
})(angular);