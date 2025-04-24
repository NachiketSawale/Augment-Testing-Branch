/**
 * Created by henkel
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsCompanyCreateRoleController', BasicsCompanyCreateRoleController);

	BasicsCompanyCreateRoleController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCompanyCreateRoleController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '53ce3acd0703462abe01e899b4b9c4fa');
	}
})();