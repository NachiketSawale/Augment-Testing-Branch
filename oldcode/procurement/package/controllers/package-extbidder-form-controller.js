/**
 * Created by lcn on 11/16/2021.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPackage2ExtBidderFormController',
		['$scope', 'platformDetailControllerService', 'procurementPackage2ExtBidderService',
			'procurementPackage2ExtBidderUIStandardService', 'platformTranslateService',
			function ($scope, platformDetailControllerService, service,
				uiService, platformTranslateService) {

				var loadRes = service.loadControllerInitData();
				platformDetailControllerService.initDetailController($scope, loadRes.dataService, loadRes.validationService, uiService, platformTranslateService);
			}]);

})(angular);