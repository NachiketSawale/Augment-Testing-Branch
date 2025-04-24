/**
 * Created by leo on 11.11.2015.
 */
(function () {

	'use strict';
	var moduleName = 'basics.clerk';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsClerkAbsenceProxyListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of clerk group entities.
	 **/
	angModule.controller('basicsClerkAbsenceProxyListController', BasicsClerkAbsenceProxyListController);

	BasicsClerkAbsenceProxyListController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsClerkAbsenceProxyListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b5f01723e4c34b8d8f5b90262d7f0288');
	}
})();