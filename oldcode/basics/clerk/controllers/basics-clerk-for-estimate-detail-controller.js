/**
 * Created by baf on 15.05.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForEstimateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of basics clerk for estimate entities.
	 **/
	angular.module(moduleName).controller('basicsClerkForEstimateDetailController', BasicsClerkForEstimateDetailController);

	BasicsClerkForEstimateDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsClerkForEstimateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '874e6bfd2cad48bca4a578699a51ee81');
	}

})(angular);