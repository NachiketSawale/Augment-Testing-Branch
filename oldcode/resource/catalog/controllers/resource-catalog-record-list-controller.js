/**
 * Created by baf on 02.11.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.catalog';

	/**
	 * @ngdoc controller
	 * @name resourceCatalogRecordListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource catalog record entities.
	 **/

	angular.module(moduleName).controller('resourceCatalogRecordListController', ResourceCatalogRecordListController);

	ResourceCatalogRecordListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceCatalogRecordListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bae34453f83744d3a6f7e53b7851e657');
	}
})(angular);