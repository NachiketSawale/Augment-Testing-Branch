/*
* clv
* */

(function (angular) {

	'use strict';
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc controller
	 * @name salesBidCertificateDetailController
	 * @function
	 *
	 * @description
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesBidCertificateDetailController',
		['$scope', '$injector', 'platformContainerControllerService',
			function ($scope, $injector, platformContainerControllerService) {

				platformContainerControllerService.initController($scope, moduleName, 'a8bd10d7081a45099bcd6a8bd56cdd79', 'salesBidTranslationService');
			}]);
})(angular);