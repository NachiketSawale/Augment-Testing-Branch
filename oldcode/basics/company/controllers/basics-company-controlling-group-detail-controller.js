(function (angular) {

	'use strict';
	var moduleName = 'basics.company';
	/**
	 * @ngdoc controller
	 * @name BasicsCompanyControllingGroupDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  synonymDetail view of unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompanyControllingGroupDetailController', BasicsCompanyControllingGroupDetailController);

	BasicsCompanyControllingGroupDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyControllingGroupDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bed9a6d24ff846feb25ff940c56f5778', 'basicsCompanyTranslationService');
	}
})(angular);