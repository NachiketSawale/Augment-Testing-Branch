/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForPackageListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of basics clerk forPackage entities.
	 **/

	angular.module(moduleName).controller('basicsClerkForPackageListController', BasicsClerkForPackageListController);

	BasicsClerkForPackageListController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsClerkForPackageListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4fefcbe307f14fb09e7371b5726e8b85');
	}
})(angular);