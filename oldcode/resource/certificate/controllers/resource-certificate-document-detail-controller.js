/**
 * Created by baf on 28.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.certificate';

	/**
	 * @ngdoc controller
	 * @name resourceCertificateDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource certificate document entities.
	 **/
	angular.module(moduleName).controller('resourceCertificateDocumentDetailController', ResourceCertificateDocumentDetailController);

	ResourceCertificateDocumentDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceCertificateDocumentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dd6a8c4970bd4f4fb46a6114c68ccd95');
	}

})(angular);