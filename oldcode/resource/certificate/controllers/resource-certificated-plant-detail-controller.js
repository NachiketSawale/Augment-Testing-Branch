/**
 * Created by baf on 28.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.certificate';

	/**
	 * @ngdoc controller
	 * @name resourceCertificateCertificatedPlantDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource certificate certificatedPlant entities.
	 **/
	angular.module(moduleName).controller('resourceCertificatedPlantDetailController', ResourceCertificatedPlantDetailController);

	ResourceCertificatedPlantDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceCertificatedPlantDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '055f01dd049d4ae3a1f00ff58444e176');
	}

})(angular);