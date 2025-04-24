/**
 * Created by baf on 02.11.2017
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.catalog';

	/**
	 * @ngdoc controller
	 * @name resourceCatalogRecordDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource catalog detail entities.
	 **/
	angular.module(moduleName).controller('resourceCatalogRecordDetailController', ResourceCatalogRecordDetailController);

	ResourceCatalogRecordDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceCatalogRecordDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b6d25f959003460cbf03529c91ad5894', 'resourceCatalogTranslationService');
	}

})(angular);