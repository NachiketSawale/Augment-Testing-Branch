/*
* clv
* */

(function (angular) {

	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc controller
	 * @name salesContractCertificateDetailController
	 * @function
	 *
	 * @description
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesContractCertificateDetailController',
		['$scope', '$injector', 'platformContainerControllerService',
			function ($scope, $injector, platformContainerControllerService) {

				platformContainerControllerService.initController($scope, moduleName, '80a057f19ea94187acdbbbdf17d124fb', 'salesContractTranslationService');
			}]);
})(angular);