(function (angular) {

	'use strict';
	var moduleName = 'basics.company';


	/**
	 * @ngdoc controller
	 * @name CompanyCreateRoleDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  CreateRole.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompanyCreateRoleDetailController', BasicsCompanyCreateRoleDetailController);

	BasicsCompanyCreateRoleDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyCreateRoleDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '26a0309eaa0843ccab4eb2f60c1ac508', 'basicsCompanyTranslationService');
	}
})(angular);