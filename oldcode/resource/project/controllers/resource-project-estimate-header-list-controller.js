/**
 * Created by baf on 29.07.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectEstimateHeaderListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource project estimateHeader entities.
	 **/

	angular.module(moduleName).controller('resourceProjectEstimateHeaderListController', ResourceProjectEstimateHeaderListController);

	ResourceProjectEstimateHeaderListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceProjectEstimateHeaderListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b4495302ff744586bcfb22ca4184d647');
	}
})(angular);