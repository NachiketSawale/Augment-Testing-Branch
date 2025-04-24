/**
 * Created by baf on 28.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.certificate';

	/**
	 * @ngdoc controller
	 * @name resourceCertificatedPlantListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource certificate certificatedPlant entities.
	 **/

	angular.module(moduleName).controller('resourceCertificatedPlantListController', ResourceCertificatedPlantListController);

	ResourceCertificatedPlantListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceCertificatedPlantListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '43d1291116b641858c78ad23732e4e60');
	}
})(angular);