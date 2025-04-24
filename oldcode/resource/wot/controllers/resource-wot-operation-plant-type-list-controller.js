/**
 * Created by baf on 24.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.wot';

	/**
	 * @ngdoc controller
	 * @name resourceWotOperationPlantTypeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource wot operationPlantType entities.
	 **/

	angular.module(moduleName).controller('resourceWotOperationPlantTypeListController', ResourceWotOperationPlantTypeListController);

	ResourceWotOperationPlantTypeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceWotOperationPlantTypeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '8bf3d2a2d03a4ae99aab2ad090c77a53');
	}
})(angular);