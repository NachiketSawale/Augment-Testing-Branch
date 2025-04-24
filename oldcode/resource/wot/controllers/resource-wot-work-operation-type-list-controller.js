/**
 * Created by baf on 24.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.wot';

	/**
	 * @ngdoc controller
	 * @name resourceWotWorkOperationTypeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource wot workOperationType entities.
	 **/

	angular.module(moduleName).controller('resourceWotWorkOperationTypeListController', ResourceWotWorkOperationTypeListController);

	ResourceWotWorkOperationTypeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceWotWorkOperationTypeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5c10bdee259d4d9d87fd84a396183093');
	}
})(angular);