/**
 * Created by baf on 24.04.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.wot';

	/**
	 * @ngdoc controller
	 * @name resourceWotOperationPlantTypeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource wot operationPlantType entities.
	 **/
	angular.module(moduleName).controller('resourceWotOperationPlantTypeDetailController', ResourceWotOperationPlantTypeDetailController);

	ResourceWotOperationPlantTypeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceWotOperationPlantTypeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '84f1b6d1a8d44840a5c13965dd32e411');
	}

})(angular);