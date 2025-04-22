/*
* clv
* */
(function (angular) {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractCertificateListController
	 * @function
	 *
	 * @description
	 **/
	angular.module(moduleName).controller('salesContractCertificateListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {

				platformContainerControllerService.initController($scope, moduleName, '468925bdac6a4e47b6c6719a8686f95a');
			}
		]);
})(angular);