/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForEstimateListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of basics clerk for estimate entities.
	 **/

	angular.module(moduleName).controller('basicsClerkForEstimateListController', BasicsClerkForEstimateListController);

	BasicsClerkForEstimateListController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsClerkForEstimateListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd0919db314094f058b6eca179f017e6d');
	}
})(angular);