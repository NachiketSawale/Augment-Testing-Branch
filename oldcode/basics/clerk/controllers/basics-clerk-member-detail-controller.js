
(function (angular) {

	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkMemberDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of clerk member entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsClerkMemberDetailController', BasicsClerkMemberDetailController);

	BasicsClerkMemberDetailController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsClerkMemberDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6723baf728274de9a7b455bd518c0a79','basicsClerkTranslationService');
	}
})(angular);