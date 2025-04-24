/**
 * Created by cakiral on 01.08.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectRequisitionsListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource project plant cost code requisitions entities.
	 **/

	angular.module(moduleName).controller('resourceProjectRequisitionsListController', ResourceProjectRequisitionsListController);

	ResourceProjectRequisitionsListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceProjectRequisitionsListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '23e53ed2b44b11e9a2a32a2ae2dbcce4');
	}
})(angular);