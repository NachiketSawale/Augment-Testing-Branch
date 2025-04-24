/**
 * Created by baf on 05.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource project  entities.
	 **/
	angular.module(moduleName).controller('resourceProjectDetailController', ResourceProjectDetailController);

	ResourceProjectDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceProjectDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6859a6fb2e9346e9a4d9f4ec3c212052');
	}

})(angular);