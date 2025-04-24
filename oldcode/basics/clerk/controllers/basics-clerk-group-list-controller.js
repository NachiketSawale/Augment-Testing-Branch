/**
 * Created by leo on 11.11.2015.
 */
(function () {

	'use strict';
	var moduleName = 'basics.clerk';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsClerkGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of clerk group entities.
	 **/
	angModule.controller('basicsClerkGroupListController', BasicsClerkGroupListController);

	BasicsClerkGroupListController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsClerkGroupListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '82bb9ecf97e94aadab3d30f79cba2c02');
	}
})();