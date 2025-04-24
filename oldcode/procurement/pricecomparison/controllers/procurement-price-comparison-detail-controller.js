(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonDetailController
	 * @requires $scope, platformDetailControllerService
	 * @description
	 * #
	 * Controller for pricecomparison header form container (leading detail container).
	 */
	angular.module(moduleName).controller('procurementPriceComparisonDetailController', [
		'$scope', 'platformDetailControllerService', 'procurementPriceComparisonMainService',
		'procurementPriceComparisonHeaderUIStandardService', 'platformTranslateService',
		function ($scope, myInitService, dataService, usStandardService, translateService) {

			myInitService.initDetailController($scope, dataService, {}, usStandardService, translateService);
		}
	]);
})(angular);