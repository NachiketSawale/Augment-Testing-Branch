/*
* clv
* */
(function (angular) {

	'use strict';
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc controller
	 * @name salesBidCertificateListController
	 * @function
	 *
	 * @description
	 **/
	angular.module(moduleName).controller('salesBidCertificateListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {

				platformContainerControllerService.initController($scope, moduleName, 'ce1499b758bc45f8a61c4df00ade9e6e');
			}
		]);
})(angular);