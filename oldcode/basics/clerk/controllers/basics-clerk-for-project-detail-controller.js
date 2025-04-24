/**
 * Created by baf on 15.05.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForProjectDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of basics clerk forProject entities.
	 **/
	angular.module(moduleName).controller('basicsClerkForProjectDetailController', BasicsClerkForProjectDetailController);

	BasicsClerkForProjectDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsClerkForProjectDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5af6320d446b4945a1d4f7daa9eb1013');
	}

})(angular);