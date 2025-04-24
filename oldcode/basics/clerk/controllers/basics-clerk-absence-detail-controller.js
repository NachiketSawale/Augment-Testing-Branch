(function (angular) {

	'use strict';

	var moduleName = 'basics.clerk';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsClerkAbsenceDetailController', BasicsClerkAbsenceDetailController);
	BasicsClerkAbsenceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsClerkAbsenceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6122EEE3BF1A41CE994E0F1E5C165850', 'basicsClerkTranslationService');
	}
})(angular);