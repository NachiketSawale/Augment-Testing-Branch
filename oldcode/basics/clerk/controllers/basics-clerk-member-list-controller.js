
(function () {

	'use strict';
	var moduleName = 'basics.clerk';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsClerkMemberListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of clerk member entities.
	 **/
	angModule.controller('basicsClerkMemberListController', BasicsClerkMemberListController);

	BasicsClerkMemberListController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsClerkMemberListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '1e606c28d2244e6587965611e602244d');
	}
})();