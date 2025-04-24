/**
 * Created by baf on 15.05.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForPackageDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of basics clerk forPackage entities.
	 **/
	angular.module(moduleName).controller('basicsClerkForPackageDetailController', BasicsClerkForPackageDetailController);

	BasicsClerkForPackageDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsClerkForPackageDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f8e0f47316db4f628e0f3c394e0bda2f');
	}

})(angular);