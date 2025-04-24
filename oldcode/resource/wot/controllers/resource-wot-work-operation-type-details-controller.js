/**
 * Created by baf on 24.04.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.wot';

	/**
	 * @ngdoc controller
	 * @name resourceWotWorkOperationTypeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource wot workOperationType entities.
	 **/
	angular.module(moduleName).controller('resourceWotWorkOperationTypeDetailController', ResourceWotWorkOperationTypeDetailController);

	ResourceWotWorkOperationTypeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceWotWorkOperationTypeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '8c9b09fc5ce34a468e28cfaa40ece637');
	}

})(angular);