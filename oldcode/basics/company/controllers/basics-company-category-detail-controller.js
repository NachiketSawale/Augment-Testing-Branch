(function (angular) {

	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name categoryDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  synonymDetail view of unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('basicsCompanyCategoryDetailController', BasicsCompanyCategoryDetailController);

	BasicsCompanyCategoryDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyCategoryDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'E8B8B6571FE64C90925A0FC49486AC64', 'basicsCompanyTranslationService');
	}
})(angular);