/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForProjectListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of basics clerk forProject entities.
	 **/

	angular.module(moduleName).controller('basicsClerkForProjectListController', BasicsClerkForProjectListController);

	BasicsClerkForProjectListController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsClerkForProjectListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '81de3f7a458942018890cd82b2333e5b');
	}
})(angular);