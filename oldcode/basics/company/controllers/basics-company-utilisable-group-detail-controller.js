(function (angular) {

	'use strict';
	var moduleName = 'basics.company';
	/**
	 * @ngdoc controller
	 * @name CompanyUtilisableGroupDetailController
	 * @function
	 *
	 * @description
	 * Controller for the utilisable group.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCompanyUtilisableGroupDetailController', BasicsCompanyUtilisableGroupDetailController);

	BasicsCompanyUtilisableGroupDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyUtilisableGroupDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '76063ce5e89f4c9bbb571b1c431244bc', 'basicsCompanyTranslationService');
	}
})(angular);