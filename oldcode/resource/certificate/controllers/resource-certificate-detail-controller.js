/**
 * Created by baf on 28.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.certificate';

	/**
	 * @ngdoc controller
	 * @name resourceCertificateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource certificate certificate entities.
	 **/
	angular.module(moduleName).controller('resourceCertificateDetailController', ResourceCertificateDetailController);

	ResourceCertificateDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceCertificateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '424d4d840861440489a0bfdfc71d04a1');
	}

})(angular);