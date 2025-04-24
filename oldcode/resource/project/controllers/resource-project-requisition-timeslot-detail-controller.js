/**
 * Created by baf on 31.01.2025
 */

(function (angular) {

	'use strict';
	const moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectRequisitionTimeslotDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource project  entities.
	 **/
	angular.module(moduleName).controller('resourceProjectRequisitionTimeslotDetailController', ResourceProjectRequisitionTimeslotDetailController);

	ResourceProjectRequisitionTimeslotDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceProjectRequisitionTimeslotDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ae5c829a150e44ba9284ef506bf57bb6');
	}

})(angular);