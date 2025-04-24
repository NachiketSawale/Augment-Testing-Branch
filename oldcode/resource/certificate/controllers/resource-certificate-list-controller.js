/**
 * Created by baf on 28.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.certificate';

	/**
	 * @ngdoc controller
	 * @name resourceCertificateListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource certificate certificate entities.
	 **/

	angular.module(moduleName).controller('resourceCertificateListController', ResourceCertificateListController);

	ResourceCertificateListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceCertificateListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ddfd93ac951e42f0bb947a847121a79a');
	}
})(angular);