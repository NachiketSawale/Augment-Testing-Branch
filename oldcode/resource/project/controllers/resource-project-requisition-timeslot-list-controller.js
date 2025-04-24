/**
 * Created by baf on 31.01.2025
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectRequisitionTimeslotListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource project  entities.
	 **/

	angular.module(moduleName).controller('resourceProjectRequisitionTimeslotListController', ResourceProjectRequisitionTimeslotListController);

	ResourceProjectRequisitionTimeslotListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceProjectRequisitionTimeslotListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dee017999fd94bfcb1ce73097ac71380');
	}
})(angular);