(function (angular) {

	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name CompanyTextmoduleDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  synonymDetail view of unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompanyTextModuleDetailController', SchedulingMainClerkDetailController);

	SchedulingMainClerkDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingMainClerkDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b22a1b0792e44782848001641da08ceb', 'basicsCompanyTranslationService');
	}
})(angular);